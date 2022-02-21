import axios from "axios";
import { apiURL } from "../config";

const api = axios.create({
  baseURL: apiURL,
});

export default api;
