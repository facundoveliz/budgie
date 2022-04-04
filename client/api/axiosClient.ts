import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_LOCAL,
  timeout: 2000,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('x-auth-token');
    if (token) {
      config.headers!.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => console.log(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        return (window.location.href = '/login');
      }
      if (error.response.data.msg === 'Invalid email or password') {
        return error.response.data.msg;
      }
    }
    return console.log(error);
  },
);

export default axiosClient;
