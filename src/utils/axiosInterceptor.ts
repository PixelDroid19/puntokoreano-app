import axios from 'axios';
import { notification } from 'antd';
import { useAuthStore } from '../store/auth.store';

const setupAxiosInterceptors = () => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 || error.response?.data?.code === 'TOKEN_EXPIRED') {
        const { logout } = useAuthStore.getState();
        logout();
        notification.error({
          message: 'Sesión expirada',
          description: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.'
        });
      }
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors;