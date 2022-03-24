import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 2000,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('x-auth-token');
    if (token) {
      config.headers!.Authorization = `Bearer ${token }`;
      console.log('token exists');
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default axiosClient;
