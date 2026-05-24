import axios from 'axios';
import { useAuth } from 'src/hooks/useAuth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
};

// ✅ Fix #5 — accès défensif au store
api.interceptors.request.use((config) => {
  const state = useAuth.getState();
  const accessToken = state?.accessToken;
  config.withCredentials = true;
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ Fix #1 — ne pas tenter un refresh sur /auth/login ou /auth/refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          // ✅ Fix #6 — headers potentiellement undefined
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // ✅ Fix #2 — URL absolue avec baseURL + Fix #4 — timeout sur le refresh
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true, timeout: 5000 }
        );

        const newAccessToken = res.data.accessToken;
        const user = res.data.user;

        useAuth.getState().setAuth(user, newAccessToken);
        processQueue(null, newAccessToken);

        // ✅ Fix #6 — headers potentiellement undefined
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuth.getState().logout();
        // ✅ Fix #3 — event dispatch (assure-toi que le listener est monté dans App.tsx dès le démarrage)
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;