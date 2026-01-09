"use client";

import { Button, Result } from "antd";
import { HomeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* 背景装饰 */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-cyan-100/50 blur-3xl" />
      </div>

      {/* 404 内容 */}
      <div className="relative z-10">
        <Result
          status="404"
          title="404"
          subTitle="抱歉，您访问的页面不存在。"
          extra={[
            <Button
              key="back"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.back()}
            >
              返回上一页
            </Button>,
            <Button
              key="home"
              type="primary"
              icon={<HomeOutlined />}
              onClick={() => router.push("/")}
            >
              返回首页
            </Button>,
          ]}
        />
      </div>
    </div>
  );
}
