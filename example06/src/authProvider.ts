import axios from 'axios';

interface LoginParams {
    username: string;
    password: string;
}
interface CheckParamsErr {
    status: number;
}
export const authProvider = {
    // Được gọi khi người dùng đăng nhập
    login: async ({ username, password }: LoginParams) => {
        try {
            const response = await axios.post('http://localhost:8900/api/auth/login', {
                userName: username,
                password: password,
            });

            console.log('Login response:', response.data);

            if (response.data.authToken) {
                localStorage.setItem("token", response.data.authToken);
                localStorage.setItem("username", response.data.userName);
                localStorage.setItem("userId", response.data.id.toString());
                return Promise.resolve();
            } else {
                return Promise.reject(new Error("Không nhận được token xác thực"));
            }
        } catch (error: any) {
            if (error.response) {
                // Lỗi từ server
                return Promise.reject(new Error(error.response.data || "Sai tài khoản hoặc mật khẩu"));
            }
            return Promise.reject(new Error("Lỗi kết nối đến server"));
        }
    },

    // Được gọi khi người dùng nhấp vào nút đăng xuất
    logout: () => {
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        return Promise.resolve();
    },

    // Được gọi khi API trả về lỗi
    checkError: ({ status }: CheckParamsErr) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem("username");
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            return Promise.reject();
        }
        return Promise.resolve();
    },

    // Được gọi khi người dùng điều hướng đến một vị trí mới, để kiểm tra xác thực
    checkAuth: () => {
        return localStorage.getItem("token") ? Promise.resolve() : Promise.reject();
    },

    // Được gọi khi người dùng điều hướng đến một vị trí mới, để kiểm tra quyền / vai trò
    getPermissions: () => Promise.resolve(),
};