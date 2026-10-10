# ADR 0003：移除 Google Maps 与 Baidu Maps，仅保留高德地图

- 状态：implemented（2026-10-11 落地，提交 `8f85956`；本地 `npm ci && typecheck && lint && build && test` 全绿）
- 日期：2026-10-10 起草
- 决策人：chenyang（仓库所有者）
- 关联：[实施计划](../plans/0003-remove-google-and-baidu-maps.md)（同编号）

> 本 ADR 只记录**决策**。分期、验收命令、checklist、完成定义等执行细节在关联计划里，
> 决策本身变化时才修订本文档。

## Context and Problem Statement

站点对外宣称支持三种地图（Google Maps / 高德 / 百度），但经 [ADR 0001](0001-typescript-migration.md)
阶段 5 死代码清理后，**真正渲染的只剩 `react-amap`（高德）一种**：Google Maps 与 Baidu Maps
的组件都已是占位 `<div>`（`src/Application/Map/index.tsx`），真实渲染实现当年就未启用。

两个「僵尸地图」各自的处境：

- **Google Maps**：中国大陆被列为
  [prohibited territory](https://cloud.google.com/maps-platform/terms/maps-prohibited-territories/)，
  本仓库历史上专门用 [`GOOGLE_MAP_ISSUE.md`](../../GOOGLE_MAP_ISSUE.md) 记录过白图问题；
  配置项 `REACT_APP_GOOGLE_MAPS_API_KEY` 已在全仓库无引用（ADR 0002 已实测）。
- **Baidu Maps**：`react-bmapgl` 只被 `src/globals.d.ts` 以 triple-slash 引用其**类型**，
  无运行时 import；`window.BMapGL` 靠 `index.html` 脚本注入；用户反馈已不可用。

问题：既然两者都无法使用，是否应把它们从代码中彻底删除，只保留高德？

**必须区分**：本次删除的是「地图渲染」这一功能。Google **登录 + Google Drive 照片加载**
（`gapi` / `platform.js` / `GoogleLogin` / `gDriveFilesApi`）与 Google Analytics（`react-ga`）
是站点核心能力，**保留不动**。

## Decision Drivers

**目标**

1. 删除一切已不可用的地图集成：Google Maps、Baidu Maps
2. 删除只为这两者存在的抽象与配套：地图选择器、「按 S 切换地图」、百度坐标转换、
   `BMapGL` 全局类型、`react-bmapgl` / `google-map-react` 依赖、百度脚本与 `REACT_APP_BAIDU_MAP_AK`
3. 高德成为唯一地图，代码与 UI 更直接（无多余分支）
4. 删除后 `typecheck` / `lint` / `build` / `test` 全绿

**非目标**

- 不动 Google 登录 / Google Drive / Google Analytics
- 不升级 `react-amap` 或高德 API 版本
- 不重构高德地图内部逻辑（保留 `AMap/` 现状）
- 不顺带清理与本次无关的遗留（如 `public/homepage.html`）

## Considered Options

| 方案 | 结论 | 理由 |
| --- | --- | --- |
| **1. 彻底删除 Google Maps + Baidu Maps，仅留高德** | **是** | 两者本就无法使用且已是占位实现；删除后选择器、切换、坐标转换、依赖、脚本、环境变量一并消失，收益直接 |
| 2. 保留地图选择器，只留高德一项 | 否 | 只剩一个选项的选择器是死 UI，用户已明确要删 |
| 3. 保留代码但隐藏入口 | 否 | 等于把死代码继续养着；ADR 0001 的原则就是「死代码清除」 |
| 4. 只删 Google Maps，保留 Baidu | 否 | 百度同样不可用，留着是同等负担 |

## Decision Outcome

选择**方案 1**：从代码、依赖、构建产物入口（`index.html`）、CI 环境变量与文档中，
删除 Google Maps 与 Baidu Maps 的全部痕迹；高德为唯一地图。

### Consequences

- **Good**：删除 `Map/BaiduMap/` 整子树、`MapSelector.tsx`，移除地图选择 / 切换 / 百度坐标转换等死逻辑；
  `Map/index.tsx` 从三地图分支退化为单一 `<AMap>`
- **Good**：移除 `react-bmapgl`、`google-map-react`、`@types/google-map-react` 三个依赖，
  以及 `REACT_APP_BAIDU_MAP_AK`、`REACT_APP_GOOGLE_MAPS_API_KEY` 两个环境变量
- **Good**：`index.html` 少一个第三方同步脚本（百度 JSAPI），首屏少一次网络请求
- **Bad**：未来若要重新支持第二种地图，需重新引入抽象与依赖（但当前无此需求）
- **Bad**：地图选择器移除后，`localStorage` 中 `pmap::selectedMap` 成为孤儿键。
  本决策顺带把它从配置导出/导入中移除，**旧导出的配置文件仍可导入**（多余键被忽略）
- **Bad**：仓库 Secrets 里的 `REACT_APP_GOOGLE_MAPS_API_KEY` / `REACT_APP_BAIDU_MAP_AK`
  **不在代码内**，只能在 GitHub 设置里手工删除（见计划「收尾」）；本机 `.env.local` 同理
- **Neutral**：`react-ga`（Google Analytics）虽同样带 “google”，但属统计而非地图，保留

### Confirmation

删除后以下命令全绿，且 grep 判据无输出，视为符合本决策：

```sh
npm ci && npm run typecheck && npm run lint && npm run build && npm test

# 业务代码与入口不再出现两个地图的符号
grep -rnE "BAIDU_MAP|GOOGLE_MAP|BMapGL|react-bmapgl|google-map-react" src index.html package.json
grep -rnE "Baidu|baidu" src index.html
# 文档/CI 不再引用两个地图的 key
grep -rnE "REACT_APP_BAIDU_MAP_AK|REACT_APP_GOOGLE_MAPS_API_KEY" .github AGENTS.md README.md DEVELOP.md
```

> `grep` 命中的例外：`docs/` 与 `help/` 的历史记录、README 的 Google Drive 说明、`react-ga` 等
> 与「地图」无关的 “google” 字样不算命中。判据只针对 `src`、`index.html`、`package.json`、
> 当前生效的 CI/文档配置。

## More Information

- 执行细节：[移除计划](../plans/0003-remove-google-and-baidu-maps.md)
- 前序决策：[ADR 0001](0001-typescript-migration.md)、[ADR 0002](0002-cra-to-vite.md)
- 项目指令：[AGENTS.md](../../AGENTS.md)
