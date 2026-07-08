import axios from "axios";

const API = axios.create({
  baseURL: "https://ecomhub-backend-1.onrender.com/api",
});

delete API.defaults.headers.common["Authorization"];

export default API;