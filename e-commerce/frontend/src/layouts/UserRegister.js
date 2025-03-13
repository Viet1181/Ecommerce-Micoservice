import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { REGISTER } from '../api/apiService';

const UserRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    userPassword: '',
    confirmPassword: '',
    active: 1,
    userDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      street: '',
      streetNumber: '',
      zipCode: '',
      locality: '',
      country: 'Vietnam'
    },
    role: {
      roleName: 'ROLE_USER'
    }
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
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
    setError('');
    setLoading(true);

    if (formData.userPassword !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        ...formData
      };
      delete userData.confirmPassword;

      const response = await REGISTER(userData);
      
      if (response) {
        navigate('/Login', { 
          state: { 
            message: 'Đăng ký thành công! Vui lòng đăng nhập.' 
          } 
        });
      }
    } catch (err) {
      console.error('Lỗi đăng ký:', err);
      if (err.response?.data?.message?.includes('User already exists')) {
        setError('Tên đăng nhập đã được sử dụng. Vui lòng chọn tên khác.');
      } else {
        setError(err.response?.data?.message || 'Đã xảy ra lỗi khi đăng ký');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-content padding-y">
      <div className="card mx-auto" style={{ maxWidth: '520px', marginTop: '40px' }}>
        <article className="card-body">
          <header className="mb-4"><h4 className="card-title">Đăng ký tài khoản</h4></header>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="col form-group">
                <label>Tên đăng nhập</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="col form-group">
                <label>Họ</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="userDetails.firstName"
                  value={formData.userDetails.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col form-group">
                <label>Tên</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="userDetails.lastName"
                  value={formData.userDetails.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  name="userDetails.email"
                  value={formData.userDetails.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label>Số điện thoại</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  name="userDetails.phoneNumber"
                  value={formData.userDetails.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-8">
                <label>Tên đường</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="userDetails.street"
                  value={formData.userDetails.street}
                  onChange={handleChange}
                  placeholder="Tên đường"
                  required
                />
              </div>
              <div className="form-group col-md-4">
                <label>Số nhà</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="userDetails.streetNumber"
                  value={formData.userDetails.streetNumber}
                  onChange={handleChange}
                  placeholder="Số nhà"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Thành phố</label>
                <input 
                  type="text" 
                  className="form-control"
                  name="userDetails.locality"
                  value={formData.userDetails.locality}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label>Mã bưu điện</label>
                <input 
                  type="text" 
                  className="form-control"
                  name="userDetails.zipCode"
                  value={formData.userDetails.zipCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Quốc gia</label>
              <select 
                className="form-control"
                name="userDetails.country"
                value={formData.userDetails.country}
                onChange={handleChange}
              >
                <option value="Vietnam">Việt Nam</option>
                <option value="Other">Khác</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Mật khẩu</label>
                <input 
                  type="password" 
                  className="form-control"
                  name="userPassword"
                  value={formData.userPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label>Xác nhận mật khẩu</label>
                <input 
                  type="password" 
                  className="form-control"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đăng ký'}
              </button>
            </div>

            <div className="form-group">
              <label className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" required />
                <div className="custom-control-label">
                  Tôi đồng ý với <a href="#">điều khoản và điều kiện</a>
                </div>
              </label>
            </div>
          </form>
        </article>
      </div>
      <p className="text-center mt-4">
        Đã có tài khoản? <Link to="/Login">Đăng nhập</Link>
      </p>
      <br /><br />
    </section>
  );
};

export default UserRegister;