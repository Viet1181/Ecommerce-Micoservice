import React, { useState, useEffect } from 'react';
import { LOGIN } from '../api/apiService';
import { useNavigate, Link } from 'react-router-dom';

const UserLogin = () => {
    const [formData, setFormData] = useState({
        userName: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra xem có userName đã lưu không
        const savedUserName = localStorage.getItem('rememberedUserName');
        if (savedUserName) {
            setFormData(prev => ({ ...prev, userName: savedUserName }));
            setRememberMe(true);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await LOGIN(formData);
            
            if (response && response.authToken) {
                // Log token để debug
                console.log('Token từ server:', response.authToken);
                
                // Lưu token không có prefix "Bearer "
                const token = response.authToken.replace('Bearer ', '');
                console.log('Token đã xử lý:', token);
                
                localStorage.setItem('authToken', token);
                console.log('Token trong localStorage:', localStorage.getItem('authToken'));
                
                if (rememberMe) {
                    localStorage.setItem('rememberedUserName', formData.userName);
                } else {
                    localStorage.removeItem('rememberedUserName');
                }

                navigate('/', { replace: true });
            } else {
                setError('Phản hồi không hợp lệ từ máy chủ');
            }
        } catch (err) {
            console.error('Lỗi đăng nhập:', err);
            setError('Tài khoản hoặc mật khẩu không đúng');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="section-content padding-y" style={{ minHeight: '84vh' }}>
            <div className="card mx-auto" style={{ maxWidth: '380px', marginTop: '100px' }}>
                <div className="card-body">
                    <h4 className="card-title text-center mb-4">Đăng nhập</h4>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="userName">Tên đăng nhập</label>
                            <input 
                                id="userName"
                                name="userName" 
                                className="form-control" 
                                placeholder="Nhập tên đăng nhập" 
                                type="text"
                                value={formData.userName}
                                onChange={handleChange}
                                required 
                            />
                            <small className="form-text text-muted">
                                Sử dụng tên đăng nhập đã đăng ký, không phải email
                            </small>
                        </div>
                        <div className="form-group mt-3">
                            <label htmlFor="password">Mật khẩu</label>
                            <input 
                                id="password"
                                name="password" 
                                className="form-control" 
                                placeholder="Nhập mật khẩu" 
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                        <div className="form-group mt-3">
                            <div className="custom-control custom-checkbox">
                                <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label className="custom-control-label" htmlFor="rememberMe">
                                    Ghi nhớ tài khoản
                                </label>
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-primary btn-block mt-3 w-100"
                            disabled={loading}
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <Link to="/register">Chưa có tài khoản? Đăng ký ngay</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserLogin;