

import API from "./ApiInstance";
import { AuthStore } from "../store/AuthStore"
import axios from "axios";
import { navigateToLogin } from "../navigationService";
import { getNewAccessToken } from "../api/services/AuthService";

let isRefreshing = false;
let failedQueue = [];

API.interceptors.request.use((config) => {
  const token = AuthStore.getAccessToken();

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
        AuthStore.clearAccessToken();
        navigateToLogin();
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
      AuthStore.clearAccessToken();
      navigateToLogin();
    }

    return Promise.reject(error);
  }
);

export default API;