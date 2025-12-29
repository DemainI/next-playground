"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Card, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { login, getCaptcha } from "@/services/auth";
import { useRouter } from "next/navigation";

interface LoginForm {
  username: string;
  password: string;
  code: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [captchaHtml, setCaptchaHtml] = useState<string>("");
  const [captchaUuid, setCaptchaUuid] = useState<string>("");
  const [captchaEnabled, setCaptchaEnabled] = useState(false);
  const router = useRouter();

  // 获取验证码
  const fetchCaptcha = async () => {
    setCaptchaLoading(true);
    try {
      const res = await getCaptcha();
      if (res && typeof res === "object" && "data" in res) {
        const data = res.data as {
          img?: string;
          uuid?: string;
          captchaEnabled?: boolean;
        };
        if (data.img) {
          setCaptchaHtml(data.img);
        }
        if (data.uuid) {
          setCaptchaUuid(data.uuid);
        }
        if (data.captchaEnabled !== undefined) {
          setCaptchaEnabled(data.captchaEnabled);
        }
      }
    } catch {
      message.error("获取验证码失败，请稍后重试");
    } finally {
      setCaptchaLoading(false);
    }
  };

  // 组件挂载时获取验证码
  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleSubmit = async (values: LoginForm) => {
    setLoading(true);

    try {
      const res = await login({
        userName: values.username,
        password: values.password,
        code: values.code,
        uuid: captchaUuid,
      });
      const { token } = res.data;
      if (token) {
        window.localStorage.setItem("ACCESS_TOKEN", token);
      }
      message.success(res.msg);
      router.push("/");
    } catch (error) {
      const err = error as Error;
      message.error(err.message || "登录失败，请稍后重试");
      // 登录失败后刷新验证码
      fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* 背景装饰 */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-cyan-100/50 blur-3xl" />
      </div>

      {/* 登录卡片 */}
      <div className="relative w-full max-w-md px-4">
        {/* 表单卡片 */}
        <Card
          className="shadow-xl shadow-gray-200/50"
          styles={{
            body: { padding: "32px" },
          }}
        >
          <Form<LoginForm>
            name="login"
            onFinish={handleSubmit}
            size="large"
            layout="vertical"
          >
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: "请输入用户名" }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="请输入用户名"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: "请输入密码" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="请输入密码"
              />
            </Form.Item>

            {captchaEnabled && (
              <Form.Item
                name="code"
                label="验证码"
                rules={[{ required: true, message: "请输入验证码" }]}
              >
                <div className="flex gap-2">
                  <Input
                    prefix={<CheckCircleOutlined className="text-gray-400" />}
                    placeholder="请输入验证码"
                    className="flex-1"
                  />
                  {/* 验证码显示区域 */}
                  <div
                    className="flex h-10 w-32 cursor-pointer items-center justify-center rounded border border-gray-300 bg-white transition-colors hover:border-blue-400"
                    onClick={fetchCaptcha}
                    title="点击刷新验证码"
                  >
                    {captchaLoading ? (
                      <span className="text-gray-400">加载中...</span>
                    ) : captchaHtml ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: captchaHtml }}
                        className="flex h-full w-full items-center justify-center"
                      />
                    ) : (
                      <ReloadOutlined className="text-gray-400" />
                    )}
                  </div>
                </div>
              </Form.Item>
            )}

            <Form.Item className="mb-0 mt-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="h-11"
              >
                {loading ? "登录中..." : "登 录"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
