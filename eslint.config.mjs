import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintConfigPrettier, // 关闭与 Prettier 冲突的格式化规则
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
