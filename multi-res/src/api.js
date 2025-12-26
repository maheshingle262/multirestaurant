import axios from "axios";

const API = axios.create({
  baseURL: "/api",   // nginx handles routing
  withCredentials: true
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;


/* src/api.js
import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_BASE ||
    "http://18.61.27.191:8080",
});

// Attach JWT token if exists
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;*/
