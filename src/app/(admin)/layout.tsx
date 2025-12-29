"use client";

import { useState, createContext, useContext } from "react";
import { Layout, ConfigProvider } from "antd";
import Sidebar from "./components/Sidebar";
import HeaderNav from "./components/HeaderNav";
import AuthGuard from "./AuthGuard";

const { Content } = Layout;

// 布局上下文
interface LayoutContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  tabs: TabItem[];
  setTabs: (tabs: TabItem[]) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface TabItem {
  key: string;
  label: string;
  closable?: boolean;
}

const LayoutContext = createContext<LayoutContextType | null>(null);

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayoutContext must be used within LayoutProvider");
  }
  return context;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [tabs, setTabs] = useState<TabItem[]>([
    { key: "/", label: "首页", closable: false },
  ]);
  const [activeTab, setActiveTab] = useState("/");

  return (
    <LayoutContext.Provider
      value={{
        collapsed,
        setCollapsed,
        tabs,
        setTabs,
        activeTab,
        setActiveTab,
      }}
    >
      <ConfigProvider>
        <Layout className="h-screen">
          {/* 侧边栏 */}
          <Sidebar />

          <Layout className="bg-[#f5f5f5]">
            {/* 顶部导航 */}
            <HeaderNav />

            {/* 内容区 */}
            <Content className="m-4 overflow-auto rounded-lg bg-white p-6">
              <AuthGuard>{children}</AuthGuard>
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    </LayoutContext.Provider>
  );
}
