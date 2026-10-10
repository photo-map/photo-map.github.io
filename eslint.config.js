import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

// CRA 的 `react-scripts build` 内嵌 ESLint（AGENTS.md「硬约束」），`vite build` 不做，
// 因此把 lint 显式搬到 CI / 本地脚本，取代 package.json#eslintConfig 的 "react-app" 预设。
// 规则集在迁移期先逼近现状、避免一次性引入大量失败，可后续收紧。
export default tseslint.config(
  {
    // 产物与依赖不入 lint
    ignores: ['dist/**', 'build/**', 'coverage/**', 'node_modules/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // TS 自身负责未定义符号检查，no-undef 在 TS 下误报多（尤其 Vitest 的 test/expect 全局）
      'no-undef': 'off',
      // 迁移期先对齐 CRA 的宽松度
      '@typescript-eslint/no-explicit-any': 'off',
      // 以下三条是较新 typescript-eslint 默认开启、但 CRA 时代未强制的规则；
      // 触发点都是既有代码的惯用写法（`a && a()` 短路、`Component<{}, S>` 无 props、
      // globals.d.ts 中刻意的 triple-slash 类型引用）。迁移不重构业务代码（ADR 0002 非目标），
      // 故先关闭；日后要收紧应作为独立的重构任务。
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
);
