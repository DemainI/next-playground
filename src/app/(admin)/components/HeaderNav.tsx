"use client";

import { useState } from "react";
import {
  Layout,
  Breadcrumb,
  Tabs,
  Dropdown,
  Avatar,
  Space,
  Button,
} from "antd";
import type { TabsProps, MenuProps } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionCircleOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutContext } from "../layout";

const { Header } = Layout;

// 路由映射（用于面包屑）
const routeMap: Record<string, { title: string; parent?: string }> = {
  "/": { title: "首页" },
  "/system/users": { title: "用户管理", parent: "系统管理" },
  "/system/roles": { title: "角色管理", parent: "系统管理" },
  "/system/menus": { title: "菜单管理", parent: "系统管理" },
};

export default function HeaderNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, setCollapsed, tabs, setTabs, activeTab, setActiveTab } =
    useLayoutContext();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 获取面包屑
  const getBreadcrumbItems = () => {
    const route = routeMap[pathname];
    if (!route) return [{ title: "首页" }];

    const items = [{ title: "首页" }];
    if (route.parent) {
      items.push({ title: route.parent });
    }
    items.push({ title: route.title });
    return items;
  };

  // 标签页配置
  const tabItems: TabsProps["items"] = tabs.map((tab) => ({
    key: tab.key,
    label: tab.label,
    closable: tab.closable,
  }));

  // 切换标签页
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    router.push(key);
  };

  // 关闭标签页
  const handleTabEdit: TabsProps["onEdit"] = (targetKey, action) => {
    if (action === "remove" && typeof targetKey === "string") {
      const newTabs = tabs.filter((tab) => tab.key !== targetKey);
      setTabs(newTabs);

      // 如果关闭的是当前标签，跳转到最后一个标签
      if (activeTab === targetKey && newTabs.length > 0) {
        const lastTab = newTabs[newTabs.length - 1];
        setActiveTab(lastTab.key);
        router.push(lastTab.key);
      }
    }
  };

  // 全屏切换
  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  // 用户下拉菜单
  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人中心",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "设置",
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
      danger: true,
    },
  ];

  const handleUserMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      router.push("/login");
    }
  };

  return (
    <>
      {/* 顶部工具栏 */}
      <Header
        className="flex h-12 items-center justify-between bg-white px-4 border-b border-gray-200"
        style={{ padding: "0 16px", backgroundColor: "#fff" }}
      >
        {/* 左侧：折叠按钮 + 面包屑 */}
        <div className="flex items-center gap-4">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Breadcrumb items={getBreadcrumbItems()} />
        </div>

        {/* 右侧工具栏 */}
        <Space size="small">
          <Button type="text" icon={<QuestionCircleOutlined />} />
          <Button
            type="text"
            icon={
              isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />
            }
            onClick={toggleFullscreen}
          />

          {/* 用户头像 */}
          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <Avatar
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
              className="cursor-pointer"
              style={{ backgroundColor: "#1677ff" }}
            />
          </Dropdown>
        </Space>
      </Header>

      {/* 标签页导航 */}
      <div className="flex items-center bg-[#f5f5f5] px-4 h-10 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <Tabs
          type="editable-card"
          hideAdd
          activeKey={activeTab}
          items={tabItems}
          onChange={handleTabChange}
          onEdit={handleTabEdit}
          size="small"
          className="admin-tabs"
        />
      </div>
    </>
  );
}
