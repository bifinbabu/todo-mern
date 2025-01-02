import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://todo-mern-api-mu.vercel.app/api",
});

export default axiosInstance;
