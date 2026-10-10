# ADR（Architecture Decision Records）

记录本仓库的架构决策。每条决策一篇文档，**只记录，不复述格式规则**。

## 格式约定

- 文件名：`NNNN-kebab-case-title.md`，4 位序号递增（`0001`、`0002`…）
- **文件名一经创建不再更改**：状态、日期的变化只改文档内容，不 rename，
  否则所有指向它的链接都会断
- 推翻旧决策时**新建一篇**，在新文档里声明 supersede 关系（如
  `Supersedes [0001](0001-typescript-migration.md)`），旧文档状态改为 `superseded`
- 日期写在文档内的时间字段，不进文件名 —— 时间戳由 `git log` 提供，
  写进文件名是会过期的冗余信息
- **ADR 只记录决策本身**（约 1~2 页）。实施计划、checklist、验收命令等执行细节放在
  `docs/` 下的独立文档里，由 ADR 链接过去 —— 决策应稳定，计划会反复修订

## 状态词汇

| 状态 | 含义 |
| --- | --- |
| `proposed` | 已起草，待评审 |
| `accepted` | 评审通过，待落地 |
| `implemented` | 已落地（对 MADR 标准状态集的**本地扩展**，用来说明落地完成） |
| `rejected` | 评审否决 |
| `deprecated` | 不再推荐，但暂无替代 |
| `superseded` | 已被新 ADR 取代 |

> 前 4 项与 [MADR 4.0](https://github.com/adr/madr) 一致；`deprecated` 沿用 MADR 早期版本词汇。

## 单篇 ADR 的结构

结构遵循 Nygard 模板（title / status / context / decision / consequences），
并按 [adr.github.io](https://adr.github.io/adr-templates/) 的建议补上
**Considered Options 的权衡分析**（该站认为这是理解决策理由的关键）：

```markdown
# ADR 0001：<决策标题>

- 状态：proposed | accepted | implemented | rejected | deprecated | superseded
- 日期：YYYY-MM-DD <起草/最近修订>
- 决策人：<谁做的决定>
- 关联：<链接到实施计划>

## Context and Problem Statement   （背景与压力：为什么现在必须决策）
## Decision Drivers                （目标 / 非目标 / 约束）
## Considered Options              （备选方案及其优劣，必填）
## Decision Outcome                （选了哪个、为什么）
### Consequences                   （必须包含负面影响与代价）
### Confirmation                   （如何验证实现符合决策，通常是命令）
## More Information                （链接到计划、相关文档）
```

## 状态流转

```
proposed ──评审通过──> accepted ──落地完成──> implemented
    │
    └──被新决策推翻──> superseded（由 0002+ 声明）
```

## 现有 ADR

| # | 标题 | 状态 | 实施计划 |
| --- | --- | --- | --- |
| 0001 | [TypeScript 迁移](0001-typescript-migration.md) | implemented | [迁移计划](../plans/0001-typescript-migration.md) |
| 0002 | [构建迁移（CRA → Vite）](0002-cra-to-vite.md) | implemented | [迁移计划](../plans/0002-cra-to-vite.md) |
| 0003 | [移除 Google Maps 与 Baidu Maps，仅保留高德地图](0003-remove-google-and-baidu-maps.md) | implemented | [移除计划](../plans/0003-remove-google-and-baidu-maps.md) |

## 配套文档

- **实施计划**放 `docs/plans/`，文件名与对应 ADR **同编号**（`adr/0001-*.md` ↔ `plans/0001-*.md`），
  一眼看出执行的是哪条决策
- 计划是可变的执行文档；决策是稳定的记录。**计划可以反复修订，ADR 只有决策变化时才改**
- 计划属临时生命周期：迁移完成后按完成定义归档，长期仍有效的约定（如迁移期的编码规则）
  应上提到 `AGENTS.md` 或 `docs/` 根目录的长期文档，不要随计划一起被遗忘
