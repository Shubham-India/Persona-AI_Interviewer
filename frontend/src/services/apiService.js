import axios from "axios";


const baseApi = axios.create({
  baseURL: import.meta.env.VITE_API, 
  timeout: 15000,       
  headers: {
    "Content-Type": "application/json",   // Kis tarah ka data bhejoge
  },
});

// 2. Request Interceptor: Attach the Access Token to every outgoing request
baseApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); //  Access Token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Response Interceptor: Handle Data and Refresh Token Logic
baseApi.interceptors.response.use(
  (response) => response.data, // Automatically return data so you don't have to write .data in pages
  async (error) => {
    const originalRequest = error.config;


    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark request as retried to prevent loops

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

const res = await axios.post(`${import.meta.env.VITE_API}/users/refresh-token`, {
  token: refreshToken,
});

     
        const { accessToken } = res.data;

     
        localStorage.setItem("token", accessToken);

     
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return baseApi(originalRequest); 

      } catch (refreshError) {
        // If Refresh Token is also expired or invalid, log the user out
        console.error("Refresh token failed. Redirecting to login...");
        localStorage.clear();
        if (window.location.pathname !== "/") {
        window.location.href = "/"; 
    }
        return Promise.reject(refreshError);
      }
    }

    // For other errors (500, 404, 403), just reject the promise
    return Promise.reject(error);
  }
);

export default baseApi;