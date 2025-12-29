/**
 * 通用 API 代理路由
 * 使用动态路由 [...path] 统一处理所有接口
 *
 * 请求路径示例：
 * - /api/login → params.path = ["login"]
 * - /api/user/info → params.path = ["user", "info"]
 * - /api/orders/123 → params.path = ["orders", "123"]
 *
 * 注意：Next.js 16 中，params 是异步的（Promise），需要 await
 */

import { NextRequest } from "next/server";
import { proxyRequest, handleOptions } from "../_utils/proxy";

/**
 * 统一的代理处理函数
 *
 * 注意：Next.js 16 中，params 是异步的，需要 await
 */
async function handleProxyRequest(
  request: NextRequest,
  paramsPromise: Promise<{ path: string[] }>,
  method: string,
) {
  // Next.js 16: params 是 Promise，需要 await
  const params = await paramsPromise;

  // 将路径数组转换为字符串：["login"] → "/login"
  // ["user", "info"] → "/user/info"
  const path = `/${params.path.join("/")}`;
  return proxyRequest(request, path, { method });
}

// GET 请求
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleProxyRequest(request, params, "GET");
}

// POST 请求
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleProxyRequest(request, params, "POST");
}

// PUT 请求
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleProxyRequest(request, params, "PUT");
}

// PATCH 请求
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleProxyRequest(request, params, "PATCH");
}

// DELETE 请求
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return handleProxyRequest(request, params, "DELETE");
}

// OPTIONS 请求（CORS 预检）
export async function OPTIONS() {
  return handleOptions();
}
