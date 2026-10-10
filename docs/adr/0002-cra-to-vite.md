# ADR 0002：构建迁移（CRA → Vite）

- 状态：accepted（2026-10-10 阶段 0 ①~⑥ 全绿：① 真机渲染人工确认通过；⑥ 定为**现代浏览器-only**；⑤ 定用 **flat config + `typescript-eslint`**）
- 日期：2026-10-10 起草
- 决策人：chenyang（仓库所有者）
- 关联：[迁移计划](../plans/0002-cra-to-vite.md)（同编号）

> 本 ADR 只记录**决策**。分期、验收命令、checklist、完成定义等执行细节在关联的迁移计划里，
> 决策本身变化时才修订本文档。`proposed → accepted` 的门槛是**阶段 0 探针全绿**（见计划）。

## Context and Problem Statement

Create React App 官方已进入 EOL，`react-scripts` 5.0.1 停止维护。ADR 0001 完成后技术栈是
React 18 + antd 5 + TypeScript 4.9，但**构建层没动**：dev / build / test 仍完全由 `react-scripts` 提供。

继续留在 CRA 的代价：

- 底层 webpack 5 / Babel / ESLint 依赖链无人修复安全漏洞；
- 工具链与 Node 版本漂移时可能**突然硬失败**（本仓库已被弃用 action 拦停过流水线，见 [`docs/ci.md`](../ci.md)）；
- 无法享受现代构建器的 dev 速度与配置能力。

问题：如何在**不中断业务、不推翻 ADR 0001 的 `strict` TS 成果、且迁移前可证伪**的前提下换掉构建层？

### 现状盘点（2026-10-10 实测）

| 事实 | 证据 | 影响 |
| --- | --- | --- |
| 迁移前基线全绿 | `npx tsc --noEmit` exit 0；`CI=true npm run build` 成功；`CI=true npm test` 4 suites / 6 tests 通过 | 迁移需保持这三条等价 |
| 运行时真正 import 的地图库**只有 `react-amap@1.2.8`** | `grep react-amap src/` → `Map/AMap/index.tsx`；`GoogleMap`/`BaiduMap` 均为占位 div（`Map/index.tsx:34-35`） | 老库风险面比预想小 |
| `react-bmapgl` 仅作**类型引用**，`mapvgl` 不在构建图 | `react-bmapgl` 无运行时 import，只在 `src/globals.d.ts` triple-slash 引用其类型；`window.BMapGL` 是 `index.html` 脚本注入的全局 | 最高风险的 600KB 压缩 UMD（mapvgl）已被 ADR 0001 死代码清理移出 |
| `google-map-react@2.2.1` 已是**未使用依赖** | `grep google-map-react src/` 无运行时 import | 不阻塞迁移；清理另行处理 |
| CRA 耦合面很小 | `src` 仅 1 处 `process.env`（`Map/AMap/index.tsx:279`）；`public/index.html` 3 处 `%PUBLIC_URL%` + 1 处 `%REACT_APP_BAIDU_MAP_AK%`；1 个 `react-app-env.d.ts`；`package.json#eslintConfig`；测试从 `react-scripts test` 起 | 迁移主要是配置层，业务代码几乎不动 |
| 纯静态 SPA：无路由、无 SSR、无后端 | 读 `src/index.tsx` 与依赖列表 | 可排除 Next / Astro 等框架场景 |

## Decision Drivers

**目标**

1. 换掉 `react-scripts`，产物仍是**静态目录**，`gh-pages` 部署方式不变
2. 迁移期间任意时刻 `tsc --noEmit` / `build` / `test` 保持绿灯（渐进、可中断）
3. **env 变量与 GitHub secrets 名称不变**（`REACT_APP_*`），把 CI 与密钥面改动降到最小

**非目标**（明确不做，避免范围蔓延）

- 不升级 React / antd / TypeScript：构建迁移是独立项目，一次只动一个变量
- 不重构业务逻辑、不把 class 组件改写为函数组件
- 不处理老地图库自身的维护状态、不清理未使用依赖（`google-map-react` 等）
- 不引入 SSR / 路由（本应用没有该需求）

## Considered Options

| 方案 | 结论 | 理由 |
| --- | --- | --- |
| **1. Vite（+ Vitest）** | **是** | 纯静态 SPA 的最优场景：配置最少、dev 最快、生态最大、CRA→Vite 路径最成熟；`envPrefix: 'REACT_APP_'` 可让 secrets 名零改动；Vitest API 接近 Jest，测试迁移成本低 |
| 2. Rsbuild（Rspack 内核） | 否（**备选/兜底**） | 保留 Webpack 语义，老库兼容风险最低；但社区/资料少于 Vite，押注面更窄。**若阶段 0 在 `react-amap` 或 env 注入上不可解，回退到本方案** |
| 3. Next.js（`output: 'export'`） | 否 | 本应用重度依赖 `window.gapi / BMapGL / AMap` 全局脚本，须把整棵树包 `dynamic(..., { ssr:false })`；静态导出还丢特性。功能收益与复杂度不成比例 |
| 4. Astro | 否 | 本质是「一个巨大 React island」，无内容站/SEO 需求，全局脚本处理别扭 |
| 5. 留在 CRA / `@craco`、`react-app-rewired` 等 fork | 否 | **不解决 EOL**：`react-scripts` 依旧无人维护，fork 只是薄壳。仅可作为有时限的观望 |
| 6. 自建 webpack/esbuild | 否 | 控制力最强、维护成本最高，对 ~2700 行的小项目不划算 |

## Decision Outcome

选择 **方案 1：迁移到 Vite（测试用 Vitest）**，按依赖方向**渐进**推进，且**先跑阶段 0 探针**：
探针回答完未知项并全绿后，ADR 才由 `proposed` 进入 `accepted` 并开始搬迁；任一未知项不可解，
则回到本 ADR 改选方案 2（Rsbuild）。理由：三条目标（静态产物、随时绿灯、secrets 名不变）Vite 都能满足，
且本仓库的 CRA 耦合面已实测很小。

### Consequences

- **Good**：dev 冷启动与 HMR 显著快于 webpack；配置集中在单个 `vite.config.ts`，比 CRA 的黑盒可读
- **Good**：迁移前有可证伪的探针，失败可在几乎零成本时发现（不产出 Go 决策）
- **Good**：`envPrefix: 'REACT_APP_'` 下环境变量与 secrets 名不变，CI 改动小
- **Bad**：dev 走**原生 ESM**，与 CRA 的 webpack bundling 行为不同；`react-amap`（CJS）可能需要 `optimizeDeps` 兜底
- **Bad**：CRA 与 `@vitejs/plugin-react` **无法在同一 `package.json` 干净共存**（Babel peer 冲突，阶段 0 实测），
  因此不存在「两个构建器并存」的渐进路径，步 1 必须**原子翻转**（详见迁移计划阶段 0 实测）
- **Bad**：Vite 的 `build` **不再内嵌 ESLint 与类型检查**（CRA 会硬失败）。必须把 `tsc --noEmit` 与 ESLint 明确加进 CI，否则判据出现空窗
- **Bad**：Vite 默认产物目标是现代浏览器；若仍需兼容旧浏览器要引入 `@vitejs/plugin-legacy`（需实测后决定）
- **Bad**：`%PUBLIC_URL%` / `%REACT_APP_%` 是 CRA 专有语法，`index.html` 需改写并实测路径
- **Bad**：引入 Vite 大版本后仍需靠 Dependabot（`.github/dependabot.yml`）盯升级，与 CRA 时代相同

### Confirmation

迁移每一步执行等价的三条命令且全绿，视为符合本决策：

```sh
npx tsc --noEmit          # 类型检查（Vite 与 tsc 共用 tsconfig.json）
npm run build             # 生产构建（Vite；lint 由 CI 中独立步骤承担）
CI=true npm test          # 测试（Vitest + jsdom）
```

阶段 0 探针是例外：以「回答未知项」为完成判据，允许命令失败（细节见迁移计划）。

## More Information

- 执行细节：[迁移计划](../plans/0002-cra-to-vite.md)
- 前序决策：[ADR 0001：TypeScript 迁移](0001-typescript-migration.md)
- 项目指令：[AGENTS.md](../../AGENTS.md)
- CI 判据：[docs/ci.md](../ci.md)
