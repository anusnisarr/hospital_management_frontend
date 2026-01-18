import axios from "axios";
let abortController = new AbortController();

export const resetApiSession = () => {
  abortController.abort();
  abortController = new AbortController();
};

const authAPI = axios.create({
  baseURL: import.meta.env.VITE_BASE_PATH,
  signal: abortController.signal,
  withCredentials: true
});

export default authAPI;
