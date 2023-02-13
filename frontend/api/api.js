import axios from "axios";
import { parseCookies } from "nookies";
import { API_URI } from ".env.js";

const api = axios.create({
  baseURL: `${API_URI}`,
});

api.interceptors.request.use(
  (config) => {
    const cookies = parseCookies();
    if (cookies.token) {
      config.headers["Authorization"] = "Bearer " + cookies.token;
    }
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default api;
