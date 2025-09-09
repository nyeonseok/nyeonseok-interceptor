import axios, { AxiosInstance } from "axios";

interface ApiClientOptions {
  baseURL: string;
  getAccessToken: () => string | null;
  setAccessToken: (token: string) => void;
  refreshEndpoint: string;
  onLogout?: () => void;
}

export function createApiClient(options: ApiClientOptions): AxiosInstance {
  const api = axios.create({
    baseURL: options.baseURL,
    withCredentials: true,
  });

  // 요청 인터셉터
  api.interceptors.request.use(
    (config) => {
      const token = options.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 응답 인터셉터
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const res = await axios.post(
            options.refreshEndpoint,
            {},
            { withCredentials: true }
          );
          if (res.status === 200) {
            const newToken = res.data;
            options.setAccessToken(newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          } else {
            options.onLogout?.();
          }
        } catch (refreshError) {
          options.onLogout?.();
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
}
