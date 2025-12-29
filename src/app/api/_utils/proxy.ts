import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosRequestConfig, AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * 通用 API 代理函数（使用 axios）
 * @param request Next.js 请求对象
 * @param path 后端 API 路径（不包含 baseURL）
 * @param options 额外配置选项
 */
export async function proxyRequest(
  request: NextRequest,
  path: string,
  options: {
    method?: string;
    body?: unknown;
  } = {},
) {
  try {
    const method = (options.method || request.method).toLowerCase() as
      | "get"
      | "post"
      | "put"
      | "patch"
      | "delete"
      | "head"
      | "options";
    const url = `${API_BASE_URL}${path}`;

    // 构建请求头
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // 转发 Authorization 头（如果存在）
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers.Authorization = authHeader;
    }

    // 转发 Cookie（如果需要）
    const cookie = request.headers.get("cookie");
    if (cookie) {
      headers.Cookie = cookie;
    }

    // 构建 axios 请求配置
    const axiosConfig: AxiosRequestConfig = {
      method,
      url,
      headers,
      timeout: 15000, // 15 秒超时
    };

    // 添加请求体（如果是 POST/PUT/PATCH）
    if (options.body) {
      // 如果显式提供了 body，使用它
      axiosConfig.data = options.body;
    } else if (method !== "get" && method !== "head" && method !== "options") {
      // 对于 POST/PUT/PATCH/DELETE，从请求中读取 body
      try {
        const body = await request.json();
        axiosConfig.data = body;
      } catch {
        // 如果没有 body（如空的 POST 请求），忽略错误
      }
    }

    // 转发请求到真实后端
    // axios 会自动处理 JSON 序列化和解析
    const response = await axios(axiosConfig);

    // 返回响应，设置 CORS 头
    // axios 响应结构：response.data 是响应体，response.status 是状态码
    return NextResponse.json(response.data, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (error) {
    console.error("API Proxy Error:", error);

    // axios 错误处理
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      // 如果有响应（HTTP 错误状态码）
      if (axiosError.response) {
        return NextResponse.json(
          axiosError.response.data || {
            code: axiosError.response.status,
            msg: "请求失败",
            error: axiosError.message,
          },
          {
            status: axiosError.response.status,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
          },
        );
      }

      // 如果没有响应（网络错误、超时等）
      if (axiosError.request) {
        return NextResponse.json(
          {
            code: 500,
            msg: "网络错误",
            error: "无法连接到服务器",
          },
          { status: 500 },
        );
      }
    }

    // 其他错误
    return NextResponse.json(
      {
        code: 500,
        msg: "服务器错误",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * 处理 CORS 预检请求
 */
export function handleOptions() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
