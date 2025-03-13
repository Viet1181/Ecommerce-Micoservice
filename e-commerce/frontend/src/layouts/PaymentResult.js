import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const processPayment = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const paymentId = params.get('paymentId');
        const PayerID = params.get('PayerID');

        if (paymentId && PayerID) {
          const response = await axios.get(
            `http://localhost:8900/api/shop/order/success?paymentId=${paymentId}&PayerID=${PayerID}`
          );

          if (response.data.success) {
            setMessage('Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.');
          } else {
            setMessage('Thanh toán thất bại. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.');
          }
        } else if (location.pathname.includes('cancel')) {
          setMessage('Bạn đã hủy thanh toán. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.');
        }
      } catch (error) {
        console.error('Lỗi khi xử lý thanh toán:', error);
        setMessage('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng liên hệ hỗ trợ.');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [location]);

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Đang xử lý thanh toán...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="card">
        <div className="card-body text-center">
          <h3 className="card-title">Kết quả thanh toán</h3>
          <p className="card-text">{message}</p>
          <button 
            className="btn btn-primary mr-2"
            onClick={() => navigate('/')}
          >
            Về trang chủ
          </button>
          <button 
            className="btn btn-outline-primary"
            onClick={() => navigate('/profile/orders')}
          >
            Xem đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
