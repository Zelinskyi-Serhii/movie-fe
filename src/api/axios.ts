import { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface IRequestData {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  header?: AxiosRequestConfig["headers"];
  prevent?: boolean;
  overrideBaseUrl?: string;
}

export const axiosBaseQuery = (): BaseQueryFn<IRequestData> => {
  return async ({ url, method, data, params, header }) => {
    let headers: AxiosRequestConfig["headers"] = {};

    headers["Content-Type"] = "application/json";

    if (header) {
      headers = { ...headers, ...header };
    }

    try {
      const result = await axiosInstance({
        url: BASE_URL + url,
        method: method || "get",
        data,
        params,
        headers,
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      return {
        error: { status: err.response?.status, results: err.response?.data },
      };
    }
  };
};
