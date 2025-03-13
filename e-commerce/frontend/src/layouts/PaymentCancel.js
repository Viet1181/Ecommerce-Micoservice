import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="container text-center py-5">
            <div className="alert alert-warning" role="alert">
                Bạn đã hủy thanh toán. Đơn hàng của bạn sẽ không được xử lý.
            </div>
            <div>Bạn sẽ được chuyển về trang chủ sau 3 giây...</div>
            <button 
                className="btn btn-primary mt-3"
                onClick={() => navigate('/')}
            >
                Về trang chủ ngay
            </button>
        </div>
    );
};

export default PaymentCancel;
