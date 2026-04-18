/**
 * CurrentTaskPage.tsx
 * 复刻墨刀原型「首页-当前任务」页面
 * 三个Tab：当前工作 / 任务状态（待执行+已完成分组）/ 任务大厅（计划任务列表）
 * 设计提醒：培训流程已迁移到当前工作页内部，需保持蓝白工作台风格，不再沿用首页培训卡片主题。
 */
import React, { useState } from "react";
import TaskDrawerPage from "./TaskDrawerPage";
import type { TrainingTask as DrawerTrainingTask } from "./DrawerPage";

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
  hasView?: boolean;
}

const PENDING_TASKS: StatusTask[] = [
  { id: 1, seq: 1, time: "11:00", name: "洗手台清洁", code: "BZ-230" },
  { id: 2, seq: 2, time: "11:20", name: "烤鸭架清理", code: "BZ-102" },
  { id: 3, seq: 3, time: "11:30", name: "切土豆块", code: "BZ-830" },
  { id: 4, seq: 4, time: "12:00", name: "切土豆丝", code: "BZ-831" },
  { id: 5, seq: 5, time: "12:30", name: "切牛肉块", code: "BZ-897" },
  { id: 6, seq: 5, time: "13:00", name: "备桌-罗奇营", code: "BZ-839" },
  { id: 7, seq: 5, time: "13:30", name: "洗手间清洁", code: "BZ-230" },
  { id: 8, seq: 5, time: "14:00", name: "清洗餐具", code: "BZ-450" },
];

const DONE_TASKS: StatusTask[] = [
  { id: 9, seq: 1, time: "10:00", name: "备桌-凯德麓语", code: "BZ-219", hasView: true },
  { id: 10, seq: 2, time: "10:20", name: "翻台-大厅A区A1", code: "BZ-967", hasView: true },
  { id: 11, seq: 3, time: "10:30", name: "大明虾解冻", code: "BZ-873" },
];

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
}

interface TrainingMessage {
  id: number;
  role: "ai" | "user";
  text: string;
  type?: "task" | "question" | "result";
}

const TRAINING_QUESTIONS: TrainingQuestion[] = [
  {
    id: 1,
    question: "顾客进店后，迎宾动作的第一步应该是什么？",
    aiIntro: "我们先从迎宾动作开始，回答越贴近门店实际越好。",
    hint: "先微笑问候，再确认人数与用餐需求。",
  },
  {
    id: 2,
    question: "当顾客点完单后，服务员为什么必须复述一次关键信息？",
    aiIntro: "第二题聚焦点单确认流程，尽量说出动作目的。",
    hint: "为了确认菜品、份数和特殊要求，避免出错与返工。",
  },
  {
    id: 3,
    question: "遇到异常情况时，应在多长时间内同步值班经理？",
    aiIntro: "最后一题是异常上报标准，答完就算完成本次培训。",
    hint: "第一时间同步，原则上不超过 1 分钟。",
  },
];

const TABS = [
  { key: "status", label: "任务状态", count: 25 },
  { key: "current", label: "当前工作", count: 7 },
  { key: "hall", label: "任务大厅", count: 13 },
] as const;

interface CurrentTaskPageProps {
  onBack: () => void;
  initialTab?: string;
  selectedTrainingTask?: DrawerTrainingTask | null;
  onOpenQuotaDetail?: (code: string) => void;
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

export default function CurrentTaskPage({ onBack, initialTab, selectedTrainingTask, onOpenQuotaDetail }: CurrentTaskPageProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab ?? "current");
  const [tasks, setTasks] = useState<Task[]>(CURRENT_TASKS);
  const [submittedIds, setSubmittedIds] = useState<number[]>([]);
  const [pendingExpanded, setPendingExpanded] = useState(true);
  const [doneExpanded, setDoneExpanded] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [trainingPanelOpen, setTrainingPanelOpen] = useState(Boolean(selectedTrainingTask));
  const [trainingStarted, setTrainingStarted] = useState(false);
  const [trainingFinished, setTrainingFinished] = useState(false);
  const [trainingQuestionIndex, setTrainingQuestionIndex] = useState(0);
  const [trainingInput, setTrainingInput] = useState("");
  const [trainingMessages, setTrainingMessages] = useState<TrainingMessage[]>([
    {
      id: 1,
      role: "ai",
      text: "你今天有 1 项服务流程培训待完成，建议在空档时间完成，培训结果会自动同步到当前工作记录。",
    },
    {
      id: 2,
      role: "ai",
      text: "",
      type: "task",
    },
  ]);

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
    if (trainingStarted) return;
    const firstQuestion = TRAINING_QUESTIONS[0];
    setTrainingPanelOpen(true);
    setTrainingStarted(true);
    pushMessage({
      id: Date.now(),
      role: "ai",
      text: `${firstQuestion.aiIntro}\n\n第 1 题：${firstQuestion.question}`,
      type: "question",
    });
  };

  const handleSendTrainingAnswer = () => {
    if (!trainingStarted || trainingFinished) return;
    const value = trainingInput.trim();
    if (!value) return;

    const currentQuestion = TRAINING_QUESTIONS[trainingQuestionIndex];
    const nextIndex = trainingQuestionIndex + 1;

    setTrainingMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: value },
    ]);
    setTrainingInput("");

    if (nextIndex < TRAINING_QUESTIONS.length) {
      const nextQuestion = TRAINING_QUESTIONS[nextIndex];
      setTrainingMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: `收到，这题我先按完成记录。参考要点：${currentQuestion.hint}\n\n${nextQuestion.aiIntro}\n\n第 ${nextIndex + 1} 题：${nextQuestion.question}`,
          type: "question",
        },
      ]);
      setTrainingQuestionIndex(nextIndex);
      return;
    }

    setTrainingMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 2,
        role: "ai",
        text: `本次培训已完成，我已为你记录本次学习结果。你的培训重点包括：迎宾动作、点单复述与异常上报。接下来这条培训任务会继续保留在“当前工作”里，方便你随时回看。`,
        type: "result",
      },
    ]);
    setTrainingFinished(true);
    setTasks((prev) => prev.map((task) => (
      task.isTraining ? { ...task, isNow: true } : task
    )));
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
      <div style={{ marginTop: 12, background: "#EAF0FF", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(59,91,219,0.08)" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid rgba(59,91,219,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1F2A5A" }}>当前培训</div>
            <div style={{ fontSize: 11.5, color: "#6B7AAE", marginTop: 2 }}>会话窗口仅保留本条培训任务</div>
          </div>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#3B5BDB", background: "rgba(255,255,255,0.7)", padding: "3px 8px", borderRadius: 999 }}>
            {trainingFinished ? "已完成" : trainingStarted ? "进行中" : "待开始"}
          </span>
        </div>

        <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 10 }}>
          {trainingMessages.map((message) => {
            if (message.type === "task") {
              return (
                <div key={message.id} style={{ background: "#fff", borderRadius: 14, padding: 14, border: "1px solid rgba(59,91,219,0.12)", boxShadow: "0 1px 3px rgba(59,91,219,0.06)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#3B5BDB", letterSpacing: 0.2 }}>培训任务</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginTop: 4 }}>{trainingTask.name}</div>
                    </div>
                    <span style={{ fontSize: 11, color: "#3B5BDB", fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 2 }}>{trainingTaskCode}</span>
                  </div>
                  <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 12, background: "#F5F8FF", color: "#50608F", fontSize: 12.5, lineHeight: 1.65 }}>
                    {`当前任务来自“${resolvedTrainingTask.group}”，最近进展为“${resolvedTrainingTask.progress}”。培训完成后会自动计入当前工作，你也可以随时回来继续本条任务。`}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: 12 }}>
                    <div style={{ fontSize: 11.5, color: "#7D8CB8" }}>会话中只展示该培训任务相关内容</div>
                    <button
                      onClick={handleStartTraining}
                      style={{ background: "#3B5BDB", color: "#fff", border: "none", borderRadius: 16, padding: "7px 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 10px rgba(59,91,219,0.22)" }}
                    >
                      {trainingStarted ? "继续培训" : "立即培训"}
                    </button>
                  </div>
                </div>
              );
            }

            const isUser = message.role === "user";
            return (
              <div key={message.id} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "86%",
                  background: isUser ? "#3B5BDB" : "#fff",
                  color: isUser ? "#fff" : "#24345F",
                  borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  padding: "10px 12px",
                  fontSize: 12.5,
                  lineHeight: 1.7,
                  whiteSpace: "pre-line",
                  boxShadow: isUser ? "0 4px 10px rgba(59,91,219,0.18)" : "0 1px 4px rgba(59,91,219,0.08)",
                  border: isUser ? "none" : "1px solid rgba(59,91,219,0.1)",
                }}>
                  {!isUser && (
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: "#3B5BDB", marginBottom: 4 }}>培训助手</div>
                  )}
                  {message.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── 当前工作内容 ──
  const renderCurrentWork = () => (
    <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 0" }}>
      <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        {displayTasks.map((task, index) => {
          const isTrainingTask = Boolean(task.isTraining);
          const actionLabel = isTrainingTask
            ? trainingFinished ? "回看" : trainingStarted ? "继续" : "进入"
            : submittedIds.includes(task.id) ? "已提交" : "申诉";

          return (
            <div
              key={task.id}
              onClick={isTrainingTask ? openTrainingPanel : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "14px 14px",
                borderBottom: index < tasks.length - 1 ? "1px solid #F0F0F0" : "none",
                gap: 8,
                background: isTrainingTask && trainingPanelOpen ? "#F5F8FF" : "transparent",
                cursor: isTrainingTask ? "pointer" : "default",
              }}
            >
              <span style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: task.isNow || isTrainingTask ? "#3B5BDB" : "#E8EAED",
                color: task.isNow || isTrainingTask ? "#fff" : "#888",
                fontSize: 11,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>{task.id}</span>
              <span style={{ width: 36, fontSize: 12, color: "#878787", fontWeight: task.isNow ? 600 : 400, flexShrink: 0, textAlign: "center" }}>{task.time || "—"}</span>
              <span style={{ flex: 1, fontSize: 14, color: "#1A1A1A", fontWeight: isTrainingTask ? 700 : 500 }}>
                {task.name}
              </span>
              <span
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenQuotaDetail?.(task.code);
                }}
                style={{ fontSize: 12, color: "#3B5BDB", marginRight: 6, flexShrink: 0, fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 2, cursor: "pointer" }}
              >
                {task.code}
              </span>
              {isTrainingTask ? (
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    openTrainingPanel();
                  }}
                  style={{ background: "#3B5BDB", color: "#fff", border: "none", borderRadius: 14, padding: "4px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}
                >
                  {actionLabel}
                </button>
              ) : task.canSubmit && !submittedIds.includes(task.id) ? (
                <button
                  onClick={() => handleSubmit(task.id)}
                  style={{ background: "#3B5BDB", color: "#fff", border: "none", borderRadius: 14, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}
                >申诉</button>
              ) : submittedIds.includes(task.id) ? (
                <span style={{ fontSize: 11, color: "#52C41A", flexShrink: 0 }}>已提交</span>
              ) : (
                <button style={{ background: "#3B5BDB", color: "#fff", border: "none", borderRadius: 14, padding: "4px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>申诉</button>
              )}
            </div>
          );
        })}
      </div>
      {renderTrainingPanel()}
    </div>
  );

  // ── 任务状态内容 ──
  const renderTaskStatus = () => (
    <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 0" }}>
      <div style={{ background: "#EEF2FF", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px 10px" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>待执行任务</span>
          <button onClick={() => setPendingExpanded(!pendingExpanded)} style={{ background: "#3B5BDB", color: "#fff", border: "none", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{pendingExpanded ? "收起" : "展开"}</button>
        </div>
        {pendingExpanded && (
          <div style={{ background: "#fff", borderRadius: "0 0 14px 14px", overflow: "hidden" }}>
            {PENDING_TASKS.map((task, index) => (
              <div key={task.id} style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderBottom: index < PENDING_TASKS.length - 1 ? "1px solid #F5F5F5" : "none", gap: 8 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#E8EAED", color: "#666", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{task.seq}</span>
                <span style={{ width: 40, fontSize: 12, color: "#666", flexShrink: 0 }}>{task.time}</span>
                <span style={{ flex: 1, fontSize: 13.5, color: "#1A1A1A", fontWeight: 500 }}>{task.name}</span>
                <span onClick={() => onOpenQuotaDetail?.(task.code)} style={{ fontSize: 12, color: "#3B5BDB", flexShrink: 0, marginRight: 4, fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 2, cursor: "pointer" }}>{task.code}</span>
                <LightningIcon />
                <button style={{ background: "#3b5bdb", color: "#fff", border: "none", borderRadius: 14, padding: "4px 10px", fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>申诉</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: "#EEF2FF", borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px 10px" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>已完成任务</span>
          <button onClick={() => setDoneExpanded(!doneExpanded)} style={{ background: "#3B5BDB", color: "#fff", border: "none", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{doneExpanded ? "收起" : "展开"}</button>
        </div>
        {doneExpanded && (
          <div style={{ background: "#fff", borderRadius: "0 0 14px 14px", overflow: "hidden" }}>
            {DONE_TASKS.map((task, index) => (
              <div key={task.id} style={{ display: "flex", alignItems: "center", padding: "12px 14px", borderBottom: index < DONE_TASKS.length - 1 ? "1px solid #F5F5F5" : "none", gap: 8 }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#E8EAED", color: "#666", fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{task.seq}</span>
                <span style={{ width: 40, fontSize: 12, color: "#666", flexShrink: 0 }}>{task.time}</span>
                <span style={{ flex: 1, fontSize: 13.5, color: "#1A1A1A", fontWeight: 500 }}>{task.name}</span>
                <span onClick={() => onOpenQuotaDetail?.(task.code)} style={{ fontSize: 12, color: "#3B5BDB", flexShrink: 0, marginRight: 4, fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 2, cursor: "pointer" }}>{task.code}</span>
                {task.hasView ? (
                  <button style={{ background: "#3B5BDB", color: "#fff", border: "none", borderRadius: 14, padding: "3px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", flexShrink: 0, marginRight: 2 }}>查看</button>
                ) : null}
                <LightningIcon />
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
    ? "输入你的培训回答..."
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
              <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? "#3B5BDB" : "#aaa", background: isActive ? "rgba(59,91,219,0.12)" : "#F0F0F0", padding: "1px 5px", borderRadius: 10, minWidth: 18, textAlign: "center" }}>{tab.count}</span>
              {tab.key !== "current" && <LightningIcon color={isActive ? "#3B5BDB" : "#ccc"} />}
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
