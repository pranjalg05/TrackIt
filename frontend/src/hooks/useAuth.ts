import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../libs/config";
import { useCookies } from "react-cookie";
import apiClient from "../clients/apiClient";

const AUTH_BASE = "/auth";

export const useRegister = () => {
  const [, setCookie] = useCookies(["token"]);
  return useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await apiClient.post(
        `${BASE_URL}${AUTH_BASE}/register`,
        data,
      );
      return response.data;
    },
    onSuccess: (data) => {
      setCookie("token", data["token"], { path: "/" });
    },
  });
};

export const useLogin = () => {
  const [, setCookie] = useCookies(["token"]);
  return useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await apiClient.post(`${BASE_URL}${AUTH_BASE}/login`, data);
      return response.data;
    },
    onSuccess: (data) => {
      setCookie("token", data["token"], { path: "/" });
    },
  });
};

export const useLogout = () => {
  const [, , removeCookie] = useCookies(["token"]);
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(`${BASE_URL}${AUTH_BASE}/logout`);
      return response.data;
    },
    onSuccess: () => {
      removeCookie("token", { path: "/" });
    },
  });
};
