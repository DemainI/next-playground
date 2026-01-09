# Next.js 嵌套路由创建指南

## 📚 目录

1. [什么是嵌套路由](#什么是嵌套路由)
2. [创建嵌套路由的方法](#创建嵌套路由的方法)
3. [嵌套布局（Nested Layouts）](#嵌套布局nested-layouts)
4. [实际示例](#实际示例)
5. [常见场景](#常见场景)

---

## 什么是嵌套路由

**嵌套路由**是指 URL 路径有多层结构，例如：

- `/system/users` → 系统管理 > 用户管理
- `/system/roles` → 系统管理 > 角色管理
- `/blog/posts/123` → 博客 > 文章 > 详情

在 Next.js App Router 中，**文件夹结构直接对应 URL 路径**。

---

## 创建嵌套路由的方法

### 方法 1：基本嵌套路由

**文件结构**：

```
app/
└── system/
    └── users/
        └── page.tsx      → /system/users
```

**创建步骤**：

1. 在 `app` 目录下创建文件夹 `system`
2. 在 `system` 下创建文件夹 `users`
3. 在 `users` 下创建 `page.tsx`

**示例代码**：

```typescript
// app/system/users/page.tsx
export default function UsersPage() {
  return <div>用户管理页面</div>;
}
```

### 方法 2：多层嵌套路由

**文件结构**：

```
app/
└── blog/
    └── posts/
        └── [id]/
            └── page.tsx  → /blog/posts/:id
```

**示例代码**：

```typescript
// app/blog/posts/[id]/page.tsx
export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <div>文章 ID: {id}</div>;
}
```

### 方法 3：带布局的嵌套路由

**文件结构**：

```
app/
└── system/
    ├── layout.tsx        → 系统管理布局
    ├── users/
    │   └── page.tsx      → /system/users
    └── roles/
        └── page.tsx      → /system/roles
```

**布局文件**：

```typescript
// app/system/layout.tsx
export default function SystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1>系统管理</h1>
      <nav>
        <a href="/system/users">用户管理</a>
        <a href="/system/roles">角色管理</a>
      </nav>
      {children}
    </div>
  );
}
```

---

## 嵌套布局（Nested Layouts）

### 布局的工作原理

Next.js 的布局是**嵌套的**，每个 `layout.tsx` 会包裹其子路由：

```
app/
├── layout.tsx                    → 根布局（最外层）
│   └── (admin)/
│       ├── layout.tsx            → 管理后台布局（中间层）
│       │   └── system/
│       │       ├── layout.tsx    → 系统管理布局（内层）
│       │       │   └── users/
│       │       │       └── page.tsx
```

**渲染顺序**：

```
根布局 → 管理后台布局 → 系统管理布局 → 页面内容
```

### 实际项目示例

在你的项目中：

```
app/
├── layout.tsx                    → 根布局（全局样式、字体）
│   └── (admin)/
│       ├── layout.tsx            → 管理后台布局（侧边栏、导航）
│       │   └── system/
│       │       ├── layout.tsx    → 系统管理布局（可选，如面包屑）
│       │       │   └── users/
│       │       │       └── page.tsx → /system/users
```

---

## 实际示例

### 示例 1：系统管理模块

**创建文件结构**：

```
app/
└── (admin)/
    └── system/
        ├── layout.tsx
        ├── users/
        │   └── page.tsx
        ├── roles/
        │   └── page.tsx
        └── menus/
            └── page.tsx
```

**1. 系统管理布局**：

```typescript
// app/(admin)/system/layout.tsx
"use client";

import { Breadcrumb } from "antd";
import { usePathname } from "next/navigation";

export default function SystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const breadcrumbItems = [
    { title: "首页" },
    { title: "系统管理" },
    { title: pathname.includes("/users") ? "用户管理" :
             pathname.includes("/roles") ? "角色管理" :
             pathname.includes("/menus") ? "菜单管理" : "" },
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />
      {children}
    </div>
  );
}
```

**2. 用户管理页面**：

```typescript
// app/(admin)/system/users/page.tsx
"use client";

import { Table, Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function UsersPage() {
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "用户名", dataIndex: "username", key: "username" },
    { title: "邮箱", dataIndex: "email", key: "email" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />}>
          新增用户
        </Button>
      </div>
      <Table columns={columns} dataSource={[]} />
    </div>
  );
}
```

**3. 角色管理页面**：

```typescript
// app/(admin)/system/roles/page.tsx
"use client";

export default function RolesPage() {
  return <div>角色管理页面</div>;
}
```

**4. 菜单管理页面**：

```typescript
// app/(admin)/system/menus/page.tsx
"use client";

export default function MenusPage() {
  return <div>菜单管理页面</div>;
}
```

### 示例 2：博客模块（多层嵌套）

**文件结构**：

```
app/
└── blog/
    ├── layout.tsx
    ├── page.tsx              → /blog（博客列表）
    └── posts/
        ├── page.tsx          → /blog/posts（所有文章）
        └── [slug]/
            └── page.tsx      → /blog/posts/:slug（文章详情）
```

**1. 博客布局**：

```typescript
// app/blog/layout.tsx
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-container">
      <header>
        <h1>我的博客</h1>
      </header>
      {children}
    </div>
  );
}
```

**2. 博客列表页**：

```typescript
// app/blog/page.tsx
export default function BlogPage() {
  return <div>博客列表</div>;
}
```

**3. 文章详情页**：

```typescript
// app/blog/posts/[slug]/page.tsx
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 获取文章数据
  const post = await fetch(`/api/posts/${slug}`).then(res => res.json());

  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  );
}
```

---

## 常见场景

### 场景 1：带标签页的嵌套路由

```
app/
└── dashboard/
    ├── layout.tsx        → 带标签页导航
    ├── overview/
    │   └── page.tsx      → /dashboard/overview
    ├── analytics/
    │   └── page.tsx      → /dashboard/analytics
    └── settings/
        └── page.tsx      → /dashboard/settings
```

### 场景 2：带动态参数的嵌套路由

```
app/
└── shop/
    ├── products/
    │   ├── page.tsx          → /shop/products
    │   └── [id]/
    │       ├── page.tsx      → /shop/products/:id
    │       └── reviews/
    │           └── page.tsx  → /shop/products/:id/reviews
```

### 场景 3：可选嵌套路由

```
app/
└── docs/
    ├── [[...slug]]/      → 可选 catch-all
    │   └── page.tsx      → /docs 或 /docs/guide 或 /docs/guide/install
```

---

## 📊 路由规则总结

| 文件结构                      | URL 路径        | 说明                 |
| ----------------------------- | --------------- | -------------------- |
| `app/page.tsx`                | `/`             | 首页                 |
| `app/about/page.tsx`          | `/about`        | 单层路由             |
| `app/system/users/page.tsx`   | `/system/users` | 嵌套路由             |
| `app/blog/[id]/page.tsx`      | `/blog/:id`     | 动态路由             |
| `app/shop/[...slug]/page.tsx` | `/shop/*`       | Catch-all            |
| `app/(admin)/page.tsx`        | `/`             | 路由组（不影响 URL） |

---

## 🎯 最佳实践

### 1. 合理使用布局

- **根布局**：全局样式、字体、Provider
- **功能布局**：侧边栏、导航、权限验证
- **页面布局**：面包屑、页面标题

### 2. 组织文件结构

```
app/
├── (auth)/              → 认证相关（登录、注册）
├── (admin)/             → 管理后台
│   ├── system/          → 系统管理
│   └── monitor/         → 监控管理
└── (public)/            → 公开页面
```

### 3. 使用路由组组织代码

- 使用 `(folder)` 组织相关页面
- 不影响 URL 路径
- 可以共享布局和逻辑

---

## ✅ 总结

**创建嵌套路由的步骤**：

1. ✅ 在 `app` 目录下创建文件夹结构
2. ✅ 每个路由层级创建对应的文件夹
3. ✅ 在最终文件夹中创建 `page.tsx`
4. ✅ 可选：在中间层级创建 `layout.tsx` 共享布局
5. ✅ 文件夹名直接对应 URL 路径

**关键点**：

- 📁 文件夹结构 = URL 路径
- 📄 `page.tsx` = 页面组件
- 🎨 `layout.tsx` = 共享布局
- 🔀 路由组 `(folder)` = 不影响 URL

这就是 Next.js 嵌套路由的创建方法！🎉
