import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8900/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        console.log('Token khi gửi request:', token);
        
        if (token) {
            // Nếu token đã có "Bearer " thì dùng luôn, nếu không thì thêm vào
            config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            console.log('Authorization header:', config.headers.Authorization);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Nếu token hết hạn hoặc không hợp lệ, chuyển về trang đăng nhập
            if (error.response.status === 401 || error.response.status === 403) {
                localStorage.removeItem('authToken');
                window.location.href = '/login';
                return Promise.reject({ message: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' });
            }
            return Promise.reject(error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.request);
            return Promise.reject({ 
                message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet.'
            });
        } else {
            console.error('Error setting up request:', error.message);
            return Promise.reject({ 
                message: 'Đã xảy ra lỗi khi xử lý yêu cầu của bạn.'
            });
        }
    }
);

export default axiosInstance;
