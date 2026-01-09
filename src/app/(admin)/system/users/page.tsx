"use client";

import { Table, Button, Space, Card } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  createTime: string;
}

export default function UsersPage() {
  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      render: () => (
        <Space>
          <Button type="link" icon={<EditOutlined />} size="small">
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} size="small">
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 模拟数据
  const mockData: User[] = [
    {
      id: 1,
      username: "admin",
      email: "admin@example.com",
      role: "管理员",
      status: "启用",
      createTime: "2024-01-01",
    },
    {
      id: 2,
      username: "user1",
      email: "user1@example.com",
      role: "普通用户",
      status: "启用",
      createTime: "2024-01-02",
    },
  ];

  return (
    <Card>
      <div className="mb-4 flex justify-between">
        <h2 className="text-xl font-semibold">用户管理</h2>
        <Button type="primary" icon={<PlusOutlined />}>
          新增用户
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={mockData}
        rowKey="id"
        pagination={{
          total: mockData.length,
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </Card>
  );
}
