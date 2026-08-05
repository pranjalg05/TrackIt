import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../libs/config";
import apiClient from "../clients/apiClient";

const AUTH_BASE = "/auth";

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await apiClient.post(
        `${BASE_URL}${AUTH_BASE}/register`,
        data,
      );
      return response.data;
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await apiClient.post(`${BASE_URL}${AUTH_BASE}/login`, data);
      return response.data;
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(`${BASE_URL}${AUTH_BASE}/logout`);
      return response.data;
    },
  });
};
