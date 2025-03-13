import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const completePayment = async () => {
            try {
                const paymentId = searchParams.get('paymentId');
                const PayerID = searchParams.get('PayerID');
                
                if (!paymentId || !PayerID) {
                    throw new Error('Thiếu thông tin thanh toán');
                }

                const token = localStorage.getItem('authToken');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(
                    `http://localhost:8900/api/shop/order/success?paymentId=${paymentId}&PayerID=${PayerID}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    setTimeout(() => {
                        navigate('/');
                    }, 3000);
                } else {
                    setError('Thanh toán không thành công');
                }
            } catch (error) {
                console.error('Lỗi khi hoàn tất thanh toán:', error);
                setError('Có lỗi xảy ra khi xử lý thanh toán');
            } finally {
                setLoading(false);
            }
        };

        completePayment();
    }, [searchParams, navigate]);

    if (loading) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Đang xử lý thanh toán...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container text-center py-5">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
                <button 
                    className="btn btn-primary mt-3"
                    onClick={() => navigate('/')}
                >
                    Về trang chủ
                </button>
            </div>
        );
    }

    return (
        <div className="container text-center py-5">
            <div className="alert alert-success" role="alert">
                Thanh toán thành công! Đơn hàng của bạn đang được xử lý.
            </div>
            <div>Bạn sẽ được chuyển về trang chủ sau 3 giây...</div>
        </div>
    );
};

export default PaymentSuccess;
