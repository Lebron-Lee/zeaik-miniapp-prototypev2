/**
 * 智爱客-餐饮AI 首页 v4
 * 设计规范：
 * - 主题色：zeaik橙色 #e8750a / #ff9a3c，整体背景暖橙米色调
 * - 顶部导航：汉堡(左) + zeaik logo(中) + AI诊断胶囊(右)
 * - Hero区：左侧问候文字 + 右侧专家形象（顶部完整，底部与卡片对齐，不遮挡AI诊断按钮）
 * - 「今日经营」卡片：点击问题联动发送到对话
 * - 底部：快捷按钮 + 输入框（支持语音/文字切换，拍照触发AI检测模拟）
 * - 对话界面：内嵌在页面中，支持流式AI回复
 * - 设计哲学：沿用暖橙玻璃卡片与拟物浮层语言，把碎片化培训做成聊天流中的双步骤任务卡，强调轻量引导、可快速决策与组织分组选择
 */
import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import DrawerPage from "./DrawerPage";

const EXPERT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663518710373/QXycpLBxSeowbm34BVNxpL/zeaik_expert_nobg_f210d4f5.png";

// 小悦形象（AI服务员，橙色制服+ZeAiK logo）
const EXPERT_IMGS = [
  {
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663518710373/QXycpLBxSeowbm34BVNxpL/xiaoyue_v22_final_8c461a1e.png",
    name: "小悦",
    label: "小悦",
    objectPosition: "bottom center",
    offsetY: 0,
  },
];
const LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663518710373/QXycpLBxSeowbm34BVNxpL/产品icon144_23ce91eb.png";
const TOILET_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663518710373/QXycpLBxSeowbm34BVNxpL/pasted_file_JGXRjc_image_671fe81b.png";

// ─── 图标 ────────────────────────────────────────────────────────────────────

const IcMenu = () => (
  <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
    <rect y="0" width="20" height="2.4" rx="1.2" fill="#2d2040"/>
    <rect y="6.8" width="13" height="2.4" rx="1.2" fill="#2d2040"/>
    <rect y="13.6" width="20" height="2.4" rx="1.2" fill="#2d2040"/>
  </svg>
);
const IcMore = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="5" cy="12" r="1.8" fill="#5a4a6a"/>
    <circle cx="12" cy="12" r="1.8" fill="#5a4a6a"/>
    <circle cx="19" cy="12" r="1.8" fill="#5a4a6a"/>
  </svg>
);
const IcChevronUp = ({ open }: { open: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5" strokeLinecap="round"
    style={{ transform: open ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 0.22s" }}>
    <path d="M18 15l-6-6-6 6"/>
  </svg>
);
const IcArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round">
    <path d="M7 17L17 7M7 7h10v10"/>
  </svg>
);
const IcSend = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
  </svg>
);
const IcMic = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a7a9a" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/>
    <path d="M19 10v2a7 7 0 01-14 0v-2"/>
    <path d="M12 19v3M9 22h6"/>
  </svg>
);
const IcCamera = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a7a9a" strokeWidth="1.8" strokeLinecap="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
    <circle cx="12" cy="13" r="4"/>
    <path d="M18 8.5l1.5-1" stroke="#e8750a" strokeWidth="1.5"/>
  </svg>
);
const IcKeyboard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8a7a9a" strokeWidth="1.8" strokeLinecap="round">
    <rect x="2" y="6" width="20" height="12" rx="2"/>
    <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>
  </svg>
);
const IcWave = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#9a8aaa" strokeWidth="1.6"/>
    <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#9a8aaa" strokeWidth="1.6" strokeLinecap="round"/>
    <circle cx="12" cy="12" r="2" fill="#9a8aaa"/>
  </svg>
);

// 快捷按钮图标
const IcAIDiag = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M3 12h3l2-5 3 10 3-7 2 4 2-2h3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcProduct = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7.5" height="7.5" rx="1.8" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.8" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.8" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M13.5 17.25h7.5M17.25 13.5v7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IcSalary = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="6" width="20" height="13" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M2 10h20M6 15h3M15 15h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IcInspect = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M9 12l2.5 2.5L15 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 12V19a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="18" cy="6" r="3" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
);
const IcIntercom = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v3M9 22h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IcService = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 11h6M11 8v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IcTraining = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 3L2 8l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 8v6M6 10.5v5.5a6 6 0 0012 0v-5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="20" cy="8" r="1" fill="currentColor"/>
    <path d="M20 9v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IcTask = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M7 8h10M7 12h7M7 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M16 14l1.5 1.5L20 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IcAiMenu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M7 8h10M7 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="17" cy="15" r="2.5" fill="currentColor" opacity="0.7"/>
    <path d="M15.5 15l-1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IcStoreAi = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="17" cy="8" r="2" fill="currentColor" opacity="0.6"/>
  </svg>
);
const IcGroupAi = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="5" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
    <circle cx="19" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M12 7.5v3M12 10.5L5 14.5M12 10.5L19 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const SHORTCUT_BTNS = [
  { Icon: IcSalary,   label: "工资日结" },
  { Icon: IcAiMenu,   label: "AI菜单" },
  { Icon: IcStoreAi,  label: "店面AI" },
  { Icon: IcGroupAi,  label: "集团AI" },
  { Icon: IcInspect,  label: "AI巡检" },
  { Icon: IcService,  label: "服务检测" },
  { Icon: IcIntercom, label: "智能对讲" },
  { Icon: IcTraining, label: "AI培训" },
];

// 问题列表：每条问题配独立icon和颜色（蚂蚁阿福风格）
// 统一的问题图标：用户提供的橙色对话气泡SVG
const QuestionIcon = () => (
  <svg viewBox="0 0 1024 1024" width="22" height="22" xmlns="http://www.w3.org/2000/svg">
    <path d="M782.933333 853.333333H480a358.762667 358.762667 0 0 1-252.522667-114.666666A359.872 359.872 0 0 1 130.133333 480a359.338667 359.338667 0 0 1 110.144-248.533333A362.048 362.048 0 0 1 492.8 130.133333h42.666667a360.362667 360.362667 0 0 1 256.533333 106.133334A360.362667 360.362667 0 0 1 898.133333 492.8a354.858667 354.858667 0 0 1-147.2 290.133333l44.8 32a22.528 22.528 0 0 1 4.266667 29.866667 19.2 19.2 0 0 1-17.066667 8.533333zM449.941333 374.4a53.653333 53.653333 0 0 0-38.144 16.021333l-128 128a48.490667 48.490667 0 0 0-15.978666 35.178667 54.208 54.208 0 0 0 15.978666 39.488 48.448 48.448 0 0 0 36.544 16 53.674667 53.674667 0 0 0 38.144-16l89.6-89.6 89.6 89.6a54.336 54.336 0 0 0 38.4 14.933333 46.165333 46.165333 0 0 0 36.266667-14.933333l128-128a48.469333 48.469333 0 0 0 15.978667-35.157333 54.186667 54.186667 0 0 0-15.978667-39.488 48.426667 48.426667 0 0 0-36.544-16.021334 53.653333 53.653333 0 0 0-38.144 16.021334l-89.6 89.6-89.6-89.6a48.426667 48.426667 0 0 0-36.522667-16.042667z" fill="#F58D30"/>
  </svg>
);

const QUICK_QUESTIONS = [
  {
    text: "餐饮店在哪些环节可以用AI来干活？",
    bg: "linear-gradient(135deg, #ff9a3c, #e8750a)",
    icon: <QuestionIcon />,
  },
  {
    text: "餐饮店用AI需要投入多少錢？",
    bg: "linear-gradient(135deg, #ff9a3c, #e8750a)",
    icon: <QuestionIcon />,
  },
  {
    text: "初中毕业的服务员能上手AI吗？",
    bg: "linear-gradient(135deg, #ff9a3c, #e8750a)",
    icon: <QuestionIcon />,
  },
];

// AI回复内容
const AI_REPLIES: Record<string, string> = {
  "餐饮店在哪些环节可以用AI来干活？":
    "餐饮店可以在以下环节使用AI：\n\n**1. 智能点餐** — AI菜单自动推荐，根据客户偏好和历史记录个性化推送，提升客单价15-30%。\n\n**2. 服务质检** — 通过摄像头实时监测服务员行为规范、仪容仪表，自动生成巡检报告。\n\n**3. 工资日结** — AI自动统计员工出勤、绩效数据，实现工资日结，降低人力管理成本。\n\n**4. 智能对讲** — AI语音助手替代传统对讲机，自动记录并分析沟通内容，提升协作效率。\n\n**5. 经营分析** — 实时分析营业额、翻台率、菜品销量等数据，给出经营优化建议。",
  "餐饮店用AI需要投入多少钱？":
    "根据不同规模的餐饮店，AI投入成本差异较大：\n\n**小型餐饮（1-2家门店）**\n- 基础AI套餐：约 **299元/月**\n- 包含：AI菜单 + 基础巡检 + 数据分析\n\n**中型连锁（3-10家门店）**\n- 标准AI套餐：约 **599元/月/店**\n- 包含：全功能AI套件 + 工资日结 + 智能对讲\n\n**大型连锁（10家以上）**\n- 企业定制方案，联系智爱客商务团队\n\n💡 **投入产出比参考**：通常6-12个月可回收AI投入成本，主要通过提升翻台率和降低人力成本实现。",
  "初中毕业的服务员能上手AI吗？":
    "完全可以！智爱客的AI产品专为餐饮一线员工设计，**无需任何技术背景**。\n\n**上手难度评估：**\n- 学习周期：**平均 3-7 天**即可熟练操作\n- 操作方式：全程语音+图片，无需打字\n- 界面设计：大图标、大字体，操作步骤不超过3步\n\n**实际案例：**\n> 某火锅连锁店服务员（初中学历），通过9.9元AI培训课，3天内掌握了智能巡检和工资日结功能，每月节省 2 小时以上的统计工作。\n\n**我们的培训支持：**\n- 9.9元快速入门课（视频+图文）\n- 专属客服 1 对 1 指导\n- 7×12小时在线答疑",
  "工资日结怎么操作？":
    "工资日结操作非常简单！\n\n**员工端：**\n1. 每天下班后打卡，AI自动记录出勤时间\n2. AI自动计算当日工资（按时计或按绳效计）\n3. 工资实时到帐，支持微信/支付宝\n\n**管理端：**\n- 一键查看所有员工当日工资\n- 自动生成工资单，无需手动算账\n- 支持工资暂挂和审批流程\n\n**节省效果：** 平均每月节省财务工作 **4-6小时**，彻底消除工资纠纷。",
  "AI巡检能检测哪些问题？":
    "AI巡检基于视觉AI技术，可自动检测以下问题：\n\n**唶商服务规范：**\n- 服务员仪容仪表（着装、头发、微笑）\n- 上菜速度和主动服务意识\n- 手机使用行为监测\n\n**厅内卫生环境：**\n- 桌面、地面、卫生间清洁度\n- 垃圾桶满溢预警\n- 开饬时间和关闭时间监控\n\n**客流分析：**\n- 高峰期客流密度实时预警\n- 等位时间过长自动提醒带位\n\n**检测结果自动生成巡检报告**，可一键分享给管理层。",
  "有免费试用期吗？":
    "当然有！智爱客提供 **14天全功能免费试用**，无需任何前期投入。\n\n**试用期包含：**\n- ✅ 工资日结系统\n- ✅ AI智能巡检\n- ✅ 服务质检检测\n- ✅ 智能对讲系统\n- ✅ 碎片化AI培训\n- ✅ 经营数据分析\n\n**如何申请？**\n1. 填写店铺基础信息（名称/地址/类型/面积/员工数）\n2. 提交申请，顾问 2 小时内联系\n3. 开通试用，专属顾问 1 对 1 指导\n\n要不要现在就去填写店铺信息，申请试用？",
};

// 跟进问题映射表：每个问题对应的3个追问
const FOLLOW_UP_QUESTIONS: Record<string, string[]> = {
  "餐饮店在哪些环节可以用AI来干活？": [
    "工资日结具体怎么操作？",
    "AI巡检能检测哪些问题？",
    "智能对讲和普通对讲有什么区别？",
  ],
  "餐饮店用AI需要投入多少钱？": [
    "小餐馆用哪个套餐最划算？",
    "多久能回收成本？",
    "有免费试用期吗？",
  ],
  "初中毕业的服务员能上手AI吗？": [
    "9.9元培训课包含哪些内容？",
    "上手后遇到问题怎么办？",
    "支持方言识别吗？",
  ],
  "工资日结怎么操作？": [
    "员工工资如何到账？",
    "管理层如何审批工资？",
    "可以申请免费试用吗？",
  ],
  "AI巡检能检测哪些问题？": [
    "巡检报告如何分享给上级？",
    "巡检频率可以设置吗？",
    "有免费试用期吗？",
  ],
  "有免费试用期吗？": [
    "申请试用需要多久？",
    "试用期内有专属指导吗？",
    "立即填写店铺信息申请",
  ],
};
// 默认跟进问题（未匹配时使用）
const DEFAULT_FOLLOW_UPS = [
  "工资日结怎么用？",
  "AI巡检有哪些功能？",
  "如何开始免费试用？",
];

// 图片检测 AI回复（流式输出）
const PHOTO_ANALYSIS_STEPS = [
  { delay: 500,  text: "📸 正在接收图片..." },
  { delay: 1200, text: "🔍 AI正在分析图片内容..." },
  { delay: 2000, text: "⚡ 识别卫生间区域..." },
  { delay: 2800, text: "✅ 分析完成，生成检测报告" },
];

const PHOTO_ANALYSIS_RESULT = `**📋 卫生间卫生检测报告**

**检测时间：** ${new Date().toLocaleString("zh-CN")}
**检测区域：** 卫生间 / 洗手台区域

---

**✅ 合格项目（4项）**

1. ✅ 马桶干净无污渍
2. ✅ 垃圾桶内没有垃圾
3. ✅ 地面干净无垃圾
4. ✅ 洗手池内无污渍

---

**⚠️ 整改项目（1项）**

5. ⚠️ **洗手台台面上多了一张纸** — 建议立即清理，保持台面整洁

---

**综合评分：** ⭐⭐⭐⭐ 4.0 / 5.0

**整改建议：** 请当班服务员在5分钟内完成台面清洁，并拍照上传确认。`;

// ─── 消息类型 ────────────────────────────────────────────────────────────────

// 培训任务卡片数据（用于扫码进入时的对话流）
interface TrainingCardData {
  taskId: string;
  taskTitle: string;
  orgName: string;
  inviterName: string;
  inviterRole: string;
  totalQuestions: number;
  deadline: string;
  description: string;
}

// 培训答题题目
interface TrainingQuestion {
  id: number;
  question: string;
  keyPoints: string[];
  hint: string;
  aiIntro: string;
}

interface TrainingIntroItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  aiReply: string;
}

interface TrainingLaunchReceiptCard {
  title: string;
  bankTitle: string;
  targetSummary: string;
  acceptedCount: number;
  pendingCount: number;
  acceptedNames: string[];
  pendingNames: string[];
}

interface TrainingLaunchCompletionCard {
  title: string;
  totalCount: number;
  completedCount: number;
  inProgressCount: number;
  pendingCount: number;
  completedNames: string[];
  inProgressNames: string[];
  pendingNames: string[];
}

interface TrainingLaunchQrCard {
  title: string;
  subtitle: string;
  targetSummary: string;
  focusSummary: string;
  tip: string;
  codeLabel: string;
}

type Message = {
  id: number;
  role: "user" | "ai";
  text?: string;
  image?: string;
  streaming?: boolean;
  followUps?: string[]; // AI回复完成后的跟进问题
  trainingCard?: TrainingCardData; // 培训任务卡片
  isQuestion?: boolean; // 是否是答题题目
  questionIdx?: number;
  isCorrect?: boolean; // 答题结果
  isTrainingDone?: boolean; // 培训完成
  trainingScore?: number;
  trainingLaunchReceiptCard?: TrainingLaunchReceiptCard;
  trainingLaunchCompletionCard?: TrainingLaunchCompletionCard;
  trainingLaunchQrCard?: TrainingLaunchQrCard;
};

interface TrainingLaunchBankOption {
  id: string;
  title: string;
  description: string;
  meta: string;
  tag: string;
}

interface TrainingLaunchMember {
  id: string;
  name: string;
  role: string;
}

interface TrainingLaunchGroup {
  id: string;
  label: string;
  hint: string;
  members: TrainingLaunchMember[];
}

const TRAINING_LAUNCH_BANKS: TrainingLaunchBankOption[] = [
  {
    id: "service-standard",
    title: "服务标准题库",
    description: "覆盖迎宾、点单、巡台、顾客投诉处理等高频服务场景。",
    meta: "12个知识点 · 适合前厅标准化训练",
    tag: "门店常用",
  },
  {
    id: "opening-closing",
    title: "开闭店流程题库",
    description: "聚焦门店开店检查、交接班、收档清场与安全巡查。",
    meta: "9个知识点 · 适合班前班后抽查",
    tag: "流程纠偏",
  },
  {
    id: "food-safety",
    title: "食品安全题库",
    description: "围绕留样、效期、冷链、清洁消杀与后厨协同规范展开。",
    meta: "10个知识点 · 适合后厨与值班经理",
    tag: "风险优先",
  },
];

const TRAINING_LAUNCH_GROUPS: TrainingLaunchGroup[] = [
  {
    id: "front-service",
    label: "前厅服务组",
    hint: "门店层级 · 服务礼仪与顾客接待",
    members: [
      { id: "S1", name: "曹敏", role: "服务员" },
      { id: "S2", name: "李明", role: "服务员" },
      { id: "S5", name: "赵强", role: "服务员" },
    ],
  },
  {
    id: "kitchen-pass",
    label: "后厨出品组",
    hint: "门店层级 · 食品安全与出品流程",
    members: [
      { id: "S3", name: "张华", role: "厨师" },
      { id: "S6", name: "陈静", role: "厨师" },
    ],
  },
  {
    id: "cashier-greeting",
    label: "收银与迎宾组",
    hint: "门店层级 · 高峰接待与收银操作",
    members: [
      { id: "S4", name: "王芳", role: "收银员" },
      { id: "S7", name: "刘宁", role: "迎宾" },
    ],
  },
];

// ─── 店铺信息采集弹窗 ────────────────────────────────────────────────────────
type StoreType = "快餐" | "正餐" | "火锅" | "烧烤" | "奶茶" | "其他";
type AreaRange = "50㎡以下" | "50-100㎡" | "100-300㎡" | "300㎡以上";
type StaffRange = "1-5人" | "6-15人" | "16-30人" | "30人以上";
interface StoreInfo { name: string; address: string; type: StoreType | ""; area: AreaRange | ""; staff: StaffRange | ""; }
const STORE_TYPES: StoreType[] = ["快餐", "正餐", "火锅", "烧烤", "奶茶", "其他"];
const AREA_RANGES: AreaRange[] = ["50㎡以下", "50-100㎡", "100-300㎡", "300㎡以上"];
const STAFF_RANGES: StaffRange[] = ["1-5人", "6-15人", "16-30人", "30人以上"];

function StoreInfoModal({ open, onClose, triggerLabel }: { open: boolean; onClose: () => void; triggerLabel: string }) {
  const [info, setInfo] = React.useState<StoreInfo>({ name: "", address: "", type: "", area: "", staff: "" });
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [showCall, setShowCall] = React.useState(false);
  const isComplete = info.name && info.address && info.type && info.area && info.staff;

  const handleSubmit = () => {
    if (!isComplete) { toast.error("请填写完整的店铺信息"); return; }
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1500);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setInfo({ name: "", address: "", type: "", area: "", staff: "" }); setSubmitted(false); setShowCall(false); }, 400);
  };

  if (!open) return null;

  const ChipGroup = <T extends string>({ options, value, onChange }: { options: T[]; value: T | ""; onChange: (v: T) => void }) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)} style={{
          padding: "5px 13px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer",
          background: value === opt ? "linear-gradient(135deg, #ff9a3c, #e8750a)" : "rgba(255,255,255,0.8)",
          color: value === opt ? "#fff" : "#5a4a6a",
          border: value === opt ? "none" : "1px solid rgba(200,190,220,0.5)",
          boxShadow: value === opt ? "0 2px 8px rgba(232,117,10,0.25)" : "none",
          transition: "all 0.15s",
        }}>{opt}</button>
      ))}
    </div>
  );

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 200,
      background: "rgba(30,20,50,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "flex-end",
    }} onClick={e => { if (e.target === e.currentTarget) handleClose(); }}>
      <div style={{
        width: "100%", maxHeight: "88%",
        background: "linear-gradient(170deg, #fdf4ec 0%, #f8eefc 50%, #ede8f8 100%)",
        borderRadius: "20px 20px 0 0",
        boxShadow: "0 -8px 40px rgba(100,80,140,0.18)",
        display: "flex", flexDirection: "column",
        animation: "slideUp 0.32s cubic-bezier(0.32,0.72,0,1)",
      }}>
        {/* 横条 */}
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(150,130,180,0.3)" }}/>
        </div>
        {/* 头部 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 18px 10px" }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#2d2040" }}>
              {submitted ? "✅ 申请已提交" : `『${triggerLabel}』需要了解您的店铺`}
            </div>
            <div style={{ fontSize: 12.5, color: "#9a8aaa", marginTop: 2 }}>
              {submitted ? "顾问将2小时内与您联系" : "填写信息，获取14天全功能免费试用"}
            </div>
          </div>
          <button onClick={handleClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9a8aaa" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* 内容区（可滚动） */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 18px 24px" }}>
          {!submitted ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* 店铺名称 */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#5a4a6a", marginBottom: 6 }}>店铺名称 <span style={{ color: "#e8750a" }}>*</span></div>
                <input
                  value={info.name}
                  onChange={e => setInfo(p => ({ ...p, name: e.target.value }))}
                  placeholder="例如：小王火锅店"
                  style={{
                    width: "100%", padding: "10px 13px", borderRadius: 12, fontSize: 14,
                    background: "rgba(255,255,255,0.85)", border: "1px solid rgba(220,210,240,0.5)",
                    color: "#2d2040", outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
              {/* 经营地址 */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#5a4a6a", marginBottom: 6 }}>经营地址 <span style={{ color: "#e8750a" }}>*</span></div>
                <input
                  value={info.address}
                  onChange={e => setInfo(p => ({ ...p, address: e.target.value }))}
                  placeholder="例如：北京市朝阳区建国路88号"
                  style={{
                    width: "100%", padding: "10px 13px", borderRadius: 12, fontSize: 14,
                    background: "rgba(255,255,255,0.85)", border: "1px solid rgba(220,210,240,0.5)",
                    color: "#2d2040", outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
              {/* 店铺类型 */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#5a4a6a", marginBottom: 6 }}>店铺类型 <span style={{ color: "#e8750a" }}>*</span></div>
                <ChipGroup options={STORE_TYPES} value={info.type} onChange={(v: StoreType) => setInfo(p => ({ ...p, type: v }))} />
              </div>
              {/* 店铺面积 */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#5a4a6a", marginBottom: 6 }}>店铺面积 <span style={{ color: "#e8750a" }}>*</span></div>
                <ChipGroup options={AREA_RANGES} value={info.area} onChange={(v: AreaRange) => setInfo(p => ({ ...p, area: v }))} />
              </div>
              {/* 员工数量 */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#5a4a6a", marginBottom: 6 }}>员工数量 <span style={{ color: "#e8750a" }}>*</span></div>
                <ChipGroup options={STAFF_RANGES} value={info.staff} onChange={(v: StaffRange) => setInfo(p => ({ ...p, staff: v }))} />
              </div>
              {/* 权益说明 */}
              <div style={{
                background: "rgba(255,154,60,0.1)", borderRadius: 12, padding: "10px 13px",
                border: "1px solid rgba(255,154,60,0.2)",
              }}>
                <div style={{ fontSize: 12.5, color: "#c45e00", fontWeight: 600, marginBottom: 4 }}>14天全功能免费试用包含：</div>
                <div style={{ fontSize: 12, color: "#d4845a", lineHeight: 1.7 }}>✅ 工资日结 · ✅ AI巡检 · ✅ 服务质检 · ✅ 智能对讲 · ✅ 碎片化培训</div>
              </div>
              {/* 按鈕区 */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  onClick={handleSubmit}
                  disabled={!isComplete || submitting}
                  style={{
                    width: "100%", padding: "13px", borderRadius: 22, fontSize: 15.5, fontWeight: 700,
                    background: isComplete ? "linear-gradient(135deg, #ff9a3c, #e8750a)" : "rgba(200,190,210,0.5)",
                    color: isComplete ? "#fff" : "#aaa",
                    border: "none", cursor: isComplete ? "pointer" : "not-allowed",
                    boxShadow: isComplete ? "0 4px 16px rgba(232,117,10,0.3)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {submitting ? "提交中...…" : "申请全功能免费试用"}
                </button>
                <button
                  onClick={() => setShowCall(true)}
                  style={{
                    width: "100%", padding: "11px", borderRadius: 22, fontSize: 14, fontWeight: 600,
                    background: "rgba(255,255,255,0.8)", color: "#e8750a",
                    border: "1.5px solid rgba(232,117,10,0.3)", cursor: "pointer",
                  }}
                >
                  📞 直接和顾问电话沟通，更快更直接
                </button>
              </div>
            </div>
          ) : (
            /* 提交成功界面 */
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0" }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "linear-gradient(135deg, #ff9a3c, #e8750a)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 16, boxShadow: "0 8px 24px rgba(232,117,10,0.3)",
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#2d2040", marginBottom: 6 }}>申请已提交！</div>
              <div style={{ fontSize: 13.5, color: "#9a8aaa", textAlign: "center", lineHeight: 1.6, marginBottom: 20 }}>
                您的店铺信息已收到<br/>智爱客顾问将2小时内与您联系
              </div>
              <div style={{
                background: "rgba(255,255,255,0.85)", borderRadius: 14, padding: "12px 16px",
                width: "100%", marginBottom: 16,
                border: "1px solid rgba(220,210,240,0.4)",
              }}>
                <div style={{ fontSize: 12.5, color: "#9a8aaa", marginBottom: 8 }}>您的店铺信息</div>
                {[["店铺名称", info.name], ["店铺类型", info.type], ["店铺面积", info.area], ["员工数量", info.staff]].map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid rgba(220,210,240,0.3)" }}>
                    <span style={{ fontSize: 13, color: "#7a6a8a" }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#2d2040" }}>{v}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowCall(true)}
                style={{
                  width: "100%", padding: "13px", borderRadius: 22, fontSize: 15, fontWeight: 700,
                  background: "linear-gradient(135deg, #ff9a3c, #e8750a)",
                  color: "#fff", border: "none", cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(232,117,10,0.3)",
                }}
              >
                📞 一键电话和顾问沟通
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 电话和顾问弹窗 */}
      {showCall && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 300,
          background: "rgba(30,20,50,0.5)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setShowCall(false)}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: "28px 24px",
            width: "80%", textAlign: "center",
            boxShadow: "0 16px 48px rgba(100,80,140,0.2)",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📞</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#2d2040", marginBottom: 6 }}>智爱客客服热线</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#e8750a", margin: "12px 0" }}>400-888-8888</div>
            <div style={{ fontSize: 13, color: "#9a8aaa", marginBottom: 20 }}>7×12小时在线服务</div>
            <a href="tel:4008888888" style={{
              display: "block", padding: "12px", borderRadius: 22,
              background: "linear-gradient(135deg, #ff9a3c, #e8750a)",
              color: "#fff", fontSize: 15, fontWeight: 700,
              textDecoration: "none", marginBottom: 10,
              boxShadow: "0 4px 16px rgba(232,117,10,0.3)",
            }}>立即拨打</a>
            <button onClick={() => setShowCall(false)} style={{
              width: "100%", padding: "10px", borderRadius: 22,
              background: "none", border: "1px solid rgba(200,190,220,0.5)",
              color: "#9a8aaa", fontSize: 14, cursor: "pointer",
            }}>取消</button>
          </div>
        </div>
      )}
    </div>
  );
}

interface HomePageProps {
  userPhone: string;
  onLogout: () => void;
  onOpenVideo?: () => void;
  isLoggedIn?: boolean;
  stage?: 1 | 2 | 3;
  onRequestLogin?: (trigger?: string) => void;
  onEnterStage3?: () => void;
   onOpenProduct?: () => void;
  onOpenCurrentTask?: (tab?: string) => void;
  onOpenDailySalary?: () => void;
  onOpenInspection?: () => void;
  onOpenAiMenu?: () => void;
  onOpenStoreAiModel?: () => void;
  onOpenGroupAiModel?: () => void;
  onOpenTraining?: () => void;
  onOpenTrainingConversation?: () => void;
  onOpenOrgTree?: () => void;
  fromTrainingScan?: boolean; // 从培训二维码扫码进入
  onExitTrainingScan?: () => void; // 退出扫码培训模式
}
export default function HomePage({ userPhone, onLogout, onOpenVideo, isLoggedIn = true, stage = 2, onRequestLogin, onEnterStage3, onOpenProduct, onOpenCurrentTask, onOpenDailySalary, onOpenInspection, onOpenAiMenu, onOpenStoreAiModel, onOpenGroupAiModel, onOpenTraining, onOpenTrainingConversation, onOpenOrgTree, fromTrainingScan = false, onExitTrainingScan }: HomePageProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [sectionOpen, setSectionOpen] = useState(true);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isVoiceHolding, setIsVoiceHolding] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatMode, setChatMode] = useState(false); // 是否进入对话模式
  const [msgFeedback, setMsgFeedback] = useState<Record<number, "like" | "dislike" | null>>({});
  const [speakingMsgId, setSpeakingMsgId] = useState<number | null>(null);
  const [expertIndex, setExpertIndex] = useState(0); // 当前展示的专家形象索引
  const [storeModal, setStoreModal] = useState<{ open: boolean; label: string }>({ open: false, label: "" });
  const openStoreModal = (label: string) => setStoreModal({ open: true, label });
  const [pendingImage, setPendingImage] = useState<string | null>(null); // 待发送的图片

  // ── 扫码培训模式状态 ──
  const [showTrainingRegister, setShowTrainingRegister] = useState(false);
  const [trainingRegistered, setTrainingRegistered] = useState(false);
  const [trainingRegisteredName, setTrainingRegisteredName] = useState("");
  const [trainingActiveTask, setTrainingActiveTask] = useState<TrainingCardData | null>(null);
  const [trainingQIdx, setTrainingQIdx] = useState(0);
  const [trainingAttempts, setTrainingAttempts] = useState(0);
  const [trainingIsActive, setTrainingIsActive] = useState(false);
  const [trainingIsFeedback, setTrainingIsFeedback] = useState(false);
  const [trainingShowHint, setTrainingShowHint] = useState(false);
  const [trainingIsThinking, setTrainingIsThinking] = useState(false);
  const [trainingRegisterRelation, setTrainingRegisterRelation] = useState<"downward" | "upward" | null>(null);
  const [trainingRegisterPosition, setTrainingRegisterPosition] = useState("");
  const [trainingRegisterCustomPosition, setTrainingRegisterCustomPosition] = useState("");
  const [trainingLaunchStep, setTrainingLaunchStep] = useState<0 | 1 | 2 | 3>(0);
  const [selectedTrainingBankId, setSelectedTrainingBankId] = useState<string | null>(null);
  const [selectedTrainingTargets, setSelectedTrainingTargets] = useState<Set<string>>(new Set(TRAINING_LAUNCH_GROUPS.flatMap(group => group.members.map(member => member.id))));
  const [trainingTargetQuickKey, setTrainingTargetQuickKey] = useState<"all" | "group" | "management" | "store-manager" | "other" | null>("all");
  const [trainingLaunchIntent, setTrainingLaunchIntent] = useState("");
  const [trainingLaunchGoal, setTrainingLaunchGoal] = useState("");
  const [trainingLaunchUploadedFiles, setTrainingLaunchUploadedFiles] = useState<Array<{ name: string; sizeLabel: string }>>([]);
  const [trainingTargetPickerOpen, setTrainingTargetPickerOpen] = useState(false);
  const trainingLaunchUploadRef = React.useRef<HTMLInputElement>(null);
  const trainingMsgIdRef = React.useRef(10000);

  // 培训 Mock 数据
  const TRAINING_INVITE_CARD: TrainingCardData = {
    taskId: "T-2024-001",
    taskTitle: "茶水区服务标准培训",
    orgName: "海底捞北京朝阳门店",
    inviterName: "王建长",
    inviterRole: "店长",
    totalQuestions: 5,
    deadline: "2024-04-20",
    description: "本次培训涵盖茶水区台面清洁标准、服务礼仪要点、顾客投诉处理流程等核心知识点，预计完成时间 10 分钟。",
  };

  const getTrainingIntroSummary = (_task: TrainingCardData) => {
    return "10分钟陪你练熟关键动作，学完上手更稳，面对顾客也更有底气。";
  };

  const TRAINING_INTRO_ITEMS: TrainingIntroItem[] = [
    {
      id: "goal",
      badge: "目标",
      title: "培训目标",
      subtitle: "掌握茶水区服务标准、接待礼仪与异常处理动作。",
      aiReply: `这次培训主要帮助你掌握 3 个重点：
1. 茶水区台面与设备的日常标准
2. 顾客点餐过程中的服务礼仪
3. 顾客投诉出现时的第一响应动作`,
    },
    {
      id: "method",
      badge: "方式",
      title: "培训方式",
      subtitle: `通过 AI 对话答题完成，共 ${TRAINING_INVITE_CARD.totalQuestions} 道题，支持语音或文字作答。`,
      aiReply: `你将通过 AI 对话完成本次培训，共 ${TRAINING_INVITE_CARD.totalQuestions} 道题。每道题都可以直接输入或按住说话回答；如果暂时没想起来，也可以先查看提示，再继续作答。`,
    },
    {
      id: "result",
      badge: "结果",
      title: "完成后收获",
      subtitle: "培训结果会自动归档，并同步到组织关系与后续任务中。",
      aiReply: `完成培训后，系统会自动记录你的学习结果，并把你的培训关系同步到 ${TRAINING_INVITE_CARD.orgName} 的组织结构中，后续新的培训任务也会继续发给你。`,
    },
  ];

  const currentTrainingTask = trainingActiveTask ?? TRAINING_INVITE_CARD;
  const currentTrainingIntroSummary = getTrainingIntroSummary(currentTrainingTask);
  const allTrainingLaunchMembers = TRAINING_LAUNCH_GROUPS.flatMap(group =>
    group.members.map(member => ({ ...member, groupId: group.id, groupLabel: group.label })),
  );
  const selectedTrainingMembers = allTrainingLaunchMembers.filter(member => selectedTrainingTargets.has(member.id));
  const selectedTrainingGroupLabels = TRAINING_LAUNCH_GROUPS.filter(group =>
    group.members.some(member => selectedTrainingTargets.has(member.id)),
  ).map(group => group.label);
  const createDefaultTrainingTargetSet = () => new Set(allTrainingLaunchMembers.map(member => member.id));
  const applyTrainingTargetQuickSelection = (key: "all" | "group" | "management" | "store-manager" | "other") => {
    setTrainingTargetQuickKey(key);

    if (key === "all") {
      setSelectedTrainingTargets(createDefaultTrainingTargetSet());
      return;
    }

    setSelectedTrainingTargets(new Set<string>());

    const tipMap: Record<"group" | "management" | "store-manager" | "other", string> = {
      group: "请在组织架构页细选集团对象",
      management: "请在组织架构页细选管理层对象",
      "store-manager": "请在组织架构页细选店长对象",
      other: "请在组织架构页细选其它对象",
    };

    if (onOpenOrgTree) onOpenOrgTree();
    else toast.info(tipMap[key]);
  };
  const trainingLaunchActive = trainingLaunchStep > 0;
  const formatTrainingUploadSize = (size: number) => {
    if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  };
  const getAutoRecommendedTrainingBank = (): TrainingLaunchBankOption | null => {
    if (!trainingLaunchActive) return null;
    if (selectedTrainingBankId === "upload-generated" && trainingLaunchUploadedFiles.length > 0) {
      const leadFile = trainingLaunchUploadedFiles[0]?.name ?? "培训资料";
      return {
        id: "upload-generated",
        title: "上传资料自动成题库",
        description: `已根据 ${leadFile}${trainingLaunchUploadedFiles.length > 1 ? ' 等资料' : ''} 自动抽取重点知识。`,
        meta: `${trainingLaunchUploadedFiles.length} 份资料 · 自动整理知识点`,
        tag: "自动生成",
      };
    }

    const keyword = `${trainingLaunchIntent} ${trainingLaunchGoal} ${selectedTrainingGroupLabels.join(' ')}`.toLowerCase();
    if (/(食品|后厨|效期|冷链|留样|消杀|卫生)/.test(keyword)) {
      return TRAINING_LAUNCH_BANKS.find(item => item.id === "food-safety") ?? TRAINING_LAUNCH_BANKS[0];
    }
    if (/(开店|闭店|交接|班前|班后|清场|巡店)/.test(keyword)) {
      return TRAINING_LAUNCH_BANKS.find(item => item.id === "opening-closing") ?? TRAINING_LAUNCH_BANKS[0];
    }
    return TRAINING_LAUNCH_BANKS.find(item => item.id === "service-standard") ?? TRAINING_LAUNCH_BANKS[0];
  };
  const selectedTrainingBank = getAutoRecommendedTrainingBank();
  const TRAINING_LAUNCH_QR_MATRIX = [
    "1111111001101",
    "1000001010101",
    "1011101011101",
    "1011101000101",
    "1011101011101",
    "1000001000001",
    "1111111011111",
    "0001000010010",
    "1110111010111",
    "1000100010001",
    "1111101110111",
    "1000001000101",
    "1011101011101",
    "1111111001111",
  ];
  const buildTrainingLaunchQrCard = (
    bankTitle: string,
    targetSummary: string,
    intentSummary: string,
  ): TrainingLaunchQrCard => ({
    title: "本次培训小程序码",
    subtitle: `扫码即可进入「${bankTitle}」`,
    targetSummary,
    focusSummary: intentSummary,
    tip: "员工扫码后即可开始培训并自动归位。",
    codeLabel: "Zeaik Training",
  });
  const buildTrainingLaunchReceiptCard = (
    members: typeof selectedTrainingMembers,
    bankTitle: string,
    targetSummary: string,
  ): TrainingLaunchReceiptCard => {
    const totalCount = members.length;
    const acceptedCount = totalCount <= 1 ? totalCount : Math.max(1, totalCount - 1);
    const pendingCount = Math.max(0, totalCount - acceptedCount);

    return {
      title: "培训接收情况",
      bankTitle,
      targetSummary,
      acceptedCount,
      pendingCount,
      acceptedNames: members.slice(0, acceptedCount).map(member => member.name),
      pendingNames: members.slice(acceptedCount).map(member => member.name),
    };
  };

  const buildTrainingLaunchCompletionCard = (
    members: typeof selectedTrainingMembers,
  ): TrainingLaunchCompletionCard => {
    const totalCount = members.length;
    const acceptedCount = totalCount <= 1 ? totalCount : Math.max(1, totalCount - 1);
    const pendingCount = Math.max(0, totalCount - acceptedCount);
    const completedCount = totalCount === 1 ? 0 : Math.min(acceptedCount, Math.max(1, Math.floor(acceptedCount / 2)));
    const inProgressCount = Math.max(0, acceptedCount - completedCount);
    const acceptedMembers = members.slice(0, acceptedCount);

    return {
      title: "培训完成情况",
      totalCount,
      completedCount,
      inProgressCount,
      pendingCount,
      completedNames: acceptedMembers.slice(0, completedCount).map(member => member.name),
      inProgressNames: acceptedMembers.slice(completedCount).map(member => member.name),
      pendingNames: members.slice(acceptedCount).map(member => member.name),
    };
  };

  const TRAINING_RELATION_OPTIONS = {
    downward: {
      label: "我是TA的下级",
      helper: "系统会按邀请人所在门店，为你自动归入对应培训组织。",
      positions: ["服务员", "迎宾", "收银员", "后厨员工"],
    },
    upward: {
      label: "我是TA的上级",
      helper: "系统会按管理关系自动归位，便于后续继续分发培训任务。",
      positions: ["店长", "值班经理", "区域督导", "运营经理"],
    },
  } as const;

  const TRAINING_QUESTIONS: TrainingQuestion[] = [
    { id: 1, question: "茶水区台面清洁的标准是什么？", keyPoints: ["台面整洁无杂物", "无垃圾无灰尘", "热水器保持100℃"], hint: "参考答案要点：\n① 台面整洁无杂物、无垃圾、无灰尘\n② 热水器开启并保持100℃\n③ 台面必须有茶叶、茶水壶", aiIntro: "好的，我们开始第一道题！" },
    { id: 2, question: "服务员在顾客点餐时应该注意哪些礼仪要点？", keyPoints: ["微笑服务", "主动推荐", "复述确认订单"], hint: "参考答案要点：\n① 保持微笑，站姿端正\n② 主动介绍招牌菜和特色菜\n③ 点餐完成后复述确认，避免出错", aiIntro: "太棒了！第一题答得很好，继续加油！" },
    { id: 3, question: "发现顾客投诉时，处理的第一步是什么？", keyPoints: ["立即道歉", "倾听诉求", "不争辩"], hint: "参考答案要点：\n① 第一时间真诚道歉，不辩解\n② 耐心倾听顾客诉求，表示理解\n③ 立即上报店长，不自行承诺赔偿", aiIntro: "你越来越厉害了！来看看第三题：" },
    { id: 4, question: "新菜品「宫保鸡丁」的主要食材和特色是什么？", keyPoints: ["花生", "鸡丁", "麻辣鲜香"], hint: "参考答案要点：\n① 主料：嫩鸡丁、花生米\n② 辅料：干辣椒、花椒\n③ 特色：麻辣鲜香，微甜，是川菜代表", aiIntro: "继续保持！来看第四题：" },
    { id: 5, question: "门店卫生检查的频率和标准是什么？", keyPoints: ["每日检查", "餐前餐后", "记录台账"], hint: "参考答案要点：\n① 每日餐前、餐后各检查一次\n② 每周大扫除一次\n③ 检查结果需记录台账，异常上报", aiIntro: "最后一题了，加油！" },
  ];

  const newTrainingMsgId = () => ++trainingMsgIdRef.current;

  // 扫码进入时推送培训任务卡片
  React.useEffect(() => {
    if (fromTrainingScan && !trainingRegistered) {
      // 清空普通对话，切换到培训会话
      setMessages([]);
      setChatMode(true);
      setTimeout(() => {
        setMessages([]);
      }, 400);
    }
  }, [fromTrainingScan]);

  // 开始培训（注册完成后调用）
  const handleTrainingStart = (name: string) => {
    setTrainingRegisteredName(name);
    setTrainingRegistered(true);
    setShowTrainingRegister(false);
    setTrainingActiveTask(TRAINING_INVITE_CARD);
    setTrainingQIdx(0);
    setTrainingAttempts(0);
    setTrainingIsActive(true);
    setTrainingIsFeedback(false);

    const q = TRAINING_QUESTIONS[0];
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: newTrainingMsgId(), role: "user", text: "立即开始" },
        { id: newTrainingMsgId(), role: "ai", text: `第 1 题：${q.question}`, isQuestion: true, questionIdx: 0 },
      ]);
    }, 300);
  };

  // 培训答题评估
  const evaluateTrainingAnswer = (answer: string) => {
    if (!trainingIsActive || !trainingActiveTask) return;
    const currentQ = TRAINING_QUESTIONS[trainingQIdx];
    if (!currentQ) return;

    setTrainingIsThinking(true);
    setMessages(prev => [...prev, { id: newTrainingMsgId(), role: "user", text: answer }]);
    setInputText("");

    setTimeout(() => {
      setTrainingIsThinking(false);
      const lowerAnswer = answer.toLowerCase();
      const matchedPoints = currentQ.keyPoints.filter(kp =>
        lowerAnswer.includes(kp.slice(0, 4)) || answer.length > 15
      );
      const isCorrect = matchedPoints.length >= Math.ceil(currentQ.keyPoints.length * 0.6) || trainingAttempts >= 2;

      const AI_CORRECT = ["非常棒！你说到了所有关键点，这道题完全掌握了！🎉", "答得很好！看来你平时工作很认真，继续保持！✨", "完全正确！这个知识点你已经掌握得很扎实了！👍"];
      const AI_PARTIAL = ["你说到了一部分关键点，还有一个细节没有提到，再想想？", "思路是对的！还差一个重要的知识点，再补充一下？"];
      const AI_WRONG = ["没关系，这道题有点难。可以点击下方「查看提示」看看参考答案。", "这个知识点确实不好记。要不要先看看提示答案？"];

      if (isCorrect) {
        setTrainingShowHint(false);
        setMessages(prev => [...prev, { id: newTrainingMsgId(), role: "ai", text: AI_CORRECT[Math.floor(Math.random() * AI_CORRECT.length)], isCorrect: true }]);
        setTimeout(() => {
          const nextIdx = trainingQIdx + 1;
          if (nextIdx < TRAINING_QUESTIONS.length) {
            setTrainingQIdx(nextIdx);
            setTrainingAttempts(0);
            const nextQ = TRAINING_QUESTIONS[nextIdx];
            setMessages(prev => [...prev,
              { id: newTrainingMsgId(), role: "ai", text: nextQ.aiIntro },
              { id: newTrainingMsgId(), role: "ai", text: `第 ${nextIdx + 1} 题：${nextQ.question}`, isQuestion: true, questionIdx: nextIdx },
            ]);
          } else {
            setTrainingIsFeedback(true);
            setMessages(prev => [...prev, {
              id: newTrainingMsgId(), role: "ai",
              text: `🎊 太厉害了！${TRAINING_INVITE_CARD.totalQuestions} 道题全部完成！

最后一个问题：**请用自己的话说说，这次培训让你印象最深的是什么？**`,
            }]);
          }
        }, 1500);
      } else {
        const newAttempts = trainingAttempts + 1;
        setTrainingAttempts(newAttempts);
        const replyText = newAttempts >= 2
          ? AI_WRONG[Math.floor(Math.random() * AI_WRONG.length)]
          : AI_PARTIAL[Math.floor(Math.random() * AI_PARTIAL.length)];
        setMessages(prev => [...prev, { id: newTrainingMsgId(), role: "ai", text: replyText }]);
      }
    }, 1200);
  };

  // 培训反馈提交
  const submitTrainingFeedback = (feedback: string) => {
    setTrainingIsThinking(true);
    setMessages(prev => [...prev, { id: newTrainingMsgId(), role: "user", text: feedback }]);
    setInputText("");
    setTimeout(() => {
      setTrainingIsThinking(false);
      const score = parseFloat((Math.min(5, Math.max(3.5, 3.8 + Math.random() * 1.0))).toFixed(1));
      setMessages(prev => [...prev,
        { id: newTrainingMsgId(), role: "ai", text: `非常感谢你的反馈！你今天的表现真的很棒！🌟` },
        { id: newTrainingMsgId(), role: "ai", text: "", isTrainingDone: true, trainingScore: score },
      ]);
      setTrainingIsActive(false);
      setTrainingIsFeedback(false);
    }, 1500);
  };

  // 培训模式下的发送（覆盖普通发送）
  const handleTrainingSend = (text?: string) => {
    const msg = (text || inputText).trim();
    if (!msg) return;
    setTrainingShowHint(false);
    if (trainingIsFeedback) {
      submitTrainingFeedback(msg);
    } else {
      evaluateTrainingAnswer(msg);
    }
  };

  const handleTrainingIntroAction = (_item: TrainingIntroItem) => {
    setChatMode(true);
    setShowTrainingRegister(true);
  };

  const startTrainingLaunchConversation = () => {
    setChatMode(true);
    setTrainingLaunchStep(1);
    setSelectedTrainingBankId(null);
    setTrainingTargetQuickKey("all");
    setSelectedTrainingTargets(createDefaultTrainingTargetSet());
    setTrainingLaunchIntent("");
    setTrainingLaunchGoal("");
    setTrainingLaunchUploadedFiles([]);
    setTrainingTargetPickerOpen(false);

    if (trainingLaunchActive) return;

    setMessages(prev => [
      ...prev,
      { id: msgIdRef.current++, role: "user", text: "发起AI培训" },
    ]);
  };

  const toggleTrainingTarget = (memberId: string) => {
    setTrainingTargetQuickKey(null);
    setSelectedTrainingTargets(prev => {
      const next = new Set(prev);
      if (next.has(memberId)) next.delete(memberId);
      else next.add(memberId);
      return next;
    });
  };

  const toggleTrainingGroup = (group: TrainingLaunchGroup) => {
    setTrainingTargetQuickKey(null);
    setSelectedTrainingTargets(prev => {
      const next = new Set(prev);
      const allSelected = group.members.every(member => next.has(member.id));
      group.members.forEach(member => {
        if (allSelected) next.delete(member.id);
        else next.add(member.id);
      });
      return next;
    });
  };

  const handleTrainingLaunchFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const nextFiles = files.map(file => ({ name: file.name, sizeLabel: formatTrainingUploadSize(file.size) }));
    setTrainingLaunchUploadedFiles(prev => [...prev, ...nextFiles].slice(0, 3));
    setSelectedTrainingBankId("upload-generated");
    setTrainingLaunchStep(3);
    setMessages(prev => [
      ...prev,
      {
        id: msgIdRef.current++,
        role: "user",
        text: `上传资料：${files.map(file => file.name).join('、')}`,
      },
      {
        id: msgIdRef.current++,
        role: "ai",
        text: "已收到资料，我会先根据文件内容自动整理题库；你也可以继续在对话里补充培训目的和培训目标。",
      },
    ]);
    event.target.value = "";
  };

  const resetTrainingLaunchFlow = () => {
    setTrainingLaunchStep(1);
    setSelectedTrainingBankId(null);
    setTrainingTargetQuickKey("all");
    setSelectedTrainingTargets(createDefaultTrainingTargetSet());
    setTrainingLaunchIntent("");
    setTrainingLaunchGoal("");
    setTrainingLaunchUploadedFiles([]);
    setTrainingTargetPickerOpen(false);
    setMessages(prev => {
      const filtered = prev.filter(
        msg => !msg.trainingLaunchReceiptCard && !msg.trainingLaunchCompletionCard && !msg.trainingLaunchQrCard,
      );

      return [
        ...filtered,
        {
          id: msgIdRef.current++,
          role: "ai",
          text: "好的，已退出当前培训发起流程。相关接收与完成卡片已收起；你可以重新选择培训对象并补充培训目的，我会重新为你整理题库。",
        },
      ];
    });
  };

  const handleSubmitTrainingTargets = () => {
    if (selectedTrainingTargets.size === 0) {
      toast.error("请先选择培训对象");
      return;
    }

    if (!trainingLaunchIntent.trim() && !trainingLaunchGoal.trim() && trainingLaunchUploadedFiles.length === 0) {
      toast.error("请描述培训目的或上传相关资料");
      return;
    }

    const summaryNames = selectedTrainingMembers.map(member => member.name).join('、');
    const recommendedBankTitle = selectedTrainingBank?.title ?? 'AI推荐题库';
    setTrainingLaunchStep(3);
    setTrainingTargetPickerOpen(false);
    setMessages(prev => [
      ...prev,
      {
        id: msgIdRef.current++,
        role: "user",
        text: `培训对象：${summaryNames || `${selectedTrainingTargets.size}人`}；培训目的：${trainingLaunchIntent || trainingLaunchGoal || '根据上传资料自动生成题库'}`,
      },
      {
        id: msgIdRef.current++,
        role: "ai",
        text: `已理解你的培训意图，我会优先生成「${recommendedBankTitle}」，并按所选对象进入后续发起流程。`,
      },
    ]);
  };

  const handleLaunchTrainingInChat = () => {
    if (selectedTrainingTargets.size === 0) {
      toast.error("请先选择培训对象");
      return;
    }

    const totalCount = selectedTrainingMembers.length;
    const summaryNames = selectedTrainingMembers.map(member => member.name).join('、');
    const targetSummary = `${summaryNames || `${totalCount}人`} · ${selectedTrainingGroupLabels.join(" / ") || "已选择"}`;
    const recommendedBankTitle = selectedTrainingBank?.title ?? "AI推荐题库";
    const receiptCard = buildTrainingLaunchReceiptCard(selectedTrainingMembers, recommendedBankTitle, targetSummary);
    const completionCard = buildTrainingLaunchCompletionCard(selectedTrainingMembers);
    const intentSummary = trainingLaunchIntent.trim() || trainingLaunchGoal.trim() || "根据上传资料自动生成题库";
    const qrCard = buildTrainingLaunchQrCard(recommendedBankTitle, targetSummary, intentSummary);

    setChatMode(true);
    setTrainingLaunchStep(0);
    setSelectedTrainingBankId(null);
    setTrainingTargetQuickKey("all");
    setSelectedTrainingTargets(createDefaultTrainingTargetSet());
    setTrainingLaunchIntent("");
    setTrainingLaunchGoal("");
    setTrainingLaunchUploadedFiles([]);
    setTrainingTargetPickerOpen(false);
    setInputText("");

    setMessages(prev => [
      ...prev,
      {
        id: msgIdRef.current++,
        role: "user",
        text: `发起培训：${summaryNames || `${totalCount}人`}；题库：${recommendedBankTitle}`,
      },
      {
        id: msgIdRef.current++,
        role: "ai",
        text: "",
        trainingLaunchQrCard: qrCard,
      },
      {
        id: msgIdRef.current++,
        role: "ai",
        text: "",
        trainingLaunchReceiptCard: receiptCard,
      },
      {
        id: msgIdRef.current++,
        role: "ai",
        text: "",
        trainingLaunchCompletionCard: completionCard,
      },
    ]);
  };

  const isTrainingConversation = fromTrainingScan || trainingRegistered || trainingIsActive || trainingIsFeedback || messages.some(
    msg => msg.trainingCard || msg.isQuestion || msg.isTrainingDone || msg.trainingLaunchReceiptCard || msg.trainingLaunchCompletionCard || msg.trainingLaunchQrCard,
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(1);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 6)  return "深夜好";
    if (h < 12) return "上午好";
    if (h < 14) return "中午好";
    if (h < 18) return "下午好";
    return "晚上好";
  };

  // 滚动到底部（新消息时滚动整个滚动容器到底）
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // 流式输出AI回复
  const streamAIReply = (fullText: string, sourceQuestion?: string) => {
    const id = msgIdRef.current++;
    setMessages(prev => [...prev, { id, role: "ai", text: "", streaming: true }]);

    let i = 0;
    const interval = setInterval(() => {
      i += Math.floor(Math.random() * 3) + 1;
      const chunk = fullText.slice(0, i);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, text: chunk } : m));
      if (i >= fullText.length) {
        clearInterval(interval);
        // 流式输出完成后，随机取 1-3 个跟进问题
        const allFollowUps = sourceQuestion
          ? (FOLLOW_UP_QUESTIONS[sourceQuestion] || DEFAULT_FOLLOW_UPS)
          : DEFAULT_FOLLOW_UPS;
        const count = Math.floor(Math.random() * 3) + 1; // 1、2、3 随机
        const shuffled = [...allFollowUps].sort(() => Math.random() - 0.5);
        const followUps = shuffled.slice(0, count);
        setMessages(prev => prev.map(m => m.id === id ? { ...m, streaming: false, followUps } : m));
      }
    }, 30);
  };

  // 发送文字消息
  const handleSend = (text?: string, clearFollowUps?: boolean) => {
    const msg = (text || inputText).trim();
    if (!msg && !pendingImage) return;
    setInputText("");
    setChatMode(true);

    // 点击追问气泡时，清除所有消息的 followUps
    if (clearFollowUps) {
      setMessages(prev => prev.map(m => ({ ...m, followUps: undefined })));
    }

    const userMsgId = msgIdRef.current++;

    if (pendingImage) {
      // 先发图片消息，再发文字消息
      const imgToSend = pendingImage;
      setPendingImage(null);
      // 第一条：图片消息
      setMessages(prev => [...prev, { id: userMsgId, role: "user", image: imgToSend }]);
      // 第二条：文字消息（如果有文字）
      if (msg) {
        const textMsgId = msgIdRef.current++;
        setMessages(prev => [...prev, { id: textMsgId, role: "user", text: msg }]);
      }
      // 逐步显示分析过程
      let stepId: number | null = null;
      PHOTO_ANALYSIS_STEPS.forEach(({ delay, text: stepText }, idx) => {
        setTimeout(() => {
          if (idx === 0) {
            stepId = msgIdRef.current++;
            setMessages(prev => [...prev, { id: stepId!, role: "ai", text: stepText, streaming: true }]);
          } else {
            setMessages(prev => prev.map(m =>
              m.id === stepId ? { ...m, text: stepText } : m
            ));
          }
          if (idx === PHOTO_ANALYSIS_STEPS.length - 1) {
            setTimeout(() => {
              setMessages(prev => prev.map(m =>
                m.id === stepId ? { ...m, streaming: false } : m
              ));
              setTimeout(() => streamAIReply(PHOTO_ANALYSIS_RESULT), 400);
            }, 600);
          }
        }, delay);
      });
      return;
    }

    setMessages(prev => [...prev, { id: userMsgId, role: "user", text: msg }]);

    // 查找对应AI回复
    const reply = AI_REPLIES[msg] ||
      `感谢您的提问！关于「${msg}」，智爱帮AI正在为您分析餐饮经营场景中的最佳解决方案。\n\n请稍候，或者您可以尝试点击下方的快捷问题获取更多信息。`;

    setTimeout(() => streamAIReply(reply, msg), 600);
  };

  // 拍照触发AI检测 - 新交互：加载图片到预览区，等待用户输入后发送
  const handleCamera = () => {
    setPendingImage(TOILET_IMG);
    setInputText("按餐饮行业标准看看这个环境有什么问题");
    setChatMode(true);
    // 聚焦输入框
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleTrainingLaunchUploadTrigger = () => {
    const simulatedIntent = "用 10 分钟完成服务标准快速培训";
    const simulatedGoal = "培训需求：让新入职服务员掌握迎宾话术、点单确认与异常情况第一时间上报流程。";

    setTrainingLaunchIntent(prev => prev.trim() || simulatedIntent);
    setTrainingLaunchGoal(prev => prev.trim() || simulatedGoal);
    setInputText(`${simulatedIntent}；${simulatedGoal}`);
    setChatMode(true);
    trainingLaunchUploadRef.current?.click();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // 语音按住说话
  const handleVoiceStart = () => setIsVoiceHolding(true);
  const handleVoiceEnd = () => {
    setIsVoiceHolding(false);
    // 模拟语音识别结果
    const voiceTexts = [
      "今天营业额怎么样？",
      "帮我分析一下翻台率",
      "服务员培训需要多久？",
    ];
    const recognized = voiceTexts[Math.floor(Math.random() * voiceTexts.length)];
    handleSend(recognized);
  };

  // 渲染消息内容（支持Markdown粗体）
  const renderText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      // 处理换行
      return part.split("\n").map((line, j) => (
        <React.Fragment key={`${i}-${j}`}>
          {j > 0 && <br/>}
          {line}
        </React.Fragment>
      ));
    });
  };

  const renderTrainingLaunchCard = () => {
    if (!trainingLaunchActive) return null;

    const hasTargets = selectedTrainingTargets.size > 0;
    const hasIntent = Boolean(trainingLaunchUploadedFiles.length > 0 || trainingLaunchIntent.trim() || trainingLaunchGoal.trim());
    const allSelected = selectedTrainingTargets.size === allTrainingLaunchMembers.length;
    const targetSummary = allSelected
      ? `全员培训 · ${allTrainingLaunchMembers.length}人`
      : hasTargets
        ? `${selectedTrainingMembers.length}人 · ${selectedTrainingMembers.map(member => member.name).slice(0, 2).join('、')}${selectedTrainingMembers.length > 2 ? '等' : ''}`
        : '暂未选择';

    return (
      <div className="flex mb-3" style={{ justifyContent: "flex-start" }}>
        <div style={{ maxWidth: "92%", display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              borderRadius: "4px 20px 20px 20px",
              overflow: "hidden",
              background: "rgba(255,255,255,0.98)",
              border: "1px solid rgba(241,214,190,0.82)",
              boxShadow: "0 10px 22px rgba(232,117,10,0.06), inset 0 1px 0 rgba(255,255,255,0.92)",
              backdropFilter: "blur(18px)",
            }}
          >
            {trainingLaunchStep !== 3 ? (
              <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 10, background: "#ffffff" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    padding: "12px",
                    borderRadius: 18,
                    border: "1px solid rgba(242,223,206,0.92)",
                    background: "linear-gradient(180deg, rgba(255,252,249,0.98) 0%, rgba(255,248,242,0.96) 100%)",
                    boxShadow: "0 8px 18px rgba(232,117,10,0.05), inset 0 1px 0 rgba(255,255,255,0.96)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                    <span style={{ fontSize: 12, color: "#8f6b47", fontWeight: 600, letterSpacing: "0.02em" }}>对象</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    {[
                      {
                        key: "all",
                        label: "全员",
                        active: trainingTargetQuickKey === "all" || allSelected,
                        onClick: () => applyTrainingTargetQuickSelection("all"),
                      },
                      {
                        key: "group",
                        label: "集团",
                        active: trainingTargetQuickKey === "group",
                        onClick: () => applyTrainingTargetQuickSelection("group"),
                      },
                      {
                        key: "management",
                        label: "管理层",
                        active: trainingTargetQuickKey === "management",
                        onClick: () => applyTrainingTargetQuickSelection("management"),
                      },
                      {
                        key: "store-manager",
                        label: "店长",
                        active: trainingTargetQuickKey === "store-manager",
                        onClick: () => applyTrainingTargetQuickSelection("store-manager"),
                      },
                      {
                        key: "other",
                        label: "其它",
                        active: trainingTargetQuickKey === "other",
                        onClick: () => applyTrainingTargetQuickSelection("other"),
                      },
                    ].map(item => (
                      <button
                        key={item.key}
                        onClick={item.onClick}
                        style={{
                          border: item.active ? "1px solid rgba(232,117,10,0.32)" : "1px solid rgba(232,117,10,0.14)",
                          borderRadius: 999,
                          padding: "5px 10px",
                          background: item.active ? "rgba(255,233,211,0.95)" : "rgba(255,255,255,0.92)",
                          color: item.active ? "#c45e00" : "#8f6b47",
                          fontSize: 12,
                          fontWeight: item.active ? 600 : 500,
                          lineHeight: 1.2,
                          flexShrink: 0,
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    padding: "12px",
                    borderRadius: 18,
                    border: "1px solid rgba(242,223,206,0.92)",
                    background: "#ffffff",
                    boxShadow: "0 8px 18px rgba(232,117,10,0.04), inset 0 1px 0 rgba(255,255,255,0.96)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#8f6b47", fontWeight: 600, letterSpacing: "0.02em" }}>内容</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", justifyContent: "flex-start" }}>
                    {[
                      { label: "资料库", onClick: () => toast.info("资料库功能即将开放") },
                      { label: "录音", onClick: () => toast.info("录音功能即将开放") },
                      { label: "上传", onClick: handleTrainingLaunchUploadTrigger },
                    ].map(action => (
                      <button
                        key={action.label}
                        onClick={action.onClick}
                        style={{
                          border: "1px solid rgba(232,117,10,0.14)",
                          borderRadius: 999,
                          padding: "5px 10px",
                          background: "rgba(255,248,241,0.96)",
                          color: "#8f6b47",
                          fontSize: 12,
                          fontWeight: 500,
                          lineHeight: 1.2,
                          flexShrink: 0,
                        }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                  {trainingLaunchUploadedFiles.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingTop: 2 }}>
                      {trainingLaunchUploadedFiles.map(file => (
                        <div
                          key={`${file.name}-${file.sizeLabel}`}
                          style={{
                            borderRadius: 999,
                            background: "rgba(255,250,245,0.98)",
                            border: "1px solid rgba(241,214,190,0.82)",
                            padding: "7px 10px",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <span style={{ fontSize: 12, color: "#000000", fontWeight: 500 }}>{file.name}</span>
                          <span style={{ fontSize: 11, color: "#6b6b6b" }}>{file.sizeLabel}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    ref={trainingLaunchUploadRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                    onChange={handleTrainingLaunchFileChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
            ) : (
              <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#2d2040" }}>培训需求已确认</div>
                <div
                  style={{
                    borderRadius: 16,
                    background: "linear-gradient(180deg, rgba(255,249,244,0.98) 0%, rgba(255,245,236,0.96) 100%)",
                    border: "1px solid rgba(255,215,182,0.85)",
                    padding: "14px",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#9b7f69" }}>培训对象</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#2d2040", marginTop: 3 }}>
                        {selectedTrainingMembers.length} 人 · {selectedTrainingGroupLabels.join(" / ") || "已选择"}
                      </div>
                      <div style={{ fontSize: 12, color: "#8d7865", marginTop: 6, lineHeight: 1.6 }}>
                        {selectedTrainingMembers.map(member => `${member.name}（${member.role}）`).join("、")}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: "#9b7f69" }}>培训目的与目标</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#2d2040", marginTop: 3 }}>
                        {trainingLaunchIntent || "根据资料自动整理培训目标"}
                      </div>
                      {trainingLaunchGoal && <div style={{ fontSize: 12, color: "#8d7865", marginTop: 6, lineHeight: 1.6 }}>{trainingLaunchGoal}</div>}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: "#9b7f69" }}>推荐题库</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#2d2040", marginTop: 3 }}>{selectedTrainingBank?.title}</div>
                      <div style={{ fontSize: 12, color: "#8d7865", marginTop: 6, lineHeight: 1.6 }}>{selectedTrainingBank?.description}</div>
                    </div>
                    {trainingLaunchUploadedFiles.length > 0 && (
                      <div>
                        <div style={{ fontSize: 12, color: "#9b7f69" }}>已上传资料</div>
                        <div style={{ fontSize: 12, color: "#8d7865", marginTop: 6, lineHeight: 1.6 }}>
                          {trainingLaunchUploadedFiles.map(file => file.name).join("、")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={resetTrainingLaunchFlow}
                    style={{
                      flex: 1,
                      borderRadius: 14,
                      border: "1px solid rgba(232,117,10,0.22)",
                      background: "rgba(255,247,239,0.98)",
                      color: "#c45e00",
                      fontSize: 13,
                      fontWeight: 700,
                      padding: "11px 12px",
                    }}
                  >
                    重新编辑
                  </button>
                  <button
                    onClick={handleLaunchTrainingInChat}
                    style={{
                      flex: 1.25,
                      borderRadius: 14,
                      border: "none",
                      background: "linear-gradient(135deg, #ff9a3c, #e8750a)",
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 700,
                      padding: "11px 12px",
                      boxShadow: "0 10px 20px rgba(232,117,10,0.2)",
                    }}
                  >
                    去发起培训
                  </button>
                </div>
              </div>
            )}
          </div>
          <span style={{ fontSize: 11, color: "#9d92aa", marginTop: -4, marginLeft: 8 }}>刚刚</span>
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{
        height: "100%",
        background: "linear-gradient(170deg, #fdf4ec 0%, #f8eefc 35%, #ede8f8 65%, #e8eaf5 100%)",
      }}
    >
      {/* ── 抽屉遮罩 ── */}
      {drawerOpen && (
        <div
          className="absolute inset-0 z-40"
          style={{ background: "rgba(40,20,60,0.32)", backdropFilter: "blur(3px)" }}
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ── 抽屉「我的」 ── */}
      <div
        className="absolute top-0 left-0 bottom-0 z-50"
        style={{
          width: "82%",
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        <DrawerPage
          userPhone={userPhone}
          onClose={() => setDrawerOpen(false)}
          onLogout={onLogout}
          onOpenTrainingConversation={() => {
            setDrawerOpen(false);
            onOpenTrainingConversation?.();
          }}
        />
      </div>

      {/* ── 状态栏 ── */}
      <div className="flex items-center justify-between px-5 pt-3 pb-0" style={{ fontSize: 15, fontWeight: 600, color: "#2d2040" }}>
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <svg width="15" height="11" viewBox="0 0 16 12" fill="none">
            <rect x="0" y="5" width="3" height="7" rx="1" fill="#2d2040" opacity="0.35"/>
            <rect x="4.5" y="3" width="3" height="9" rx="1" fill="#2d2040" opacity="0.6"/>
            <rect x="9" y="1" width="3" height="11" rx="1" fill="#2d2040" opacity="0.85"/>
            <rect x="13.5" y="0" width="2.5" height="12" rx="1" fill="#2d2040"/>
          </svg>
          <svg width="15" height="11" viewBox="0 0 24 18" fill="none">
            <path d="M12 4C15.5 4 18.5 5.5 20.5 8L22.5 6C19.9 3.1 16.2 1.5 12 1.5S4.1 3.1 1.5 6L3.5 8C5.5 5.5 8.5 4 12 4Z" fill="#2d2040" opacity="0.35"/>
            <path d="M12 8C14.2 8 16.2 8.9 17.7 10.4L19.7 8.4C17.6 6.3 14.9 5 12 5S6.4 6.3 4.3 8.4L6.3 10.4C7.8 8.9 9.8 8 12 8Z" fill="#2d2040" opacity="0.65"/>
            <path d="M12 12C13.1 12 14.1 12.4 14.8 13.2L16.8 11.2C15.5 9.8 13.8 9 12 9S8.5 9.8 7.2 11.2L9.2 13.2C9.9 12.4 10.9 12 12 12Z" fill="#2d2040"/>
            <circle cx="12" cy="16" r="2" fill="#2d2040"/>
          </svg>
          <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
            <div style={{ width: 22, height: 11, border: "1.5px solid #2d2040", borderRadius: 3, padding: "1.5px 2px", display: "flex", alignItems: "center" }}>
              <div style={{ width: "75%", height: "100%", background: "#4caf50", borderRadius: 1.5 }}/>
            </div>
            <div style={{ width: 2, height: 5, background: "#2d2040", borderRadius: "0 1px 1px 0", opacity: 0.6 }}/>
          </div>
        </div>
      </div>

      {/* ── 顶部导航 ── */}
      <div className="flex items-center justify-between px-4 py-2" style={{ position: "relative", zIndex: 10 }}>
        {/* 左：汉堡菜单 */}
        <button onClick={() => setDrawerOpen(true)} style={{ padding: 6, background: "none", border: "none" }}>
          <IcMenu />
        </button>

        {/* 右：官方网站 + 更多 */}
        <div className="flex items-center gap-1">
          <a
            href="https://www.zeaik.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "rgba(255,255,255,0.75)",
              border: "1.2px solid rgba(232,117,10,0.25)",
              borderRadius: 20, padding: "5px 12px",
              fontSize: 14, color: "#e8750a", fontWeight: 600,
              backdropFilter: "blur(8px)",
              boxShadow: "0 1px 6px rgba(232,117,10,0.12)",
              textDecoration: "none",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e8750a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            官方网站
          </a>
          <button onClick={() => toast.info("更多功能即将开放")} style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "rgba(255,255,255,0.55)", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <IcMore />
          </button>
        </div>
      </div>

      {/* 专家形象层已移入滚动容器内的 Hero 区，此处留空 */}

      {/* ── 统一滚动区：Hero + 今日经营 + 对话消息 ── */}
      <div
        ref={scrollAreaRef}
        style={{ flex: 1, overflowY: "auto", minHeight: 0 }}
      >

      {/* ── Hero 区：问候文字(左) + 专家形象(右，随滚动流) ── */}
      <div className="relative px-5" style={{ height: 108, overflow: "visible" }}>
        {/* 左侧问候文字 */}
        <div style={{
          position: "absolute",
          left: 20, right: "42%",
          top: 0, bottom: 0,
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "flex-start",
        }}>
          <div style={{
            fontSize: 20, fontWeight: 800, lineHeight: 1.4,
            background: "linear-gradient(90deg, #e8750a 0%, #ff9a3c 50%, #c45e00 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            {getGreeting()} ✨
          </div>
          <div style={{ fontSize: 20, color: "#9a8aaa", marginTop: 2, fontWeight: 500 }}>
            呵护生意，静待花开
          </div>
        </div>
        {/* 右侧专家形象（随滚动流，点击切换） */}
        <div
          onClick={() => {}}
          style={{
            position: "absolute",
            right: 0, bottom: -24,
            width: "31%", height: 116,
            cursor: "pointer", userSelect: "none",
            zIndex: 10,
          }}
        >
          {EXPERT_IMGS.map((expert, i) => (
            <img
              key={i}
              src={expert.src}
              alt={expert.name}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: expert.objectPosition || "bottom center",
                filter: "drop-shadow(0 4px 16px rgba(232,117,10,0.18))",
                opacity: i === expertIndex ? 1 : 0,
                transition: "opacity 0.35s ease",
                pointerEvents: "none",
                transform: `translateY(${expert.offsetY}px) scale(${(expert as any).scale ?? 1})`,
                transformOrigin: "top center",
              }}
            />
          ))}

        </div>
      </div>

      {/* ── 今日经营卡片 ── */}
      {!trainingLaunchActive && (
        <div
          className="mx-3 mt-2 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 4px 20px rgba(100,80,140,0.08), 0 1px 4px rgba(0,0,0,0.04)",
            border: "1px solid rgba(220,210,240,0.4)",
            position: "relative", zIndex: 30,
            overflow: "hidden",
          }}
        >

            {isTrainingConversation ? (
              <>
                {/* 培训介绍卡 */}
                <div className="mx-3 mt-2.5 mb-2 rounded-xl p-2.5" style={{
                  background: "rgba(255,250,244,0.96)",
                  boxShadow: "0 2px 8px rgba(232,117,10,0.10)",
                  border: "1px solid rgba(255,186,120,0.42)",
                }}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 2.5, height: 22 }}>
                        {[48, 72, 60, 82].map((h, i) => (
                          <div key={i} style={{
                            width: 5,
                            height: `${h}%`,
                            background: `rgba(232,117,10,${0.32 + i * 0.12})`,
                            borderRadius: 3,
                          }}/>
                        ))}
                      </div>
                      <div>
                        <div style={{ fontSize: 14.5, fontWeight: 700, color: "#2d2040" }}>{currentTrainingTask.taskTitle}</div>
                        <div style={{ fontSize: 12, color: "#9a8a76", marginTop: 1, lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{currentTrainingIntroSummary}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleTrainingIntroAction(TRAINING_INTRO_ITEMS[1])}
                      style={{
                        background: "linear-gradient(135deg, #ff9a3c, #e8750a)",
                        border: "none", borderRadius: 16,
                        padding: "5px 11px", color: "#fff",
                        fontSize: 13.5, fontWeight: 600,
                        whiteSpace: "nowrap",
                        boxShadow: "0 2px 8px rgba(232,117,10,0.3)",
                      }}
                    >
                      立即开始
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 经营数据卡 */}
                <div className="mx-3 mt-2.5 mb-2 rounded-xl p-2.5" style={{
                  background: "rgba(255,255,255,0.85)",
                  boxShadow: "0 2px 8px rgba(100,80,140,0.06)",
                  border: "1px solid rgba(220,210,240,0.3)",
                }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 2.5, height: 22 }}>
                        {[55, 80, 45, 90, 65].map((h, i) => (
                          <div key={i} style={{
                            width: 5, height: `${h}%`,
                            background: `rgba(232,117,10,${0.25 + i * 0.16})`,
                            borderRadius: 3,
                          }}/>
                        ))}
                      </div>
                      <div>
                        <div style={{ fontSize: 14.5, fontWeight: 700, color: "#2d2040" }}>问题清单</div>
                        <div style={{ fontSize: 12, color: "#9a8aaa", marginTop: 1 }}>AI总结员工工作执行问题</div>
                      </div>
                    </div>
                    <button
                      onClick={() => openStoreModal("去查看")}
                      style={{
                        background: "linear-gradient(135deg, #ff9a3c, #e8750a)",
                        border: "none", borderRadius: 16,
                        padding: "5px 11px", color: "#fff",
                        fontSize: 13.5, fontWeight: 600,
                        boxShadow: "0 2px 8px rgba(232,117,10,0.3)",
                      }}
                    >
                      去查看
                    </button>
                  </div>
                </div>

                {/* 问题列表：点击后联动发送到对话 */}
                <div className="px-3 pb-2 flex flex-col gap-1.5">
                  {QUICK_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      id={`zeaik-question-item-${i + 1}`}
                      data-testid={`zeaik-question-item-${i + 1}`}
                      onClick={() => handleSend(q.text)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 9,
                        padding: "8px 11px",
                        background: "rgba(255,255,255,0.85)",
                        border: "1px solid rgba(220,210,240,0.3)",
                        borderRadius: 11,
                        textAlign: "left",
                        boxShadow: "0 1px 6px rgba(100,80,140,0.05)",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,248,240,1)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.96)")}
                    >
                      {/* 问题图标 */}
                      <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                        {q.icon}
                      </div>
                      <span style={{ flex: 1, fontSize: 14, color: "#2d2040", fontWeight: 500 }}>{q.text}</span>
                      <IcArrow />
                    </button>
                  ))}
                </div>
              </>
            )}

            {!isTrainingConversation && (
              <>
                {/* 功能卡片行 */}
                <div
                  id="zeaik-home-action-row"
                  data-testid="zeaik-home-action-row"
                  className="flex gap-2 px-3 pb-2.5"
                >
                  <button
                    id="zeaik-home-video-entry"
                    data-testid="zeaik-home-video-entry"
                    aria-label="一分钟看明白"
                    onClick={() => onOpenVideo ? onOpenVideo() : toast.info("视频功能即将开放")}
                    style={{
                      flex: 1, borderRadius: 11, padding: "8px 10px",
                      background: "linear-gradient(135deg, rgba(200,230,255,0.7) 0%, rgba(180,215,255,0.6) 100%)",
                      border: "none", backdropFilter: "blur(8px)",
                      display: "flex", alignItems: "center", gap: 8,
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: "rgba(255,255,255,0.85)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 5px rgba(26,107,191,0.12)",
                    }}>
                      <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                        <path d="M1 1l8 5-8 5V1z" fill="#1a6bbf"/>
                      </svg>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1a6bbf", whiteSpace: "nowrap" }}>一分钟看明白</div>
                      <div style={{ fontSize: 10.5, color: "#5a9fd4", marginTop: 1, whiteSpace: "nowrap" }}>了解AI如何赋能餐饮</div>
                    </div>
                  </button>
                  <button
                    id="zeaik-home-training-entry"
                    data-testid="zeaik-home-training-entry"
                    aria-label="9.9元餐饮AI培训"
                    onClick={() => (isLoggedIn ? startTrainingLaunchConversation() : onRequestLogin?.("碎片化培训"))}
                    style={{
                      flex: 1, borderRadius: 11, padding: "8px 10px",
                      background: "linear-gradient(135deg, rgba(255,235,200,0.7) 0%, rgba(255,220,170,0.6) 100%)",
                      border: "none", backdropFilter: "blur(8px)",
                      display: "flex", alignItems: "center", gap: 8,
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                      background: "rgba(255,255,255,0.85)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(232,117,10,0.14)",
                      fontSize: 17,
                    }}>
                      🔥
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#c45e00", whiteSpace: "nowrap" }}>9.9元餐饮AI培训</div>
                      <div style={{ fontSize: 11, color: "#d4845a", marginTop: 1, whiteSpace: "nowrap" }}>快速上手AI赚錢</div>
                    </div>
                  </button>
                </div>
              </>
            )}
        </div>
      )}
      {/* ── 对话消息区（在统一滚动容器内） ── */}
      {chatMode && (
        <div className="px-3 py-3">
          {messages.map(msg => (
            <div
              key={msg.id}
              className="flex mb-3"
              style={{ justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
            >
{/* AI头像已取消 */}

              {/* 消息气泡 + AI操作栏（蚂蚁阿福风格：操作栏融入气泡底部） */}
              <div style={{ maxWidth: "80%", display: "flex", flexDirection: "column" }}>
                {/* 气泡卡片：AI消息时包含操作栏 */}
                <div style={{
                  borderRadius: msg.role === "user" ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, #ff9a3c, #e8750a)"
                    : "rgba(255,255,255,0.95)",
                  color: msg.role === "user" ? "#fff" : "#2d2040",
                  boxShadow: msg.role === "ai"
                    ? "0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)"
                    : "0 2px 10px rgba(232,117,10,0.18)",
                  backdropFilter: "blur(12px)",
                  border: msg.role === "ai" ? "1px solid rgba(230,220,245,0.7)" : "none",
                  overflow: "hidden",
                }}>
                  {/* 气泡顶部白色高光条（AI消息） */}
                  {msg.role === "ai" && (
                    <div style={{
                      height: 1,
                      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,1) 60%, transparent 100%)",
                    }}/>
                  )}
                  {/* 消息内容 */}
                  {msg.trainingCard ? (
                    /* 培训简介卡片 */
                    <div style={{ padding: "14px 14px 0" }}>
                      <div style={{
                        borderRadius: 14,
                        padding: "14px",
                        background: "linear-gradient(180deg, rgba(255,247,238,0.98) 0%, rgba(255,255,255,0.98) 100%)",
                        border: "1px solid rgba(255,186,120,0.4)",
                        boxShadow: "0 6px 18px rgba(232,117,10,0.08)",
                        marginBottom: 14,
                      }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: "linear-gradient(135deg, #ffb066, #e8750a)",
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                            boxShadow: "0 4px 10px rgba(232,117,10,0.18)",
                          }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                              <path d="M12 3v18M4 12h16M7 7c1.6 1.4 3.1 2.1 5 2.1S15.4 8.4 17 7M7 17c1.6-1.4 3.1-2.1 5-2.1s3.4.7 5 2.1" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "#2d2040" }}>{msg.trainingCard.taskTitle}</div>
                            <div style={{ fontSize: 13, color: "#6f6254", marginTop: 2, lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {getTrainingIntroSummary(msg.trainingCard)}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                          <div style={{ padding: "9px 10px", background: "rgba(255,255,255,0.9)", borderRadius: 10, border: "1px solid rgba(255,214,179,0.8)" }}>
                            <div style={{ fontSize: 11.5, color: "#e8750a", fontWeight: 700, marginBottom: 3 }}>培训目标</div>
                            <div style={{ fontSize: 12.5, color: "#4f4135", lineHeight: 1.5 }}>掌握茶水区台面清洁标准、服务礼仪要点，以及顾客投诉时的第一响应动作。</div>
                          </div>
                          <div style={{ padding: "9px 10px", background: "rgba(255,255,255,0.9)", borderRadius: 10, border: "1px solid rgba(255,214,179,0.8)" }}>
                            <div style={{ fontSize: 11.5, color: "#e8750a", fontWeight: 700, marginBottom: 3 }}>培训方式</div>
                            <div style={{ fontSize: 12.5, color: "#4f4135", lineHeight: 1.5 }}>共 {msg.trainingCard.totalQuestions} 道题，支持文字或语音作答；答题过程中可查看提示并继续完成培训。</div>
                          </div>
                          <div style={{ padding: "9px 10px", background: "rgba(255,255,255,0.9)", borderRadius: 10, border: "1px solid rgba(255,214,179,0.8)" }}>
                            <div style={{ fontSize: 11.5, color: "#e8750a", fontWeight: 700, marginBottom: 3 }}>完成结果</div>
                            <div style={{ fontSize: 12.5, color: "#4f4135", lineHeight: 1.5 }}>完成后将同步培训记录至 {msg.trainingCard.orgName}，由 {msg.trainingCard.inviterName} 发起的邀请会自动归档到对应组织。</div>
                          </div>
                        </div>

                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                          <span style={{ padding: "3px 8px", background: "rgba(232,117,10,0.1)", borderRadius: 10, fontSize: 11, color: "#c96a12", fontWeight: 600 }}>
                            📝 {msg.trainingCard.totalQuestions} 道题
                          </span>
                          <span style={{ padding: "3px 8px", background: "rgba(232,117,10,0.1)", borderRadius: 10, fontSize: 11, color: "#c96a12", fontWeight: 600 }}>
                            ⏰ 截止 {msg.trainingCard.deadline}
                          </span>
                          <span style={{ padding: "3px 8px", background: "rgba(232,117,10,0.1)", borderRadius: 10, fontSize: 11, color: "#c96a12", fontWeight: 600 }}>
                            👤 {msg.trainingCard.inviterName} 邀请
                          </span>
                        </div>

                        {!trainingRegistered && (
                          <button
                            onClick={() => {
                              setTrainingRegisterRelation(null);
                              setTrainingRegisterPosition("");
                              setTrainingRegisterCustomPosition("");
                              setShowTrainingRegister(true);
                            }}
                            style={{
                              width: "100%", padding: "11px",
                              background: "linear-gradient(135deg, #ff9a3c, #e8750a)",
                              border: "none", borderRadius: 10,
                              color: "#fff", fontSize: 15, fontWeight: 700,
                              cursor: "pointer",
                              boxShadow: "0 4px 16px rgba(232,117,10,0.28)",
                            }}
                          >
                            立即开始
                          </button>
                        )}
                        {trainingRegistered && (
                          <div style={{
                            width: "100%", padding: "11px",
                            background: "rgba(34,197,94,0.12)",
                            border: "1px solid rgba(34,197,94,0.3)",
                            borderRadius: 10, color: "#16a34a",
                            fontSize: 14, fontWeight: 600, textAlign: "center",
                          }}>
                            ✅ 已注册，培训进行中
                          </div>
                        )}
                      </div>
                    </div>
                  ) : msg.trainingLaunchQrCard ? (
                    <div style={{ padding: "8px 10px 10px" }}>
                      <div style={{
                        borderRadius: 13,
                        padding: "10px",
                        background: "linear-gradient(180deg, rgba(255,251,246,0.98) 0%, rgba(255,255,255,0.98) 100%)",
                        border: "1px solid rgba(241,214,190,0.92)",
                        boxShadow: "0 4px 14px rgba(232,117,10,0.08)",
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 8,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
                          <div style={{
                            width: 86,
                            height: 86,
                            padding: 7,
                            borderRadius: 12,
                            background: "#fff",
                            border: "1px solid rgba(226,213,199,0.9)",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.96)",
                            display: "grid",
                            gridTemplateColumns: "repeat(14, 1fr)",
                            gap: 1.5,
                            flexShrink: 0,
                          }}>
                            {TRAINING_LAUNCH_QR_MATRIX.flatMap((row, rowIndex) =>
                              row.split("").map((cell, cellIndex) => (
                                <div
                                  key={`${rowIndex}-${cellIndex}`}
                                  style={{
                                    borderRadius: 1.5,
                                    background: cell === "1" ? "#1f1f1f" : "transparent",
                                  }}
                                />
                              )),
                            )}
                          </div>
                          <div style={{ minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, paddingRight: 6 }}>
                            <div style={{ fontSize: 12.5, color: "#5b4739", lineHeight: 1.38, fontWeight: 600, whiteSpace: "nowrap" }}>{msg.trainingLaunchQrCard.focusSummary}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "flex-end", flexShrink: 0, paddingBottom: 2 }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 999, background: "rgba(232,117,10,0.12)", color: "#c45e00", fontSize: 11, fontWeight: 700, lineHeight: 1.2 }}>
                            <span
                              aria-hidden="true"
                              style={{
                                width: 14,
                                height: 14,
                                borderRadius: 999,
                                background: "#07c160",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 6.5C5.96243 6.5 3.5 8.52944 3.5 11.0323C3.5 12.4486 4.29174 13.713 5.52942 14.5382L5.03024 16.8277C4.95983 17.1508 5.2959 17.4066 5.58482 17.2472L8.11654 15.8504C8.40407 15.9006 8.69885 15.9274 9 15.9274C12.0376 15.9274 14.5 13.898 14.5 11.3952C14.5 8.89235 12.0376 6.8629 9 6.8629V6.5Z" fill="white"/>
                                <path d="M15.2 8.8C18.067 8.8 20.4 10.6449 20.4 12.9248C20.4 14.2112 19.6534 15.3595 18.4724 16.1205L18.9036 18.0969C18.9682 18.3933 18.6613 18.6279 18.3955 18.4811L16.2005 17.2702C15.8757 17.329 15.5418 17.36 15.2 17.36C12.3331 17.36 10 15.5151 10 13.2352C10 10.9554 12.3331 9.11048 15.2 9.11048V8.8Z" fill="white" opacity="0.92"/>
                              </svg>
                            </span>
                            <span>转发</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : msg.trainingLaunchReceiptCard ? (
                    <div style={{ padding: "12px" }}>
                      <div style={{
                        borderRadius: 13,
                        padding: "12px",
                        background: "linear-gradient(180deg, rgba(255,247,238,0.98) 0%, rgba(255,255,255,0.98) 100%)",
                        border: "1px solid rgba(255,186,120,0.42)",
                        boxShadow: "0 4px 14px rgba(232,117,10,0.08)",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                          <div style={{ fontSize: 14.5, fontWeight: 700, color: "#2d2040" }}>{msg.trainingLaunchReceiptCard.title}</div>
                          <div style={{ padding: "4px 8px", borderRadius: 999, background: "rgba(34,197,94,0.12)", color: "#15803d", fontSize: 11, fontWeight: 700 }}>
                            已发出
                          </div>
                        </div>
                        <div style={{ fontSize: 12.5, color: "#6f6254", lineHeight: 1.5, marginBottom: 9 }}>
                          {msg.trainingLaunchReceiptCard.bankTitle} · {msg.trainingLaunchReceiptCard.targetSummary}
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 9 }}>
                          <span style={{ padding: "4px 8px", borderRadius: 999, background: "rgba(34,197,94,0.12)", color: "#15803d", fontSize: 11, fontWeight: 700 }}>
                            已接收 {msg.trainingLaunchReceiptCard.acceptedCount}
                          </span>
                          <span style={{ padding: "4px 8px", borderRadius: 999, background: "rgba(245,158,11,0.12)", color: "#b45309", fontSize: 11, fontWeight: 700 }}>
                            待接收 {msg.trainingLaunchReceiptCard.pendingCount}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: "#4f4135", lineHeight: 1.5 }}>
                          {msg.trainingLaunchReceiptCard.pendingNames.length
                            ? `待接收：${msg.trainingLaunchReceiptCard.pendingNames.join("、")}`
                            : `已全部接收：${msg.trainingLaunchReceiptCard.acceptedNames.join("、")}`}
                        </div>
                      </div>
                    </div>
                  ) : msg.trainingLaunchCompletionCard ? (
                    <div style={{ padding: "12px" }}>
                      <div style={{
                        borderRadius: 13,
                        padding: "12px",
                        background: "linear-gradient(180deg, rgba(239,247,255,0.98) 0%, rgba(255,255,255,0.98) 100%)",
                        border: "1px solid rgba(168,206,255,0.58)",
                        boxShadow: "0 4px 14px rgba(26,107,191,0.08)",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                          <div style={{ fontSize: 14.5, fontWeight: 700, color: "#1a3760" }}>{msg.trainingLaunchCompletionCard.title}</div>
                          <div style={{ fontSize: 11.5, fontWeight: 700, color: "#1a6bbf" }}>
                            {msg.trainingLaunchCompletionCard.completedCount}/{msg.trainingLaunchCompletionCard.totalCount}
                          </div>
                        </div>
                        <div style={{ marginBottom: 9 }}>
                          <div style={{ height: 7, borderRadius: 999, background: "rgba(26,107,191,0.12)", overflow: "hidden" }}>
                            <div style={{ width: `${Math.max(8, (msg.trainingLaunchCompletionCard.completedCount / Math.max(1, msg.trainingLaunchCompletionCard.totalCount)) * 100)}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #59a5ff, #1a6bbf)" }} />
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 9 }}>
                          <span style={{ padding: "4px 8px", borderRadius: 999, background: "rgba(34,197,94,0.12)", color: "#15803d", fontSize: 11, fontWeight: 700 }}>
                            完成 {msg.trainingLaunchCompletionCard.completedCount}
                          </span>
                          <span style={{ padding: "4px 8px", borderRadius: 999, background: "rgba(59,130,246,0.12)", color: "#1d4ed8", fontSize: 11, fontWeight: 700 }}>
                            学习中 {msg.trainingLaunchCompletionCard.inProgressCount}
                          </span>
                          <span style={{ padding: "4px 8px", borderRadius: 999, background: "rgba(245,158,11,0.12)", color: "#b45309", fontSize: 11, fontWeight: 700 }}>
                            未接收 {msg.trainingLaunchCompletionCard.pendingCount}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: "#38506b", lineHeight: 1.5 }}>
                          {msg.trainingLaunchCompletionCard.completedNames.length
                            ? `已完成：${msg.trainingLaunchCompletionCard.completedNames.join("、")}`
                            : "目前还没有员工完成培训"}
                        </div>
                      </div>
                    </div>
                  ) : msg.isTrainingDone ? (
                    /* 培训完成卡片 */
                    <div style={{ padding: "16px 14px" }}>
                      <div style={{ textAlign: "center", marginBottom: 12 }}>
                        <div style={{ fontSize: 36, marginBottom: 4 }}>🎊</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a2e" }}>培训完成！</div>
                        <div style={{ fontSize: 13, color: "#6a7a9a", marginTop: 4 }}>你已完成「{trainingActiveTask?.taskTitle}」</div>
                      </div>
                      <div style={{
                        background: "linear-gradient(135deg, #1a6bbf, #0d4fa0)",
                        borderRadius: 14, padding: "14px",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 12,
                      }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{msg.trainingScore}</div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>综合得分</div>
                        </div>
                        <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.25)" }}/>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 20, fontWeight: 800, color: "#ffd700" }}>
                            {"★".repeat(Math.round(msg.trainingScore || 4))}{"☆".repeat(5 - Math.round(msg.trainingScore || 4))}
                          </div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
                            {(msg.trainingScore || 4) >= 4.5 ? "优秀" : (msg.trainingScore || 4) >= 4 ? "良好" : "合格"}
                          </div>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: "#6a7a9a", textAlign: "center" }}>
                        培训记录已同步至 {trainingActiveTask?.orgName}
                      </div>
                    </div>
                  ) : (
                    /* 普通消息内容 */
                    <div style={{ padding: msg.image ? "4px" : "10px 13px", fontSize: 15.5, lineHeight: 1.6 }}>
                      {msg.image ? (
                        <img
                          src={msg.image}
                          alt="上传图片"
                          style={{ width: 180, height: 135, objectFit: "cover", borderRadius: 12 }}
                        />
                      ) : (
                        <span>
                          {renderText(msg.text || "")}
                          {msg.streaming && (
                            <span style={{
                              display: "inline-block", width: 8, height: 14,
                              background: "#e8750a", borderRadius: 2,
                              marginLeft: 2, verticalAlign: "middle",
                              animation: "blink 0.8s step-end infinite",
                            }}/>
                          )}
                        </span>
                      )}
                    </div>
                  )}

                  {/* 培训答题辅助按钮（仅答题气泡 + 答错后显示） */}
                  {msg.isQuestion && trainingIsActive && !trainingIsFeedback && trainingAttempts > 0 && msg.questionIdx === trainingQIdx && (
                    <div style={{ display: "flex", gap: 8, padding: "0 14px 10px", justifyContent: "flex-end" }}>
                      <button
                        onClick={() => setTrainingShowHint(h => !h)}
                        style={{
                          padding: "6px 12px", borderRadius: 16,
                          background: "none", border: "1.5px dashed #e8750a",
                          color: "#e8750a", fontSize: 12.5, fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {trainingShowHint ? "收起提示" : "查看提示"}
                      </button>
                      <button
                        onClick={() => {
                          const nextIdx = trainingQIdx + 1;
                          setMessages(prev => [...prev,
                            { id: newTrainingMsgId(), role: "user", text: "跳过此题" },
                            { id: newTrainingMsgId(), role: "ai", text: `已跳过「第 ${trainingQIdx + 1} 题」，跳过不计分，建议课后复习。` },
                          ]);
                          if (nextIdx < TRAINING_QUESTIONS.length) {
                            setTrainingQIdx(nextIdx);
                            setTrainingAttempts(0);
                            setTrainingShowHint(false);
                            const nextQ = TRAINING_QUESTIONS[nextIdx];
                            setTimeout(() => {
                              setMessages(prev => [...prev,
                                { id: newTrainingMsgId(), role: "ai", text: nextQ.aiIntro },
                                { id: newTrainingMsgId(), role: "ai", text: `第 ${nextIdx + 1} 题：${nextQ.question}`, isQuestion: true, questionIdx: nextIdx },
                              ]);
                            }, 800);
                          } else {
                            setTrainingIsFeedback(true);
                            setTimeout(() => {
                              setMessages(prev => [...prev, {
                                id: newTrainingMsgId(), role: "ai",
                                text: `🎊 所有题目已完成！

最后一个问题：**请用自己的话说说，这次培训让你印象最深的是什么？**`,
                              }]);
                            }, 800);
                          }
                        }}
                        style={{
                          padding: "6px 12px", borderRadius: 16,
                          background: "none", border: "1.5px dashed #9a8aaa",
                          color: "#9a8aaa", fontSize: 12.5, fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        跳过此题
                      </button>
                    </div>
                  )}
                  {/* 培训提示答案展开区 */}
                  {msg.isQuestion && trainingShowHint && msg.questionIdx === trainingQIdx && (
                    <div style={{
                      margin: "0 14px 12px",
                      padding: "10px 12px",
                      background: "rgba(232,117,10,0.06)",
                      border: "1px solid rgba(232,117,10,0.2)",
                      borderRadius: 10,
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#e8750a", marginBottom: 4 }}>💡 参考提示</div>
                      <div style={{ fontSize: 12.5, color: "#5a4a6a", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                        {TRAINING_QUESTIONS[trainingQIdx]?.hint}
                      </div>
                    </div>
                  )}
                  {/* AI 操作栏：融入气泡底部 */}
                  {msg.role === "ai" && !msg.streaming && !msg.trainingCard && !msg.isTrainingDone && (
                    <>
                      {/* 分隔线 */}
                      <div style={{
                        height: 1, marginLeft: 10, marginRight: 10,
                        background: "linear-gradient(90deg, transparent, rgba(200,185,225,0.35), transparent)",
                      }}/>
                      {/* 操作按钮行 + AI提示 */}
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "6px 10px 7px",
                      }}>
                        {/* 左侧：操作按钮 */}
                        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                          {/* 语音播放 */}
                          <button
                            onClick={() => {
                              setSpeakingMsgId(speakingMsgId === msg.id ? null : msg.id);
                              toast.info(speakingMsgId === msg.id ? "已停止播放" : "语音播放功能即将开放");
                            }}
                            title="语音播放"
                            style={{
                              width: 30, height: 26, borderRadius: 6, border: "none",
                              background: speakingMsgId === msg.id ? "rgba(232,117,10,0.1)" : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              cursor: "pointer", transition: "background 0.15s",
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M11 5L6 9H2v6h4l5 4V5z" fill={speakingMsgId === msg.id ? "#e8750a" : "#b0a0c0"}/>
                              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke={speakingMsgId === msg.id ? "#e8750a" : "#b0a0c0"} strokeWidth="1.8" strokeLinecap="round"/>
                              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke={speakingMsgId === msg.id ? "#e8750a" : "#cfc0df"} strokeWidth="1.8" strokeLinecap="round"/>
                            </svg>
                          </button>

                          {/* 竖分隔 */}
                          <div style={{ width: 1, height: 12, background: "rgba(200,185,225,0.5)", margin: "0 2px" }}/>

                          {/* 点赞 */}
                          <button
                            onClick={() => setMsgFeedback(f => ({ ...f, [msg.id]: f[msg.id] === "like" ? null : "like" }))}
                            title="有帮助"
                            style={{
                              width: 30, height: 26, borderRadius: 6, border: "none",
                              background: msgFeedback[msg.id] === "like" ? "rgba(34,197,94,0.1)" : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              cursor: "pointer", transition: "background 0.15s",
                            }}
                          >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M7 22V11M2 13v7a2 2 0 002 2h11.2a2 2 0 001.97-1.67l1.2-7A2 2 0 0016.4 11H13V7a2 2 0 00-2-2h0a2 2 0 00-2 2v4H7" stroke={msgFeedback[msg.id] === "like" ? "#22c55e" : "#b0a0c0"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                          </button>

                          {/* 差评 */}
                          <button
                            onClick={() => setMsgFeedback(f => ({ ...f, [msg.id]: f[msg.id] === "dislike" ? null : "dislike" }))}
                            title="没帮助"
                            style={{
                              width: 30, height: 26, borderRadius: 6, border: "none",
                              background: msgFeedback[msg.id] === "dislike" ? "rgba(239,68,68,0.1)" : "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              cursor: "pointer", transition: "background 0.15s",
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M17 2v11m5-9v7a2 2 0 01-2 2H8.8a2 2 0 01-1.97 1.67l-1.2 7A2 2 0 007.6 13H11V9a2 2 0 012-2h0a2 2 0 012 2v2h2" stroke={msgFeedback[msg.id] === "dislike" ? "#ef4444" : "#b0a0c0"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>

                          {/* 竖分隔 */}
                          <div style={{ width: 1, height: 12, background: "rgba(200,185,225,0.5)", margin: "0 2px" }}/>

                          {/* 刷新重新生成 */}
                          <button
                            onClick={() => toast.info("重新生成功能即将开放")}
                            title="重新生成"
                            style={{
                              width: 30, height: 26, borderRadius: 6, border: "none",
                              background: "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              cursor: "pointer", transition: "background 0.15s",
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M1 4v6h6" stroke="#b0a0c0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M3.51 15a9 9 0 102.13-9.36L1 10" stroke="#b0a0c0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>

                          {/* 分享 */}
                          <button
                            onClick={() => toast.info("分享功能即将开放")}
                            title="分享"
                            style={{
                              width: 30, height: 26, borderRadius: 6, border: "none",
                              background: "transparent",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              cursor: "pointer", transition: "background 0.15s",
                            }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <circle cx="18" cy="5" r="3" stroke="#b0a0c0" strokeWidth="1.8"/>
                              <circle cx="6" cy="12" r="3" stroke="#b0a0c0" strokeWidth="1.8"/>
                              <circle cx="18" cy="19" r="3" stroke="#b0a0c0" strokeWidth="1.8"/>
                              <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" stroke="#b0a0c0" strokeWidth="1.8" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>

                        {/* 右侧：AI生成提示 */}
                        <div style={{
                          fontSize: 12, color: "#c8b8d8",
                          display: "flex", alignItems: "center", gap: 2,
                        }}>
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="#c8b8d8" strokeWidth="1.8"/>
                            <path d="M12 8v4M12 16h.01" stroke="#c8b8d8" strokeWidth="1.8" strokeLinecap="round"/>
                          </svg>
                          AI生成
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* 跟进问题：紧接在AI回复气泡下方，样式完全与AI回复气泡一致 */}
                {msg.role === "ai" && !msg.streaming && msg.followUps && (
                  <div style={{ marginTop: 5, display: "flex", flexDirection: "column", gap: 4 }}>
                    {msg.followUps.map((q, qi) => (
                      <button
                        key={qi}
                        onClick={() => handleSend(q, true)}
                        style={{
                          padding: "10px 13px",
                          background: "rgba(255,255,255,0.95)",
                          border: "1px solid rgba(230,220,245,0.7)",
                          borderRadius: "4px 18px 18px 18px",
                          color: "#2d2040",
                          fontSize: 15.5,
                          fontWeight: 400,
                          lineHeight: 1.6,
                          cursor: "pointer",
                          boxShadow: "0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)",
                          textAlign: "left",
                          transition: "background 0.15s",
                          backdropFilter: "blur(12px)",
                          maxWidth: "100%",
                          width: "100%",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,240,255,0.95)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.95)")}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {renderTrainingLaunchCard()}
          <div ref={chatEndRef} />
        </div>
      )}

      {/* 统一滚动容器结束 */}
      </div>

      {/* ── 底部对话区 ── */}
      <div style={{
        background: "linear-gradient(170deg, #fdf4ec 0%, #f8eefc 35%, #ede8f8 65%, #e8eaf5 100%)",
        borderTop: "1px solid rgba(200,190,220,0.18)",
        paddingBottom: "env(safe-area-inset-bottom, 6px)",
        flexShrink: 0,
      }}>
        {/* 快捷按钮行 */}
        <div className="flex items-center pt-2.5 pb-2" style={{ gap: 0 }}>
          {/* 左侧可横向滚动的快捷功能按钮 */}
          <div
            className="flex gap-2.5 pl-4"
            style={{ overflowX: "auto", scrollbarWidth: "none", flex: 1, minWidth: 0 }}
          >
            {SHORTCUT_BTNS.map(({ Icon, label }, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!isLoggedIn && label !== "AI培训" && label !== "碎片化培训" && label !== "培训智能体") {
                    // 第一阶段：未登录，触发登录提示
                    onRequestLogin?.(label);
                  } else if (label === "工资日结") {
                    onOpenDailySalary?.();
                  } else if (label === "工作清单") {
                    onOpenCurrentTask?.();
                  } else if (label === "服务检测") {
                    onOpenCurrentTask?.("status");
                  } else if (label === "AI巡检") {
                    onOpenInspection?.();
                  } else if (label === "AI菜单") {
                    onOpenAiMenu?.();
                  } else if (label === "店面AI") {
                    onOpenStoreAiModel?.();
                  } else if (label === "集团AI") {
                    onOpenGroupAiModel?.();
                  } else if (label === "AI培训" || label === "碎片化培训" || label === "培训智能体") {
                    startTrainingLaunchConversation();
                  } else {
                    toast.info(`${label}功能即将开放`);
                  }
                }}
                style={{
                  flexShrink: 0,
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "6px 12px",
                  background: "rgba(255,255,255,0.82)",
                  border: "none",
                  borderRadius: 20,
                  fontSize: 14.5, color: "#6a5a7a", fontWeight: 500,
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(255,248,240,0.95)";
                  e.currentTarget.style.color = "#e8750a";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.82)";
                  e.currentTarget.style.color = "#6a5a7a";
                }}
              >
                <Icon />
                {label}
              </button>
            ))}
          </div>
          {/* 右侧固定「产品体验」按钮，始终可见 */}
          <div style={{ flexShrink: 0, padding: "0 10px 0 8px" }}>
            <button
              onClick={() => onOpenProduct?.()}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "6px 13px",
                background: "linear-gradient(135deg, #ff9a3c 0%, #e8750a 100%)",
                border: "none",
                borderRadius: 20,
                fontSize: 14, color: "#fff", fontWeight: 700,
                whiteSpace: "nowrap",
                boxShadow: "0 3px 10px rgba(232,117,10,0.35)",
                cursor: "pointer",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="8" height="8" rx="2" fill="#fff" opacity="0.9"/>
                <rect x="13" y="3" width="8" height="8" rx="2" fill="#fff" opacity="0.7"/>
                <rect x="3" y="13" width="8" height="8" rx="2" fill="#fff" opacity="0.7"/>
                <rect x="13" y="13" width="8" height="8" rx="2" fill="#fff" opacity="0.5"/>
              </svg>
              产品体验
            </button>
          </div>
        </div>

        {/* 图片预览区（拍照后显示） */}
        {pendingImage && (
          <div style={{
            padding: "10px 12px 6px",
            display: "flex", gap: 10, alignItems: "flex-start",
          }}>
            {/* 已选图片 */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <img
                src={pendingImage}
                alt="待检测图片"
                style={{
                  width: 72, height: 72, borderRadius: 12,
                  objectFit: "cover",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
                  display: "block",
                }}
              />
              <button
                onClick={() => { setPendingImage(null); setInputText(""); }}
                style={{
                  position: "absolute", top: -6, right: -6,
                  width: 20, height: 20, borderRadius: "50%",
                  background: "#2d2040", border: "2px solid #fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", padding: 0,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            {/* 添加更多图片（虚线占位） */}
            <div style={{
              width: 72, height: 72, borderRadius: 12,
              border: "1.5px dashed #c8b8d8",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(255,255,255,0.6)",
              flexShrink: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8b8d8" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
          </div>
        )}

        {/* 输入框行 */}
        <div className="flex items-center gap-2 px-3 pb-2.5">
          {/* 左侧：语音/键盘切换按钮 */}
          <button
            onClick={() => setIsVoiceMode(!isVoiceMode)}
            style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "rgba(255,255,255,0.82)",
              border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {isVoiceMode ? <IcKeyboard /> : <IcMic />}
          </button>

          {/* 中间：输入框 or 语音按钮 */}
          {isVoiceMode ? (
            /* 语音模式：按住说话按钮 */
            <button
              onMouseDown={handleVoiceStart}
              onMouseUp={handleVoiceEnd}
              onTouchStart={handleVoiceStart}
              onTouchEnd={handleVoiceEnd}
              style={{
                flex: 1, height: 44,
                background: isVoiceHolding
                  ? "linear-gradient(135deg, #ff9a3c, #e8750a)"
                  : "rgba(255,255,255,0.88)",
                border: "none", borderRadius: 22,
                fontSize: 16, fontWeight: 600,
                color: isVoiceHolding ? "#fff" : "#6a5a7a",
                boxShadow: isVoiceHolding
                  ? "0 4px 16px rgba(232,117,10,0.4)"
                  : "0 2px 12px rgba(0,0,0,0.08)",
                transition: "all 0.15s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {isVoiceHolding ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="3" fill="#fff"/>
                    <path d="M6 12c0 .5.1 1 .2 1.5M18 12c0 .5-.1 1-.2 1.5M9 6.5C9.9 5.6 10.9 5 12 5s2.1.6 3 1.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                  松开发送
                </>
              ) : (
                <>
                  <IcWave />
                  按住说话
                </>
              )}
            </button>
          ) : (
            /* 文字模式：输入框 */
            <div
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.88)",
                borderRadius: 22,
                display: "flex", alignItems: "center",
                padding: "0 6px 0 12px",
                height: 44,
                boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                border: "1px solid rgba(255,255,255,0.9)",
              }}
            >
              <input
                ref={inputRef}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && (trainingIsActive || trainingIsFeedback ? handleTrainingSend() : handleSend())}
                placeholder={isTrainingConversation && !trainingIsActive && !trainingIsFeedback ? "可先查看培训介绍，或点击任务卡片开始培训..." : "发消息或按住说话..."}
                style={{
                  flex: 1, border: "none", outline: "none",
                  background: "transparent",
                  fontSize: 15.5, color: "#2d2040",
                  caretColor: "#e8750a",
                }}
              />
              {inputText.trim() ? (
                <button
                  onClick={() => trainingIsActive || trainingIsFeedback ? handleTrainingSend() : handleSend()}
                  style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "linear-gradient(135deg, #ff9a3c, #e8750a)",
                    border: "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(232,117,10,0.35)",
                  }}
                >
                  <IcSend />
                </button>
              ) : (
                <button
                  onClick={handleCamera}
                  style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "none", border: "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <IcCamera />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 光标闪烁动画 */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* 培训注册弹层（扫码培训模式） */}
      {showTrainingRegister && (
        <div
          onClick={() => {
            setShowTrainingRegister(false);
            setTrainingRegisterRelation(null);
            setTrainingRegisterPosition("");
            setTrainingRegisterCustomPosition("");
          }}
          style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "flex-end", zIndex: 200,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
            width: "100%",
            background: "linear-gradient(180deg, rgba(255,251,246,0.98) 0%, rgba(255,246,236,0.98) 100%)",
            borderRadius: "22px 22px 0 0",
            padding: "24px 20px 32px",
            animation: "slideUp 0.3s ease",
            borderTop: "1px solid rgba(232,117,10,0.16)",
            boxShadow: "0 -12px 32px rgba(113,63,18,0.10)",
          }}>
            {/* 顶部把手 */}
            <div style={{ width: 36, height: 4, background: "rgba(232,117,10,0.22)", borderRadius: 2, margin: "0 auto 20px" }}/>
            {/* 标题 */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#2d2040" }}>注册加入培训</div>
              <div style={{ fontSize: 13, color: "#8a6f58", marginTop: 4 }}>
                由 <strong style={{ color: "#e8750a" }}>{TRAINING_INVITE_CARD.inviterName}</strong> 邀请加入 {TRAINING_INVITE_CARD.orgName}
              </div>
            </div>
            {/* 姓名输入 */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#6d4c37", marginBottom: 6 }}>你的姓名</div>
              <input
                id="training-reg-name"
                placeholder="请输入真实姓名"
                style={{
                  width: "100%", padding: "12px 14px",
                  border: "1.5px solid rgba(232,117,10,0.18)", borderRadius: 14,
                  fontSize: 15, color: "#2d2040", outline: "none",
                  boxSizing: "border-box",
                  background: "rgba(255,255,255,0.88)",
                  boxShadow: "inset 0 1px 2px rgba(232,117,10,0.04)",
                }}
              />
            </div>
            {/* 我与邀请人的关系 */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#6d4c37", marginBottom: 8 }}>我与邀请人的关系</div>
              <div style={{ display: "flex", gap: 10 }}>
                {(["downward", "upward"] as const).map((relationKey) => {
                  const option = TRAINING_RELATION_OPTIONS[relationKey];
                  const isActive = trainingRegisterRelation === relationKey;

                  return (
                    <button
                      key={relationKey}
                      id={`training-reg-rel-${relationKey}`}
                      data-testid={`training-reg-rel-${relationKey}`}
                      onClick={() => {
                        setTrainingRegisterRelation(relationKey);
                        setTrainingRegisterPosition("");
                        setTrainingRegisterCustomPosition("");
                      }}
                      style={{
                        flex: 1,
                        padding: "12px 10px",
                        background: isActive ? "rgba(232,117,10,0.12)" : "rgba(255,255,255,0.84)",
                        border: `1.5px solid ${isActive ? "#e8750a" : "rgba(232,117,10,0.16)"}`,
                        borderRadius: 14,
                        color: isActive ? "#b85d08" : "#8a6f58",
                        fontSize: 13,
                        fontWeight: isActive ? 700 : 500,
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.2s ease",
                        boxShadow: isActive ? "0 6px 16px rgba(232,117,10,0.12)" : "none",
                      }}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {trainingRegisterRelation && (
                <div
                  id="training-reg-position-panel"
                  data-testid="training-reg-position-panel"
                  style={{
                    marginTop: 12,
                    padding: 14,
                    borderRadius: 16,
                    background: "rgba(255,250,245,0.96)",
                    border: "1px solid rgba(232,117,10,0.14)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#6d4c37", marginBottom: 10 }}>你的岗位</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {[...TRAINING_RELATION_OPTIONS[trainingRegisterRelation].positions, "其它"].map((position) => {
                      const isSelected = trainingRegisterPosition === position;
                      return (
                        <button
                          key={position}
                          type="button"
                          id={`training-reg-position-${position}`}
                          data-testid={`training-reg-position-${position}`}
                          onClick={() => {
                            setTrainingRegisterPosition(position);
                            if (position !== "其它") {
                              setTrainingRegisterCustomPosition("");
                            }
                          }}
                          style={{
                            padding: "9px 12px",
                            borderRadius: 999,
                            border: `1.5px solid ${isSelected ? "#e8750a" : "rgba(232,117,10,0.16)"}`,
                            background: isSelected ? "rgba(232,117,10,0.12)" : "rgba(255,255,255,0.92)",
                            color: isSelected ? "#b85d08" : "#8a6f58",
                            fontSize: 12.5,
                            fontWeight: isSelected ? 700 : 500,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          {position}
                        </button>
                      );
                    })}
                  </div>
                  {trainingRegisterPosition === "其它" && (
                    <input
                      id="training-reg-position-custom"
                      data-testid="training-reg-position-custom"
                      placeholder="请输入岗位名称"
                      value={trainingRegisterCustomPosition}
                      onChange={(e) => setTrainingRegisterCustomPosition(e.target.value)}
                      style={{
                        width: "100%",
                        marginTop: 10,
                        padding: "12px 14px",
                        border: "1.5px solid rgba(232,117,10,0.18)",
                        borderRadius: 14,
                        fontSize: 14,
                        color: "#2d2040",
                        outline: "none",
                        boxSizing: "border-box",
                        background: "rgba(255,255,255,0.9)",
                        boxShadow: "inset 0 1px 2px rgba(232,117,10,0.04)",
                      }}
                    />
                  )}
                </div>
              )}
            </div>
            {/* 确认按钮 */}
            <button
              onClick={() => {
                const nameEl = document.getElementById("training-reg-name") as HTMLInputElement;
                const name = nameEl?.value?.trim() || "新员工";
                handleTrainingStart(name);
              }}
              style={{
                width: "100%", padding: "13px",
                background: "linear-gradient(135deg, #ff9a3c, #e8750a)",
                border: "none", borderRadius: 14,
                color: "#fff", fontSize: 16, fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(232,117,10,0.26)",
                marginBottom: 10,
              }}
            >
              开始培训
            </button>
          </div>
        </div>
      )}

      {/* 店铺信息采集弹窗 */}
      <StoreInfoModal
        open={storeModal.open}
        onClose={() => setStoreModal({ open: false, label: storeModal.label })}
        triggerLabel={storeModal.label}
      />
    </div>
  );
}
