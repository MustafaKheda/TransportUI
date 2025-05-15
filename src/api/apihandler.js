import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true
});

// Intercept 401 errors and attempt token refresh
api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;
    console.log(originalRequest)
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      debugger
      try {
        await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/refresh-token`); // refreshes accessToken cookie
        return api(originalRequest); // retry original request
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);

        // 🔁 Prevent infinite loop
        originalRequest._retry = false;

        // 🧼 Optional: Clear local state / context
        // dispatch(logoutAction()) if using Redux or context

        // 🔀 Redirect to login (if in browser environment)
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
  }
);

export { api };