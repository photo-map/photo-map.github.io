# CI：构建与部署

`.github/workflows/build-deploy.yml` 分两个 job：`Build` 产出构建物，`Deploy` 把它发到 `gh-pages`。

```
push / PR to master ─┬─ Build  : checkout → setup-node → npm ci → typecheck → lint → build → test → upload-artifact
workflow_dispatch  ──┤
                     └─ Deploy : download-artifact → peaceiris/actions-gh-pages → gh-pages
                                 (needs: build，且 if: github.ref == 'refs/heads/master')
```

## 关键设计及其理由

| 设计 | 理由 |
| --- | --- |
| 拆成两个 job，用 artifact 中转构建物 | 让 PR 能跑 build + test 但**不部署**（deploy job 的 `if` 限定在 master）。代价：artifact action 的版本弃用会周期性重演，靠 Dependabot 兜住 |
| `workflow_dispatch` | 需要"只验证流水线本身"时能一键触发（2026-11-19 的镜像迁移检查就靠它），不必造一个假提交 |
| `concurrency` + `cancel-in-progress: false` | 连续 push 时排队而非并发，避免两次部署互相覆盖 `gh-pages` |
| workflow 级 `permissions: contents: read`；deploy job 级 `contents: write` | 最小权限。peaceiris 推送 `gh-pages` 需要写权限；显式声明可避免依赖仓库默认值（GitHub 自 2023-02-02 起**新建**仓库默认只读） |
| `npm ci` 而非 `npm install` | 按 lockfile 精确安装，构建可复现；声明不一致时直接报错而不是静默纠正 |
| `typecheck` / `lint` 拆成独立步骤 | CRA 的 `react-scripts build` 内嵌二者且硬失败，`vite build` 不做。拆成独立 step 才能保住判据（见 [ADR 0002](adr/0002-cra-to-vite.md)） |
| `node-version: 24.x` | Node 18 已于 2025-04-30 EOL；24 是 Active LTS（EOL 2028-04-30） |
| `runs-on: ubuntu-latest` | 浮动标签，**挂账**：2026-10-19 起灰度迁往 Ubuntu 26.04、2026-11-19 完成（actions/runner-images#14748）。迁移后需手动跑一次确认 |

## 排查手册

### 1. 步骤成功但 `gh-pages` 没动

**先读 action 源码，不要急着判成败。** peaceiris/actions-gh-pages 在发布目录没有产生任何变更时
（`src/git-utils.ts`）：

```ts
try { await exec.exec('git', ['commit', '-m', msg]); }
catch (error) { core.info('[INFO] skip commit'); }   // 吞掉异常，不抛出
```

无变化 → `git commit` 报错 → 被 catch → 后续 `git push` 变成 no-op（Everything up-to-date）
→ **step 依然 exit 0**。

所以「success + 目标分支不动 + 几步就跑完」是**正常的 no-op**，不是故障。
真正要警惕的是：**改过 `src/` 之后仍然不动**。

### 2. 不要用本地产物判断 CI 的部署结果

CI 通过 secrets 注入三个 `REACT_APP_*` 值，本地没有。这些值会被**内联进 bundle**，
因此 `main.[hash].js` 的 hash 必然不同 —— 本地构建物与线上必然不一致，**不能用来判断"线上是否更新"**。
（不含 env 的 `static/js/[数字].[hash].chunk.js` 才可直接对照。）

### 3. 弃用公告日 ≠ 实际生效日

`upload-artifact` / `download-artifact` 的 v1/v2 公告弃用日是 2024-06-30，
但本仓库在 2024-07-30 用同一份 workflow **仍然成功部署**过。
判断"某版本是否已被强制拦截"时以**实际报错**为准，别拿公告日当结论。

同理，`github-actions` 生态的大版本推进很快（本仓库已从 v2 直接跳到 v7/v8），
**任何写死的版本号表格都会过期** —— 改 workflow 前一律现查 Releases 页。

## 事故记录

**2026-10 · artifact action 被强制弃用，流水线停摆 14 个月**

`actions/upload-artifact@v2` 与 `download-artifact@v2` 被 GitHub 拒绝，报
`This request has been automatically failed because it uses a deprecated version`。
build 失败 → deploy 有 `needs: build` → 整条流水线停摆，`gh-pages` 停在 2024-07-30。
期间 `src/`、`public/` 一次未改，所以**线上内容没有过期**，坏的只是管道。

同期一并清理（同一批 2021 年的钉子）：`checkout@v2`→`v7`、`setup-node@v1`→`v7`、
`actions-gh-pages@v3`→`v4`、`node-version: 18.x`→`24.x`、`npm install`→`npm ci`、
补 `permissions` 与 `concurrency`、删除遗留 `.travis.disabled.yml`。修复提交 `800b06d`，CI 全绿。

教训：日志里「1 error + 1 notice」要分开看 —— notice（Ubuntu 26 迁移提示）**不是**失败原因。

## Dependabot

`.github/dependabot.yml`：仅 `github-actions` 生态，monthly。提交到默认分支即生效，
**不需要**在 Settings 里开开关（文档里唯一需要手动启用的情况是 fork 仓库）。

- 它会提 **major** 级升级 PR（实例：`actions/checkout from 4 to 6`）。
- **不要盲合**：先看 PR 里的 release notes 有无 breaking change，等 CI 绿再合。
- Dependabot PR 拿不到 secrets（等同 fork PR），但本项目空 env 下 build 与 test 均能通过
  （Node 24 实测），所以 PR 的 CI 不会因缺 key 而假红。
- 它只盯版本漂移，**不替代**上面「改 workflow 前现查 Releases」这条纪律。

## 本地验证

```sh
npm ci
npm run typecheck
npm run lint
npm run build
npm test                                 # 期望 4 suites / 6 tests 全过
```

## 待办检查点

**2026-11-19 之后**：Ubuntu 26.04 迁移完成。Actions 页面 → `Build & deploy` → Run workflow（选 master），
确认仍绿。本项目是纯 Node 构建、无 native 编译，预期不受 glibc / OpenSSL 差异影响。
