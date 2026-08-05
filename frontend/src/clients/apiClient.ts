import {BASE_URL} from "../libs/config";
import axios from "axios";

const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

export default apiClient;
