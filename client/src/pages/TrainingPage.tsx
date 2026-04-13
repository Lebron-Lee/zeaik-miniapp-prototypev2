/**
 * 培训智能体 · 员工端主页
 * 设计规范：橙色主题 #e8750a / #ff9a3c，白底卡片，圆角14px
 *
 * 核心设计逻辑：
 * 「无感注册」不是独立页面，而是嵌入在「接收培训任务」动作里的自然步骤。
 * 员工点击培训链接 → 检测未注册 → 弹出「加入培训」卡片（显示发起人+任务名）
 * → 2步最简注册（姓名+职位+确认上级，上级已由链接参数预填）
 * → 注册完成即直接进入答题，组织架构在后台自动构建
 */
import React, { useState } from "react";

// ── 类型定义 ──────────────────────────────────────────────────────────────────
export interface TrainingTask {
  id: string;
  title: string;
  type: "新员工" | "制度文化" | "技能" | "专项" | "自命题";
  sender: string;
  senderLevel?: string;
  totalQuestions: number;
  deadline: string;
  status: "pending" | "in_progress" | "completed";
  score?: number;
  completedAt?: string;
}

interface TrainingPageProps {
  onBack: () => void;
  onStartTask: (task: TrainingTask) => void;
  onViewReport: (task: TrainingTask) => void;
  onOpenManager: () => void;
  isManager?: boolean;
  /** 模拟通过邀请链接进入（触发无感注册弹层） */
  fromInviteLink?: boolean;
}

// ── Mock 数据 ─────────────────────────────────────────────────────────────────
const MOCK_TASKS: TrainingTask[] = [
  {
    id: "T001",
    title: "茶水区服务标准专项培训",
    type: "专项",
    sender: "王店长",
    senderLevel: "门店级·管理者",
    totalQuestions: 3,
    deadline: "今日 22:00",
    status: "pending",
  },
  {
    id: "T002",
    title: "新菜品「宫保鸡丁」知识培训",
    type: "技能",
    sender: "王店长",
    senderLevel: "门店级·管理者",
    totalQuestions: 5,
    deadline: "明日 12:00",
    status: "in_progress",
  },
  {
    id: "T003",
    title: "门店卫生制度更新培训",
    type: "制度文化",
    sender: "李区域经理",
    senderLevel: "区域级·管理者",
    totalQuestions: 4,
    deadline: "04/15 18:00",
    status: "completed",
    score: 4.2,
    completedAt: "04/11 14:30",
  },
  {
    id: "T004",
    title: "新员工入职基础培训",
    type: "新员工",
    sender: "系统",
    totalQuestions: 5,
    deadline: "04/10 18:00",
    status: "completed",
    score: 3.8,
    completedAt: "04/09 16:20",
  },
];

/** 模拟链接携带的邀请参数（实际由 URL query 解析） */
const MOCK_INVITE_CONTEXT = {
  taskId: "T001",
  taskTitle: "茶水区服务标准专项培训",
  inviterName: "王店长",
  inviterLevel: "门店级·管理者",
  orgName: "智爱客·朝阳旗舰店",
  roleHint: "服务员",
};

/** 层级顺序（用于推算下一级） */
const LEVEL_ORDER = ["集团级", "区域级", "门店级", "班组级", "员工级"];

/** 完整职位表，按层级分组 */
const JOB_OPTIONS_ALL = [
  { label: "集团总裁",   level: "集团级", roleType: "管理者" },
  { label: "集团人力总监", level: "集团级", roleType: "职能支持" },
  { label: "区域经理",   level: "区域级", roleType: "管理者" },
  { label: "人力专员",   level: "区域级", roleType: "职能支持" },
  { label: "数据分析员", level: "区域级", roleType: "职能支持" },
  { label: "店长",       level: "门店级", roleType: "管理者" },
  { label: "副店长",     level: "门店级", roleType: "管理者" },
  { label: "厨师长",     level: "门店级", roleType: "职能支持" },
  { label: "领班",     level: "班组级", roleType: "管理者" },
  { label: "服务员",     level: "员工级", roleType: "执行者" },
  { label: "收银员",     level: "员工级", roleType: "执行者" },
  { label: "厨师",       level: "员工级", roleType: "执行者" },
  { label: "传菜员",     level: "员工级", roleType: "执行者" },
  { label: "其他",       level: "员工级", roleType: "执行者" },
];

/** 根据邀请人层级，返回其下一级的职位列表（含「其他」） */
function getJobOptionsForInviterLevel(inviterLevel: string): typeof JOB_OPTIONS_ALL {
  // inviterLevel 格式如 "门店级·管理者" 或 "区域级·管理者"
  const lvLabel = inviterLevel.split("·")[0].trim();
  const idx = LEVEL_ORDER.indexOf(lvLabel);
  const nextLevel = idx >= 0 && idx < LEVEL_ORDER.length - 1
    ? LEVEL_ORDER[idx + 1]
    : LEVEL_ORDER[LEVEL_ORDER.length - 1]; // 已是最低级则保持员工级
  const filtered = JOB_OPTIONS_ALL.filter(j => j.level === nextLevel);
  // 确保「其他」始终在末尾
  const hasOther = filtered.some(j => j.label === "其他");
  if (!hasOther) filtered.push({ label: "其他", level: nextLevel, roleType: "执行者" });
  return filtered;
}

/** 模拟：与邀请人同层级的平级人员（实际由后端按层级+组织查询） */
const MOCK_PEER_SUPERIORS = [
  { id: "S1",  name: "王建国", jobTitle: "店长",     level: "门店级·管理者",  org: "北京朝阳店" },
  { id: "S2",  name: "张丽华", jobTitle: "副店长",   level: "门店级·管理者",  org: "北京朝阳店" },
  { id: "S3",  name: "陈厨师长", jobTitle: "厨师长", level: "门店级·职能支持", org: "北京朝阳店" },
  { id: "S4",  name: "刘人事", jobTitle: "人力专员", level: "门店级·职能支持", org: "北京朝阳店" },
];

const TYPE_COLOR: Record<string, { bg: string; text: string }> = {
  新员工: { bg: "#FFF3E0", text: "#E65100" },
  制度文化: { bg: "#E8EAF6", text: "#3949AB" },
  技能: { bg: "#E8F5E9", text: "#2E7D32" },
  专项: { bg: "#FFF8E1", text: "#F57F17" },
  自命题: { bg: "#F3E5F5", text: "#6A1B9A" },
};

// ── 直属上级选择器（默认收起，可展开多选） ──────────────────────────────────────────────────────────────────────────────
function SuperiorSelector({
  selectedIds,
  onToggle,
}: {
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  // 默认只显示邀请人（S1），展开后显示全部
  const visibleList = expanded ? MOCK_PEER_SUPERIORS : MOCK_PEER_SUPERIORS.slice(0, 1);
  const extraCount = MOCK_PEER_SUPERIORS.length - 1;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 13, color: "#555", fontWeight: 600 }}>直属上级</div>

      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {visibleList.map(sup => {
          const isSelected = selectedIds.includes(sup.id);
          return (
            <div
              key={sup.id}
              onClick={() => onToggle(sup.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", borderRadius: 12,
                background: isSelected ? "#F0FFF4" : "#FAFAFA",
                border: isSelected ? "1.5px solid #43A047" : "1.5px solid #E8E8E8",
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {/* 多选框 */}
              <div style={{
                width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                background: isSelected ? "#43A047" : "white",
                border: isSelected ? "none" : "1.5px solid #D0D0D0",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.15s",
              }}>
                {isSelected && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                )}
              </div>
              {/* 头像 */}
              <div style={{
                width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                background: isSelected
                  ? "linear-gradient(135deg, #43A047, #66BB6A)"
                  : "linear-gradient(135deg, #e8750a33, #ff9a3c22)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 800,
                color: isSelected ? "white" : "#e8750a",
              }}>
                {sup.name[0]}
              </div>
              {/* 信息 */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: isSelected ? "#2E7D32" : "#1A1A1A" }}>
                  {sup.name}
                  {sup.id === "S1" && (
                    <span style={{ fontSize: 10, color: "#e8750a", marginLeft: 6,
                      background: "#FFF3E0", padding: "1px 6px", borderRadius: 4 }}>邀请人</span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: "#888" }}>
                  {sup.jobTitle} · {sup.org}
                </div>
              </div>
              {isSelected && (
                <span style={{ fontSize: 10, color: "#43A047", fontWeight: 700 }}>✓ 已选</span>
              )}
            </div>
          );
        })}
      </div>
      {/* 展开/收起按钮 */}
      {extraCount > 0 && (
        <button
          onClick={() => setExpanded(v => !v)}
          style={{
            marginTop: 8, width: "100%", padding: "8px 0",
            background: "none", border: "1px dashed #E0E0E0",
            borderRadius: 10, fontSize: 12, color: "#888",
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", gap: 4, transition: "all 0.15s",
          }}
        >
          {expanded
            ? <>⌃ 收起其他上级</>
            : <>⌄ 可点击多选</>
          }
        </button>
      )}

    </div>
  );
}

// ── 通用注册弹层（接收者自选层级关系）──────────────────────────────────────────────────────────────────────────────
/**
 * 设计原则：
 * - 邀请链接不区分上级/下级，由接收者自行选择与邀请人的关系
 * - 接收者选择「我是TA的上级」→ 显示上级层级职位，注册后成为邀请人直属上级
 * - 接收者选择「我是TA的下级」→ 显示下级层级职位，注册后加入团队参与培训
 * - 发起人不需要知道接收者是谁，系统根据接收者选择自动归位
 */

/** 模拟：通用邀请链接参数（不含层级方向） */
const MOCK_SUPERIOR_INVITE_CONTEXT = {
  subordinateName: "王店长",
  subordinateLevel: "门店级·管理者",
  orgName: "智爱客·朝阳旗舰店",
  teamSize: 8,
  trainingCount: 12,
  avgScore: 4.1,
};

/** 上级可选职位（区域级及以上） */
const SUPERIOR_JOB_OPTIONS = [
  { label: "区域经理",   level: "区域级", roleType: "管理者" },
  { label: "区域督察",   level: "区域级", roleType: "管理者" },
  { label: "人力专员",   level: "区域级", roleType: "职能支持" },
  { label: "运营专员",   level: "区域级", roleType: "职能支持" },
  { label: "集团总监",   level: "集团级", roleType: "管理者" },
  { label: "其他",       level: "区域级", roleType: "管理者" },
];

function SuperiorRegisterModal({
  ctx,
  onComplete,
  onSkip,
}: {
  ctx: typeof MOCK_SUPERIOR_INVITE_CONTEXT;
  onComplete: (name: string, job: string) => void;
  onSkip: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState<"superior" | "subordinate" | "">("");
  const [selectedJob, setSelectedJob] = useState("");
  const [customJob, setCustomJob] = useState("");
  const isOtherJob = selectedJob === "其他";
  const finalJob = isOtherJob ? (customJob.trim() || "其他") : selectedJob;

  const handleStep1Next = () => {
    if (name.trim() && phone.length >= 11) setStep(2);
  };

  const handleStep2Complete = () => {
    setStep(3);
    setTimeout(() => onComplete(name, finalJob), 2000);
  };

  return (
    <div style={{
      position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)",
      zIndex: 300, display: "flex", alignItems: "flex-end",
    }}>
      <div style={{
        width: "100%", background: "white",
        borderRadius: "22px 22px 0 0",
        overflow: "hidden",
        animation: "slideUp 0.3s ease",
      }}>
        {/* 邀请卡头部：紫色主题区别于员工注册的橙色 */}
        <div style={{
          background: "linear-gradient(135deg, #6A1B9A 0%, #8E24AA 100%)",
          padding: "20px 18px 18px",
        }}>
          {/* 下级信息 */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "rgba(255,255,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 800, color: "white",
            }}>
              {ctx.subordinateName[0]}
            </div>
            <div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
                <span style={{ fontWeight: 700, color: "white" }}>{ctx.subordinateName}</span>
                <span style={{ fontSize: 11, marginLeft: 6, opacity: 0.75 }}>({ctx.subordinateLevel})</span>
                &nbsp;邀请你加入团队
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
                {ctx.orgName} · 你来决定与TA的层级关系
              </div>
            </div>
          </div>

          {/* 团队数据预览 */}
          <div style={{
            background: "rgba(255,255,255,0.18)", borderRadius: 12,
            padding: "12px 14px",
            display: "flex", gap: 0,
          }}>
            {[
              { label: "团队人数", value: ctx.teamSize + "人" },
              { label: "已发培训", value: ctx.trainingCount + "次" },
              { label: "平均得分", value: ctx.avgScore.toFixed(1) + "分" },
            ].map((item, i) => (
              <div key={i} style={{
                flex: 1, textAlign: "center",
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.2)" : "none",
              }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "white" }}>{item.value}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 步骤内容 */}
        <div style={{ padding: "18px 18px 24px" }}>
          {/* 步骤进度点 */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 18 }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{
                width: s === step ? 20 : 6, height: 6, borderRadius: 3,
                background: s <= step ? "#6A1B9A" : "#E0E0E0",
                transition: "all 0.3s",
              }} />
            ))}
          </div>

          {/* Step 1: 基本信息 */}
          {step === 1 && (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
                你好！先告诉我你的名字 👋
              </div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 18 }}>
                注册完成即可查看 {ctx.subordinateName} 的团队培训数据
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, color: "#555", fontWeight: 600, marginBottom: 6 }}>姓名</div>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="请输入你的姓名"
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: 12,
                    border: "1.5px solid #E0E0E0", fontSize: 15, outline: "none",
                    boxSizing: "border-box", background: "#FAFAFA",
                  }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "#555", fontWeight: 600, marginBottom: 6 }}>手机号</div>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  placeholder="用于登录和接收团队通知"
                  type="tel"
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: 12,
                    border: "1.5px solid #E0E0E0", fontSize: 15, outline: "none",
                    boxSizing: "border-box", background: "#FAFAFA",
                  }}
                />
              </div>

              <button
                onClick={handleStep1Next}
                disabled={!name.trim() || phone.length < 11}
                style={{
                  width: "100%", padding: "14px 0", borderRadius: 14,
                  background: name.trim() && phone.length >= 11
                    ? "linear-gradient(135deg, #6A1B9A, #8E24AA)"
                    : "#E0E0E0",
                  border: "none", fontSize: 15, fontWeight: 700,
                  color: name.trim() && phone.length >= 11 ? "white" : "#aaa",
                  cursor: name.trim() && phone.length >= 11 ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                下一步
              </button>
            </>
          )}

          {/* Step 2: 关系选择 + 职位选择 */}
          {step === 2 && (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
                {name}，你与 {ctx.subordinateName} 是什么关系？
              </div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>
                系统会根据你的选择自动将你归入正确的组织层级
              </div>

              {/* 关系选择卡片 */}
              <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                {[
                  {
                    key: "superior" as const,
                    icon: "📈",
                    label: "我是TA的上级",
                    desc: "注册后可查看TA的团队培训数据",
                    activeColor: "#6A1B9A",
                    activeBg: "#F3E5F5",
                    activeBorder: "#CE93D8",
                  },
                  {
                    key: "subordinate" as const,
                    icon: "📚",
                    label: "我是TA的下级",
                    desc: "注册后加入团队，参与培训任务",
                    activeColor: "#e8750a",
                    activeBg: "#FFF3E0",
                    activeBorder: "#FFB74D",
                  },
                ].map(opt => {
                  const isActive = relation === opt.key;
                  return (
                    <div
                      key={opt.key}
                      onClick={() => { setRelation(opt.key); setSelectedJob(""); }}
                      style={{
                        flex: 1, padding: "14px 10px", borderRadius: 14,
                        background: isActive ? opt.activeBg : "#FAFAFA",
                        border: `1.5px solid ${isActive ? opt.activeBorder : "#E0E0E0"}`,
                        cursor: "pointer", textAlign: "center",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{ fontSize: 24, marginBottom: 6 }}>{opt.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? opt.activeColor : "#555" }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: 11, color: "#888", marginTop: 4, lineHeight: 1.5 }}>
                        {opt.desc}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 职位选择（根据关系动态切换） */}
              {relation && (
              <div style={{ marginBottom: isOtherJob ? 8 : 14 }}>
                <div style={{ fontSize: 13, color: "#555", fontWeight: 600, marginBottom: 8 }}>你的职位</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {(relation === "superior" ? SUPERIOR_JOB_OPTIONS : getJobOptionsForInviterLevel(ctx.subordinateLevel)).map(job => (
                    <button
                      key={job.label}
                      onClick={() => setSelectedJob(job.label)}
                      style={{
                        padding: "8px 14px", borderRadius: 20,
                        border: selectedJob === job.label
                          ? `1.5px solid ${relation === "superior" ? "#6A1B9A" : "#e8750a"}`
                          : "1.5px solid #E0E0E0",
                        background: selectedJob === job.label
                          ? (relation === "superior" ? "#F3E5F5" : "#FFF3E0")
                          : "white",
                        color: selectedJob === job.label
                          ? (relation === "superior" ? "#6A1B9A" : "#e8750a")
                          : "#555",
                        fontSize: 13, fontWeight: selectedJob === job.label ? 700 : 400,
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                    >
                      {job.label}
                      <span style={{ fontSize: 10, color: "#aaa", marginLeft: 4 }}>{job.level}</span>
                    </button>
                  ))}
                </div>
              </div>
              )}

              {/* 「其他」自定义职位 */}
              {isOtherJob && (
                <div style={{ marginBottom: 14 }}>
                  <input
                    value={customJob}
                    onChange={e => setCustomJob(e.target.value)}
                    placeholder="如：大区运营主管"
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: 12,
                      border: "1.5px solid #6A1B9A", fontSize: 14, outline: "none",
                      boxSizing: "border-box", background: "#F9F0FF",
                      color: "#1A1A1A",
                    }}
                  />
                </div>
              )}

              {/* 邀请人信息确认卡（根据关系显示不同文案） */}
              {relation && selectedJob && (
              <div style={{
                background: relation === "superior" ? "#F3E5F5" : "#FFF3E0",
                borderRadius: 12, padding: "12px 14px",
                marginBottom: 16,
                border: `1px solid ${relation === "superior" ? "#CE93D8" : "#FFB74D"}`,
              }}>
                <div style={{ fontSize: 12, color: relation === "superior" ? "#6A1B9A" : "#e8750a", fontWeight: 700, marginBottom: 6 }}>
                  {relation === "superior" ? "👤 邀请人（你的下级）" : "👤 邀请人（你的上级）"}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    background: relation === "superior"
                      ? "linear-gradient(135deg, #6A1B9A, #8E24AA)"
                      : "linear-gradient(135deg, #e8750a, #ff9a3c)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 800, color: "white",
                  }}>{ctx.subordinateName[0]}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>{ctx.subordinateName}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{ctx.subordinateLevel} · {ctx.orgName}</div>
                  </div>
                </div>
                <div style={{
                  marginTop: 10, fontSize: 11, color: "#555", lineHeight: 1.7,
                  background: relation === "superior" ? "rgba(106,27,154,0.08)" : "rgba(232,117,10,0.08)",
                  borderRadius: 8, padding: "8px 10px",
                }}>
                  {relation === "superior" ? (
                    <>
                      ✅ 注册完成后自动成为 {ctx.subordinateName} 的直属上级<br/>
                      ✅ 可立即查看其团队 {ctx.teamSize} 人的培训数据<br/>
                      ✅ 组织架构自动向上扩展
                    </>
                  ) : (
                    <>
                      ✅ 注册完成后加入 {ctx.subordinateName} 的团队<br/>
                      ✅ 直接进入培训任务，无需额外步骤<br/>
                      ✅ 组织架构自动向下扩展
                    </>
                  )}
                </div>
              </div>
              )}

              <button
                onClick={handleStep2Complete}
                disabled={!relation || !selectedJob || (isOtherJob && !customJob.trim())}
                style={{
                  width: "100%", padding: "14px 0", borderRadius: 14,
                  background: relation && selectedJob && (!isOtherJob || customJob.trim())
                    ? relation === "superior"
                      ? "linear-gradient(135deg, #6A1B9A, #8E24AA)"
                      : "linear-gradient(135deg, #e8750a, #ff9a3c)"
                    : "#E0E0E0",
                  border: "none", fontSize: 15, fontWeight: 700,
                  color: relation && selectedJob && (!isOtherJob || customJob.trim()) ? "white" : "#aaa",
                  cursor: relation && selectedJob && (!isOtherJob || customJob.trim()) ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                {relation === "superior" ? "加入团队并查看培训数据" : "加入团队并开始培训"}
              </button>
            </>
          )}

          {/* Step 3: 完成动画 */}
          {step === 3 && (
            <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
              <div style={{
                width: 64, height: 64, borderRadius: 20, margin: "0 auto 16px",
                background: relation === "superior"
                  ? "linear-gradient(135deg, #6A1B9A, #8E24AA)"
                  : "linear-gradient(135deg, #e8750a, #ff9a3c)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32,
              }}>
                {relation === "superior" ? "📈" : "🎉"}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", marginBottom: 6 }}>
                欢迎加入，{name}！
              </div>
              <div style={{ fontSize: 13, color: "#888", lineHeight: 1.7 }}>
                {relation === "superior" ? (
                  <>
                    你已成功成为 <span style={{ color: "#6A1B9A", fontWeight: 600 }}>{ctx.subordinateName}</span> 的直属上级<br/>
                    职位：<span style={{ color: "#1A1A1A", fontWeight: 600 }}>{finalJob}</span><br/>
                    可管理团队：<span style={{ color: "#1A1A1A", fontWeight: 600 }}>{ctx.teamSize} 人</span><br/>
                    <span style={{ color: "#aaa", fontSize: 11 }}>(组织架构已自动向上扩展)</span>
                  </>
                ) : (
                  <>
                    你已成功加入 <span style={{ color: "#e8750a", fontWeight: 600 }}>{ctx.orgName}</span><br/>
                    职位：<span style={{ color: "#1A1A1A", fontWeight: 600 }}>{finalJob}</span><br/>
                    直属上级：<span style={{ color: "#1A1A1A", fontWeight: 600 }}>{ctx.subordinateName}</span><br/>
                    <span style={{ color: "#aaa", fontSize: 11 }}>(组织架构已自动向下扩展)</span>
                  </>
                )}
              </div>
              <div style={{ marginTop: 16, fontSize: 13, color: relation === "superior" ? "#6A1B9A" : "#e8750a", fontWeight: 600 }}>
                {relation === "superior" ? "正在进入团队管理面板..." : "正在进入培训任务..."}
              </div>
            </div>
          )}

          {/* 跳过链接 */}
          {step < 3 && (
            <button
              onClick={onSkip}
              style={{
                width: "100%", marginTop: 12, background: "none", border: "none",
                fontSize: 13, color: "#aaa", cursor: "pointer", padding: "8px 0",
              }}
            >
              已有账号？直接登录
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 无感注册弹层 ──────────────────────────────────────────────────────────────────────────────
const IcBack = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
);
const IcBook = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    <path d="M8 7h8M8 11h6"/>
  </svg>
);
const IcStar = ({ filled }: { filled: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#FF9A3C" : "none"} stroke="#FF9A3C" strokeWidth="1.8">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IcManager = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const IcClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
);
const IcCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);
const IcArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);

// ── 评分星星 ──────────────────────────────────────────────────────────────────
function ScoreStars({ score }: { score: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <IcStar key={i} filled={i <= Math.round(score)} />
      ))}
      <span style={{ fontSize: 13, fontWeight: 700, color: "#FF9A3C", marginLeft: 4 }}>{score.toFixed(1)}</span>
    </div>
  );
}

// ── 无感注册弹层 ──────────────────────────────────────────────────────────────
/**
 * 设计原则：
 * - 对员工来说，这是「开始培训」的入口，不是「注册系统」
 * - 标题聚焦任务，而非账号创建
 * - 上级已由链接参数预填，员工只需确认，无需搜索
 * - 职位选择使用员工熟悉的名称，系统后台完成权限映射
 * - 2步完成，最小信息采集
 */
function InviteRegisterModal({
  inviteCtx,
  onComplete,
  onSkip,
}: {
  inviteCtx: typeof MOCK_INVITE_CONTEXT;
  onComplete: (name: string, job: string) => void;
  onSkip: () => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedJob, setSelectedJob] = useState(inviteCtx.roleHint);
  const [customJob, setCustomJob] = useState(""); // 「其他」时的自定义职位
  const [showJobPicker, setShowJobPicker] = useState(false);
  // 直属上级多选：默认选中邀请人
  const [selectedSuperiorIds, setSelectedSuperiorIds] = useState<string[]>(["S1"]);

  // 根据邀请人层级动态过滤职位列表
  const jobOptions = getJobOptionsForInviterLevel(inviteCtx.inviterLevel);
  const isOtherJob = selectedJob === "其他";
  const finalJob = isOtherJob ? (customJob.trim() || "其他") : selectedJob;

  const toggleSuperior = (id: string) => {
    setSelectedSuperiorIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleStep1Next = () => {
    if (name.trim() && phone.length >= 11) setStep(2);
  };

  const handleStep2Complete = () => {
    setStep(3);
    setTimeout(() => {
      onComplete(name, finalJob);
    }, 1800);
  };

  return (
    <div style={{
      position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)",
      zIndex: 300, display: "flex", alignItems: "flex-end",
    }}>
      <div style={{
        width: "100%", background: "white",
        borderRadius: "22px 22px 0 0",
        overflow: "hidden",
        animation: "slideUp 0.3s ease",
      }}>
        {/* 任务邀请卡头部 */}
        <div style={{
          background: "linear-gradient(135deg, #e8750a 0%, #ff9a3c 100%)",
          padding: "20px 18px 18px",
        }}>
          {/* 发起人信息 */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "rgba(255,255,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 800, color: "white",
            }}>
              {inviteCtx.inviterName[0]}
            </div>
            <div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)" }}>
                <span style={{ fontWeight: 700, color: "white" }}>{inviteCtx.inviterName}</span>
                <span style={{ fontSize: 11, marginLeft: 6, opacity: 0.75 }}>({inviteCtx.inviterLevel})</span>
                &nbsp;邀请你加入团队
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
                {inviteCtx.orgName} · 点击后自选与邀请人的关系
              </div>
            </div>
          </div>

          {/* 任务卡片 */}
          <div style={{
            background: "rgba(255,255,255,0.18)", borderRadius: 12,
            padding: "12px 14px",
          }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginBottom: 4 }}>培训任务</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{inviteCtx.taskTitle}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 6 }}>
              2步完成注册 · 自选与邀请人的层级关系 · 系统自动归位
            </div>
          </div>
        </div>

        {/* 步骤内容 */}
        <div style={{ padding: "18px 18px 24px" }}>
          {/* 步骤进度点 */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 18 }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{
                width: s === step ? 20 : 6, height: 6, borderRadius: 3,
                background: s <= step ? "#e8750a" : "#E0E0E0",
                transition: "all 0.3s",
              }} />
            ))}
          </div>

          {/* Step 1: 基本信息 */}
          {step === 1 && (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
                你好！先告诉我你的名字 👋
              </div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 18 }}>
                只需两步，马上开始培训
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 13, color: "#555", fontWeight: 600, marginBottom: 6 }}>姓名</div>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="请输入你的姓名"
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: 12,
                    border: "1.5px solid #E0E0E0", fontSize: 15, outline: "none",
                    boxSizing: "border-box",
                    background: "#FAFAFA",
                  }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "#555", fontWeight: 600, marginBottom: 6 }}>手机号</div>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  placeholder="用于登录和接收培训通知"
                  type="tel"
                  style={{
                    width: "100%", padding: "12px 14px", borderRadius: 12,
                    border: "1.5px solid #E0E0E0", fontSize: 15, outline: "none",
                    boxSizing: "border-box",
                    background: "#FAFAFA",
                  }}
                />
              </div>

              <button
                onClick={handleStep1Next}
                disabled={!name.trim() || phone.length < 11}
                style={{
                  width: "100%", padding: "14px 0", borderRadius: 14,
                  background: name.trim() && phone.length >= 11
                    ? "linear-gradient(135deg, #e8750a, #ff9a3c)"
                    : "#E0E0E0",
                  border: "none", fontSize: 15, fontWeight: 700,
                  color: name.trim() && phone.length >= 11 ? "white" : "#aaa",
                  cursor: name.trim() && phone.length >= 11 ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                下一步
              </button>
            </>
          )}

          {/* Step 2: 职位 + 确认上级 */}
          {step === 2 && (
            <>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
                {name}，确认一下你的职位 ✅
              </div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 18 }}>
                系统会根据职位自动分配权限
              </div>

              {/* 职位选择 */}
              <div style={{ marginBottom: isOtherJob ? 8 : 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontSize: 13, color: "#555", fontWeight: 600 }}>你的职位</div>

                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {jobOptions.map(job => (
                    <button
                      key={job.label}
                      onClick={() => setSelectedJob(job.label)}
                      style={{
                        padding: "8px 14px", borderRadius: 20,
                        border: selectedJob === job.label ? "1.5px solid #e8750a" : "1.5px solid #E0E0E0",
                        background: selectedJob === job.label ? "#FFF3E0" : "white",
                        color: selectedJob === job.label ? "#e8750a" : "#555",
                        fontSize: 13, fontWeight: selectedJob === job.label ? 700 : 400,
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                    >
                      {job.label}
                      {job.label === inviteCtx.roleHint && selectedJob !== job.label && (
                        <span style={{ fontSize: 10, color: "#aaa", marginLeft: 4 }}>推荐</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 「其他」自定义职位输入框 */}
              {isOtherJob && (
                <div style={{ marginBottom: 14 }}>
                  <input
                    value={customJob}
                    onChange={e => setCustomJob(e.target.value)}
                    placeholder="如：传菜员"
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: 12,
                      border: "1.5px solid #e8750a", fontSize: 14, outline: "none",
                      boxSizing: "border-box", background: "#FFF8F0",
                      color: "#1A1A1A",
                    }}
                  />

                </div>
              )}

              {/* 直属上级：默认显示邀请人，可展开多选 */}
              <SuperiorSelector
                selectedIds={selectedSuperiorIds}
                onToggle={toggleSuperior}
              />

              <button
                onClick={handleStep2Complete}
                disabled={!selectedJob || selectedSuperiorIds.length === 0 || (isOtherJob && !customJob.trim())}
                style={{
                  width: "100%", padding: "14px 0", borderRadius: 14,
                  background: selectedJob && selectedSuperiorIds.length > 0 && (!isOtherJob || customJob.trim())
                    ? "linear-gradient(135deg, #e8750a, #ff9a3c)"
                    : "#E0E0E0",
                  border: "none", fontSize: 15, fontWeight: 700,
                  color: selectedJob && selectedSuperiorIds.length > 0 && (!isOtherJob || customJob.trim()) ? "white" : "#aaa",
                  cursor: selectedJob && selectedSuperiorIds.length > 0 && (!isOtherJob || customJob.trim()) ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                加入团队并开始培训
              </button>
            </>
          )}

          {/* Step 3: 完成动画 */}
          {step === 3 && (
            <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
              <div style={{
                width: 64, height: 64, borderRadius: 20, margin: "0 auto 16px",
                background: "linear-gradient(135deg, #e8750a, #ff9a3c)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32,
              }}>
                🎉
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", marginBottom: 6 }}>
                欢迎加入，{name}！
              </div>
              <div style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>
                你已成功加入 <span style={{ color: "#e8750a", fontWeight: 600 }}>{inviteCtx.orgName}</span><br/>
                职位：<span style={{ color: "#1A1A1A", fontWeight: 600 }}>{finalJob}</span><br/>
                直属上级：<span style={{ color: "#1A1A1A", fontWeight: 600 }}>
                  {MOCK_PEER_SUPERIORS.filter(s => selectedSuperiorIds.includes(s.id)).map(s => s.name).join("、")}
                </span><br/>
                <span style={{ color: "#aaa", fontSize: 11 }}>(组织架构已自动更新)</span>
              </div>
              <div style={{ marginTop: 16, fontSize: 13, color: "#e8750a", fontWeight: 600 }}>
                正在进入培训任务...
              </div>
            </div>
          )}

          {/* 跳过链接（已有账号） */}
          {step < 3 && (
            <button
              onClick={onSkip}
              style={{
                width: "100%", marginTop: 12, background: "none", border: "none",
                fontSize: 13, color: "#aaa", cursor: "pointer", padding: "8px 0",
              }}
            >
              已有账号？直接登录
            </button>
          )}
        </div>
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
}

// ── 主组件 ────────────────────────────────────────────────────────────────────

// ── 答题对话流图标 ──────────────────────────────────────────────────────────────
const IcAI = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#e8750a" opacity="0.15"/>
    <path d="M12 8v4M12 16h.01" stroke="#e8750a" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8.5 10.5c.5-1.5 2-2.5 3.5-2.5s3 1 3.5 2.5" stroke="#e8750a" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const IcLightbulb = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M9 21h6M12 3a6 6 0 016 6c0 2.22-1.21 4.16-3 5.2V17H9v-2.8A6 6 0 0112 3z"/>
  </svg>
);
const IcClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);
const IcMic = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "white" : "#e8750a"} strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/>
    <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v3M9 22h6"/>
  </svg>
);
const IcSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
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

export default function TrainingPage({
  onBack,
  onStartTask: _onStartTask,
  onViewReport,
  onOpenManager,
  isManager = true,
  fromInviteLink = false,
}: TrainingPageProps) {
  // ── 注册弹层状态 ──
  const [showInviteRegister, setShowInviteRegister] = React.useState(fromInviteLink);
  const [showSuperiorRegister, setShowSuperiorRegister] = React.useState(false);
  const [registeredName, setRegisteredName] = React.useState<string | null>(null);
  const [registeredRole, setRegisteredRole] = React.useState<"staff" | "superior" | null>(null);
  const [showNewMemberBanner, setShowNewMemberBanner] = React.useState(false);

  // ── 对话流状态 ──
  type ChatMsg =
    | { id: number; type: "ai-text"; text: string }
    | { id: number; type: "task-card"; task: TrainingTask }
    | { id: number; type: "user-text"; text: string }
    | { id: number; type: "ai-question"; text: string; qIdx: number }
    | { id: number; type: "ai-correct"; text: string }
    | { id: number; type: "ai-reply"; text: string }
    | { id: number; type: "training-done"; score: number; taskTitle: string; task: TrainingTask }
    | { id: number; type: "completed-task"; task: TrainingTask };

  const [msgs, setMsgs] = React.useState<ChatMsg[]>([]);
  const [inputText, setInputText] = React.useState("");
  const [isVoiceMode, setIsVoiceMode] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [isVoiceHolding, setIsVoiceHolding] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isThinking, setIsThinking] = React.useState(false);
  const [showHint, setShowHint] = React.useState(false);

  // ── 当前答题状态 ──
  const [activeTask, setActiveTask] = React.useState<TrainingTask | null>(null);
  const [currentQIdx, setCurrentQIdx] = React.useState(0);
  const [attempts, setAttempts] = React.useState(0);
  const [usedHint, setUsedHint] = React.useState(false);
  const [isFeedbackPhase, setIsFeedbackPhase] = React.useState(false);
  const [isTrainingActive, setIsTrainingActive] = React.useState(false);

  const msgIdRef = React.useRef(0);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const pendingTasks = MOCK_TASKS.filter(t => t.status !== "completed");
  const completedTasks = MOCK_TASKS.filter(t => t.status === "completed");

  const MOCK_QUESTIONS = [
    { id: 1, question: "茶水区台面清洁的标准是什么？", keyPoints: ["台面整洁无杂物", "无垃圾无灰尘", "热水器保持100℃"], hint: "参考答案要点：\n① 台面整洁无杂物、无垃圾、无灰尘\n② 热水器开启并保持100℃\n③ 台面必须有茶叶、茶水壶", aiIntro: "好的，我们开始第一道题！" },
    { id: 2, question: "服务员在顾客点餐时应该注意哪些礼仪要点？", keyPoints: ["微笑服务", "主动推荐", "复述确认订单"], hint: "参考答案要点：\n① 保持微笑，站姿端正\n② 主动介绍招牌菜和特色菜\n③ 点餐完成后复述确认，避免出错", aiIntro: "太棒了！第一题答得很好，继续加油！" },
    { id: 3, question: "发现顾客投诉时，处理的第一步是什么？", keyPoints: ["立即道歉", "倾听诉求", "不争辩"], hint: "参考答案要点：\n① 第一时间真诚道歉，不辩解\n② 耐心倾听顾客诉求，表示理解\n③ 立即上报店长，不自行承诺赔偿", aiIntro: "你越来越厉害了！来看看第三题：" },
    { id: 4, question: "新菜品「宫保鸡丁」的主要食材和特色是什么？", keyPoints: ["花生", "鸡丁", "麻辣鲜香"], hint: "参考答案要点：\n① 主料：嫩鸡丁、花生米\n② 辅料：干辣椒、花椒\n③ 特色：麻辣鲜香，微甜，是川菜代表", aiIntro: "继续保持！来看第四题：" },
    { id: 5, question: "门店卫生检查的频率和标准是什么？", keyPoints: ["每日检查", "餐前餐后", "记录台账"], hint: "参考答案要点：\n① 每日餐前、餐后各检查一次\n② 每周大扫除一次\n③ 检查结果需记录台账，异常上报", aiIntro: "最后一题了，加油！" },
  ];

  const newId = () => ++msgIdRef.current;

  // ── 初始化：AI 推送问候 + 任务卡片 ──
  React.useEffect(() => {
    const initMsgs: ChatMsg[] = [
      { id: newId(), type: "ai-text", text: "你好！我是你的培训助手 🎓\n\n你有以下待完成的培训任务，点击「开始培训」即可直接在这里完成答题 👇" },
      ...pendingTasks.map(t => ({ id: newId(), type: "task-card" as const, task: t })),
    ];
    if (completedTasks.length > 0) {
      initMsgs.push({ id: newId(), type: "ai-text", text: `你已完成 ${completedTasks.length} 项培训，继续保持！✨` });
      completedTasks.forEach(t => initMsgs.push({ id: newId(), type: "completed-task" as const, task: t }));
    }
    setTimeout(() => setMsgs(initMsgs), 200);
  }, []);

  // ── 自动滚动 ──
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, isThinking]);

  const handleRegisterComplete = (name: string, job: string) => {
    setRegisteredName(name);
    setRegisteredRole("staff");
    setShowInviteRegister(false);
    setShowNewMemberBanner(true);
    setTimeout(() => setShowNewMemberBanner(false), 4000);
  };

  const handleSuperiorRegisterComplete = (name: string, job: string) => {
    setRegisteredName(name);
    setRegisteredRole("superior");
    setShowSuperiorRegister(false);
    setShowNewMemberBanner(true);
    setTimeout(() => setShowNewMemberBanner(false), 5000);
  };

  // ── 开始培训：在对话流中插入第一道题 ──
  const handleStartTask = (task: TrainingTask) => {
    setActiveTask(task);
    setCurrentQIdx(0);
    setAttempts(0);
    setUsedHint(false);
    setIsFeedbackPhase(false);
    setIsTrainingActive(true);

    const questions = MOCK_QUESTIONS.slice(0, task.totalQuestions);
    const q = questions[0];
    const newMsgs: ChatMsg[] = [
      { id: newId(), type: "ai-text", text: `好的！开始「${task.title}」培训 🚀\n共 ${task.totalQuestions} 道题，答对一道才能进入下一题，加油！💪` },
      { id: newId(), type: "ai-question", text: `第 1 题：${q.question}`, qIdx: 0 },
    ];
    setMsgs(prev => [...prev, ...newMsgs]);
  };

  // ── 评估答案 ──
  const evaluateAnswer = (answer: string) => {
    if (!activeTask || !isTrainingActive) return;
    const questions = MOCK_QUESTIONS.slice(0, activeTask.totalQuestions);
    const currentQ = questions[currentQIdx];
    if (!currentQ) return;

    setIsThinking(true);
    setMsgs(prev => [...prev, { id: newId(), type: "user-text", text: answer }]);
    setInputText("");

    setTimeout(() => {
      setIsThinking(false);
      const lowerAnswer = answer.toLowerCase();
      const matchedPoints = currentQ.keyPoints.filter(kp =>
        lowerAnswer.includes(kp.slice(0, 4)) || answer.length > 15
      );
      const isCorrect = matchedPoints.length >= Math.ceil(currentQ.keyPoints.length * 0.6) || attempts >= 2;

      const AI_CORRECT = ["非常棒！你说到了所有关键点，这道题完全掌握了！🎉", "答得很好！看来你平时工作很认真，继续保持！✨", "完全正确！这个知识点你已经掌握得很扎实了，为你点赞！👍"];
      const AI_PARTIAL = ["你说到了一部分关键点，还有一个细节没有提到，再想想？", "思路是对的！还差一个重要的知识点，再补充一下？", "不错的回答！但还有一个关键步骤没有说到，再补充一下？"];
      const AI_WRONG = ["没关系，这道题有点难。可以点击下方「查看提示」看看参考答案。", "这个知识点确实不好记。要不要先看看提示答案，然后用自己的话说一遍？"];

      if (isCorrect) {
        const replyText = AI_CORRECT[Math.floor(Math.random() * AI_CORRECT.length)];
        setMsgs(prev => [...prev, { id: newId(), type: "ai-correct", text: replyText }]);

        setTimeout(() => {
          const nextIdx = currentQIdx + 1;
          if (nextIdx < questions.length) {
            setCurrentQIdx(nextIdx);
            setAttempts(0);
            setUsedHint(false);
            const nextQ = questions[nextIdx];
            setMsgs(prev => [...prev,
              { id: newId(), type: "ai-text", text: nextQ.aiIntro },
              { id: newId(), type: "ai-question", text: `第 ${nextIdx + 1} 题：${nextQ.question}`, qIdx: nextIdx },
            ]);
          } else {
            setIsFeedbackPhase(true);
            setMsgs(prev => [...prev, {
              id: newId(), type: "ai-text",
              text: `🎊 太厉害了！${activeTask.totalQuestions} 道题全部完成！\n\n最后一个问题：**请用自己的话说说，这次培训让你印象最深的是什么？有什么想法或建议？**`,
            }]);
          }
        }, 1500);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        const replyText = newAttempts >= 2
          ? AI_WRONG[Math.floor(Math.random() * AI_WRONG.length)]
          : AI_PARTIAL[Math.floor(Math.random() * AI_PARTIAL.length)];
        setMsgs(prev => [...prev, { id: newId(), type: "ai-reply", text: replyText }]);
      }
    }, 1200);
  };

  // ── 提交反馈后完成培训 ──
  const submitFeedback = (feedback: string) => {
    if (!activeTask) return;
    setIsThinking(true);
    setMsgs(prev => [...prev, { id: newId(), type: "user-text", text: feedback }]);
    setInputText("");

    setTimeout(() => {
      setIsThinking(false);
      const score = parseFloat((Math.min(5, Math.max(3, 3.5 + Math.random() * 1.2))).toFixed(1));
      setMsgs(prev => [...prev,
        { id: newId(), type: "ai-text", text: `非常感谢你的反馈！你今天的表现真的很棒！🌟` },
        { id: newId(), type: "training-done", score, taskTitle: activeTask.title, task: activeTask },
      ]);
      setIsTrainingActive(false);
      setIsFeedbackPhase(false);
    }, 1500);
  };

  // ── 跳过当前题目 ──
  const handleSkip = () => {
    if (!activeTask || !isTrainingActive || isFeedbackPhase) return;
    const questions = MOCK_QUESTIONS.slice(0, activeTask.totalQuestions);
    const currentQ = questions[currentQIdx];
    if (!currentQ) return;

    setShowHint(false);
    setMsgs(prev => [...prev,
      { id: newId(), type: "user-text", text: "跳过此题" },
      { id: newId(), type: "ai-reply", text: `已跳过「${currentQ.question.slice(0, 14)}…」\n跳过的题目不计入得分，建议课后复习一下这个知识点 📖` },
    ]);

    setTimeout(() => {
      const nextIdx = currentQIdx + 1;
      setAttempts(0);
      setUsedHint(false);
      if (nextIdx < questions.length) {
        setCurrentQIdx(nextIdx);
        const nextQ = questions[nextIdx];
        setMsgs(prev => [...prev,
          { id: newId(), type: "ai-text", text: nextQ.aiIntro },
          { id: newId(), type: "ai-question", text: `第 ${nextIdx + 1} 题：${nextQ.question}`, qIdx: nextIdx },
        ]);
      } else {
        setIsFeedbackPhase(true);
        setMsgs(prev => [...prev, {
          id: newId(), type: "ai-text",
          text: `🎊 全部题目已完成！\n\n最后一个问题：**请用自己的话说说，这次培训让你印象最深的是什么？有什么想法或建议？**`,
        }]);
      }
    }, 800);
  };

  const handleSend = (overrideText?: string) => {
    const text = (overrideText ?? inputText).trim();
    if (!text || !isTrainingActive) return;
    setShowHint(false);
    if (isFeedbackPhase) {
      submitFeedback(text);
    } else {
      evaluateAnswer(text);
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      if (!activeTask) return;
      const questions = MOCK_QUESTIONS.slice(0, activeTask.totalQuestions);
      const voiceTexts = [
        "台面要整洁无杂物，热水器要保持100度，还要有茶叶和茶水壶",
        "要微笑服务，主动介绍菜品，点完餐要复述确认",
        "第一步要立刻道歉，然后听顾客说，不能跟顾客争辩",
        "主料是鸡丁和花生，口味是麻辣鲜香，是川菜代表",
        "每天餐前餐后各检查一次，每周大扫除，结果要记台账",
      ];
      setInputText(voiceTexts[currentQIdx % voiceTexts.length]);
    } else {
      setIsRecording(true);
    }
  };
  const handleVoiceStart = () => {
    if (!isTrainingActive) return;
    setIsVoiceHolding(true);
  };
  const handleVoiceEnd = () => {
    setIsVoiceHolding(false);
    if (!isTrainingActive) return;
    const voiceAnswers = [
      "台面要整洁无杂物，热水器要保持100度，还要有茶叶和茶水壶",
      "要微笑服务，主动介绍菜品，点完餐要复述确认",
      "第一步要立刻道歉，然后听顾客说，不能跟顾客争辩",
      "主料是鸡丁和花生，口味是麻辣鲜香，是川菜代表",
      "每天餐前餐后各检查一次，每周大扫除，结果要记台账",
    ];
    const recognized = voiceAnswers[currentQIdx % voiceAnswers.length];
    setInputText(recognized);
    setTimeout(() => handleSend(recognized), 300);
  };

  const currentQ = activeTask
    ? MOCK_QUESTIONS.slice(0, activeTask.totalQuestions)[currentQIdx]
    : null;

  return (
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      background: "#F7F8FC", fontFamily: "-apple-system, 'PingFang SC', sans-serif",
      position: "relative",
    }}>
      {/* 顶部导航 */}
      <div style={{
        background: "linear-gradient(135deg, #e8750a 0%, #ff9a3c 100%)",
        padding: "44px 16px 14px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={onBack} style={{ background: "none", border: "none", padding: 4, cursor: "pointer" }}>
            <IcBack />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <IcBook />
            <span style={{ fontSize: 17, fontWeight: 700, color: "white" }}>
              {isTrainingActive && activeTask ? activeTask.title : "培训助手"}
            </span>
          </div>
          {isManager ? (
            <button
              onClick={onOpenManager}
              style={{
                background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 20,
                padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
              }}
            >
              <IcManager />
              <span style={{ fontSize: 12, color: "white", fontWeight: 600 }}>管理</span>
            </button>
          ) : <div style={{ width: 60 }} />}
        </div>

        {/* 答题进度条（仅答题时显示） */}
        {isTrainingActive && activeTask && !isFeedbackPhase && (
          <div style={{ marginTop: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.85)" }}>
                第 {currentQIdx + 1} 题 / 共 {activeTask.totalQuestions} 题
              </span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.85)" }}>
                {Math.round((currentQIdx / activeTask.totalQuestions) * 100)}%
              </span>
            </div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.3)", borderRadius: 4 }}>
              <div style={{
                height: "100%", borderRadius: 4, background: "white",
                width: `${(currentQIdx / activeTask.totalQuestions) * 100}%`,
                transition: "width 0.5s ease",
              }} />
            </div>
          </div>
        )}
      </div>

      {/* 新成员加入成功横幅 */}
      {showNewMemberBanner && (
        <div style={{
          background: registeredRole === "superior"
            ? "linear-gradient(135deg, #6A1B9A, #8E24AA)"
            : "linear-gradient(135deg, #43A047, #66BB6A)",
          padding: "10px 16px",
          display: "flex", alignItems: "center", gap: 10,
          flexShrink: 0,
          animation: "slideDown 0.3s ease",
        }}>
          <span style={{ fontSize: 18 }}>{registeredRole === "superior" ? "📈" : "🎉"}</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>
              {registeredRole === "superior"
                ? `${registeredName} 已成功成为上级！组织向上扩展`
                : `欢迎加入！${registeredName}，你已成功加入团队`}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
              {registeredRole === "superior"
                ? "组织架构已自动向上更新 · 可查看下级团队数据"
                : "组织架构已自动更新 · 上级已收到通知"}
            </div>
          </div>
        </div>
      )}

      {/* 对话流区域 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px 8px" }}>
        {/* 演示提示条 */}
        <div style={{
          background: "linear-gradient(135deg, #FFF8E1, #FFF3E0)",
          border: "1px solid #FFD54F", borderRadius: 12,
          padding: "10px 14px", marginBottom: 14,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>🔗</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#E65100" }}>演示：无感注册体验</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setShowInviteRegister(true)} style={{
              background: "linear-gradient(135deg, #e8750a, #ff9a3c)",
              border: "none", borderRadius: 10, padding: "6px 10px",
              fontSize: 11, fontWeight: 700, color: "white", cursor: "pointer",
            }}>员工注册</button>
            <button onClick={() => setShowSuperiorRegister(true)} style={{
              background: "linear-gradient(135deg, #6A1B9A, #8E24AA)",
              border: "none", borderRadius: 10, padding: "6px 10px",
              fontSize: 11, fontWeight: 700, color: "white", cursor: "pointer",
            }}>通用注册</button>
          </div>
        </div>

        {/* 消息列表 */}
        {msgs.map(msg => {
          if (msg.type === "ai-text" || msg.type === "ai-reply") {
            return (
              <div key={msg.id} style={{ display: "flex", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ maxWidth: "82%", display: "flex", flexDirection: "column" }}>
                  <div style={{
                    borderRadius: "4px 18px 18px 18px",
                    background: "rgba(255,255,255,0.95)",
                    color: "#2d2040",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(230,220,245,0.7)",
                    overflow: "hidden",
                  }}>
                    <div style={{ height: 1, background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.9) 30%, rgba(255,255,255,1) 60%, transparent 100%)" }}/>
                    <div style={{ padding: "10px 13px", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                      {msg.text.replace(/\*\*/g, "")}
                    </div>
                    <div style={{ height: 1, marginLeft: 10, marginRight: 10, background: "linear-gradient(90deg, transparent, rgba(200,185,225,0.35), transparent)" }}/>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px 7px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {[
                          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 5L6 9H2v6h4l5 4V5z" fill="#b0a0c0"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#b0a0c0" strokeWidth="1.8" strokeLinecap="round"/></svg> },
                          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b0a0c0" strokeWidth="1.8" strokeLinecap="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/></svg> },
                          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b0a0c0" strokeWidth="1.8" strokeLinecap="round"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/></svg> },
                          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b0a0c0" strokeWidth="1.8" strokeLinecap="round"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg> },
                          { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b0a0c0" strokeWidth="1.8" strokeLinecap="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> },
                        ].map((btn, i) => (
                          <button key={i} style={{ width: 28, height: 24, borderRadius: 6, border: "none", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>{btn.icon}</button>
                        ))}
                      </div>
                      <span style={{ fontSize: 10, color: "#c0b0d0" }}>内容由AI生成</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          if (msg.type === "ai-question") {
            return (
              <div key={msg.id} style={{ display: "flex", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ maxWidth: "82%" }}>
                  <div style={{
                    borderRadius: "4px 18px 18px 18px",
                    background: "rgba(255,248,240,0.98)",
                    color: "#2d2040",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1)",
                    border: "1.5px solid #FFD54F",
                    overflow: "hidden",
                    padding: "10px 13px",
                    fontSize: 14, lineHeight: 1.6,
                  }}>
                    <div style={{ fontSize: 11, color: "#e8750a", fontWeight: 700, marginBottom: 4 }}>📝 答题</div>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          }

          if (msg.type === "ai-correct") {
            return (
              <div key={msg.id} style={{ display: "flex", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ maxWidth: "82%" }}>
                  <div style={{
                    borderRadius: "4px 18px 18px 18px",
                    background: "rgba(255,255,255,0.95)",
                    color: "#2d2040",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1)",
                    border: "1px solid #C8E6C9",
                    overflow: "hidden",
                    padding: "10px 13px",
                    fontSize: 14, lineHeight: 1.6,
                  }}>
                    <div style={{ fontSize: 11, color: "#43A047", fontWeight: 700, marginBottom: 4 }}>✅ 回答正确</div>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          }

          if (msg.type === "user-text") {
            return (
              <div key={msg.id} style={{ display: "flex", flexDirection: "row-reverse", alignItems: "flex-end", gap: 8, marginBottom: 12 }}>
                <div style={{
                  maxWidth: "75%",
                  background: "linear-gradient(135deg, #e8750a, #ff9a3c)",
                  color: "white",
                  borderRadius: "14px 4px 14px 14px", padding: "10px 13px",
                  fontSize: 14, lineHeight: 1.6,
                  boxShadow: "0 3px 10px rgba(232,117,10,0.3)",
                }}>
                  {msg.text}
                </div>
              </div>
            );
          }

          if (msg.type === "task-card") {
            const task = msg.task;
            const typeStyle = TYPE_COLOR[task.type] || { bg: "#F5F5F5", text: "#666" };
            const isUrgent = task.deadline.includes("今日");
            return (
              <div key={msg.id} style={{ marginBottom: 10, paddingLeft: 40 }}>
                <div style={{
                  background: "white", borderRadius: 14, padding: "14px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                  border: isUrgent ? "1.5px solid #FFD54F" : "1.5px solid #F0F0F0",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ flex: 1, marginRight: 8 }}>
                      {isUrgent && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#E65100", background: "#FFF3E0", padding: "2px 7px", borderRadius: 10, marginBottom: 5, display: "inline-block" }}>⚡ 今日截止</span>
                      )}
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.4 }}>{task.title}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: typeStyle.text, background: typeStyle.bg, padding: "3px 9px", borderRadius: 10, whiteSpace: "nowrap" }}>{task.type}</span>
                  </div>
                  <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                    <span style={{ fontSize: 11, color: "#888" }}>📋 {task.totalQuestions} 道题</span>
                    <span style={{ fontSize: 11, color: "#888" }}>⏰ {task.deadline}</span>
                    <span style={{ fontSize: 11, color: "#888" }}>来自 {task.sender}</span>
                  </div>
                  <button
                    onClick={() => handleStartTask(task)}
                    style={{
                      width: "100%", padding: "10px 0", borderRadius: 12,
                      background: "linear-gradient(135deg, #e8750a, #ff9a3c)",
                      border: "none", fontSize: 14, fontWeight: 700, color: "white", cursor: "pointer",
                      boxShadow: "0 3px 10px rgba(232,117,10,0.3)",
                    }}
                  >
                    {task.status === "in_progress" ? "继续培训" : "开始培训"}
                  </button>
                </div>
              </div>
            );
          }

          if (msg.type === "completed-task") {
            const task = msg.task;
            const typeStyle = TYPE_COLOR[task.type] || { bg: "#F5F5F5", text: "#666" };
            return (
              <div key={msg.id} style={{ marginBottom: 10, paddingLeft: 40 }}>
                <div
                  onClick={() => onViewReport(task)}
                  style={{
                    background: "white", borderRadius: 14, padding: "12px 14px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                    border: "1.5px solid #F0F0F0",
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: "#F0FFF4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#43A047" strokeWidth="2.2" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", marginBottom: 3 }}>{task.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: typeStyle.text, background: typeStyle.bg, padding: "2px 7px", borderRadius: 8 }}>{task.type}</span>
                      {task.score && <ScoreStars score={task.score} />}
                    </div>
                    <div style={{ fontSize: 11, color: "#aaa", marginTop: 3 }}>完成于 {task.completedAt}</div>
                  </div>
                  <IcArrow />
                </div>
              </div>
            );
          }

          if (msg.type === "training-done") {
            return (
              <div key={msg.id} style={{ marginBottom: 12, paddingLeft: 40 }}>
                <div style={{
                  background: "linear-gradient(135deg, #FFF8F0, #FFF3E0)",
                  borderRadius: 14, padding: "16px",
                  border: "1.5px solid #FFD54F",
                  boxShadow: "0 2px 10px rgba(232,117,10,0.1)",
                }}>
                  <div style={{ textAlign: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 32, marginBottom: 6 }}>🏆</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#e8750a" }}>培训完成！</div>
                    <div style={{ fontSize: 13, color: "#888", marginTop: 3 }}>{msg.taskTitle}</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginBottom: 14 }}>
                    <span style={{ fontSize: 13, color: "#555" }}>本次得分</span>
                    <span style={{ fontSize: 24, fontWeight: 800, color: "#e8750a" }}>{msg.score}</span>
                    <span style={{ fontSize: 13, color: "#888" }}>/ 5.0</span>
                    <ScoreStars score={msg.score} />
                  </div>
                  <button
                    onClick={() => onViewReport(msg.task)}
                    style={{
                      width: "100%", padding: "10px 0", borderRadius: 12,
                      background: "linear-gradient(135deg, #e8750a, #ff9a3c)",
                      border: "none", fontSize: 14, fontWeight: 700, color: "white", cursor: "pointer",
                    }}
                  >
                    查看完整报告
                  </button>
                </div>
              </div>
            );
          }

          return null;
        })}

        {/* AI 思考中 */}
        {isThinking && (
          <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{
              borderRadius: "4px 18px 18px 18px",
              background: "rgba(255,255,255,0.95)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1)",
              border: "1px solid rgba(230,220,245,0.7)",
              padding: "12px 16px",
              display: "flex", gap: 5, alignItems: "center",
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: "50%", background: "#e8750a",
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  opacity: 0.7,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 提示答案弹层 */}
      {showHint && currentQ && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "white", borderRadius: "20px 20px 0 0",
          padding: "20px 18px 32px",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.12)", zIndex: 100,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <IcLightbulb />
              <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>参考答案</span>
            </div>
            <button onClick={() => setShowHint(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <IcClose />
            </button>
          </div>
          <div style={{
            background: "#FFF8F0", borderRadius: 12, padding: "14px 16px",
            fontSize: 14, color: "#555", lineHeight: 1.8, whiteSpace: "pre-line",
            border: "1px solid #FFE0B2",
          }}>
            {currentQ.hint}
          </div>
          <div style={{ fontSize: 12, color: "#aaa", marginTop: 10, textAlign: "center" }}>
            关闭答案后，用自己的话说一遍给 AI 听 💪
          </div>
        </div>
      )}

      {/* 底部输入区（与首页同款控件） */}
      <div style={{
        background: "linear-gradient(170deg, #fdf4ec 0%, #f8eefc 35%, #ede8f8 65%, #e8eaf5 100%)",
        borderTop: "1px solid rgba(200,190,220,0.18)",
        paddingBottom: "env(safe-area-inset-bottom, 6px)",
        flexShrink: 0,
        opacity: isTrainingActive ? 1 : 0.65,
        transition: "opacity 0.2s",
      }}>
        {/* 答错后：查看提示 + 跳过此题 */}
        {isTrainingActive && !isFeedbackPhase && attempts >= 1 && (
          <div style={{ display: "flex", gap: 8, padding: "10px 12px 0" }}>
            {!showHint && (
              <button
                onClick={() => { setShowHint(true); setUsedHint(true); }}
                style={{
                  flex: 1, padding: "8px 0", borderRadius: 20, border: "1.5px dashed #FFB74D",
                  background: "rgba(255,248,240,0.9)", color: "#e8750a", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                }}
              >
                <IcLightbulb />
                查看提示
              </button>
            )}
            <button
              onClick={handleSkip}
              style={{
                flex: 1, padding: "8px 0", borderRadius: 20,
                border: "1.5px dashed rgba(180,170,200,0.6)",
                background: "rgba(255,255,255,0.7)", color: "#8a7a9a", fontSize: 13, fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8a7a9a" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              跳过此题
            </button>
          </div>
        )}

        {/* 未激活时提示 */}
        {!isTrainingActive && (
          <div style={{ textAlign: "center", fontSize: 12, color: "#b0a0c0", padding: "8px 0 4px", letterSpacing: 0.3 }}>
            请先选择培训内容开始答题
          </div>
        )}

        {/* 输入框行（与首页完全一致） */}
        <div className="flex items-center gap-2 px-3 pb-2.5 pt-2">
          {/* 左侧：语音/键盘切换 */}
          <button
            onClick={() => { if (isTrainingActive) setIsVoiceMode(!isVoiceMode); }}
            style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "rgba(255,255,255,0.82)",
              border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              cursor: isTrainingActive ? "pointer" : "not-allowed",
            }}
          >
            {isVoiceMode ? <IcKeyboard /> : <IcMic active={false} />}
          </button>

          {/* 中间：语音按钮 or 文字输入框 */}
          {isVoiceMode ? (
            <button
              onMouseDown={handleVoiceStart}
              onMouseUp={handleVoiceEnd}
              onTouchStart={handleVoiceStart}
              onTouchEnd={handleVoiceEnd}
              disabled={!isTrainingActive}
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
                cursor: isTrainingActive ? "pointer" : "not-allowed",
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
                  {isTrainingActive ? "按住说话" : "请先选择培训"}
                </>
              )}
            </button>
          ) : (
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
                onChange={e => { if (isTrainingActive) { setInputText(e.target.value); setShowHint(false); } }}
                onKeyDown={e => e.key === "Enter" && isTrainingActive && handleSend()}
                placeholder={isTrainingActive ? "输入你的回答..." : "请先选择培训内容"}
                disabled={!isTrainingActive}
                style={{
                  flex: 1, border: "none", outline: "none",
                  background: "transparent",
                  fontSize: 15.5, color: "#2d2040",
                  caretColor: "#e8750a",
                  cursor: isTrainingActive ? "text" : "not-allowed",
                }}
              />
              {inputText.trim() && isTrainingActive ? (
                <button
                  onClick={() => handleSend()}
                  style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "linear-gradient(135deg, #ff9a3c, #e8750a)",
                    border: "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(232,117,10,0.35)",
                    cursor: "pointer",
                  }}
                >
                  <IcSend />
                </button>
              ) : (
                <button
                  style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "none", border: "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, opacity: 0.5,
                  }}
                >
                  <IcMic active={false} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 员工无感注册弹层 */}
      {showInviteRegister && (
        <InviteRegisterModal
          inviteCtx={MOCK_INVITE_CONTEXT}
          onComplete={handleRegisterComplete}
          onSkip={() => setShowInviteRegister(false)}
        />
      )}

      {/* 上级注册弹层（反向拉新） */}
      {showSuperiorRegister && (
        <SuperiorRegisterModal
          ctx={MOCK_SUPERIOR_INVITE_CONTEXT}
          onComplete={handleSuperiorRegisterComplete}
          onSkip={() => setShowSuperiorRegister(false)}
        />
      )}

      <style>{`
        @keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }
      `}</style>
    </div>
  );
}


// ── 待完成任务卡片 ────────────────────────────────────────────────────────────
function PendingTaskCard({ task, onStart }: { task: TrainingTask; onStart: () => void }) {
  const typeStyle = TYPE_COLOR[task.type] || { bg: "#F5F5F5", text: "#666" };
  const isUrgent = task.deadline.includes("今日");

  return (
    <div style={{
      background: "white", borderRadius: 14, padding: "14px 14px",
      marginBottom: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      border: isUrgent ? "1.5px solid #FFD54F" : "1.5px solid transparent",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ flex: 1, marginRight: 10 }}>
          {isUrgent && (
            <span style={{
              fontSize: 10, fontWeight: 700, color: "#E65100",
              background: "#FFF3E0", padding: "2px 7px", borderRadius: 10, marginBottom: 6, display: "inline-block",
            }}>⚡ 今日截止</span>
          )}
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.4 }}>{task.title}</div>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600, color: typeStyle.text,
          background: typeStyle.bg, padding: "3px 9px", borderRadius: 10, whiteSpace: "nowrap",
        }}>{task.type}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
        <span style={{ fontSize: 12, color: "#888" }}>📋 {task.totalQuestions} 道题</span>
        <span style={{ fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 3 }}>
          <IcClock />{task.deadline}
        </span>
        <span style={{ fontSize: 12, color: "#888" }}>来自 {task.sender}</span>
      </div>

      {task.status === "in_progress" && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: "#e8750a", fontWeight: 600 }}>进行中</span>
            <span style={{ fontSize: 11, color: "#888" }}>已完成 2/{task.totalQuestions} 题</span>
          </div>
          <div style={{ height: 4, background: "#F0F0F0", borderRadius: 4 }}>
            <div style={{ height: "100%", width: `${(2 / task.totalQuestions) * 100}%`, background: "linear-gradient(90deg, #e8750a, #ff9a3c)", borderRadius: 4 }} />
          </div>
        </div>
      )}

      <button
        onClick={onStart}
        style={{
          width: "100%", padding: "11px 0", borderRadius: 12,
          background: task.status === "in_progress"
            ? "linear-gradient(135deg, #e8750a, #ff9a3c)"
            : "linear-gradient(135deg, #e8750a, #ff9a3c)",
          border: "none", fontSize: 14, fontWeight: 700, color: "white",
          cursor: "pointer",
        }}
      >
        {task.status === "in_progress" ? "继续培训" : "开始培训"}
      </button>
    </div>
  );
}

// ── 已完成任务卡片 ────────────────────────────────────────────────────────────
function CompletedTaskCard({ task, onView }: { task: TrainingTask; onView: () => void }) {
  const typeStyle = TYPE_COLOR[task.type] || { bg: "#F5F5F5", text: "#666" };

  return (
    <div
      onClick={onView}
      style={{
        background: "white", borderRadius: 14, padding: "14px 14px",
        marginBottom: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: "#F0FFF4",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#43A047" strokeWidth="2.2" strokeLinecap="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>{task.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 10, fontWeight: 600, color: typeStyle.text,
            background: typeStyle.bg, padding: "2px 7px", borderRadius: 8,
          }}>{task.type}</span>
          {task.score && <ScoreStars score={task.score} />}
        </div>
        <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>
          完成于 {task.completedAt} · 来自 {task.sender}
        </div>
      </div>
      <IcArrow />
    </div>
  );
}
