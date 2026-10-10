# AGENTS.md

本文件是本仓库的**项目指令**，是协作方式的唯一事实源。
可复用的项目知识放 `docs/`；agent 的私有运行期记忆**不属于本仓库**（见文末「知识归属」）。

## 项目概览

把照片按 GPS 坐标展示在 Google Maps / 高德地图 / 百度地图上的纯前端站点。

- 技术栈：Create React App（`react-scripts` 5.0.1）、React 18、antd 5、TypeScript 4.9.5（`strict` 全开；
  2026-10-10 迁移完成，决策见 [ADR 0001](docs/adr/0001-typescript-migration.md)）
- 线上：<https://photo-map.github.io>
- 源码分支 `master` → CI 构建 → 发布分支 `gh-pages`（GitHub Pages 提供服务）

## 常用命令

```sh
npm ci                    # 安装依赖。CI 与本地验证都用它，不要用 npm install
npx tsc --noEmit          # 类型检查（无输出即通过；tsc 与 CRA 共用 tsconfig.json）
npm start                 # 开发服务器
npm run build             # 生产构建 → build/（内嵌 ESLint，且 TS 类型错误会让 build 硬失败）
CI=true npm test          # 单次跑测试（不加 CI=true 会进 watch 模式不退出）
npm run analyze           # 产物体积分析
```

`npm ci` 要求 `package-lock.json` 与 `package.json` 一致，不一致会**直接报错退出**。
这是预期行为，**不要**为了让它跑过去而改回 `npm install`。

## 环境变量

三个 key 由 GitHub Actions secrets 注入；本地开发写进 `.env.local`（已被 .gitignore 忽略）。

| 变量 | 用途 |
| --- | --- |
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Google Maps |
| `REACT_APP_AMAP_API_KEY` | 高德地图 |
| `REACT_APP_BAIDU_MAP_AK` | 百度地图 |

- JS 中读 `process.env.REACT_APP_X`；`public/index.html` 中用 `%REACT_APP_X%`（CRA 的 HTML 变量替换）。
- 新增变量要同时改三处：仓库 Settings → Secrets、workflow 顶层 `env:`、源码引用处。

## 硬约束

- **Node 24** 是目标版本（CI 与本项目一致）。react-scripts 5 在 Node 24 下的构建与测试均已验证通过。
- **新代码必须写 TS/TSX**：`src/` 下不得引入 `.js`/`.jsx` 业务文件（`tsconfig.json` 已移除 `allowJs`，
  引入即编译报错）。新领域类型放 `src/Application/types.ts`，第三方全局声明放 `src/globals.d.ts`；
  `prop-types` 依赖已移除，组件入参一律用 `interface`。
- 不要提交 `build/`（已被 .gitignore 忽略）；不要手工向 `gh-pages` 提交。
- 提交时**不要用 `git add -A`** — 本机产物（`.workbuddy/` 等）不该进提交。
- 依赖升级前后都跑一遍：`npm ci && CI=true npm run build && CI=true npm test`。
  react-scripts 5 已停止维护，激进升级风险高。

## CI 纪律

`.github/workflows/build-deploy.yml` 里各 action 的版本**会漂移，并被 GitHub 强制弃用**。
弃用不是警告，是**硬失败**：2026-10 本仓库因 `actions/upload-artifact@v2` 被拦，
流水线停摆 14 个月无人察觉。

因此改动 workflow 前：

1. **现查**每个 action 的 Releases 页确认当前大版本，不要照抄任何文档或记忆里的版本号。
2. 版本号只写 `@vN` 大版本，靠 Dependabot（`.github/dependabot.yml`）盯后续升级。
3. 记住 `runs-on: ubuntu-latest` 是浮动标签，镜像会变。

判据、排查流程与事故记录见 [`docs/ci.md`](docs/ci.md)。

## 知识归属

| 内容 | 放哪 |
| --- | --- |
| 协作规则、命令、硬约束 | 本文件 |
| 可复用的项目知识、坑点、设计理由 | `docs/` |
| 一次性的过程记录、本机实验细节 | **不要**进仓库 |

`.workbuddy/` 是 agent 的运行期私有记忆（含本机路径、本机实验结果），已在 `.gitignore` 忽略。
**有价值的结论必须回流到本文件或 `docs/`**，私有记忆里只留指针 —— 否则知识会锁死在
某个工具的私有格式里，换工具即丢失。
