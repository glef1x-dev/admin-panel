import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';

export const JWT_ACCESS_TOKEN_KEY = 'access';

export default function createAxiosClient(): AxiosInstance {
    const axiosClient = Axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        withCredentials: true,
    });

    axiosClient.interceptors.request.use((requestConfig): AxiosRequestConfig => {
        const token = window.localStorage.getItem(JWT_ACCESS_TOKEN_KEY);
        if (requestConfig.headers !== undefined) {
            requestConfig.headers.Authorization = token ? `Bearer ${token}` : '';
        }

        return requestConfig;
    });

    axiosRetry(axiosClient, {
        retries: 2,
        retryDelay: axiosRetry.exponentialDelay,
        onRetry: (retryCount: number, error: AxiosError, requestConfig: AxiosRequestConfig) => {
            const originalConfig = error.config;
            originalConfig!.headers = {
                ...originalConfig!.headers,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            };
            axiosClient.post('/auth/token/refresh/', null, originalConfig).then((response) => {
                window.localStorage.setItem(JWT_ACCESS_TOKEN_KEY, response.data.access);
            });
        },
        retryCondition: (error) => {
            if (error.response === undefined) {
                // Should retry
                return true;
            }

            return error.response.status === 401 || error.response.status >= 500;
        },
    });

    return axiosClient;
}
