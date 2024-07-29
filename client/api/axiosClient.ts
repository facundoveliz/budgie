import axios from "axios";

const axiosClient = axios.create({
	baseURL:
		process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_PRODUCTION ||
		process.env.NEXT_PUBLIC_REACT_APP_BASE_URL_LOCAL,
	timeout: 1200000,
});

axiosClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("x-auth-token");
		if (token) {
			config.headers!.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		throw error.response;
	},
);

axiosClient.interceptors.response.use(
	(response) => response,
	(error) => {
		const token = localStorage.getItem("x-auth-token");
		if (error.response) {
			if (error.response.status === 401) {
				if (!token) {
					window.location.href = "/login";
				}
			}
			throw error.response;
		}
	},
);

export default axiosClient;
