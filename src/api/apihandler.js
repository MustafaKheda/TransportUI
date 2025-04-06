import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  credentials: "include", 
});

// Intercept 401 errors and attempt token refresh
api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post('/refresh-token'); // refreshes accessToken cookie
        return api(originalRequest); // retry original request
      } catch (refreshError) {
        console.error("Refresh failed", refreshError);
        // You can redirect to login page here if needed
      }
    }

    return Promise.reject(err);
  }
);

export default api;