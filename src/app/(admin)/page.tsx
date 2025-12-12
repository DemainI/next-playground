"use client";

import { Card, Row, Col, Statistic } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  CloudServerOutlined,
} from "@ant-design/icons";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* 欢迎区域 */}
      <div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
        <h1 className="text-2xl font-semibold">欢迎使用后台管理系统</h1>
        <p className="mt-2 text-blue-100">
          这是仪表盘页面，您可以在这里查看系统概览信息
        </p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="用户总数"
              value={1024}
              prefix={<UserOutlined className="text-blue-500" />}
              styles={{ content: { color: "#1677ff" } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="在线用户"
              value={56}
              prefix={<TeamOutlined className="text-green-500" />}
              styles={{ content: { color: "#52c41a" } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="系统日志"
              value={8846}
              prefix={<FileTextOutlined className="text-orange-500" />}
              styles={{ content: { color: "#fa8c16" } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="服务数量"
              value={12}
              prefix={<CloudServerOutlined className="text-purple-500" />}
              styles={{ content: { color: "#722ed1" } }}
            />
          </Card>
        </Col>
      </Row>

      {/* 提示信息 */}
      <Card title="快速开始">
        <ul className="space-y-2 text-gray-600">
          <li>• 点击左侧菜单可以切换到不同的管理页面</li>
          <li>• 点击侧边栏底部的按钮可以折叠/展开菜单</li>
          <li>• 点击顶部标签页可以在已打开的页面之间快速切换</li>
          <li>• 点击右上角头像可以查看个人信息或退出登录</li>
        </ul>
      </Card>
    </div>
  );
}
