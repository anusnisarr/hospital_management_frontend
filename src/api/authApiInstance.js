import axios from "axios";

const authAPI = axios.create({
  baseURL: import.meta.env.VITE_BASE_PATH,
  withCredentials: true
});

export default authAPI;
