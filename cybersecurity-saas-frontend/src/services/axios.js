import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

if (!process.env.REACT_APP_API_URL) {
  console.warn("REACT_APP_API_URL environment variable is not set");
}

// Attach JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses - token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}/users/token/refresh/`,
            { refresh: refreshToken }
          );

          const { access } = response.data;
          localStorage.setItem("access_token", access);

          originalRequest.headers["Authorization"] = `Bearer ${access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Token refresh failed - logout user
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token - logout user
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
