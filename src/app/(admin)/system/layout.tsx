"use client";

import { Breadcrumb } from "antd";
import { usePathname } from "next/navigation";

/**
 * 系统管理模块布局
 * 为所有系统管理子页面提供面包屑导航
 */
export default function SystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 根据路径生成面包屑
  const getBreadcrumbItems = () => {
    const items = [{ title: "首页" }, { title: "系统管理" }];

    if (pathname.includes("/users")) {
      items.push({ title: "用户管理" });
    } else if (pathname.includes("/roles")) {
      items.push({ title: "角色管理" });
    } else if (pathname.includes("/menus")) {
      items.push({ title: "菜单管理" });
    }

    return items;
  };

  return (
    <div className="space-y-4">
      <Breadcrumb items={getBreadcrumbItems()} />
      {children}
    </div>
  );
}
