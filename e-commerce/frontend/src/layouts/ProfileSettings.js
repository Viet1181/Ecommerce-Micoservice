import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserById, updateUser } from '../api/apiService';
import { jwtDecode } from 'jwt-decode';

const ProfileSettings = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
    roles: [],
    address: {
      addressId: 0,
      street: '',
      buildingName: '',
      city: '',
      state: '',
      country: '',
      pincode: ''
    },
    cart: null
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await getUserById(userId);
        setUserInfo(response);
        setFormData({
          userId: response.id,
          firstName: response.userDetails.firstName || '',
          lastName: response.userDetails.lastName || '',
          email: response.email || '',
          mobileNumber: response.userDetails.phoneNumber || '',
          password: response.password || '',
          roles: response.roles || [],
          address: {
            addressId: 0,
            street: response.userDetails.street || '',
            buildingName: response.userDetails.streetNumber || '',
            city: response.userDetails.locality || '',
            state: '',
            country: response.userDetails.country || '',
            pincode: response.userDetails.zipCode || ''
          },
          cart: response.cart || null
        });
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      // Xử lý cho các trường trong address
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        ...userInfo,
        userDetails: {
          ...userInfo.userDetails,
          firstName: e.target.firstName.value,
          lastName: e.target.lastName.value,
          phoneNumber: e.target.mobileNumber.value,
          street: e.target.street.value,
          streetNumber: e.target.buildingName.value,
          zipCode: e.target.pincode.value,
          locality: e.target.city.value,
          country: e.target.country.value
        }
      };

      await updateUser(userInfo.id, updatedUser);
      alert('Cập nhật thông tin thành công');
      navigate('/profile');
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      alert('Có lỗi xảy ra khi cập nhật thông tin');
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!userInfo) {
    return <div>Không tìm thấy thông tin người dùng</div>;
  }

  return (
    <>
      <section className="section-pagetop bg-gray">
        <div className="container">
          <h2 className="title-page">Cài đặt tài khoản</h2>
        </div>
      </section>

      <section className="section-content padding-y">
        <div className="container">
          <div className="row">
            <aside className="col-md-3">
              <nav className="list-group">
                <Link className="list-group-item" to="/profile">Tổng quan tài khoản</Link>
                <Link className="list-group-item" to="/profile/address">Địa chỉ của tôi</Link>
                <Link className="list-group-item" to="/profile/orders">Đơn hàng của tôi</Link>
                <Link className="list-group-item" to="/profile/wishlist">Danh sách yêu thích</Link>
                <Link className="list-group-item" to="/profile/selling">Sản phẩm đang bán</Link>
                <Link className="list-group-item active" to="/profile/settings">Cài đặt</Link>
                <Link className="list-group-item" to="/logout" onClick={(e) => {
                  e.preventDefault();
                  if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                    window.location.href = '/logout';
                  }
                }}>Đăng xuất</Link>
              </nav>
            </aside>

            <main className="col-md-9">
              <div className="card">
                <div className="card-body">
                  <form className="row" onSubmit={handleSubmit}>
                    <div className="col-md-9">
                      <div className="form-row">
                        <div className="col form-group">
                          <label>Họ</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
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
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        {/* <div className="col form-group">
                          <label>Email</label>
                          <input 
                            type="email" 
                            className="form-control" 
                            name="email"
                            value={formData.email}
                            readOnly
                          />
                        </div> */}
                        <div className="col form-group">
                          <label>Số điện thoại</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>Số nhà, tên đường</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="street"
                            value={formData.address.street}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Tên tòa nhà</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="buildingName"
                            value={formData.address.buildingName}
                            onChange={handleInputChange}
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
                            value={formData.address.city}
                            onChange={handleInputChange}
                          />
                        </div>
                        {/* <div className="form-group col-md-6">
                          <label>Quận/Huyện</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="state"
                            value={formData.address.state}
                            onChange={handleInputChange}
                          />
                        </div> */}
                      </div>

                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label>Quốc gia</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="country"
                            value={formData.address.country}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label>Mã bưu điện</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            name="pincode"
                            value={formData.address.pincode}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <button type="submit" className="btn btn-primary">Lưu thay đổi</button>
                      <Link to="/change-password" className="btn btn-outline-primary ml-3">Đổi mật khẩu</Link>
                    </div>
                    <div className="col-md">
                      <img 
                        src={userInfo?.image || "http://localhost:8900/api/catalog/images/avt.jpg"} 
                        className="img-md rounded-circle border" 
                        alt="Ảnh đại diện" 
                      />
                    </div>
                  </form>
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProfileSettings;
