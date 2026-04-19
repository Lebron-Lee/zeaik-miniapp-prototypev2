/**
 * CurrentTaskPage.tsx
 * 复刻墨刀原型「首页-当前任务」页面
 * 三个Tab：当前工作 / 任务状态（待执行+已完成分组）/ 任务大厅（计划任务列表）
 * 设计提醒：培训流程已迁移到当前工作页内部，需保持蓝白工作台风格，不再沿用首页培训卡片主题。
 */
import React, { useRef, useState } from "react";
import TaskDrawerPage from "./TaskDrawerPage";
import { TRAINING_TASKS, type TrainingTask as DrawerTrainingTask } from "./DrawerPage";

// ── 当前工作数据 ──
interface Task {
  id: number;
  time: string;
  isNow: boolean;
  name: string;
  code: string;
  canSubmit: boolean;
  isTraining?: boolean;
}

const CURRENT_TASKS: Task[] = [
  { id: 1, time: "09:30", isNow: true, name: "维也纳门前过道清理", code: "BZ-2301", canSubmit: true },
  { id: 2, time: "09:45", isNow: true, name: "公共厕所洗手台清理", code: "BZ-1020", canSubmit: true },
  { id: 3, time: "10:00", isNow: false, name: "切土豆丝", code: "BZ-8301", canSubmit: false },
  { id: 4, time: "10:30", isNow: false, name: "切牛肉块", code: "BZ-1412", canSubmit: false },
  { id: 5, time: "11:30", isNow: false, name: "备桌-凯德麓语", code: "BZ-2195", canSubmit: false },
  { id: 6, time: "12:30", isNow: false, name: "翻台-大厅A区A1", code: "BZ-9677", canSubmit: false },
  { id: 7, time: "", isNow: false, name: "学习培训", code: "BZ-0011", canSubmit: false, isTraining: true },
];

// ── 任务状态数据 ──
interface StatusTask {
  id: number;
  seq: number;
  time: string;
  name: string;
  code: string;
  sourceTask: DrawerTrainingTask;
  hasView?: boolean;
}

const PENDING_TASKS: StatusTask[] = TRAINING_TASKS
  .filter((task) => task.group === "我发起的")
  .map((task, index) => ({
    id: task.id,
    seq: index + 1,
    time: task.time.replace("今天 ", "").replace("昨天 ", ""),
    name: task.title,
    code: `TR-${String(task.id).padStart(4, "0")}`,
    sourceTask: task,
  }));

const JOINED_TASKS: StatusTask[] = TRAINING_TASKS
  .filter((task) => task.group === "我参加的")
  .map((task, index) => ({
    id: task.id,
    seq: index + 1,
    time: task.time.replace("今天 ", "").replace("昨天 ", ""),
    name: task.title,
    code: `TR-${String(task.id).padStart(4, "0")}`,
    sourceTask: task,
  }));


// ── 任务大厅数据 ──
interface HallTask {
  id: number;
  seq: number;
  time: string;
  name: string;
  code: string;
}

const HALL_TASKS: HallTask[] = [
  { id: 1, seq: 1, time: "09:00", name: "洗手台清理", code: "BZ-23" },
  { id: 2, seq: 2, time: "09:30", name: "烤鸭架清理", code: "BZ-10" },
  { id: 3, seq: 3, time: "10:00", name: "切土豆丝", code: "BZ-83" },
  { id: 4, seq: 4, time: "10:30", name: "切牛肉块", code: "BZ-1" },
  { id: 5, seq: 5, time: "11:30", name: "炒制-宫保鸡丁", code: "BZ-423" },
  { id: 6, seq: 6, time: "11:30", name: "收桌-凯德麓语", code: "BZ-21" },
  { id: 7, seq: 7, time: "12:30", name: "包间翻台-阳光家园", code: "BZ-90" },
  { id: 8, seq: 8, time: "12:35", name: "炒制-董府牛肋肉", code: "BZ-22" },
  { id: 9, seq: 9, time: "14:00", name: "清洗餐具", code: "LC-45" },
  { id: 10, seq: 10, time: "14:00", name: "大明虾解冻", code: "BZ-87" },
];

interface TrainingQuestion {
  id: number;
  question: string;
  aiIntro: string;
  hint: string;
  keyPoints: string[];
}

interface TrainingMessage {
  id: number;
  role: "ai" | "user";
  text: string;
  type?: "task" | "question" | "result" | "retryPrompt";
  questionIdx?: number;
  isCorrect?: boolean;
  trainingScore?: number;
}

const TRAINING_QUESTIONS: TrainingQuestion[] = [
  {
    id: 1,
    question: "顾客进店后，迎宾动作的第一步应该是什么？",
    aiIntro: "我们先从迎宾动作开始，回答越贴近门店实际越好。",
    hint: "先微笑问候，再确认人数与用餐需求。",
    keyPoints: ["微笑问候", "确认人数", "用餐需求"],
  },
  {
    id: 2,
    question: "当顾客点完单后，服务员为什么必须复述一次关键信息？",
    aiIntro: "第二题聚焦点单确认流程，尽量说出动作目的。",
    hint: "为了确认菜品、份数和特殊要求，避免出错与返工。",
    keyPoints: ["确认菜品", "确认份数", "特殊要求", "避免出错"],
  },
  {
    id: 3,
    question: "遇到异常情况时，应在多长时间内同步值班经理？",
    aiIntro: "最后一题是异常上报标准，答完就算完成本次培训。",
    hint: "第一时间同步，原则上不超过 1 分钟。",
    keyPoints: ["第一时间", "1分钟", "同步值班经理"],
  },
];

const TABS = [
  { key: "status", label: "问题清单", count: null },
  { key: "current", label: "当前工作", count: 7 },
  { key: "hall", label: "任务大厅", count: 13 },
] as const;

interface CurrentTaskPageProps {
  onBack: () => void;
  initialTab?: string;
  selectedTrainingTask?: DrawerTrainingTask | null;
  onOpenQuotaDetail?: (code: string) => void;
  onOpenTrainingDetail?: (task: DrawerTrainingTask) => void;
}

// ── 闪电图标 ──
function LightningIcon({ color = "#3B5BDB" }: { color?: string }) {
  return (
    <svg width="10" height="13" viewBox="0 0 10 13" fill="none">
      <path d="M6 1L1 7.5h4L4 12l5-6.5H5L6 1z" fill={color} />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CurrentTaskPage({ onBack, initialTab, selectedTrainingTask, onOpenQuotaDetail, onOpenTrainingDetail }: CurrentTaskPageProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab ?? "current");
  const [tasks, setTasks] = useState<Task[]>(CURRENT_TASKS);
  const [submittedIds, setSubmittedIds] = useState<number[]>([]);
  const [pendingExpanded, setPendingExpanded] = useState(true);
  const [joinedExpanded, setJoinedExpanded] = useState(true);
  const [doneExpanded, setDoneExpanded] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [trainingPanelOpen, setTrainingPanelOpen] = useState(true);
  const [trainingStarted, setTrainingStarted] = useState(false);
  const [trainingFinished, setTrainingFinished] = useState(false);
  const [trainingIsFeedback, setTrainingIsFeedback] = useState(false);
  const [trainingShowHint, setTrainingShowHint] = useState(false);
  const [trainingAttempts, setTrainingAttempts] = useState(0);
  const [trainingQuestionIndex, setTrainingQuestionIndex] = useState(0);
  const [trainingInput, setTrainingInput] = useState("");
  const [trainingMessages, setTrainingMessages] = useState<TrainingMessage[]>([
    {
      id: 1,
      role: "ai",
      text: "",
      type: "task",
    },
  ]);

  const trainingMsgIdRef = useRef(1000);
  const newTrainingMessageId = () => ++trainingMsgIdRef.current;

  const resolvedTrainingTask = selectedTrainingTask ?? {
    id: 1,
    title: "学习培训",
    time: "待安排",
    progress: "预计 10 分钟完成服务标准快速培训",
    group: "我发起的" as const,
  };
  const trainingTaskCode = `TR-${String(resolvedTrainingTask.id).padStart(4, "0")}`;
  const displayTasks = tasks.map((task) => (
    task.isTraining
      ? { ...task, name: resolvedTrainingTask.title, code: trainingTaskCode }
      : task
  ));
  const trainingTask = displayTasks.find((task) => task.isTraining) ?? displayTasks[displayTasks.length - 1];

  const handleSubmit = (taskId: number) => {
    setSubmittedIds((prev) => [...prev, taskId]);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, canSubmit: false } : t)));
  };

  const openTrainingPanel = () => {
    setActiveTab("current");
    setTrainingPanelOpen(true);
  };

  const pushMessage = (message: TrainingMessage) => {
    setTrainingMessages((prev) => [...prev, message]);
  };

  const handleStartTraining = () => {
    if (trainingStarted || trainingFinished) return;
    const firstQuestion = TRAINING_QUESTIONS[0];
    setTrainingPanelOpen(true);
    setTrainingStarted(true);
    setTrainingIsFeedback(false);
    setTrainingShowHint(false);
    setTrainingAttempts(0);
    setTrainingQuestionIndex(0);
    setTrainingMessages((prev) => [
      ...prev,
      { id: newTrainingMessageId(), role: "user", text: "立即培训" },
      {
        id: newTrainingMessageId(),
        role: "ai",
        text: `第 1 题：${firstQuestion.question}`,
        type: "question",
        questionIdx: 0,
      },
    ]);
  };

  const handleSendTrainingAnswer = () => {
    if (!trainingStarted || trainingFinished) return;
    const value = trainingInput.trim();
    if (!value) return;

    if (trainingIsFeedback) {
      setTrainingMessages((prev) => [
        ...prev,
        { id: newTrainingMessageId(), role: "user", text: value },
        {
          id: newTrainingMessageId(),
          role: "ai",
          text: "收到你的反馈啦，辛苦你认真完成整个培训！",
        },
        {
          id: newTrainingMessageId(),
          role: "ai",
          text: "",
          type: "result",
          trainingScore: 4.6,
        },
      ]);
      setTrainingInput("");
      setTrainingFinished(true);
      setTrainingIsFeedback(false);
      setTrainingShowHint(false);
      setTasks((prev) => prev.map((task) => (
        task.isTraining ? { ...task, isNow: true } : task
      )));
      return;
    }

    const currentQuestion = TRAINING_QUESTIONS[trainingQuestionIndex];
    const matchedPoints = currentQuestion.keyPoints.filter((point) => value.includes(point.slice(0, 2)) || value.includes(point));
    const isCorrect = matchedPoints.length >= Math.ceil(currentQuestion.keyPoints.length * 0.6) || value.length >= 16 || trainingAttempts >= 1;

    setTrainingMessages((prev) => [
      ...prev,
      { id: newTrainingMessageId(), role: "user", text: value },
    ]);
    setTrainingInput("");

    if (!isCorrect) {
      const nextAttempts = trainingAttempts + 1;
      setTrainingAttempts(nextAttempts);
      setTrainingMessages((prev) => [
        ...prev,
        {
          id: newTrainingMessageId(),
          role: "ai",
          text: nextAttempts >= 2 ? "这道题还差一点，你可以先查看提示，再继续补充。" : "思路是对的，但还差一个关键点，再想想？",
          type: "retryPrompt",
          questionIdx: trainingQuestionIndex,
        },
      ]);
      return;
    }

    const nextIndex = trainingQuestionIndex + 1;
    const praiseText = trainingQuestionIndex === 0 ? "答得很好，迎宾动作的关键步骤已经抓住了。" : trainingQuestionIndex === 1 ? "这题答得很稳，点单复述的目的已经说清楚了。" : "这题也完成了，异常上报意识不错。";

    if (nextIndex < TRAINING_QUESTIONS.length) {
      const nextQuestion = TRAINING_QUESTIONS[nextIndex];
      setTrainingMessages((prev) => [
        ...prev,
        { id: newTrainingMessageId(), role: "ai", text: praiseText, isCorrect: true },
        { id: newTrainingMessageId(), role: "ai", text: nextQuestion.aiIntro },
        {
          id: newTrainingMessageId(),
          role: "ai",
          text: `第 ${nextIndex + 1} 题：${nextQuestion.question}`,
          type: "question",
          questionIdx: nextIndex,
        },
      ]);
      setTrainingQuestionIndex(nextIndex);
      setTrainingAttempts(0);
      setTrainingShowHint(false);
      return;
    }

    setTrainingMessages((prev) => [
      ...prev,
      { id: newTrainingMessageId(), role: "ai", text: praiseText, isCorrect: true },
      {
        id: newTrainingMessageId(),
        role: "ai",
        text: "太棒了，最后一题。最后请简单说说这次培训对你有没有帮助？",
      },
    ]);
    setTrainingAttempts(0);
    setTrainingIsFeedback(true);
    setTrainingShowHint(false);
  };

  // ── 状态栏 + 导航栏（共用） ──
  const renderHeader = () => (
    <>
      <div style={{
        height: 44,
        background: "#3B5BDB",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        flexShrink: 0,
      }}>
        <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>12:00</span>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect x="0" y="7" width="3" height="5" rx="0.5" fill="white" />
            <rect x="4.5" y="4.5" width="3" height="7.5" rx="0.5" fill="white" />
            <rect x="9" y="2" width="3" height="10" rx="0.5" fill="white" />
            <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" fill="white" />
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <circle cx="8" cy="11" r="1.5" fill="white" />
            <path d="M4.5 8.5C5.5 7.5 6.7 7 8 7s2.5.5 3.5 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M1.5 5.5C3.2 3.8 5.5 2.8 8 2.8s4.8 1 6.5 2.7" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
          <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
            <rect x="0.5" y="0.5" width="18" height="11" rx="2.5" stroke="white" strokeOpacity="0.35" />
            <rect x="1.5" y="1.5" width="15" height="9" rx="1.5" fill="white" />
            <path d="M19.5 4v4a2 2 0 000-4z" fill="white" fillOpacity="0.4" />
          </svg>
        </div>
      </div>

      <div style={{
        height: 44,
        background: "#3B5BDB",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button onClick={() => setDrawerOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ display: "block", width: 20, height: 2, background: "#fff", borderRadius: 1 }} />
            <span style={{ display: "block", width: 20, height: 2, background: "#fff", borderRadius: 1 }} />
            <span style={{ display: "block", width: 20, height: 2, background: "#fff", borderRadius: 1 }} />
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>服务员：曹敏</span>
          <span style={{
            background: "rgba(255,255,255,0.25)",
            color: "#fff",
            fontSize: 11,
            padding: "1px 6px",
            borderRadius: 10,
          }} />
        </div>
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="white" strokeWidth="1.8" />
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="white" strokeWidth="1.8" />
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="white" strokeWidth="1.8" />
            <rect x="5" y="5" width="3" height="3" fill="white" />
            <rect x="16" y="5" width="3" height="3" fill="white" />
            <rect x="5" y="16" width="3" height="3" fill="white" />
            <path d="M14 14h3v3h-3z" fill="white" />
            <path d="M18 14h3v3h-3z" fill="white" />
            <path d="M14 18h3v3h-3z" fill="white" />
            <path d="M18 18h3v3h-3z" fill="white" />
          </svg>
        </button>
      </div>
    </>
  );

  const renderTrainingPanel = () => {
    if (!trainingPanelOpen) return null;

    return (
      <div style={{ marginTop: 12, marginBottom: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {trainingMessages.map((message) => {
            if (message.type === "task") {
              return (
                <div key={message.id} style={{ background: "#EEF2FF", borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", padding: "12px 14px", gap: 8, background: "#fff", borderRadius: 14, border: "1px solid rgba(59,91,219,0.1)", boxShadow: "0 1px 3px rgba(59,91,219,0.06)" }}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#E8EAED", color: "#666", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{trainingTask.id}</span>
                  <span style={{ width: 40, fontSize: 12, color: "#666", flexShrink: 0 }}>{resolvedTrainingTask.time}</span>
                  <span style={{ flex: 1, fontSize: 13.5, color: "#1A1A1A", fontWeight: 500 }}>{trainingTask.name}</span>
                  <button
                    onClick={handleStartTraining}
                    style={{ background: "#3B5BDB", color: "#fff", border: "none", borderRadius: 14, padding: "4px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}
                  >
                    {trainingStarted ? (trainingFinished ? "已完成" : "继续培训") : "立即培训"}
                  </button>
                  </div>
                </div>
              );
            }

            if (message.type === "result") {
              return (
                <div key={message.id} style={{ padding: "16px 14px" }}>
                  <div style={{ textAlign: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 36, marginBottom: 4 }}>🎊</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a2e" }}>培训完成！</div>
                    <div style={{ fontSize: 12, color: "#6a7a9a", marginTop: 4 }}>你已完成「{trainingTask.name}」</div>
                  </div>
                  <div style={{
                    background: "linear-gradient(135deg, #1a6bbf, #0d4fa0)",
                    borderRadius: 14,
                    padding: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    marginBottom: 12,
                  }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{message.trainingScore ?? 4.6}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>综合得分</div>
                    </div>
                    <div style={{ width: 1, height: 36, background: "rgba(255,255,255,0.25)" }} />
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#ffd700" }}>{"★".repeat(Math.round(message.trainingScore ?? 4.6))}{"☆".repeat(5 - Math.round(message.trainingScore ?? 4.6))}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{(message.trainingScore ?? 4.6) >= 4.5 ? "优秀" : (message.trainingScore ?? 4.6) >= 4 ? "良好" : "合格"}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#6a7a9a", textAlign: "center" }}>培训记录已同步至当前培训任务档案</div>
                </div>
              );
            }

            const isUser = message.role === "user";
            const isCurrentQuestion = message.type === "question" && message.questionIdx === trainingQuestionIndex && !trainingFinished && !trainingIsFeedback;
            const isRetryPrompt = message.type === "retryPrompt" && message.questionIdx === trainingQuestionIndex && !trainingFinished && !trainingIsFeedback;
            return (
              <React.Fragment key={message.id}>
                <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "80%",
                    borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                    background: isUser ? "linear-gradient(135deg, #ff9a3c, #e8750a)" : "rgba(255,255,255,0.95)",
                    color: isUser ? "#fff" : "#2d2040",
                    boxShadow: isUser
                      ? "0 2px 10px rgba(232,117,10,0.18)"
                      : "0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)",
                    backdropFilter: "blur(12px)",
                    border: isUser ? "none" : "1px solid rgba(230,220,245,0.7)",
                    overflow: "hidden",
                  }}>
                    <div style={{ padding: "10px 13px", fontSize: 12.5, lineHeight: 1.7, whiteSpace: "pre-line" }}>
                      {message.text}
                    </div>
                    {isRetryPrompt && trainingAttempts > 0 && (
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "0 13px 10px" }}>
                        <button onClick={() => setTrainingShowHint((prev) => !prev)} style={{ padding: "6px 12px", borderRadius: 16, background: "none", border: "1.5px dashed #e8750a", color: "#e8750a", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>{trainingShowHint ? "收起提示" : "查看提示"}</button>
                        <button onClick={() => {
                          const nextIndex = trainingQuestionIndex + 1;
                          setTrainingMessages((prev) => [...prev, { id: newTrainingMessageId(), role: "user", text: "跳过此题" }, { id: newTrainingMessageId(), role: "ai", text: `已跳过第 ${trainingQuestionIndex + 1} 题，建议课后回看提示再复习。` }]);
                          setTrainingShowHint(false);
                          setTrainingAttempts(0);
                          if (nextIndex < TRAINING_QUESTIONS.length) {
                            const nextQuestion = TRAINING_QUESTIONS[nextIndex];
                            setTrainingQuestionIndex(nextIndex);
                            setTrainingMessages((prev) => [...prev, { id: newTrainingMessageId(), role: "ai", text: nextQuestion.aiIntro }, { id: newTrainingMessageId(), role: "ai", text: `第 ${nextIndex + 1} 题：${nextQuestion.question}`, type: "question", questionIdx: nextIndex }]);
                          } else {
                            setTrainingIsFeedback(true);
                            setTrainingMessages((prev) => [...prev, { id: newTrainingMessageId(), role: "ai", text: "题目部分已经结束，请说说这次培训对你有没有帮助？" }]);
                          }
                        }} style={{ padding: "6px 12px", borderRadius: 16, background: "none", border: "1.5px dashed #9a8aaa", color: "#9a8aaa", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>跳过此题</button>
                      </div>
                    )}
                  </div>
                </div>
                {isRetryPrompt && trainingShowHint && (
                  <div style={{ margin: "0 14px 12px", padding: "10px 12px", background: "rgba(232,117,10,0.06)", border: "1px solid rgba(232,117,10,0.2)", borderRadius: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#e8750a", marginBottom: 4 }}>💡 参考提示</div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.7, color: "#5a4a6a" }}>{TRAINING_QUESTIONS[trainingQuestionIndex]?.hint}</div>
                  </div>
                )}
              </React.Fragment>
            );
        })}
      </div>
    );
  };

  // ── 当前工作内容 ──
  const renderCurrentWork = () => (
    <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 0" }}>
      {renderTrainingPanel()}
    </div>
  );

  // ── 任务状态内容 ──
  const renderTaskStatus = () => (
    <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 0" }}>
      <div style={{ background: "#EEF2FF", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px 10px" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>我发起的培训</span>
          <button onClick={() => setPendingExpanded(!pendingExpanded)} style={{ background: "#3B5BDB", color: "#fff", border: "none", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{pendingExpanded ? "收起" : "展开"}</button>
        </div>
        {pendingExpanded && (
          <div style={{ background: "#fff", borderRadius: "0 0 14px 14px", overflow: "hidden" }}>
            {PENDING_TASKS.map((task, index) => (
              <div key={task.id} style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderBottom: index < PENDING_TASKS.length - 1 ? "1px solid #F5F5F5" : "none", gap: 8 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#E8EAED", color: "#666", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{task.seq}</span>
                <span style={{ width: 40, fontSize: 12, color: "#666", flexShrink: 0 }}>{task.time}</span>
                <span style={{ flex: 1, fontSize: 13.5, color: "#1A1A1A", fontWeight: 500 }}>{task.name}</span>
                <button onClick={() => onOpenTrainingDetail?.(task.sourceTask)} style={{ background: "#3b5bdb", color: "#fff", border: "none", borderRadius: 14, padding: "4px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>查看</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: "#EEF2FF", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px 10px" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>我参加的培训</span>
          <button onClick={() => setJoinedExpanded(!joinedExpanded)} style={{ background: "#3B5BDB", color: "#fff", border: "none", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{joinedExpanded ? "收起" : "展开"}</button>
        </div>
        {joinedExpanded && (
          <div style={{ background: "#fff", borderRadius: "0 0 14px 14px", overflow: "hidden" }}>
            {JOINED_TASKS.map((task, index) => (
              <div key={task.id} style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderBottom: index < JOINED_TASKS.length - 1 ? "1px solid #F5F5F5" : "none", gap: 8 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#E8EAED", color: "#666", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{task.seq}</span>
                <span style={{ width: 40, fontSize: 12, color: "#666", flexShrink: 0 }}>{task.time}</span>
                <span style={{ flex: 1, fontSize: 13.5, color: "#1A1A1A", fontWeight: 500 }}>{task.name}</span>
                <button onClick={() => onOpenTrainingDetail?.(task.sourceTask)} style={{ background: "#3b5bdb", color: "#fff", border: "none", borderRadius: 14, padding: "4px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>查看</button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );

  // ── 任务大厅内容 ──
  const renderTaskHall = () => (
    <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 0" }}>
      <div style={{ background: "#EEF2FF", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: "12px 14px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>计划任务</span>
            <span style={{ fontSize: 12, color: "#888" }}>共{HALL_TASKS.length}项</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#3B5BDB", background: "#DBEAFE", padding: "2px 8px", borderRadius: 10, fontWeight: 500 }}>大厅A区</span>
              <span style={{ fontSize: 12, color: "#3B5BDB", background: "#DBEAFE", padding: "2px 8px", borderRadius: 10, fontWeight: 500 }}>大厅A区</span>
            </div>
            <span style={{ fontSize: 12, color: "#888" }}>净工时：7.5小时</span>
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: "0 0 14px 14px", overflow: "hidden" }}>
          {HALL_TASKS.map((task, index) => (
            <div key={task.id} style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderBottom: index < HALL_TASKS.length - 1 ? "1px solid #F5F5F5" : "none", gap: 8 }}>
              <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#E8EAED", color: "#666", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{task.seq}</span>
              <span style={{ width: 40, fontSize: 12, color: "#666", flexShrink: 0 }}>{task.time}</span>
              <span style={{ flex: 1, fontSize: 13.5, color: "#1A1A1A", fontWeight: 500 }}>{task.name}</span>
              <span onClick={() => onOpenQuotaDetail?.(task.code)} style={{ fontSize: 12, color: "#3B5BDB", flexShrink: 0, marginRight: 4, fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 2, cursor: "pointer" }}>{task.code}</span>
              <LightningIcon />
              <button style={{ background: "#3b5bdb", color: "#fff", border: "none", borderRadius: 14, padding: "4px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>申诉</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const trainingInputEnabled = activeTab === "current" && trainingPanelOpen && trainingStarted && !trainingFinished;
  const inputPlaceholder = trainingInputEnabled
    ? trainingIsFeedback ? "说说这次培训对你是否有帮助..." : "输入你的培训回答..."
    : activeTab === "current" && trainingPanelOpen
      ? trainingFinished ? "培训已完成，可回看本次记录" : "点击“立即培训”后在这里继续作答"
      : "说点什么...";

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#F2F3F7", fontFamily: "'PingFang SC', 'Helvetica Neue', Arial, sans-serif", overflow: "hidden" }}>
      {renderHeader()}

      {activeTab === "current" && renderCurrentWork()}
      {activeTab === "status" && renderTaskStatus()}
      {activeTab === "hall" && renderTaskHall()}

      <div style={{ height: 48, background: "#fff", borderTop: "1px solid #EBEBEB", display: "flex", alignItems: "stretch", flexShrink: 0 }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{ flex: 1, border: "none", cursor: "pointer", background: isActive ? "#EEF2FF" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, padding: 0, transition: "background 0.15s" }}
            >
              <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 400, color: isActive ? "#3B5BDB" : "#888" }}>{tab.label}</span>
              {tab.count !== null ? (
                <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? "#3B5BDB" : "#aaa", background: isActive ? "rgba(59,91,219,0.12)" : "#F0F0F0", padding: "1px 5px", borderRadius: 10, minWidth: 18, textAlign: "center" }}>{tab.count}</span>
              ) : null}
              {tab.key !== "current" && tab.count !== null ? <LightningIcon color={isActive ? "#3B5BDB" : "#ccc"} /> : null}
            </button>
          );
        })}
      </div>

      {drawerOpen && (
        <div style={{ position: "absolute", inset: 0, zIndex: 200, display: "flex" }}>
          <div onClick={() => setDrawerOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />
          <div style={{ position: "relative", zIndex: 1, width: "80%", maxWidth: 300, height: "100%", background: "#fff", overflowY: "auto", boxShadow: "4px 0 24px rgba(0,0,0,0.18)", animation: "slideInLeft 0.22s ease" }}>
            <TaskDrawerPage
              onClose={() => setDrawerOpen(false)}
              onOpenQuotaDetail={(code) => {
                setDrawerOpen(false);
                onOpenQuotaDetail?.(code);
              }}
            />
          </div>
        </div>
      )}

      <div style={{ height: 52, background: "#fff", borderTop: "1px solid #F0F0F0", display: "flex", alignItems: "center", padding: "0 12px", gap: 10, flexShrink: 0 }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="16" rx="3" stroke="#888" strokeWidth="1.5" />
            <path d="M7 9h10M7 13h6" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <div style={{ flex: 1, height: 32, background: "#F5F5F5", borderRadius: 16, display: "flex", alignItems: "center", padding: "0 12px" }}>
          <input
            value={trainingInput}
            onChange={(event) => setTrainingInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSendTrainingAnswer();
              }
            }}
            disabled={!trainingInputEnabled}
            placeholder={inputPlaceholder}
            style={{ width: "100%", border: "none", outline: "none", background: "transparent", fontSize: 13, color: trainingInputEnabled ? "#1A1A1A" : "#BBB" }}
          />
        </div>
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="8" y="2" width="8" height="13" rx="4" stroke="#888" strokeWidth="1.5" />
            <path d="M5 11a7 7 0 0014 0" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 18v4M9 22h6" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <button style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#888" strokeWidth="1.5" />
            <path d="M12 8v8M8 12h8" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <button
          onClick={handleSendTrainingAnswer}
          style={{ width: 32, height: 32, borderRadius: "50%", background: "#3B5BDB", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(59,91,219,0.35)" }}
        >
          {trainingInputEnabled && trainingInput.trim() ? <SendIcon /> : (
            <svg width="14" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="8" y="2" width="8" height="13" rx="4" fill="white" />
              <path d="M5 11a7 7 0 0014 0" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 18v4M9 22h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
