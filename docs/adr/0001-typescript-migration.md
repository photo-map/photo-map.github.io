# ADR 0001：TypeScript 迁移

- 状态：accepted
- 日期：2026-10-08 起草，2026-10-09 评审通过
- 决策人：chenyang（仓库所有者，评审中）
- 关联：[迁移计划](../plans/0001-typescript-migration.md)（同编号）

> 本 ADR 只记录**决策**。分期、验收命令、checklist、完成定义等执行细节在关联的迁移计划里，
> 决策本身变化时才修订本文档。

## Context and Problem Statement

`src/` 下 40 个业务文件全部是 `.js`/`.jsx`（约 2675 行），只有 CRA 脚手架残留的 5 个 TS 文件。
类型信息目前只靠 `prop-types`（运行时）和零散的 JSDoc `@typedef`（仅编辑器提示），
编译期没有任何约束。如何在不中断现有开发的前提下，把业务代码迁到 TS/TSX？

### 现状盘点（已实测）

| 事实 | 证据 | 影响 |
| --- | --- | --- |
| 40 个 `.js`/`.jsx` 文件，2675 行，最大 `Map/index.jsx` 368 行 | `wc -l` | 全量迁移体量过大，渐进可行 |
| `tsconfig.json` 已是 `strict: true` + `allowJs: true` + `noEmit` | 直接读配置 | **JS 不检查、TS 严查** → 渐进迁移每步都可保持绿灯；`strict` 是现成的，不必从零打开 |
| CRA 5 自动识别 tsconfig：`useTypeScript = fs.existsSync(paths.appTsConfig)`，webpack `resolve.extensions` 与 jest `moduleFileExtensions` 均包含 `.ts/.tsx` | `react-scripts/config/webpack.config.js:69,319`、`scripts/utils/createJestConfig.js:61` | **迁移不需要改任何构建/测试配置** |
| jest 走 Babel：`babel-preset-react-app` 依赖 `@babel/preset-typescript` | 读该包 `package.json` | `.ts/.tsx` 测试无需额外配置 |
| ESLint 已备好 TS 支持：`eslint-config-react-app` 依赖 `@typescript-eslint/parser` 与 `eslint-plugin` | 读该包 `package.json` | 不必新装 lint 依赖 |
| `prop-types` 只用在 4 个文件 + `Map/typedef.js` | grep | 删除依赖的收口面很小 |
| `Map/typedef.js` 唯一引用方是 `Map/BaiduMap/index.jsx` | grep | 第一刀风险低 |
| 自带类型：`react-bmapgl`、`react-amap`、`react-ga`；缺类型但 DefinitelyTyped 有：`google-map-react`、`pubsub-js`、`debug`、`lodash.get` | 读各包 `package.json` 的 `types` 字段、`npm view @types/*` | 需装 4 个 `@types/*`，无阻塞 |
| `react-bmapgl` 的 `dist/index.d.ts` 引用全局 `BMapGL` 命名空间，但**未引用**自带的 `types/bmapgl/index.d.ts` | 读 `dist/index.d.ts`，无任何 `/// <reference>` | 未知项①：需实测补 triple-slash reference |
| `window.BMapGL` / `AMap` / `gapi` / `google` 无任何声明 | 全仓库无相关 `.d.ts` | 未知项②：迁到 tsx 必报 `does not exist on type 'Window'` |

## Decision Drivers

**目标**

1. `src/` 下业务代码全部为 `.ts`/`.tsx`，`tsconfig.json` 移除 `allowJs`
2. 移除 `prop-types` 运行时依赖，其声明由 `interface` 取代
3. 迁移期间任意时刻 `npm run build` 与 `npm test` 保持绿灯（渐进、可中断）

**非目标**（明确不做，避免范围蔓延）

- 不更换构建工具：CRA → Vite 是**独立的下一个项目**（react-scripts 5 已停止维护，问题要隔离）
- 不做 class 组件 → 函数组件的重写，只做类型标注
- 不升级 `typescript`（保持 4.9.5，在 CRA 5 支持范围内）
- 不修复存量业务 bug，除非它**阻断编译**（豁免上限见迁移计划「开放问题」）
- 不清理 JSDoc `@typedef`：迁哪个文件顺手删哪个，不单独开任务

## Considered Options

| 方案 | 结论 | 理由 |
| --- | --- | --- |
| 1. 一次性全量迁移（Big Bang） | 否 | ~3000 行单 PR，review 与回滚压力大，期间需冻结其他改动 |
| **2. 按依赖方向渐进迁移** | **是** | 每步绿灯、可拆 5~8 个 PR、可随时中断；2675 行的体量让成本可控 |
| 3. 薄 TS（改名 + `any` 压住，`strict` 降级） | 否 | `strict: true` 是既有配置，降级是倒退；「后续收紧」实践中不会发生 |
| 4. 迁移 + 同时换 Vite | 否 | 两个变量耦合，报错无法归因；见「非目标」 |
| 计划产出方式：ADR（本文档） vs spike 先行 vs checklist Issue vs codemod vs 无文档 | ADR + 迁移计划 | 遵守本仓库 AGENTS.md「有价值的结论必须回流到 `docs/`」；计划不落盘即失传 |

## Decision Outcome

选择 **方案 2：按依赖方向渐进迁移**。它同时满足三条目标：`allowJs` 保证任何时刻 JS 文件仍可开发
（可中断），TS 文件的 `strict` 检查在每步即时生效（不倒退），且每一步的完成与否由命令判定而非人工判断。

**执行策略**：本 ADR 评审通过（`proposed` → `accepted`）→ 阶段 0 探针实测未知项 → 结论回填迁移计划
→ 按分期推进。顺序与验收标准见[迁移计划](../plans/0001-typescript-migration.md)。

### Consequences

- **Good**：每步独立可回滚；迁移不阻塞业务开发；`strict` 无需从零打开
- **Good**：CRA 对 TS 的支持是现成的（构建、测试、lint 均无需改配置）
- **Bad**：迁移期存在 JS/TS 混合中间态，`allowJs` 长期为 `true`；期间新增的 `.js` 代码仍不受类型保护
- **Bad**：**没有包体积收益**。CRA 的 `babel-plugin-transform-react-remove-prop-types` 在生产构建里
  本来就剥离 `propTypes`，移除该依赖的收益纯粹在编译期，不可作为性能论据
- **Bad**：按阶段拆多个 PR，评审与 CI 次数多于一次性迁移
- **Bad**：阶段 0 探针可能推翻渐进路线（见迁移计划的「风险与未知项」）

### Confirmation

每步执行三条命令且全绿，即视为符合本决策：

```sh
npx tsc --noEmit        # 类型检查（与 CRA 同一 tsconfig、同一 TS 版本）
CI=true npm run build   # 生产构建（内嵌 ESLint，failOnError: true）
CI=true npm test        # 测试
```

阶段 0 探针是例外：它以「回答未知项」为完成判据，允许命令失败（细节见迁移计划）。
迁移的最终完成定义（含 `AGENTS.md` 同步）见迁移计划末尾。

## More Information

- 执行细节：[迁移计划](../plans/0001-typescript-migration.md)
- 项目指令：[AGENTS.md](../../AGENTS.md)
- CI 判据：[docs/ci.md](../ci.md)
