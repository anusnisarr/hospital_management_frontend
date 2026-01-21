

import API from "./ApiInstance";
import { AuthStore } from "../store/AuthStore"
import { getNewAccessToken } from "../api/services/AuthService";

let isRefreshing = false;
let failedQueue = [];

const AUTH_EXCLUDED_ROUTES = [
  "/auth/refresh",
  "/auth/login",
  "/auth/TenantRegister",
  "/auth/logout",
];

API.interceptors.request.use((config) => {
  const token = AuthStore.getAccessToken();
  const url = config.url || "";

  if (AUTH_EXCLUDED_ROUTES.some((route) => url.includes(route))) {
    return config;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


const processQueue = (error, token = null) => {
  failedQueue.forEach(promise => {
    if (error) promise.reject(error);
    else promise.resolve(token);
  });
  failedQueue = [];
};

API.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (error.name === "CanceledError") {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      error.response.data?.code === "ACCESS_TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await getNewAccessToken();

        const newToken = res.accessToken;
        AuthStore.setAccessToken(newToken);

        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return API(originalRequest);
      } catch (err) {
        processQueue(err, null);
        logout("REFRESH_FAILED")
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    if (
      error.response?.status === 401 &&
      ["REFRESH_TOKEN_EXPIRED", "REFRESH_TOKEN_MISSING"].includes(
        error.response.data?.code
      )
    ) {
      logout("REFRESH_TOKEN_EXPIRED or MISSING");
    };

    return Promise.reject(error);
  }
);

export default API;