/**
 * 通用 API 响应类型
 * 所有接口的响应都遵循这个格式
 */

/**
 * 通用 API 响应体
 * @template T - data 字段的类型
 *
 * @example
 * // data 是用户对象
 * type UserResponse = ApiResponse<{ id: number; name: string }>;
 *
 * // data 是数组
 * type UserListResponse = ApiResponse<Array<{ id: number; name: string }>>;
 *
 * // data 是 null
 * type EmptyResponse = ApiResponse<null>;
 */
export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}
