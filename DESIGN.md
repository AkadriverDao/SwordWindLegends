# Design Brief — 剑风传奇 (Sword Wind Legends)

## Direction

剑风传奇 — 暗色模式专属的中文博客 / 社区平台，以硬编码 dark-* hex 调色板为视觉基础，通过 CSS 变量统一暴露为设计令牌。

## Tone

暗色编辑风（dark editorial）— 近黑底 + 卡片分层 + 靛紫强调，克制而具沉浸感；不引入浅色主题。

## Differentiation

CJK 优先排版 + 6 套主题预设 + 4 种背景样式 + 6 种强调色，用户可即时切换主题而不破坏暗色基底。

## Color Palette

| Token            | Hex       | Role                |
| ---------------- | --------- | ------------------- |
| dark-bg          | #0f0f0f   | 应用底色            |
| dark-surface     | #1a1a1a   | 表面 / 面板         |
| dark-card        | #2d2d2d   | 卡片 / 提升层       |
| dark-muted       | #404040   | 弱化背景            |
| dark-border      | #525252   | 边框                |
| dark-hover       | #666666   | 悬停态              |
| dark-text        | #e5e5e5   | 主文本              |
| dark-text-secondary | #a3a3a3 | 次要文本            |
| dark-primary     | #6366f1   | 主色（靛蓝）        |
| dark-secondary   | #8b5cf6   | 次色（紫罗兰）      |
| dark-accent      | #f59e0b   | 强调（琥珀）        |
| dark-success     | #10b981   | 成功（翠绿）        |
| dark-warning     | #f59e0b   | 警告（同强调）      |
| dark-error       | #ef4444   | 错误（红）          |

## Theme Presets (6)

| Preset        | Primary  | Secondary |
| ------------- | -------- | --------- |
| blue-purple   | #6366f1  | #8b5cf6   |
| pink-purple   | #ec4899  | #8b5cf6   |
| green-blue    | #10b981  | #3b82f6   |
| orange-red    | #f59e0b  | #ef4444   |
| purple-pink   | #8b5cf6  | #ec4899   |
| cyan-blue     | #06b6d4  | #3b82f6   |

## Accent Colors (6)

none / amber #f59e0b / emerald #10b981 / rose #f43f5e / violet #8b5cf6 / sky #0ea5e9

## Background Styles (4)

gradient（默认渐变）/ solid（纯色）/ pattern（径向点阵）/ starry（星空）

## Typography

- Display/Body: CJK 优先栈 — PingFang SC, Hiragino Sans GB, MS YaHei, Source Han Sans SC, Noto Sans CJK SC
- 字体样式预设 4 套: default(system-ui) / serif(Georgia) / sans(Inter) / mono(JetBrains Mono)
- 层级: 标题 700 / 0.025em letter-spacing；.elegant-numbers 用于统计数字（SF Pro Display）
- 移动端 <=640px 缩小 text-4xl..xs

## Elevation & Depth

表面分层（bg→surface→card→muted）+ cartoon-shadow 卡通风阴影 + shadow-2xl 提升层；卡片悬停上浮 -2px。

## Structural Zones

| Zone    | Background        | Border        | Notes                       |
| ------- | ----------------- | ------------- | --------------------------- |
| Header  | dark-surface      | border-b      | 品牌标 + 导航               |
| Content | dark-bg / 渐变    | —             | 卡片网格，交替 muted 分节   |
| Footer  | dark-surface/40   | border-t      | 弱化底栏                    |

## Spacing & Rhythm

容器 max-w-4xl 居中，px-4 sm:px-6，py-4 sm:py-8；令牌 --space-xs..2xl (0.25/0.5/1/1.5/2/3rem)；移动端折叠 padding。

## Border Radius

动态 --theme-border-radius（默认 0.75rem）；预设 4 套: none(0)/small(0.375)/rounded(0.75)/large(1.5rem)；cartoon 圆角 1.5/2/2.5rem；自定义 border-3/border-4。

## Component Patterns

- 按钮: 圆角随 --theme-border-radius，主色填充 + 悬停阴影
- 卡片: dark-card 底 + cartoon-shadow，悬停上浮
- 徽章: 主/次/强调色系，圆角 sm
- 表单: 移动端 44px 最小触控目标，range slider 三色变体（gold/death/nothing）

## z-index Scale

z-base 1 / z-content 10 / z-sticky 100 / z-overlay 999996 / z-backdrop 999997 / z-dropdown 999998 / z-modal 999999（令牌定义于 index.css，消除多文件重复）

## Motion

- 入场: fade/slide，0.2–0.3s ease-out
- 悬停: -2px 上浮 + 阴影加深，--transition-smooth (0.3s cubic-bezier)
- 装饰: starry 星空 / gradient 流动

## Constraints

- 纯暗色模式，不引入浅色主题切换
- 保留现有 dark-* hex 工具类为视觉真值，CSS 变量仅作语义别名
- 不改变现有页面视觉外观，仅整合令牌与文档化
- 界面文案一律中文

## Signature Detail

cartoon-shadow 卡通投影 + CJK 优先排版，赋予暗色社区平台独特的「厚重手作」质感，区别于通用 SaaS 暗色模板。
