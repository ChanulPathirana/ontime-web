import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getBuses = () => API.get("/buses");
export const getRoutes = () => API.get("/routes");
