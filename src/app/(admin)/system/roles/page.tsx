"use client";

import { Table, Button, Space, Card, Tag } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface Role {
  id: number;
  name: string;
  code: string;
  description: string;
  permissions: string[];
  createTime: string;
}

export default function RolesPage() {
  const columns: ColumnsType<Role> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "角色名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "角色代码",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "权限",
      dataIndex: "permissions",
      key: "permissions",
      render: (permissions: string[]) => (
        <Space wrap>
          {permissions.map((perm) => (
            <Tag key={perm} color="blue">
              {perm}
            </Tag>
          ))}
        </Space>
      ),
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
  const mockData: Role[] = [
    {
      id: 1,
      name: "管理员",
      code: "admin",
      description: "系统管理员，拥有所有权限",
      permissions: ["用户管理", "角色管理", "菜单管理"],
      createTime: "2024-01-01",
    },
    {
      id: 2,
      name: "普通用户",
      code: "user",
      description: "普通用户，只有查看权限",
      permissions: ["查看"],
      createTime: "2024-01-02",
    },
  ];

  return (
    <Card>
      <div className="mb-4 flex justify-between">
        <h2 className="text-xl font-semibold">角色管理</h2>
        <Button type="primary" icon={<PlusOutlined />}>
          新增角色
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
