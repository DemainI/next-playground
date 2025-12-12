"use client";

import { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: LoginForm) => {
    setLoading(true);

    // 模拟登录请求
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("登录信息:", values);
    message.success("登录成功！");
    setLoading(false);

    // TODO: 实际登录逻辑
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
