import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api", // direct backend URL
});

// Remove any default Authorization header if present
delete API.defaults.headers.common["Authorization"];

export default API;
