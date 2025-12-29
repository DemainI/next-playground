import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from "axios";

// 客户端调用本地 API Routes（解决跨域问题）
// 服务端环境变量 API_BASE_URL 用于 API Routes 代理转发
// 客户端 baseURL 必须为空，才能调用同源的 /api/xxx
const baseURL =
  typeof window !== "undefined"
    ? ""
    : (process.env.NEXT_PUBLIC_API_BASE_URL ?? "");

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("ACCESS_TOKEN");
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器：自动提取 response.data
axiosInstance.interceptors.response.use(
  <T = any>(response: AxiosResponse<T>) => {
    // 返回 response.data，而不是整个 response 对象
    return response.data as T;
  },
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message ?? error.message;

    if (typeof window !== "undefined" && status === 401) {
      window.localStorage.removeItem("ACCESS_TOKEN");
      window.location.href = "/login";
    }

    return Promise.reject(new Error(message));
  },
);

// 自定义 http 接口，返回类型是 T 而不是 AxiosResponse<T>
interface CustomHttpInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

// 创建自定义 http 实例，类型为 CustomHttpInstance
const http = axiosInstance as unknown as CustomHttpInstance;

export default http;
