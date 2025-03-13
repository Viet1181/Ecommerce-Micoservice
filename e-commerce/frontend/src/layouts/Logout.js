import { useEffect } from 'react';
import { LOGOUT } from '../api/apiService';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                await LOGOUT();
                // Navigation will be handled by LOGOUT function
            } catch (error) {
                console.error('Logout failed:', error);
                navigate('/login');
            }
        };

        handleLogout();
    }, [navigate]);

    // Return null since this is just a functional component
    return null;
};

export default Logout;
