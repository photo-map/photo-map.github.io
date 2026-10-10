# CRA → Vite 构建迁移计划

关联决策：[ADR 0002](../adr/0002-cra-to-vite.md)（编号一致：`plans/0002` 执行的是 `adr/0002`）。
本文档是决策的**执行落地**（分期、验收、checklist、完成定义），可随实践自由修订；
决策本身变化时改 ADR，并在此更新链接与日期。

## 验收标准（机器判定）

```sh
npx tsc --noEmit        # 类型检查（Vite 与 tsc 共用 tsconfig.json）
npm run build           # 生产构建（Vite）
CI=true npm test        # 测试（Vitest + jsdom）
```

- 三条全绿才算一步完成；每个阶段一个（或多个）PR，**PR 内不做与该阶段无关的改动**
- **与 CRA 时代的关键差异**：`react-scripts build` 内嵌 ESLint 且类型错误硬失败（ADR 0001 探针③），
  `vite build` 两者都不做。因此 CI 必须**显式**增加 `npx tsc --noEmit` 与 lint 步骤，
  否则判据出现空窗（见阶段 1）
- 阶段 0 探针是唯一例外，判据见下节

迁移完成追加判据：

```sh
grep -rn "react-scripts" package.json          # 无输出（devDependencies/scripts 均无）
grep -rn "%PUBLIC_URL%\|%REACT_APP_" public/    # 无输出
```

## 迁移分期

| 阶段 | 范围 | 关键动作 | 性质 |
| --- | --- | --- | --- |
| **0. 探针** | 独立 worktree（不进 `master`） | 实测未知项①②③④⑤⑥，**全绿才进入阶段 1** | 允许失败/丢弃，**判据见下节** |
| **1. 原子切换（构建 + 测试 + lint 同一个 PR）** | 新增 `vite.config.ts` 与根 `index.html`；移除 `react-scripts`；`package.json` scripts 改 Vite/Vitest；Jest → Vitest；新增 ESLint flat config；`@types/node` 升 `^22.14.0`（Vite 8 peer）；CI 同步 | `vite dev`/`build`/`preview` 跑通；4 suites 全绿；三命令全绿；`build-deploy.yml` 增加 `tsc --noEmit` + lint 且产物目录改 `dist`；`AGENTS.md` / `DEVELOP.md` / `docs/ci.md` 同步 | 核心 PR，风险最高，**合并即切换生产** |
| **2. 收尾** | 清理迁移遗留 | 删 `react-app-env.d.ts`、`package.json#eslintConfig`（已在阶段 1 做则记「已完成」）；两条 grep 判据全绿；评估移除未使用依赖（`google-map-react`）、`public/homepage.html` 去留 | 可选，独立 PR |

> **阶段划分修订（阶段 0 实测后，2026-10-10）**：原计划把「构建骨架」（阶段 1）与「测试与 lint」（阶段 2）
> 拆成两个 PR。但 `react-scripts` **一个包同时承载 `start` / `build` / `test`**，且与 `@vitejs/plugin-react`
> 无法在同一 `package.json` 干净共存（`ERESOLVE`，见下「新发现」#1）——因此**不存在「先只换 build、
> 测试暂留 CRA」的渐进路径**：移除 `react-scripts` 就必须同时把测试切到 Vitest。两阶段合并为阶段 1。
> 又因阶段 1 合并即切换生产，长期有效的约定（`AGENTS.md` 等）也在同一 PR 内更新，避免出现
> 「代码已是 Vite、项目指令仍写 CRA」的窗口。

阶段 0 完成后，**若发现 Vite 路线不可行**（如 `react-amap` 无法加载、env 注入无法等价），
应先回到 ADR 0002 改选方案 2（Rsbuild），再继续 —— 这是探针存在的意义。本次探针全绿，故按 Vite 继续。

## 阶段 0：探针的产出判据（与普通阶段不同）

探针的目的是**回答未知项**，不是交付代码，因此：

- **完成判据**：逐一给出①~⑥的是/否 + 证据（命令输出 / 报错原文 / 截图），并把结论与文档修订
  回填到本计划的「风险与未知项」表
- **运行方式**：在**独立 git worktree** 上做，`master` 与 CRA 全程保持绿灯，生产不切；
  探针代码**不合并**，跑完可整支丢弃
- **命令是否全绿不作要求**：若探针暴露的问题需要先改方案，命令红是预期结果
- **人工判据**：地图真正渲染需要真机浏览器 + 真实 API key（key 在 `.env.local`，不入库），
  机器只能验证到「构建成功、模块加载不崩、产物/env 正确」

### 待回答的未知项

| # | 待回答的问题 | 判定方式 | 候选缓解 |
| --- | --- | --- | --- |
| ① | `react-amap@1.2.8`（CJS）在 Vite 预打包 + build 下能否正常 import 并渲染 AMap | `vite dev` 与 `vite build && vite preview` 各起一次，浏览器看 AMap 是否渲染、console 是否报错 | `optimizeDeps.include: ['react-amap']`；必要时 `build.commonjsOptions` |
| ② | `envPrefix: 'REACT_APP_'` 是否同时（a）替换 `index.html` 的 `%REACT_APP_BAIDU_MAP_AK%`（b）暴露 `import.meta.env.REACT_APP_AMAP_API_KEY` | 构建后 `grep` 产物，确认 key 已替换而非残留 `%…%` / `undefined` | A：`envPrefix`；B：`define` 注入 `process.env.*`（源码零改动）；C：自定义 HTML transform 插件 |
| ③ | `%PUBLIC_URL%` → `base` / `import.meta.env.BASE_URL` 后 favicon / manifest / logo 路径正确 | `vite preview` 打开页面看资源是否 404 | 现部署在根路径，`base: '/'` 应足够；用 `BASE_URL` 拼 `public/` 资源 |
| ④ | Vitest（jsdom + `@testing-library/jest-dom`）能否跑通现有 4 suites | `CI=true npm test`（Vitest） | `test.environment: 'jsdom'` + `test.setupFiles` 指向 `setupTests.ts` |
| ⑤ | 类型 / lint 判据在 Vite 下如何等价维持 | 跑 `npx tsc --noEmit`；新增 ESLint flat config 并跑 `eslint src` | CI 增加两个独立步骤；lint 规则集合尽量对齐 `eslint-config-react-app` |
| ⑥ | esbuild 默认 target / browserslist 兼容目标是否需要 `@vitejs/plugin-legacy` | 构建后检查产物语法目标；评估目标浏览器 | 先保持默认，实测后再决定是否引入 legacy 插件 |

### 阶段 0 实测结论（2026-10-10）

**环境**：Node `20.20.2`（本机；仓库目标 Node 24）、Vite `8.3.4`（rolldown 内核）、
`@vitejs/plugin-react@6.1.2`、Vitest `4.1.11`、jsdom `29.1.1`。
探针在独立 worktree `../photo-map-vite-spike` 上执行，未进入 `master`；探针跑完后该 worktree 已移作
迁移分支 `../photo-map-vite-migration`（分支 `feat/cra-to-vite`），`node_modules` 与探针配置沿用。

| # | 未知项 | 结论 | 证据 |
| --- | --- | --- | --- |
| ① | `react-amap`（CJS）在 Vite 下加载 | ✅ 可加载，**真机渲染确认通过** | `vite build` 转换 2983 个模块成功；`vitest` 中 `import { Map } from 'react-amap'` 得到 `function`；`vite dev` 真机确认 AMap 正常渲染、无 console error |
| ② | `envPrefix:'REACT_APP_'` 的注入 / 替换 | ✅ HTML 与 JS 两侧都生效 | 产物 `index.html` 无 `%REACT_APP_%` 残留且 `ak=SPIKE_BAIDU_KEY`；AMap key 被替换进 JS 产物 |
| ③ | `%PUBLIC_URL%` → 根路径 | ✅ 路径正确 | `dist/index.html` 的资源均为 `/...` 绝对路径；`vite preview` 实测 `/`、`/favicon.ico`、`/manifest.json`、`/logo192.png`、`/assets/` 全部 **200** |
| ④ | Vitest 跑通现有测试 | ✅ 4 suites / 6 tests | `CI=true npm test`；仅加 `environment:'jsdom'` + `setupFiles`，**测试代码零改动** |
| ⑤ | 类型检查等价 | ✅ `tsc --noEmit` PASS（ESLint 未测） | `import.meta.env` 经 `src/vite-env.d.ts`（`vite/client`）通过 strict 检查 |
| ⑥ | 产物语法目标 | ⚠️ 转为现代浏览器，**待决策** | 产物含 680 处 `=>`、276 处 `?.`、240 处 `const/let`；`browserslist` 字段**不被 Vite 使用**，回 es5 需 `@vitejs/plugin-legacy` |

**静态分析（迁移前，仍有效）**：

| 结论 | 证据 |
| --- | --- |
| 迁移前基线全绿 | `npx tsc --noEmit` exit 0；`CI=true npm run build` 成功；`CI=true npm test` 4 suites / 6 tests 通过 |
| **① 风险面收窄**：运行时仅 `react-amap` 一个老库 | `react-amap@1.2.8`：`main: lib/index.js`（Babel CJS 产物），无 `module` 字段、无 `process.env`、无 Node 内置引用 → 预打包风险低 |
| **`mapvgl` 风险清零** | `react-bmapgl` 无运行时 import，仅 `src/globals.d.ts` triple-slash 引用其类型；其依赖 `mapvgl@1.0.0-beta.191`（621 KB 压缩 UMD、154 处 `window`、含 WASM）**不在构建图内** |
| `google-map-react` 移出风险评估 | `grep -rn google-map-react src/` 无运行时 import（历史遗留依赖） |
| `react-amap` 的 `window.AMap` 是运行时全局 | `MapSelector.tsx:36`、`Map/index.tsx:196` 读 `window.AMap`；由 AMap JS API 脚本注入，与 npm 包无关 |

**新发现（回填 ADR / CI 的注意点）**

1. **CRA 与 `@vitejs/plugin-react` 无法在同一 `package.json` 干净共存**：CRA 锁 `@babel/core@7.24.9`，
   而 plugin-react 的 Babel 桥要求 `≥7.29 / 8.0.0-rc` → `npm install` 报 `ERESOLVE`。
   这佐证「步 1 必须**原子翻转**、不能构建器并存」；过渡期可用 `--legacy-peer-deps` 绕过（探针即如此安装）。
2. **Vite 只处理根 `index.html`**：`public/` 下其它 html 原样拷贝，`%PUBLIC_URL%` 不替换 ——
   但**与 CRA 行为一致**（对比 CRA `build/homepage.html` 同样残留 2 处），非回归；`homepage.html` 当前无引用。
   阶段 1 已顺手把该文件的 2 处 `%PUBLIC_URL%/...` 改为根路径 `/...`（路径本已失效），使验收 grep 干净。
3. `vite.config.ts` 用 ESM 语法但 `package.json` 无 `"type":"module"`，Vite 8 报 config loader 警告
   → 收尾时加 `"type":"module"` 或改用 `.mts`。
4. 产物 `process.env` 引用 0 处；3 处 `require(` 是 `react-ga` 的字符串文案，无运行时影响；
   `google-map-react`（未使用）未进入产物。
5. Node `20.20.2` 可跑 Vite 8（无 `EBADENGINE`）；CI 目标 Node 24 亦满足。
6. `REACT_APP_GOOGLE_MAPS_API_KEY` **全仓库无引用**（`grep` 遍 `src`/`public` 无命中），
   真实 key 重建后也不进入产物 —— 属遗留变量，迁移时可评估一并移除。
7. 真实 key 注入已复验：用 `origin/gh-pages` 发布产物还原的真值重建，百度 ak 与高德 key 均正确进入产物
   （Google key 因未被引用而不出现）。
8. **`@types/node` 必须从 `16` 升到 `≥20.19`**：Vite 8 声明 `peerOptional @types/node@^20.19.0 || >=22.12.0`，
   与项目现有 `@types/node@^16.18.102` 冲突（`ERESOLVE`）。**阶段 0 的 `--legacy-peer-deps` 掩盖了这条**，
   是「探针用 legacy 安装」的副作用 —— 阶段 1 必须做一次**干净的** `npm install` 才能暴露同类问题。
   `src/` 不使用任何 Node API（`grep` 无命中），故升至 `^22.14.0`（满足 Vite 8 peer）。
   这是迁移期间**唯一被迫的依赖改动**，不影响「不动 React/antd/TS」的冻结约定。

**阶段 0 全部达成**：① 真机渲染人工确认通过；⑤ 定用 **flat config + `typescript-eslint`**（具体配置在阶段 1 落地）；
⑥ 定为**现代浏览器-only**（不引入 `@vitejs/plugin-legacy`）。

### 阶段 0 执行清单

- [x] 建独立 worktree；装 `vite @vitejs/plugin-react vitest jsdom`（`--legacy-peer-deps`）
- [x] 写最小 `vite.config.ts`（`envPrefix: 'REACT_APP_'`、`base: '/'`）与 `src/vite-env.d.ts`
- [x] ② 构建后 `grep` 产物确认 `REACT_APP_*` 被替换（机器）
- [x] ③ `dist/index.html` 资源路径均为 `/...`（机器）
- [x] ④ Vitest 跑通 4 suites / 6 tests（机器）
- [x] ⑤ `tsc --noEmit` 跑通（机器）；ESLint flat config 待阶段 2
- [x] ⑥ 产物语法目标已确认（现代浏览器），legacy 决策待定
- [x] ① 构建 + 运行时 import 验证 `react-amap`（机器）
- [x] ① 真机浏览器确认 AMap 渲染、无 console error（人工；真 key 从 `origin/gh-pages` 产物还原）
- [x] ③ `vite preview` 真机确认 favicon / manifest / logo 不 404（人工 + `vite preview` 机器实测全 200）
- [x] 把①~⑥结论回填本计划与 ADR

## 风险与未知项

| # | 风险 / 未知项 | 影响 | 验证方式 | 缓解 |
| --- | --- | --- | --- | --- |
| ① | ✅ 已解决：`react-amap`（CJS）在 Vite 下构建 + 运行时 import 正常（真机渲染待人工） | — | 阶段 0 探针 | 无需 `optimizeDeps` 兜底；真机若异常再回退 Rsbuild |
| ② | ✅ 已解决：`envPrefix:'REACT_APP_'` 同时替换 HTML `%…%` 与暴露 `import.meta.env` | — | 阶段 0 探针 | 保持源码用 `import.meta.env` |
| ③ | ✅ 已解决：根路径资源正确（`base: '/'`） | — | 阶段 0 构建产物 | — |
| ④ | ✅ 已解决：Vitest 跑通 4 suites，测试代码零改动 | — | 阶段 0 探针 | `environment:'jsdom'` + `setupFiles` |
| ⑤ | ✅ 已决策：`tsc` 等价；`build` 不再内嵌 lint/类型检查 → 用 flat config + `typescript-eslint` 补回 | 类型/lint 错误可能溜进产物 | 阶段 0 | 阶段 1 落地 flat config；CI 显式加 `tsc --noEmit` + `eslint` 步骤 |
| ⑥ | ✅ 已决策：**接受**产物目标为现代浏览器（不引入 `@vitejs/plugin-legacy`） | 旧浏览器（IE / 旧 Android WebView）白屏 | 阶段 0 已确认现象 | 明确放弃旧浏览器支持；日后需要再加 legacy 插件 |
| ⑦ | 迁移与依赖升级耦合，报错无法归因 | 迁移停滞 | 全程 | 非目标已冻结：不动 React/antd/TS |
| ⑧ | Vite 大版本后续漂移 | 升级风险 | 长期 | `.github/dependabot.yml` 盯升级，版本号只写 `^N` |
| ⑨ | `@types/node@16` 与 Vite 8 的 peer 冲突（阶段 0 被 `--legacy-peer-deps` 掩盖） | 干净 `npm ci` 会 `ERESOLVE`，CI 直接红 | 阶段 1 已修 | `@types/node` 升至 `^22.14.0`；`src/` 无 Node API 依赖 |

## 回滚策略

- 迁移全程在**分支/worktree**上，`master` 与 CRA 一直能构建能部署；**生产只有最后一个 PR 才切换**
- 阶段 0 探针允许整支分支丢弃，但**实测结论必须先回填本文档与 ADR**
- 若切换后发现问题：`git revert` 该合并 PR 即回到 CRA 状态（文档不删，改状态）
- 最坏退路：回到 ADR 0002 选择 Rsbuild（保留 Webpack 语义），而非「无构建器可用」

## 开放问题（评审时定）

1. ~~**ESLint 方案**~~ → **已定（2026-10-10）**：采用 **flat config + `typescript-eslint` + `eslint-plugin-react-hooks`**，
   不沿用 `eslint-config-react-app`，避免把 CRA 的隐式依赖带进新栈；规则集在阶段 1 落地时按需逼近现状。
2. ~~**兼容目标**~~ → **已定（2026-10-10）**：**现代浏览器-only**，不引入 `@vitejs/plugin-legacy`（换取更小产物）。
3. **`google-map-react` 等未使用依赖**：迁移后是否一并清理？倾向：**单独 PR**，不混入构建迁移。
4. **`index.html` 位置**：Vite 约定 `index.html` 在项目根（而非 `public/`）。`public/homepage.html` 的去留需确认（当前是否被使用）。
5. **CI 编排**：`build-deploy.yml` 是继续用 `npm run build` + 独立 lint/tsc 步骤，还是把 lint/tsc 收进一个 npm script（如 `npm run verify`）。

## 逐阶段 checklist

> 每项对应一个阶段；勾选前三条验收命令必须全绿。

- [x] 阶段 0 探针：①~⑥ 结论已回填本文档；ADR 0002 转 `accepted`
- [x] 阶段 1（原子，一个 PR）：`vite.config.ts` 就位；`index.html` 搬到根；移除 `react-scripts`；Jest → Vitest（4 suites 全绿）；ESLint flat config 就位；CI 增加 `tsc --noEmit` + lint 且产物目录改 `dist`；`AGENTS.md`/`DEVELOP.md`/`docs/ci.md` 同步；三命令 + 两条 grep 判据全绿 —— **本地已全部验证通过**（`tsc` 0、`eslint` 0 error / 8 warn、Vitest 4 suites / 6 tests、`vite build` ✓；`@types/node` 升至 `^22.14.0`），待提交 PR 并由 CI 复验
- [ ] 阶段 1 合并后在 `master` 复验：CI（`build-deploy.yml`）成功部署到 `gh-pages`；ADR 0002 `accepted` → `implemented`
- [ ] 阶段 2（收尾，独立 PR）：评估移除 `google-map-react` 等未使用依赖、`public/homepage.html` 去留

## 完成定义（Definition of Done）

- [ ] `package.json` 无 `react-scripts`，scripts 全部指向 Vite/Vitest
- [ ] `public/` 下无 `%PUBLIC_URL%` / `%REACT_APP_` 残留，`index.html` 位于项目根
- [ ] 三条验收命令全绿；CI 含显式的类型检查与 lint 步骤
- [ ] CI 成功部署到 `gh-pages`
- [ ] **`AGENTS.md` 同步**：技术栈、常用命令、硬约束更新为 Vite/Vitest（它是项目指令的唯一事实源）
- [ ] 本计划长期有效的约定（如 CI 必须显式跑 lint/tsc）上提 `AGENTS.md` 或 `docs/`
- [ ] ADR 0002 状态由 `accepted` → `implemented`（`accepted` 已于 2026-10-10 阶段 0 全绿后完成）
