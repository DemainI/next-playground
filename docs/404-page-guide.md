# Next.js 404 页面配置指南

## 已创建的 404 页面

项目中的 404 页面位于：`src/app/not-found.tsx`

## 自动触发 404 的情况

1. 访问不存在的路由（如 `/nonexistent-page`）
2. 动态路由参数不匹配且没有 fallback
3. 在服务端组件中调用 `notFound()` 函数

## 手动触发 404

### 在服务端组件中

```typescript
// app/users/[id]/page.tsx
import { notFound } from 'next/navigation';

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 从数据库获取用户
  const user = await getUserById(id);

  // 如果用户不存在，触发 404
  if (!user) {
    notFound(); // 这会显示 not-found.tsx 页面
  }

  return <div>用户: {user.name}</div>;
}
```

### 在 API 路由中

```typescript
// app/api/users/[id]/route.ts
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound(); // 返回 404 状态码和 not-found.tsx 页面
  }

  return NextResponse.json(user);
}
```

## 自定义 404 页面

### 全局 404 页面

`app/not-found.tsx` - 适用于所有路由

### 特定路由的 404 页面

可以在特定路由目录下创建 `not-found.tsx`：

```
app/
├── not-found.tsx          # 全局 404
└── blog/
    ├── not-found.tsx      # blog 路由下的 404
    └── [id]/
        └── page.tsx
```

## 404 页面特性

当前实现的 404 页面包含：

- ✅ 使用 Ant Design 的 Result 组件
- ✅ 与登录页面风格一致的背景装饰
- ✅ "返回上一页" 按钮
- ✅ "返回首页" 按钮
- ✅ 响应式设计

## 测试 404 页面

访问以下 URL 来测试：

- `/nonexistent-page` - 不存在的路由
- `/test/404` - 任意不存在的路径
