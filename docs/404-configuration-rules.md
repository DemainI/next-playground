# Next.js 404 页面配置规则详解

## 📋 核心规则

### 1. 文件命名规则

**必须使用：** `not-found.tsx`

```typescript
// ✅ 正确
app/not-found.tsx

// ❌ 错误（不会生效）
app/404.tsx
app/NotFound.tsx
app/notFound.tsx
app/404-page.tsx
```

### 2. 文件位置规则

#### 规则 1：全局 404 页面

**位置：** `app/not-found.tsx`

**作用范围：** 整个应用的所有路由

```
app/
├── not-found.tsx      ← 全局 404，适用于所有路由
├── layout.tsx
├── page.tsx
└── ...
```

**触发场景：**

- 访问不存在的路由：`/nonexistent`
- 动态路由参数不匹配
- 在任意位置调用 `notFound()`

#### 规则 2：局部 404 页面

**位置：** 特定路由目录下的 `not-found.tsx`

**作用范围：** 仅该路由及其子路由

```
app/
├── not-found.tsx           ← 全局 404
├── blog/
│   ├── not-found.tsx       ← 仅适用于 /blog/* 路由
│   ├── page.tsx
│   └── [id]/
│       └── page.tsx
└── shop/
    ├── not-found.tsx       ← 仅适用于 /shop/* 路由
    └── products/
        └── page.tsx
```

**优先级：** 局部 404 > 全局 404

### 3. 作用域规则

#### 示例 1：全局 404

```
app/
├── not-found.tsx      ← 全局
├── page.tsx           → /
├── about/
│   └── page.tsx       → /about
└── blog/
    └── page.tsx       → /blog
```

**访问 `/nonexistent`** → 显示 `app/not-found.tsx`

#### 示例 2：局部 404

```
app/
├── not-found.tsx           ← 全局
├── blog/
│   ├── not-found.tsx       ← 局部（仅 /blog/*）
│   ├── page.tsx            → /blog
│   └── [id]/
│       └── page.tsx        → /blog/:id
└── shop/
    └── page.tsx            → /shop
```

**访问 `/blog/nonexistent`** → 显示 `app/blog/not-found.tsx`（局部）
**访问 `/shop/nonexistent`** → 显示 `app/not-found.tsx`（全局）

### 4. 布局继承规则

404 页面会继承父级布局：

```
app/
├── layout.tsx              ← 根布局
├── not-found.tsx          ← 会使用根布局
└── blog/
    ├── layout.tsx         ← blog 布局
    ├── not-found.tsx      ← 会使用根布局 + blog 布局
    └── [id]/
        └── page.tsx
```

## 🔧 手动触发规则

### 使用 `notFound()` 函数

```typescript
import { notFound } from 'next/navigation';

// 在服务端组件中
export default async function Page() {
  const data = await fetchData();

  if (!data) {
    notFound(); // 触发最近的 not-found.tsx
  }

  return <div>{data}</div>;
}
```

### 查找规则

`notFound()` 会向上查找最近的 `not-found.tsx`：

```
app/
├── not-found.tsx           ← 全局
├── blog/
│   ├── not-found.tsx       ← blog 局部
│   └── [id]/
│       └── page.tsx        ← 调用 notFound()
```

**在 `app/blog/[id]/page.tsx` 中调用 `notFound()`**：

1. 先查找 `app/blog/not-found.tsx`（存在，使用它）
2. 如果不存在，查找 `app/not-found.tsx`

## 📁 完整示例

### 示例 1：全局 404

```typescript
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h1>404 - 页面不存在</h1>
      <p>抱歉，您访问的页面不存在。</p>
    </div>
  );
}
```

### 示例 2：局部 404

```typescript
// app/blog/not-found.tsx
export default function BlogNotFound() {
  return (
    <div>
      <h1>文章不存在</h1>
      <p>抱歉，您要查找的文章不存在。</p>
      <a href="/blog">返回博客列表</a>
    </div>
  );
}
```

```typescript
// app/blog/[id]/page.tsx
import { notFound } from 'next/navigation';

export default async function BlogPost({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);

  if (!post) {
    notFound(); // 显示 app/blog/not-found.tsx
  }

  return <article>{post.content}</article>;
}
```

### 示例 3：API 路由中的 404

```typescript
// app/api/users/[id]/route.ts
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    notFound(); // 返回 404 状态码
  }

  return NextResponse.json(user);
}
```

## 🎯 最佳实践

### 1. 创建全局 404 页面

```typescript
// app/not-found.tsx
"use client";

import { Button, Result } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，您访问的页面不存在。"
      extra={
        <Button type="primary" onClick={() => router.push("/")}>
          返回首页
        </Button>
      }
    />
  );
}
```

### 2. 为特定路由创建局部 404

```typescript
// app/products/not-found.tsx
export default function ProductNotFound() {
  return (
    <div>
      <h1>产品不存在</h1>
      <p>抱歉，您要查找的产品不存在或已下架。</p>
      <Link href="/products">浏览所有产品</Link>
    </div>
  );
}
```

### 3. 在动态路由中验证并触发 404

```typescript
// app/products/[id]/page.tsx
import { notFound } from 'next/navigation';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  // 产品不存在时触发 404
  if (!product) {
    notFound();
  }

  // 产品已下架时也触发 404
  if (product.status === 'archived') {
    notFound();
  }

  return <div>{product.name}</div>;
}
```

## ⚠️ 注意事项

### 1. 必须是默认导出

```typescript
// ✅ 正确
export default function NotFound() {
  return <div>404</div>;
}

// ❌ 错误
export function NotFound() {
  return <div>404</div>;
}
```

### 2. 可以是客户端或服务端组件

```typescript
// ✅ 客户端组件
"use client";
export default function NotFound() {
  return <div>404</div>;
}

// ✅ 服务端组件
export default function NotFound() {
  return <div>404</div>;
}
```

### 3. 不能使用路由参数

```typescript
// ❌ 错误：not-found.tsx 不能接收 params
export default function NotFound({ params }: { params: { id: string } }) {
  // 这不会工作
}
```

### 4. 与 error.tsx 的区别

| 文件            | 用途     | 触发时机                      |
| --------------- | -------- | ----------------------------- |
| `not-found.tsx` | 404 页面 | 路由不存在或调用 `notFound()` |
| `error.tsx`     | 错误页面 | 组件抛出错误                  |

## 📊 配置规则总结表

| 规则         | 说明                           |
| ------------ | ------------------------------ |
| **文件命名** | 必须是 `not-found.tsx`         |
| **全局位置** | `app/not-found.tsx`            |
| **局部位置** | `app/[route]/not-found.tsx`    |
| **作用范围** | 局部 > 全局                    |
| **布局继承** | 继承父级所有布局               |
| **手动触发** | 使用 `notFound()` 函数         |
| **查找顺序** | 向上查找最近的 `not-found.tsx` |
| **导出方式** | 必须是 `export default`        |
| **组件类型** | 可以是客户端或服务端组件       |

## 🔍 实际项目示例

基于你的项目结构：

```
src/app/
├── not-found.tsx          ← 全局 404（已创建）
├── layout.tsx
├── (admin)/
│   ├── layout.tsx
│   ├── page.tsx
│   └── system/
│       ├── users/
│       │   └── page.tsx
│       └── roles/
│           └── page.tsx
└── login/
    └── page.tsx
```

**触发场景：**

- `/nonexistent` → `app/not-found.tsx`
- `/system/nonexistent` → `app/not-found.tsx`（因为没有局部 404）
- 在 `app/(admin)/system/users/page.tsx` 中调用 `notFound()` → `app/not-found.tsx`

**如果要为 system 路由创建局部 404：**

```
app/
├── not-found.tsx
└── (admin)/
    └── system/
        ├── not-found.tsx      ← 仅适用于 /system/* 路由
        ├── users/
        └── roles/
```

这样 `/system/nonexistent` 会显示 `app/(admin)/system/not-found.tsx`。
