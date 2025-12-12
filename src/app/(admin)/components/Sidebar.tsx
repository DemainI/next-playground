"use client";

import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  TeamOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import { useLayoutContext, TabItem } from "../layout";

const { Sider } = Layout;

// 菜单配置
type MenuItem = Required<MenuProps>["items"][number];

const menuItems: MenuItem[] = [
  {
    key: "/",
    icon: <HomeOutlined />,
    label: "首页",
  },
  {
    key: "system",
    icon: <SettingOutlined />,
    label: "系统管理",
    children: [
      { key: "/system/users", icon: <UserOutlined />, label: "用户管理" },
      { key: "/system/roles", icon: <TeamOutlined />, label: "角色管理" },
      { key: "/system/menus", icon: <MenuOutlined />, label: "菜单管理" },
    ],
  },
];

// 路由标签映射
const routeLabelMap: Record<string, string> = {
  "/": "首页",
  "/system/users": "用户管理",
  "/system/roles": "角色管理",
  "/system/menus": "菜单管理",
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, setCollapsed, tabs, setTabs, setActiveTab } =
    useLayoutContext();

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    return [pathname];
  };

  // 获取当前展开的子菜单
  const getOpenKeys = () => {
    if (pathname.startsWith("/system")) return ["system"];
    if (pathname.startsWith("/monitor")) return ["monitor"];
    return [];
  };

  // 处理菜单点击
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    // 更新标签页
    const label = routeLabelMap[key] || key;
    const existingTab = tabs.find((tab) => tab.key === key);

    if (!existingTab) {
      const newTab: TabItem = {
        key,
        label,
        closable: key !== "/",
      };
      setTabs([...tabs, newTab]);
    }

    setActiveTab(key);
    router.push(key);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      trigger={null}
      width={220}
      className="overflow-hidden"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500">
            <svg
              className="h-5 w-5 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          {!collapsed && (
            <span className="whitespace-nowrap text-base font-semibold text-white">
              悦普信息化管理系统
            </span>
          )}
        </div>
      </div>

      {/* 菜单 */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
        items={menuItems}
        onClick={handleMenuClick}
        className="border-none"
      />
    </Sider>
  );
}
