# 智爱客小程序原型 · 项目交接文档

> **项目名称**：智爱客-餐饮AI 小程序原型（zeaik-miniapp-prototype）
> **当前版本**：`4e168c2d`（2026-04-12）
> **原型地址**：https://zeaiapp-qxycplbx.manus.space
> **GitHub 仓库**：https://github.com/Lebron-Lee/zeaik-miniapp-prototype
> **文档版本**：v1.0 · 由 Manus AI 生成

---

## 一、交接方法（操作步骤）

Manus 目前不支持直接将项目转移到另一个账号，但可通过 **GitHub 仓库 + Manus 项目指令** 的组合完成完整交接。新同事按以下步骤操作，即可在自己的 Manus 账号下恢复完整的开发环境。

### 第一步：Fork GitHub 仓库

登录新同事的 GitHub 账号，访问原仓库地址 `https://github.com/Lebron-Lee/zeaik-miniapp-prototype`，点击右上角 **Fork**，将代码复制到自己的 GitHub 账号下。

### 第二步：在 Manus 中创建新项目

在新同事的 Manus 账号中，新建一个 **Project**（项目），项目名称建议使用 `智爱客小程序产品设计`，并将本文档第二节的**项目级指令**粘贴到项目的 Instructions 字段中。

### 第三步：在新任务中初始化 Web 项目

在该项目下新建一个 Task，向 Manus 发送以下指令（将 `YOUR_GITHUB_USERNAME` 替换为实际用户名）：

```
请帮我从 GitHub 仓库 https://github.com/YOUR_GITHUB_USERNAME/zeaik-miniapp-prototype 
克隆代码，初始化为一个 web-static 类型的 webdev 项目，项目名称为 zeaik-miniapp-prototype，
并启动开发服务器。这是一个已有的 React + Tailwind 4 + shadcn/ui 项目，
请不要覆盖已有代码，直接安装依赖并运行。
```

> **注意**：Manus 会自动处理 GitHub 授权和代码同步，初始化完成后即可在 Preview 面板中看到原型界面。

### 第四步：同步项目知识（Skills）

原项目积累了若干产品规范知识（Skills），存储在原 Manus 账号的 `/home/ubuntu/skills/` 目录中。新同事可在交接时向 Manus 发送以下指令，手动重建这些规范：

```
请在当前项目中创建以下产品设计规范 Skills：
1. AI回复内容气泡交互规范：AI回复气泡底部需包含语音播放、点赞、差评、刷新、分享按钮，并显示「内容由AI生成」提示
2. 产品体验页面顶部title栏设计规范：顶部title栏固定不随页面滚动，背景色与首页主题色保持一致
3. 产品说明视频页面交互规范：视频播放完成后显示「体验一下产品」引导按钮
4. Zeaik品牌卡通形象设计规范：基于Zeaik Logo设计理念进行原创，无凤凰元素，只考虑zeaik及zeaik logo元素
```

---

## 二、项目级指令（粘贴到新 Project 的 Instructions）

```
关注移动端微信小程序设计规范、关注智爱客APP产品知识、精通小程序前端设计及研发

【产品背景】
智爱客（Zeaik）是一款面向餐饮连锁企业的AI运营管理平台，官网：zeaik.com
核心产品包括：店面运营AI模型、集团运营AI模型、AI智能菜单、培训智能体

【本原型聚焦模块】
培训智能体（Training Agent）：通过AI对话形式完成员工培训，自动构建组织架构

【核心设计理念】
1. 无感注册：员工点击培训链接即触发注册，2步完成，不打断培训主流程
2. 通用邀请链接：链接不区分上级/下级，接收者自选与邀请人的层级关系，系统自动归位
3. 组织自生长：培训行为驱动组织架构自动构建，无需HR手动维护

【品牌设计规范】
- 主题色：橙色 #e8750a / #ff9a3c（CSS变量 --zeaik-orange）
- 背景色：暖橙米色 oklch(0.965 0.005 270)
- 字体：Noto Sans SC + -apple-system + PingFang SC
- 圆角：14px（卡片）/ 20px（弹层）/ 22px（底部弹层顶角）
- 小程序尺寸：375px宽，模拟iPhone外壳展示
```

---

## 三、项目现状总览

### 3.1 技术栈

| 层级 | 技术选型 |
|------|----------|
| 框架 | React 19 + TypeScript |
| 样式 | Tailwind CSS 4 + shadcn/ui |
| 路由 | Wouter（客户端路由） |
| 构建 | Vite |
| 部署 | Manus Web Static（静态前端） |
| 代码托管 | GitHub（`Lebron-Lee/zeaik-miniapp-prototype`） |

### 3.2 页面清单

本原型采用**单页应用 + 视图切换**模式，所有页面通过 `MiniAppShell.tsx` 中的 `AppView` 状态管理，无传统路由跳转。

| 视图 ID | 文件 | 功能描述 | 完成度 |
|---------|------|----------|--------|
| `home` | `HomePage.tsx` | 首页：AI对话、今日经营、快捷入口 | ✅ 完成 |
| `video` | `VideoPage.tsx` | 产品介绍视频页，播放完成后显示引导按钮 | ✅ 完成 |
| `product` | `ProductPage.tsx` | 产品矩阵介绍页 | ✅ 完成 |
| `store-info` | `StoreInfoPage.tsx` | 店铺信息采集页（AI引导填写） | ✅ 完成 |
| `inspection` | `InspectionPage.tsx` | 常规巡检页（AI拍照对比） | ✅ 完成 |
| `daily-salary` | `DailySalaryPage.tsx` | 工资日结页（蓝紫渐变） | ✅ 完成 |
| `quota-detail` | `QuotaDetailPage.tsx` | 配额详情页 | ✅ 完成 |
| `ai-menu` | `AiMenuPage.tsx` | AI智能菜单产品介绍 | ✅ 完成 |
| `store-ai-model` | `StoreAiModelPage.tsx` | 店面运营AI模型介绍 | ✅ 完成 |
| `group-ai-model` | `GroupAiModelPage.tsx` | 集团运营AI模型介绍（深蓝金色科技风） | ✅ 完成 |
| `training` | `TrainingPage.tsx` | 员工端培训主页 + 通用注册弹层 | ✅ 完成 |
| `training-answer` | `TrainingAnswerPage.tsx` | AI对话答题页（语音/文字双模式） | ✅ 完成 |
| `training-report` | `TrainingReportPage.tsx` | 培训报告页（5分制评分） | ✅ 完成 |
| `training-manager` | `TrainingManagerPage.tsx` | 管理端：发起培训 + 完成率看板 | ✅ 完成 |
| `org-tree` | `OrgTreePage.tsx` | 组织架构树 + 传播记录 + 上级视角 | ✅ 完成 |
| `org-register` | `OrgRegisterPage.tsx` | 独立注册页（从组织树进入） | ✅ 完成 |
| `drawer` | `DrawerPage.tsx` | 「我的」抽屉页 | ✅ 完成 |
| `current-task` | `CurrentTaskPage.tsx` | 当前任务页 | ✅ 完成 |

### 3.3 核心模块：培训智能体

培训智能体是本原型的核心演示模块，包含以下完整流程：

**员工端流程**

```
接收邀请链接
    ↓
通用注册弹层（TrainingPage.tsx · InviteRegisterModal）
    Step 1：填写姓名 + 手机号
    Step 2：选择与邀请人的关系（我是TA的上级 / 我是TA的下级）
           → 动态切换职位列表 + 确认卡文案
    Step 3：注册完成动画（根据关系显示不同颜色和文案）
    ↓
培训任务列表（TrainingPage.tsx）
    ↓
AI对话答题（TrainingAnswerPage.tsx）
    ↓
培训报告（TrainingReportPage.tsx）
```

**管理端流程**

```
管理端首页（TrainingManagerPage.tsx）
    ↓
发起培训弹层（4步）
    Step 1：选择培训类型
    Step 2：AI生成题目（流式动画）
    Step 3：选择参与人员
    Step 4：分享邀请链接（通用链接，含接收者自选关系说明）
    ↓
完成率看板 + 问题清单排名
```

**组织架构模块**

```
OrgTreePage.tsx
    ├── 组织树 Tab：可视化层级树，角色色彩区分
    ├── 传播记录 Tab：时间线展示链接传播路径（含向上传播节点）
    └── 上级视角 Tab：绑定上级前后的数据可见范围对比
```

---

## 四、设计规范速查

### 4.1 色彩系统

| 用途 | 颜色值 | CSS 变量 |
|------|--------|----------|
| 主品牌色（橙） | `#e8750a` | `--zeaik-orange` |
| 主品牌色（浅橙） | `#ff9a3c` | `--zeaik-orange-light` |
| 页面背景 | `oklch(0.965 0.005 270)` | `--zeaik-bg` |
| 卡片背景 | `white` | `--card` |
| 上级注册主题色 | `#6A1B9A`（紫） | 内联样式 |
| 管理端强调色 | `#1565C0`（蓝） | 内联样式 |

### 4.2 间距与圆角

本项目大量使用内联 `style` 而非 Tailwind 工具类，以下为约定规范：

| 元素类型 | 圆角 | 内边距 |
|----------|------|--------|
| 页面卡片 | `14px` | `16px` |
| 底部弹层（半屏） | `22px 22px 0 0` | `18px 18px 24px` |
| 标签/胶囊 | `20px` | `8px 14px` |
| 输入框 | `12px` | `12px 14px` |
| 主操作按钮 | `14px` | `14px 0` |

### 4.3 字体层级

| 层级 | 字号 | 字重 | 用途 |
|------|------|------|------|
| 大标题 | `18px` | `800` | 弹层标题、完成动画 |
| 页面标题 | `16px` | `700` | 页面 H1 |
| 卡片标题 | `15px` | `700` | 步骤标题、卡片主文 |
| 正文 | `13px` | `400` | 描述文字 |
| 辅助文字 | `11px` | `400` | 标签、时间戳 |

### 4.4 交互规范

**AI 回复气泡**：底部需包含语音播放、点赞、差评、刷新、分享五个操作按钮，并显示「内容由AI生成」提示文字。

**弹层动画**：底部弹层使用 `slideUp` 动画（`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`），时长 `0.3s ease`。

**步骤进度点**：使用宽度变化（当前步骤 `20px`，其余 `6px`）而非数字，配合 `transition: all 0.3s` 过渡。

**禁用按钮**：背景色 `#E0E0E0`，文字色 `#aaa`，`cursor: not-allowed`。

---

## 五、待办事项（建议优先级）

以下为已识别但尚未实现的功能点，供新同事参考接续开发。

### 高优先级

| 编号 | 功能描述 | 涉及文件 |
|------|----------|----------|
| T-01 | 「已有账号」登录后选择与邀请人层级关系的绑定流程 | `TrainingPage.tsx` |
| T-02 | OrgTreePage 增加「待确认关系」虚线节点（邀请已发出但未注册） | `OrgTreePage.tsx` |
| T-03 | TrainingManagerPage 步骤4增加「已响应 N 人」实时计数 | `TrainingManagerPage.tsx` |

### 中优先级

| 编号 | 功能描述 | 涉及文件 |
|------|----------|----------|
| T-04 | 首页 AI 对话支持图片上传（拍照识别菜品/巡检问题） | `HomePage.tsx` |
| T-05 | 培训报告页增加「分享给上级」按钮，触发上级注册邀请 | `TrainingReportPage.tsx` |
| T-06 | 组织树节点点击后展示成员培训详情侧滑面板 | `OrgTreePage.tsx` |
| T-07 | 工资日结页增加「积分兑换」交互演示 | `DailySalaryPage.tsx` |

### 低优先级 / 探索方向

| 编号 | 功能描述 |
|------|----------|
| T-08 | 增加「集团视角」演示：多门店数据汇总看板 |
| T-09 | 增加「新员工入职」完整流程演示（从扫码到完成第一次培训） |
| T-10 | 增加暗色模式切换（当前仅支持亮色） |

---

## 六、关键文件速查

```
zeaik-miniapp-prototype/
├── client/
│   ├── index.html              ← 字体引入（Noto Sans SC）
│   └── src/
│       ├── index.css           ← 全局设计 Token（品牌色、圆角、字体）
│       ├── App.tsx             ← 路由入口（仅 / 和 fallback，均指向 MiniAppShell）
│       └── pages/
│           ├── MiniAppShell.tsx    ← ⭐ 核心：所有视图的状态机和路由调度
│           ├── HomePage.tsx        ← ⭐ 首页（AI对话 + 经营数据）
│           ├── TrainingPage.tsx    ← ⭐ 员工端培训 + 通用注册弹层
│           ├── TrainingManagerPage.tsx  ← ⭐ 管理端发起培训
│           ├── OrgTreePage.tsx     ← ⭐ 组织架构树 + 传播记录
│           ├── TrainingAnswerPage.tsx   ← AI答题交互
│           ├── TrainingReportPage.tsx   ← 培训报告
│           └── OrgRegisterPage.tsx      ← 独立注册页
└── package.json                ← React 19 + Tailwind 4 + shadcn/ui
```

---

## 七、常见问题

**Q：为什么大量使用内联 `style` 而不是 Tailwind 工具类？**

本项目在早期开发中为了快速迭代和精确控制微信小程序风格的像素级细节，选择了内联样式。新同事可以继续沿用这一风格，也可以逐步将高频样式提取为 Tailwind 工具类或 CSS 变量，两种方式可以共存。

**Q：如何添加新页面？**

在 `client/src/pages/` 下新建 `XxxPage.tsx`，然后在 `MiniAppShell.tsx` 中：① 将新视图 ID 添加到 `AppView` 类型联合；② 在 `renderContent()` 的条件渲染中添加对应 case；③ 在触发入口（如 HomePage 的快捷按钮）中调用 `setAppView("xxx")`。

**Q：如何修改 Mock 数据？**

所有 Mock 数据均以 `const MOCK_` 开头，定义在各页面文件的顶部（类型定义之后）。修改这些常量即可更新演示内容，无需改动渲染逻辑。

**Q：图片资源在哪里？**

所有图片均通过 CDN URL 引用（`https://d2xsxph8kpxj0f.cloudfront.net/...`），不存储在项目目录中。如需添加新图片，使用 `manus-upload-file --webdev` 命令上传并获取 CDN URL。

---

*本文档由 Manus AI 自动生成，版本对应 commit `4e168c2d`（2026-04-12）。*
