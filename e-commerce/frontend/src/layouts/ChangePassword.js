import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getUserById, updateUser } from '../api/apiService';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const decodedToken = jwtDecode(token);
        const email = decodedToken.email;
        
        const response = await getUserById(email);
        if (response) {
          setUserId(response.userId);
        } else {
          setError('Không thể lấy thông tin người dùng!');
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        setError('Có lỗi xảy ra khi lấy thông tin người dùng!');
      }
    };

    fetchUserId();
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserById(userId);
        setUserData(response);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userData) {
      setError('Không thể lấy thông tin người dùng!');
      return;
    }

    try {
      const { newPassword, confirmPassword } = formData;
      if (newPassword !== confirmPassword) {
        setError('Mật khẩu mới không khớp!');
        return;
      }

      const updatedUserData = {
        ...userData,
        userPassword: newPassword
      };

      await updateUser(userId, updatedUserData);
      alert('Đổi mật khẩu thành công!');
      navigate('/profile');
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      setError('Có lỗi xảy ra khi đổi mật khẩu!');
    }
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: '380px', marginTop: '100px' }}>
      <div className="card-body">
        <h4 className="card-title mb-4">Đổi mật khẩu</h4>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mật khẩu hiện tại</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Nhập mật khẩu hiện tại" 
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu mới</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Nhập mật khẩu mới" 
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
            />
            <small className="form-text text-muted">
              Mật khẩu phải có ít nhất 5 ký tự
            </small>
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu mới</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Nhập lại mật khẩu mới" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary btn-block" disabled={!userData}>
              Đổi mật khẩu
            </button>
          </div>
        </form>

        <p className="text-center mt-4">
          <Link to="/profile/settings" className="btn btn-light">
            <i className="fa fa-arrow-left"></i> Quay lại cài đặt
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ChangePassword;
