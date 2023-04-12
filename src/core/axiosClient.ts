import Axios, {AxiosError, AxiosInstance, InternalAxiosRequestConfig} from 'axios';
import axiosRetry from 'axios-retry';

export const JWT_ACCESS_TOKEN_KEY = 'access';

export default function createAxiosClient(): AxiosInstance {
    const axiosClient = Axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        withCredentials: true,
    });

    axiosClient.interceptors.request.use(<T extends InternalAxiosRequestConfig>(requestConfig: T): T => {
        const token = window.localStorage.getItem(JWT_ACCESS_TOKEN_KEY);
        if (requestConfig.headers !== undefined) {
            requestConfig.headers.Authorization = token ? `Bearer ${token}` : '';
        }

        return requestConfig;
    });

    axiosRetry(axiosClient, {
        retries: 2,
        retryDelay: axiosRetry.exponentialDelay,
        onRetry: (retryCount: number, error: AxiosError) => {
            const requestConfig = error.config;
            if (!requestConfig) {
                console.error("Retry failed: no error requestConfig. Error: ", error);
                return;
            }

            requestConfig.headers = Object.assign(requestConfig.headers, {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            });

            axiosClient
                .post('/auth/token/refresh/', null, requestConfig)
                .then((response) => {
                    window.localStorage.setItem(JWT_ACCESS_TOKEN_KEY, response.data.access);
                });
        }
    });

    return axiosClient;
}
