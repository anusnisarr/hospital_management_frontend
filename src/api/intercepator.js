
import API from "./ApiInstance";
import { AuthStore } from "../store/AuthStore"

API.interceptors.request.use(async (config) => {
  if (config.url.includes("/auth/refresh")) return config;

  let token = AuthStore.getAccessToken();

  if (!token) {
    const res = await API.post("/auth/refresh");
    token = res.data.accessToken;
    AuthStore.setAccessToken(token);
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});


API.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject(error);
  }
);


export default API;


