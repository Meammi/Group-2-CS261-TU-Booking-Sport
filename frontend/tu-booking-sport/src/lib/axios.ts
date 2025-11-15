import axios from "axios";
import { API_BASE } from "./config";

axios.defaults.baseURL = API_BASE;
axios.defaults.withCredentials = true;

export default axios;