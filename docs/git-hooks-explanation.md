# Git Hooks 和 Pre-commit 提示说明

## 🔍 问题分析

在 `git commit` 时出现了两个提示：

### 1. Husky 废弃警告

```
husky - DEPRECATED

Please remove the following two lines from .husky/pre-commit:

#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

They WILL FAIL in v10.0.0
```

**原因**：

- 你使用的是 Husky v9.1.7
- Husky v10 改变了工作方式，不再需要这两行代码
- 这是**警告**，不是错误，当前版本仍可正常工作

### 2. Prettier 格式化检查失败

```
[warn] Code style issues found in 9 files. Run Prettier with --write to fix.
husky - pre-commit script failed (code 1)
```

**原因**：

- `.husky/pre-commit` 钩子会运行 `format:check`
- 有 9 个文件的代码格式不符合 Prettier 规范
- Pre-commit 钩子阻止了提交（这是**预期行为**，确保代码格式统一）

---

## ✅ 解决方案

### 方案 1: 修复代码格式（推荐）

**自动修复所有格式问题**：

```bash
npm run format:write
# 或
pnpm format:write
```

这会自动格式化所有文件，然后重新提交：

```bash
git add .
git commit -m "your message"
```

### 方案 2: 更新 Husky 配置（可选）

**移除废弃的代码行**：

```bash
# .husky/pre-commit 文件内容改为：
npm run format:check
npm run lint:check
```

移除这两行：

- `#!/usr/bin/env sh`
- `. "$(dirname -- "$0")/_/husky.sh"`

---

## 📝 详细说明

### Git Hooks 的作用

**Pre-commit 钩子**会在每次 `git commit` 时自动运行，确保：

- ✅ 代码格式符合规范（Prettier）
- ✅ 代码质量符合规范（ESLint）
- ✅ 防止提交格式不规范的代码

### 工作流程

```
git commit
  ↓
触发 .husky/pre-commit
  ↓
运行 format:check（检查格式）
  ↓
如果有格式问题 → ❌ 阻止提交
如果格式正确 → ✅ 继续提交
```

---

## 🎯 快速修复

**立即修复格式问题**：

```bash
# 1. 自动修复格式
pnpm format:write

# 2. 重新提交
git add .
git commit -m "your message"
```

---

## 📚 总结

**两个提示的含义**：

1. **Husky 警告**：未来版本会改变，当前可忽略或更新配置
2. **Prettier 错误**：代码格式问题，需要修复后才能提交

**推荐操作**：

1. 运行 `pnpm format:write` 修复格式
2. 重新提交

这就是 Git Hooks 在保护代码质量！🎉
