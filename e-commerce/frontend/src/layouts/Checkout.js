import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { getCart } from '../api/apiService';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [orderData, setOrderData] = useState({
    orderItems: [],
    totalAmount: 0
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    district: '',
    address: '',
    zipCode: '',
    country: '',
    paymentMethod: 'CASH_ON_DELIVERY'
  });

  useEffect(() => {
    fetchUserAndCartData();
  }, []);

  const fetchUserAndCartData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      setUserId(userId);

      // Lấy thông tin user
      const userResponse = await axios.get(
        `http://localhost:8900/api/accounts/users/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (userResponse.data) {
        const userData = userResponse.data;
        const userDetails = userData.userDetails;
        setFormData(prev => ({
          ...prev,
          firstName: userDetails.firstName || '',
          lastName: userDetails.lastName || '',
          email: userDetails.email || '',
          phone: userDetails.phoneNumber || '',
          address: `${userDetails.streetNumber} ${userDetails.street}` || '',
          city: userDetails.locality || '',
          district: userDetails.zipCode || '',
          zipCode: userDetails.zipCode || '',
          country: userDetails.country || ''
        }));
      }

      // Lấy thông tin giỏ hàng sử dụng getCart từ apiService
      const cartResponse = await getCart();
      if (cartResponse) {
        setCartData(cartResponse);
        setOrderData({
          orderItems: cartResponse.products,
          totalAmount: cartResponse.totalPrice
        });
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin:', error);
      alert('Có lỗi xảy ra khi tải thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayPalPayment = async (orderId) => {
    try {
      const response = await axios.post(
        `http://localhost:8900/api/shop/order/pay/${orderId}`,
        null,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      
      if (response.data.success && response.data.data) {
        window.location.href = response.data.data;
      } else {
        alert('Không thể tạo liên kết thanh toán PayPal');
      }
    } catch (error) {
      console.error('Lỗi khi tạo thanh toán PayPal:', error);
      alert('Có lỗi xảy ra khi tạo thanh toán PayPal');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!userId) {
        alert('Không tìm thấy thông tin người dùng');
        return;
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      // Tạo đơn hàng với thông tin giao hàng
      const orderResponse = await axios.post(
        `http://localhost:8900/api/shop/order/${userId}`,
        {},  
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true  
        }
      );

      if (orderResponse.data) {
        const orderId = orderResponse.data.id;

        // Clear cartId cookie
        document.cookie = "cartId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
        // Update cart count in header
        const event = new CustomEvent('cartUpdated', { detail: { count: 0 } });
        window.dispatchEvent(event);

        if (formData.paymentMethod === 'PAYPAL') {
          await handlePayPalPayment(orderId);
        } else {
          alert('Đặt hàng thành công!');
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error);
      alert('Có lỗi xảy ra khi đặt hàng');
    }
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <section className="section-content padding-y">
      <div className="container" style={{ maxWidth: '720px' }}>
        <form onSubmit={handleSubmit}>
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title mb-3">Thông tin giao hàng</h4>

              <div className="form-row">
                <div className="col form-group">
                  <label>Họ</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col form-group">
                  <label>Tên</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="col form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    readOnly
                  />
                </div>
                <div className="col form-group">
                  <label>Số điện thoại</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Tỉnh/Thành phố</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>Quận/Huyện</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group col-md-6">
                  <label>Mã bưu điện</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group col-md-6">
                  <label>Quốc gia</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Địa chỉ chi tiết</label>
                <textarea 
                  className="form-control" 
                  rows="2"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title mb-4">Phương thức thanh toán</h4>
              <div className="form-group">
                <div className="custom-control custom-radio">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="CASH_ON_DELIVERY"
                    className="custom-control-input"
                    checked={formData.paymentMethod === 'CASH_ON_DELIVERY'}
                    onChange={handleInputChange}
                  />
                  <label className="custom-control-label" htmlFor="cod">
                    Thanh toán khi nhận hàng (COD)
                  </label>
                </div>
                <div className="custom-control custom-radio mt-2">
                  <input
                    type="radio"
                    id="banking"
                    name="paymentMethod"
                    value="BANK_TRANSFER"
                    className="custom-control-input"
                    checked={formData.paymentMethod === 'BANK_TRANSFER'}
                    onChange={handleInputChange}
                  />
                  <label className="custom-control-label" htmlFor="banking">
                    Chuyển khoản ngân hàng
                  </label>
                </div>
                <div className="custom-control custom-radio mt-2">
                  <input
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    value="PAYPAL"
                    className="custom-control-input"
                    checked={formData.paymentMethod === 'PAYPAL'}
                    onChange={handleInputChange}
                  />
                  <label className="custom-control-label" htmlFor="paypal">
                    PayPal
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title mb-4">Tổng quan đơn hàng</h4>
              <table className="table">
                <tbody>
                  {orderData.orderItems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {item.product.productName} x {item.quantity}
                      </td>
                      <td className="text-right">
                        {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td><strong>Tổng thanh toán:</strong></td>
                    <td className="text-right">
                      <strong>
                        {orderData.totalAmount?.toLocaleString('vi-VN')}đ
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Xác nhận đặt hàng
          </button>
        </form>

        <br /><br />
      </div>
    </section>
  );
};

export default Checkout;
