// api.ts
import axios, { type AxiosError, type AxiosResponse } from "axios";

export const EVENT_EMITTER = new EventTarget();

export const API_INSTANCE = axios.create({
  baseURL: "https://fakeapi.com/api",
  timeout: 60000, // Set your desired timeout
  headers: {
    "x-api-version": "1.0.0",
  },
  validateStatus: (status) => status <= 500,
});

API_INSTANCE.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    EVENT_EMITTER.dispatchEvent(new CustomEvent("ReqError", { detail: error }));
    return Promise.reject(error);
  }
);
