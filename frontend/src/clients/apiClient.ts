import {BASE_URL} from "../libs/config";
import axios from "axios";

const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})

apiClient.interceptors.request.use(
    (config) => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
)

export default apiClient;
