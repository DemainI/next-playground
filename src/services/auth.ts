import http from "./http";
import { ApiResponse } from "@/types/api";

export interface LoginPayload {
  userName: string;
  password: string;
  code: string;
  uuid: string;
}

// 使用通用响应类型，指定 data 的类型
export type LoginResponse = ApiResponse<{
  token: string;
}>;

// 验证码响应类型
export type CaptchaResponse = ApiResponse<{
  captchaEnabled: boolean;
  img: string; // SVG字符串
  uuid: string;
}>;

// 登出响应类型（data 为 null）
export type LogoutResponse = ApiResponse<any>;

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return http.post<LoginResponse>("/api/login", payload);
}

// 获取验证码
export function getCaptcha(): Promise<CaptchaResponse> {
  return http.get<CaptchaResponse>("/api/captchaImage");
}

// 登出接口
export function logout(): Promise<LogoutResponse> {
  return http.post<LogoutResponse>("/api/logout");
}
