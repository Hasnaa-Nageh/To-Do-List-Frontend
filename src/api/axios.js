import axios from "axios";

const api = axios.create({
  baseURL: "https://to-do-list-backend-tawny.vercel.app/api",
  withCredentials: true,
  timeout: 10000,
});

export default api;