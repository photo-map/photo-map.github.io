# 移除 Google Maps 与 Baidu Maps 计划

关联决策：[ADR 0003](../adr/0003-remove-google-and-baidu-maps.md)（编号一致：`plans/0003` 执行的是 `adr/0003`）。
本文档是决策的**执行落地**（分期、验收、checklist），可随实践自由修订；决策本身变化时改 ADR。

## 验收标准（机器判定）

```sh
npm ci && npm run typecheck && npm run lint && npm run build && npm test

# A. 业务代码 / 入口 / 依赖清单不再出现两个地图的符号
grep -rnE "BAIDU_MAP|GOOGLE_MAP|BMapGL|react-bmapgl|google-map-react" src index.html package.json
grep -rnE "Baidu|baidu" src index.html
# B. 生效中的 CI / 文档配置不再引用两个地图的 key
grep -rnE "REACT_APP_BAIDU_MAP_AK|REACT_APP_GOOGLE_MAPS_API_KEY" .github AGENTS.md README.md DEVELOP.md
```

- 命令全绿、两组 grep 无输出才算完成；每个阶段一个 PR，**PR 内不做与该阶段无关的改动**
- 预期的「非命中」例外（不算失败）：`docs/` 与 `help/` 的历史记录、README 中 Google Drive 说明、
  `react-ga`（Google Analytics）等与「地图」无关的 “google” 字样、`public/google947803d4f6f8b67f.html`
  （Search Console 站点验证文件，**保留**）
- **明确保留**：Google 登录 / Google Drive 照片加载（`gapi`、`platform.js`、`GoogleLogin`、
  `gDriveFilesApi`）、Google Analytics（`react-ga`）

---

## 阶段 1：业务代码摘除（单 PR，风险最高）

目标：`src/` 与 `index.html` 中不再有 Google / Baidu 地图的任何分支或符号，高德成为唯一地图。

### 1.1 地图主组件 `src/Application/Map/index.tsx`

- 删除占位组件 `const GoogleMap = …` / `const BaiduMap = …`（当前 `GoogleMap`/`BaiduMap` 都是 `<div>` 占位）
- 删除 `googleMapCenter`、`baiduMapCenter`（只服务被删分支）
- `state`：删除 `gpsBMapPointsMapping`、`selectedMap`
- 删除切换地图相关：`switchMapToken`、`switchMapSubscriber`、`setMap`、`handleMapChange`、
  导出常量 `SWITCH_MAP_TOPIC`、以及对 `A_MAP` / `GOOGLE_MAP` 的引用
- `handleLoginSuccess`：
  - 删除 `if (window.BMapGL) { … getGpsBMapPointsMapping(…) }` 整块
  - 把 `if (this.state.selectedMap === 'amap') { await addMarkersToAMap(…) }` 改为**无条件** `await addMarkersToAMap(privatePhotos)`
- 渲染：删除死代码 `renderMap()`（本就未被调用），把 `renderMap2()` 里 Google/Baidu 两个 `<div>` 与
  show/hide 包装去掉，直接渲染单一 `<AMap …/>`；`render()` 不再向 `MenuDrawer` 传 `selectedMap` / `onMapChange`
- `MapState`：删除 `gpsBMapPointsMapping`、`selectedMap`；保留 `folders`、`amapLoaded`、`message`
- 其余（`Message`、`Menu` 按钮、PubSub `FIT_MARKERS_TOPIC` 发布等）不变

### 1.2 地图辅助与选择器

- `src/Application/Map/helpers.ts`：删除 `getGpsBMapPointsMapping`（唯一的百度消费者）及其
  `foldersToBMapPoints` / `convert` / `chunk` / `GpsBMapPointsMapping` 导入
- 删除 `src/Application/Map/MapSelector.tsx`（整文件）
- 删除 `src/Application/Map/BaiduMap/` 整子树：`helpers.ts`、`types.ts`、`helpers.test.ts`
- `src/Application/Map/constants.ts`：
  - 删除 `localStorageKeySelectedMap`（选择器已删，配置导出/导入同步去键）
  - `FIT_MARKERS_TOPIC` 的值 `"googlemap.fitmarkers"` → `"amap.fitmarkers"`（纯改名，无行为变化）

### 1.3 常量、菜单、快捷键、全局类型

- `src/Application/constants.ts`：删除 `GOOGLE_MAP`、`BAIDU_MAP`、`A_MAP`、`DEFAULT_SELECTED_MAP`，
  仅保留 `PRIVATE_FOLDER_ID`
- `src/Application/MenuDrawer/index.tsx`：移除 `MapSelector` 的 import 与渲染；从 props 删除
  `selectedMap` / `onMapChange`
- `src/Application/MenuDrawer/helpers.ts`：`exportConfig` / `importConfig` 去掉
  `localStorageKeySelectedMap` 键（**旧配置文件仍可导入**，多余键被忽略）
- `src/Application/MenuDrawer/helpers.test.ts`：同步更新导出内容与断言
- `src/Application/init.ts`：删除 `SWITCH_MAP_TOPIC` 导入与 `KeyS`（切换地图）分支，保留 `KeyM`（开合菜单）
- `src/globals.d.ts`：删除 `react-bmapgl` 的 triple-slash reference 与 `Window.BMapGL` 成员；
  保留 `AMap` / `google` / `gapi` / `gapiLoadedFlag` / `PM_trainsMap`
- 删除 `src/Application/utils/utils.ts` 与 `utils.test.ts`：其中唯一导出 `chunk` 只被
  `getGpsBMapPointsMapping` 使用，删除后成孤儿（`utils/` 目录下 `gapiRequest.ts`、`gDriveFilesApi.ts` 保留）

### 1.4 入口 `index.html`

- 删除 Baidu Map API 的 `<script src="//api.map.baidu.com/api…">` 整块
- `meta description` 的 “Google Maps or AMap” → 仅保留高德措辞
- **保留** Google `platform.js` 脚本（登录 / Drive 依赖）

### 1.5 顺手修正的注释（可选）

- `src/Application/Map/AMap/index.tsx` 中「与 BaiduMap/helpers 的决策一致」的注释改为不再引用已删文件

---

## 阶段 2：依赖与 CI 环境变量（单 PR 或并入阶段 1）

- `package.json` 删除依赖：`react-bmapgl`、`google-map-react`、`@types/google-map-react`
- 执行 `npm install` 同步 `package-lock.json`，再以 `npm ci` 验证 lockfile 一致
- `.github/workflows/build-deploy.yml` 顶层 `env:` 删除：
  `REACT_APP_GOOGLE_MAPS_API_KEY`、`REACT_APP_BAIDU_MAP_AK`（保留 `REACT_APP_AMAP_API_KEY`）
- 依赖移除判据：

  ```sh
  npm ls react-bmapgl google-map-react @types/google-map-react   # 均应为 empty
  grep -rn "react-bmapgl\|google-map-react" package.json package-lock.json  # 无输出
  ```

---

## 阶段 3：文档与资产收尾（单 PR）

- 删除 `GOOGLE_MAP_ISSUE.md`（Google Maps 白图问题说明，已无对象）
- 删除 `demo-google-map.jpg`（README 快照，根目录）
- 删除 `public/Jietu20210816-230746.jpg`（仅被 `GOOGLE_MAP_ISSUE.md` 引用）
- `AGENTS.md`：项目概览「Google Maps / 高德 / 百度」→ 高德；环境变量表删除 Google Maps、百度两行
- `README.md`：Summary 改为仅高德；删除 “Photos on the Google Maps” 快照与 `demo-google-map.jpg` 引用；
  Develop 的 `.env.local` 示例删除两个 key
- `DEVELOP.md`：删除 `react-google-maps` / `recompose` 初始化行；删除 “Baidu Map” 一节；
  删除 z-index 的 `#mask (baidu map)` 行；删除 Vitest 的 “Should not test react-bmapgl” 注记；
  “Add env” 示例删除百度 script；API documents 删除百度条目
- `TODO.md`：两条历史完成项（`Google Maps` / `Google Map`）措辞更新为高德（纯文字，可选）
- `docs/adr/README.md`：现有 ADR 表新增 0003 行
- `docs/plans/0002-cra-to-vite.md`：在阶段 2 的「评估移除 `google-map-react`」处加一行注记，
  指向本计划承接该清理（可选）

### 收尾（代码外，手工）

- GitHub 仓库 Settings → Secrets：删除 `REACT_APP_GOOGLE_MAPS_API_KEY`、`REACT_APP_BAIDU_MAP_AK`
  （代码删除 env 注入后，残留 secret 无害，但按卫生清理）
- 本机 `.env.local`：删除同两个变量（已被 `.gitignore` 忽略）

---

## 完成定义

- [x] 阶段 1：`src` / `index.html` 无两个地图符号；四命令全绿；grep A 无输出
  （额外清理：`src/Application/index.css` 与 `components/Message/index.css` 中提及 baidu z-index 的注释，
  以及已无引用的 `.map-wrapper .hide` 规则）
- [x] 阶段 2：三个依赖移除且 `npm ci` 通过；workflow env 仅剩高德；grep B 无输出
- [x] 阶段 3：文档/资产同步；`GOOGLE_MAP_ISSUE.md` 与两张 Google 图删除；ADR 索引更新
- [ ] 收尾：GitHub Secrets 手工清理（本机无 `.env.local`，无需处理）
- [x] 本地实现与验证完成（2026-10-11）：`npm ci && npm run typecheck && npm run lint && npm run build && npm test` 全绿；
  ADR 0003 → `implemented`（提交 `8f85956`）

## 风险与回退

- **风险**：`selectedMap` 从配置导出/导入移除，改变导出 JSON 格式。回退：`importConfig` 对缺失键
  本就按 `undefined` 写入，不崩溃；如需兼容保留键，可在阶段 1 单独保留该行。
- **风险**：误删 Google Drive / 登录相关代码。缓解：判据只针对地图符号，`GoogleLogin`、`gapi`、
  `gDriveFilesApi`、`platform.js`、`react-ga` 均在保留清单内，PR 评审时逐个确认。
- **回退**：本次为纯删除，`git revert` 对应提交即可恢复；无数据迁移、无运行时状态变更。
