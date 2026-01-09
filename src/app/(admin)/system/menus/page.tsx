"use client";

import { Table, Button, Space, Card } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

interface Menu {
  id: number;
  name: string;
  path: string;
  icon: string;
  parentId: number | null;
  order: number;
  status: string;
}

export default function MenusPage() {
  const columns: ColumnsType<Menu> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "菜单名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "路径",
      dataIndex: "path",
      key: "path",
    },
    {
      title: "图标",
      dataIndex: "icon",
      key: "icon",
    },
    {
      title: "父菜单ID",
      dataIndex: "parentId",
      key: "parentId",
      render: (parentId: number | null) => parentId || "-",
    },
    {
      title: "排序",
      dataIndex: "order",
      key: "order",
      width: 80,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
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
  const mockData: Menu[] = [
    {
      id: 1,
      name: "系统管理",
      path: "/system",
      icon: "SettingOutlined",
      parentId: null,
      order: 1,
      status: "启用",
    },
    {
      id: 2,
      name: "用户管理",
      path: "/system/users",
      icon: "UserOutlined",
      parentId: 1,
      order: 1,
      status: "启用",
    },
    {
      id: 3,
      name: "角色管理",
      path: "/system/roles",
      icon: "TeamOutlined",
      parentId: 1,
      order: 2,
      status: "启用",
    },
    {
      id: 4,
      name: "菜单管理",
      path: "/system/menus",
      icon: "MenuOutlined",
      parentId: 1,
      order: 3,
      status: "启用",
    },
  ];

  return (
    <Card>
      <div className="mb-4 flex justify-between">
        <h2 className="text-xl font-semibold">菜单管理</h2>
        <Button type="primary" icon={<PlusOutlined />}>
          新增菜单
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
