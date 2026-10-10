# TypeScript 迁移计划

关联决策：[ADR 0001](../adr/0001-typescript-migration.md)（编号一致：`plans/0001` 执行的是 `adr/0001`）。
本文档是决策的**执行落地**（分期、验收、checklist、完成定义），可随实践自由修订；
决策本身变化时改 ADR，并在此更新链接与日期。迁移完成后本文档可归档（见「完成定义」）。

## 验收标准（机器判定）

```sh
npx tsc --noEmit        # 类型检查（tsc 与 CRA 用同一份 tsconfig、同一个 TS 版本）
CI=true npm run build   # 生产构建
CI=true npm test        # 测试
```

- 三条全绿才算一步完成；每个阶段一个（或多个）PR，**PR 内不做与该阶段无关的改动**
- `npm run build` **已内嵌 ESLint 且 `failOnError: true`**（`webpack.config.js:769`），
  所以 lint 错误会直接让 build 变红，无需单独跑 lint —— 但意味着
  `@typescript-eslint` 对 TS 文件启用的规则（如 `no-unused-vars`）可能在迁移时爆出一批
  **与类型无关**的报错，属预期内的一次性成本
- 阶段 0 探针是唯一例外，判据见下

阶段 5 追加判据：

```sh
grep -r "prop-types" src/          # 无输出
grep -c "allowJs" tsconfig.json    # 无 allowJs 行
```

## 迁移分期

**排序原则**：先被依赖者（叶子）→ 后依赖者（根）。判定以文件**实际 import** 为准：
`helper` 若 import 了组件，就不算叶子，归入该组件所在的阶段（本篇据此把
`Map/helpers.js` 归入阶段 4、`MenuDrawer/helpers.js` 归入阶段 3）。
地图子系统内部按「小 → 大」推进，`Map/index.jsx`（368 行，全仓库最复杂）永远最后。

| 阶段 | 范围 | 关键动作 | 性质 |
| --- | --- | --- | --- |
| **0. 探针** | `Map/BaiduMap/` 子树 + 新增 `src/globals.d.ts` + 新增 `src/Application/types.ts` | 实测未知项①②③（**已回填结论**）；`helpers.js` 已迁为 `helpers.ts`；组件待「开放问题」4 定夺 | 允许失败/丢弃，**判据见下节** |
| **1. 类型基建** | 装 `@types/google-map-react`、`@types/pubsub-js`、`@types/debug`、`@types/lodash.get` | `npm install` 同步 lockfile，随后验证 `npm ci` 通过 | 小 PR |
| **2. 纯函数层（真叶子）** | `utils/`、`Application/constants.js`、`config.js`、`Map/constants.js`、`Map/GoogleMap/constants.js`、`Map/AMap/constants.js`、`helpers/filesListHelpers.js`、`Map/GoogleMap/helpers.js`、`Map/AMap/helpers.js` | 无 import 组件；含 `utils.test.js` 改名 | 无 UI，最好测 |
| **3. 无状态组件 + MenuDrawer** | `components/`（HelpTip、Message、GoogleLogin×2）、`MenuDrawer/`（index、Title、ConfigSection、FolderList、helpers） | `propTypes` → `interface`；含 `MenuDrawer/helpers.test.js` 改名 | 依赖阶段 2 的类型 |
| **4. 地图子系统** | `Map/GoogleMap/` → `Map/AMap/index.jsx` → `Map/markers.jsx` → `Map/MapSelector.jsx` → `Map/helpers.js` → `Map/index.jsx`（最后） | 全局 `window.*` 声明在此补齐；`Map/index.jsx` 单独一个 PR | 最难，拆多个 PR |
| **5. 收尾** | `Application/index.jsx`、`Application/init.js`、**处理 `BaiduMap/index.jsx` + `Map/typedef.js`（阶段 0 遗留，开放问题 4）**、删除 `prop-types` 依赖、移除 `allowJs`、更新 `AGENTS.md` | `grep -r "prop-types" src/` 必须为空；`src/` 下无 `.js`/`.jsx` 业务文件 | 迁移完成判据 |

阶段 0 完成后，**若发现渐进路线不可行**（例如 CRA type-check 行为与假设不符），
应先回到 ADR 修订决策，再继续 —— 这是探针存在的意义。

### 迁移期间的类型衔接约定（JS/TS 边界）

迁移期 JS 与 TS 并存，规则如下，避免同物异名扩散：

1. **新领域类型只写在 `src/Application/types.ts`**，JS 文件通过 JSDoc 引用：
   `@returns {Promise<import("../types").DriveFile[]>}` —— 不得再新增 `@typedef`
2. JS 文件里**已有的** JSDoc `@typedef`（如 `gDriveFilesApi.js` 的 `File`、
   `Map/helpers.js` 的 `PhotoFolder`）保留到该文件迁移时删除，删除后统一指向 `types.ts`
3. 边界处的 JS 文件迁到 TS 时，其 JSDoc 引用同步换成 `import type ... from "../types"`

## 阶段 0：探针的产出判据（与普通阶段不同）

探针的目的是**回答未知项**，不是交付代码，因此：

- **完成判据**：逐一给出①②③的是/否 + 证据（命令输出 / 报错原文），并把结论与文档修订
  回填到本计划的「风险与未知项」表
- **代码去向**：合入或丢弃均可。若未知项结论推翻了渐进路线，整支分支可丢弃，但**结论必须回填**
- **命令是否全绿不作要求**：若探针暴露的问题需要先改方案，命令红是预期结果

| # | 待回答的未知项 | 判定方式 |
| --- | --- | --- |
| ① | `BMapGL` 全局命名空间能否取到 | `globals.d.ts` 加 `/// <reference path="../node_modules/react-bmapgl/types/bmapgl/index.d.ts" />` 后跑 `tsc` |
| ② | `window.*` 声明需要多少 | 初版 `interface Window` 后跑 `tsc`，看还缺哪些 |
| ③ | CRA 构建期 type-check 是否真的阻断 build | 刻意留一个类型错误，跑 `npm run build` 观察 |

### 阶段 0 实测结论（2026-10-09）

| # | 未知项 | 结论 | 证据 |
| --- | --- | --- | --- |
| ① | `BMapGL` 命名空间 | ✅ 可用 | `src/globals.d.ts` 的 triple-slash reference 生效，`BMapGL.Map/Point/Icon/Size/Convertor` 均可解析，`tsc` exit 0 |
| ② | `window.*` 声明 | ✅ 一版够用 | `interface Window` + `BMapGL: typeof BMapGL` 即可，`window.BMapGL.Convertor` 等通过检查 |
| ③ | CRA 是否阻断类型错误 | ✅ 是，硬失败 | 注入 `TS2322` 后 `npm run build` **exit=1**，输出 `Failed to compile` + `TS2322`，与 ESLint 无关 |

**额外发现（比预想更关键）**

1. `react-bmapgl@0.2.27` 的类型是 React 16 时代的产物，在 React 18 + `strict` 下**不能直接使用**：
   - `<Map>` 的 `MapProps` 不含 `children` → JSX 子节点报 `TS2322`
   - `<Marker>` / `<NavigationControl>` 的 `MapChildrenProps.map: BMapGL.Map` 声明为**必填**（设计上应由父级 context 注入）
2. `import ZoomControl from "react-bmapgl/Control/ZoomControl"` 是**坏 import**：实测 webpack 与 Node 均无法解析
   （该包只发布了 `dist/Control/`，没有根级 `Control/`）
3. 上述坏 import 没让 CI 变红，因为 **`BaiduMap/index.jsx` 是死代码**：`Map/index.jsx:22` 的真组件 import 被注释，
   `Map/index.jsx:34` 用占位组件 `const BaiduMap = () => <div>BaiduMap</div>` 顶替

**阶段 0 实际交付（可合入）**

- 新增 `src/globals.d.ts`、`src/Application/types.ts`、`src/Application/Map/BaiduMap/types.ts`
- `Map/BaiduMap/helpers.js → helpers.ts`、`helpers.test.js → helpers.test.ts`
  （jest 走 Babel preset-typescript，`.ts` 测试直接可跑，无需配置）
- 三命令全绿：`tsc --noEmit` exit 0 / `npm test` 4 suites 6 tests 通过 / `npm run build` 成功
- 未动：`BaiduMap/index.jsx`、`Map/typedef.js`（后者的唯一消费者是上述死代码，去留见「开放问题」4）

**行为差异（已定，2026-10-10）**：`helpers.ts` 的 `foldersToBMapPoints` 现在会**跳过**没有 GPS 的照片，
而原 JS 代码会抛 `Cannot read properties of undefined`。决定：**保持跳过** —— 无 GPS 的照片在任何地图上
都无法落图（Google/AMap 路径同样无条件访问 `location`），原行为是让整个地图加载崩溃；可选地加
`console.warn` 仅对开发者可见；「在应用内提示用户有 N 张照片无 GPS」是超范围的小需求，
已记入根目录 `TODO.md`，不在本次迁移内做。

## 风险与未知项

> ①②③ 已在阶段 0 实测完成（结论见上节 ✅），下表保留原始假设以便对照。

| # | 风险 / 未知项 | 影响 | 验证方式 | 缓解 |
| --- | --- | --- | --- | --- |
| ① | ✅ 已解决：`BMapGL` 命名空间可取得 | — | 阶段 0 | 采用 `src/globals.d.ts` 的 triple-slash reference |
| ② | ✅ 已解决：`window.*` 声明一版够用 | — | 阶段 0 | `src/globals.d.ts` |
| ③ | ✅ 已确认：CRA 构建对类型错误硬失败 | 验收必须以 `tsc --noEmit` 为准 | 阶段 0 | 三命令验收成立 |
| ④ | `react-amap@1.2.8` 自带类型质量未知 | 阶段 4 可能要写 shim | 届时读 `types/index.d.ts` | 本地 `declare module 'react-amap'` 兜底 |
| ⑤ | 第三方类型与运行时数据不符（如 `BMapGL.Point` 要求 `equals` 方法，API 返回的却是纯对象） | 需要 `as` 断言，断言位置不当会掩盖真错 | 阶段 0 已用上 | 断言集中在数据边界（`foldersToBMapPoints`），不扩散到组件内部 |
| ⑥ | 存量 bug 被类型检查暴露 | 可能被「不修 bug」目标卡住 | 阶段 0 已发现 2 处（ref 笔误、坏 import） | 处置原则见「开放问题」1、4，豁免设上限 |
| ⑦ | `@typescript-eslint` 规则对迁移文件报错（与类型无关） | build 变红，属一次性成本 | 阶段 0 未出现 | 按规则逐个处理；确属误报才加 `eslint-disable` 并注明理由 |
| ⑧ | **`react-bmapgl` 类型在 React 18 + strict 下不可用**（缺 `children`、子组件 `map` 必填） | 任何使用该库的组件都需 shim | 阶段 0 实测 | 见「开放问题」4；若确需该库，写本地 `declare module` 放宽，勿逐处 `@ts-expect-error` |
| ⑨ | 死代码/坏 import 藏在未进入构建图的文件里 | CI 绿灯 ≠ 文件可编译；迁移时集中爆雷 | 阶段 0 发现 `BaiduMap/index.jsx` | 各阶段迁移前先确认该文件是否被 import（`grep` 引用方），死代码不进迁移范围 |

## 回滚策略

- 每个阶段独立 PR，单步出问题直接 `git revert`，不需要回滚整个迁移
- 阶段 0 是探针：允许整支分支丢弃，但**实测结论必须先回填本文档**
- `allowJs` 在阶段 5 之前始终为 `true` → 任何时刻 `.js` 文件都可继续开发，迁移不阻塞业务

## 开放问题（评审时定）

1. **存量 bug 的处置**：`Map/BaiduMap/index.jsx:81` 的 ref 写的是
   `this.handleMapComponentMounted`，而类里定义的方法叫 `handleMapComponentMountOrUmount`
   —— 引用了不存在的方法，ref 回调是 `undefined`（JS 不查，迁 tsx 必报错）。
   - **豁免上限**：仅「引用了不存在的符号、导致 `tsc` 无法通过」算阻塞迁移；其他 bug 一律不修，
     记入 `docs/` 或 Issue 另行处理，避免范围蔓延
   - **默认处置**：就地按笔误修正（改动 1 行），与迁移同一个 PR
   - **可选**：若要求「历史最干净」，单独开 bugfix PR 先修再迁移，**仅限本例外**
2. **`any` 的容忍度**：第三方全局（`window.AMap` / `window.gapi`）先 `any` 占位，
   迁移完成后再单独开「收紧全局类型」的后续任务，避免阶段 0 就陷进去
3. **checklist 落点**：逐阶段 checklist 挂在本计划末尾（随仓库版本化），
   GitHub Issue 仅用于跟踪进度
4. **`BaiduMap/index.jsx` 的去留**（阶段 0 新发现）—— **结论：(c) 暂不管，保持 `.jsx`，钉进阶段 5 必办项**
   - 依据：它是死代码（`Map/index.jsx:22` 的真组件 import 被注释，`:34` 用占位组件顶替），
     **不影响运行时、构建与 CI**（探针实测：CI 全绿、单独 ESLint `exit=0`）
   - 代价：它挡住了迁移终点 —— 关 `allowJs` 前必须删除或迁移；且它是陷阱，
     谁去「重新启用百度地图」（取消那行注释）会立刻撞上坏 import（构建失败）+ ref 笔误（运行时崩溃）
   - 处理要求：阶段 5 之前二选一 —— 删除（推荐，`git revert` 可一键找回）或迁移
     （需改 import 为 `react-bmapgl/dist/Control/ZoomControl`，并为 `react-bmapgl` 在 React 18 + strict
     下不可用的类型写 shim）
   - `Map/typedef.js` 随之保留（唯一消费者就是这个组件），同样在阶段 5 一起处理
   - 开放问题 **1（ref 笔误）随之延期**：它就位于该组件内，处理 (c) 时一并解决

## 逐阶段 checklist

> 每项对应一个阶段；勾选前三条验收命令必须全绿。

- [ ] 阶段 0 探针：①②③ 结论已回填本计划 ✅；`src/Application/types.ts`、`src/globals.d.ts`、`BaiduMap/types.ts` 建立 ✅；`BaiduMap/helpers.ts` + `helpers.test.ts` 迁移完成 ✅；`BaiduMap/index.jsx` 与 `Map/typedef.js` **按开放问题 4 暂缓，已转入阶段 5**
- [x] 阶段 1：4 个 `@types/*` 安装并写入 lockfile（2026-10-10）；`npm ci` 通过；`tsc`/`test`/`build` 三命令全绿
- [ ] 阶段 2：真叶子文件全部迁为 `.ts`（`utils*`、4 个 `constants`、`config`、`filesListHelpers`、`GoogleMap/helpers`、`AMap/helpers`）
- [ ] 阶段 3：`components/` 与 `MenuDrawer/` 全部迁为 `.tsx`/`.ts`，`propTypes` 全部替换为 `interface`
- [ ] 阶段 4：地图子系统全部迁完；`window.*` 全局声明补齐；`Map/index.jsx` 最后单独 PR
- [ ] 阶段 5：`Application/index.jsx`、`init.js` 迁完；**处理阶段 0 遗留的 `BaiduMap/index.jsx` + `Map/typedef.js`（删或迁）**；`prop-types` 依赖移除；`allowJs` 移除；`AGENTS.md` 同步
- [ ] 收尾：三条命令 + 阶段 5 两条 grep 判据全绿；CI 成功部署

## 完成定义（Definition of Done）

- [ ] `src/` 下无 `.js`/`.jsx` 业务文件（脚手架的 `.d.ts` 除外）
- [ ] `tsconfig.json` 移除 `allowJs`
- [ ] `package.json` 移除 `prop-types`
- [ ] 三条验收命令全绿，且 CI（`build-deploy.yml`）成功部署
- [ ] **`AGENTS.md` 同步**：技术栈补充 TypeScript、常用命令补 `npx tsc --noEmit`、
      硬约束补「新增代码必须 TS/TSX」（它是项目指令的唯一事实源，不改即过期）
- [ ] 本计划中迁移后**仍然有效**的约定（如「迁移期间的类型衔接约定」的长期部分）
      上提到 `AGENTS.md` 或 `docs/` 长期文档，然后归档本计划
- [ ] ADR 状态由 `proposed` 改为 `accepted`（评审通过时）→ 迁移完成后标 `implemented`；
      探针结论与文档修订已回填
