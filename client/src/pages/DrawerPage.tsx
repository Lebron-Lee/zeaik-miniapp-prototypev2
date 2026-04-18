/**
 * 智爱客-餐饮AI 抽屉「我的」页面 v4
 * 设计规范：
 * - 头像+用户名左右一行（去掉统计卡片）
 * - 专属智库（与学习中心统一列表样式）
 * - 学习中心
 * - 对话记录（移至最后，参考蚂蚁阿福样式）
 */
import React, { useState } from "react";
import { toast } from "sonner";

interface DrawerPageProps {
  userPhone: string;
  onClose: () => void;
  onLogout: () => void;
  onOpenTrainingConversation?: () => void;
}

// ─── 线性 SVG 图标 ────────────────────────────────────────────────────────────

const IcClose = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6a5a7a" strokeWidth="2.2" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const IcChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.2" strokeLinecap="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);


const IcMember = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="#e8750a"/>
  </svg>
);

// 专属智库图标
const IcReport = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="2" width="13" height="17" rx="2" fill="rgba(232,117,10,0.15)" stroke="#e8750a" strokeWidth="1.4"/>
    <path d="M7 7h7M7 10.5h7M7 14h4" stroke="#e8750a" strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="18" cy="18" r="4" fill="#e8750a"/>
    <path d="M16.5 18h3M18 16.5v3" stroke="#fff" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const IcBook = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="#e8750a" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" fill="rgba(232,117,10,0.12)" stroke="#e8750a" strokeWidth="1.4"/>
    <path d="M8 7h8M8 10.5h6M8 14h4" stroke="#e8750a" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

// 学习中心图标
const IcTrain = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 3l2.09 6.26L20 10.18l-4.91 4.82 1.18 6.82L12 18.77l-4.27 3.05 1.18-6.82L4 10.18l5.91-.92L12 3z" fill="rgba(232,117,10,0.15)" stroke="#e8750a" strokeWidth="1.4" strokeLinejoin="round"/>
  </svg>
);

const IcHelp = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" fill="rgba(232,117,10,0.12)" stroke="#e8750a" strokeWidth="1.4"/>
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke="#e8750a" strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="12" cy="17" r="0.6" fill="#e8750a"/>
  </svg>
);

// 对话图标
const IcChatBubble = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="rgba(232,117,10,0.12)" stroke="#e8750a" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M8 9h8M8 13h5" stroke="#e8750a" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

// ─── 培训中心模拟任务数据 ─────────────────────────────────────────────────────

type TrainingTaskGroup = "我发起的" | "我参加的";

interface TrainingTask {
  id: number;
  title: string;
  time: string;
  progress: string;
  group: TrainingTaskGroup;
  hasUpdate?: boolean;
}

export const TRAINING_TASKS: TrainingTask[] = [
  { id: 1, title: "茶水区服务标准培训", time: "今天 09:41", progress: "新增 3 人完成，完成率 72%", group: "我发起的", hasUpdate: true },
  { id: 2, title: "门店开档检查培训", time: "昨天 18:20", progress: "新增 1 条待完成提醒", group: "我发起的", hasUpdate: true },
  { id: 3, title: "新品推荐话术培训", time: "昨天 11:08", progress: "培训已发起，待 5 人接收", group: "我发起的" },
  { id: 4, title: "服务礼仪标准培训", time: "今天 14:32", progress: "已完成 4/5 题，待提交反馈", group: "我参加的" },
  { id: 5, title: "食品安全晨会培训", time: "昨天 16:45", progress: "培训完成，得分 96 分", group: "我参加的" },
  { id: 6, title: "值班经理交接培训", time: "3天前", progress: "历史任务，可回看记录", group: "我参加的" },
];

// ─── 通用列表卡片组件 ────────────────────────────────────────────────────────

function SectionCard({ title, badge, items }: {
  title: string;
  badge?: string;
  items: { Icon: () => React.ReactElement; label: string; desc: string }[];
}) {
  return (
    <div className="px-3 pt-3">
      {/* 标题行 */}
      <div className="flex items-center gap-2 px-1 mb-2">
        <span style={{ fontSize: 14, fontWeight: 700, color: "#2d2040" }}>{title}</span>
        {badge && (
          <div style={{
            background: "rgba(232,117,10,0.12)",
            border: "1px solid rgba(232,117,10,0.25)",
            borderRadius: 8, padding: "2px 7px",
            fontSize: 11, color: "#e8750a", fontWeight: 600,
          }}>{badge}</div>
        )}
      </div>

      <div style={{
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(12px)",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.9)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}>
        {items.map(({ Icon, label, desc }, i) => (
          <button
            key={i}
            onClick={() => toast.info(`${label}功能即将开放`)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "13px 16px",
              background: "none", border: "none",
              borderBottom: i < items.length - 1 ? "1px solid rgba(232,117,10,0.06)" : "none",
              textAlign: "left",
              transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,248,240,0.8)")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, rgba(255,210,160,0.45), rgba(255,235,200,0.35))",
              border: "1px solid rgba(232,117,10,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Icon />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#2d2040" }}>{label}</div>
              <div style={{ fontSize: 12, color: "#9a8aaa", marginTop: 2 }}>{desc}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.2" strokeLinecap="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

export const TRAINING_DRAWER_BADGE_COUNT = TRAINING_TASKS.filter(
  task => task.group === "我发起的" && task.hasUpdate,
).length;

export default function DrawerPage({ userPhone, onClose, onOpenTrainingConversation }: DrawerPageProps) {
  const [showAllTrainingTasks, setShowAllTrainingTasks] = useState(false);

  const initiatedTasks = TRAINING_TASKS.filter(task => task.group === "我发起的");
  const joinedTasks = TRAINING_TASKS.filter(task => task.group === "我参加的");
  const initiatedUpdateCount = TRAINING_DRAWER_BADGE_COUNT;

  const visibleInitiatedTasks = showAllTrainingTasks ? initiatedTasks : initiatedTasks.slice(0, 2);
  const visibleJoinedTasks = showAllTrainingTasks ? joinedTasks : joinedTasks.slice(0, 2);

  return (
    <div
      className="flex flex-col overflow-y-auto"
      style={{
        background: "linear-gradient(170deg, #fdf4ec 0%, #f8eefc 50%, #ede8f8 100%)",
        height: "100%",
        position: "relative",
      }}
    >
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 16, right: 16, zIndex: 10,
          width: 32, height: 32, borderRadius: "50%",
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(232,117,10,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <IcClose />
      </button>

      {/* ── 用户信息区：头像+用户名左右一行（无统计卡片） ── */}
      <div style={{
        padding: "52px 20px 18px",
        background: "linear-gradient(145deg, rgba(255,210,160,0.35) 0%, rgba(255,235,200,0.2) 100%)",
        borderBottom: "1px solid rgba(232,117,10,0.08)",
      }}>
        <div className="flex items-center gap-3">
          {/* 头像 */}
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "linear-gradient(135deg, #ff9a3c, #e8750a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 800, color: "#fff",
            boxShadow: "0 4px 14px rgba(232,117,10,0.28)",
            flexShrink: 0,
          }}>
            张
          </div>
          {/* 用户名 + 手机号 + 会员标签 */}
          <div style={{ flex: 1 }}>
            <div className="flex items-center gap-2 mb-0.5">
              <span style={{ fontSize: 17, fontWeight: 700, color: "#2d2040" }}>张老板</span>
              <div style={{
                display: "flex", alignItems: "center", gap: 3,
                background: "linear-gradient(90deg, #fff3e0, #ffe0b2)",
                border: "1px solid rgba(232,117,10,0.3)",
                borderRadius: 10, padding: "2px 7px",
              }}>
                <IcMember />
                <span style={{ fontSize: 11, color: "#e8750a", fontWeight: 600 }}>餐饮会员</span>
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: "#9a8aaa", fontWeight: 500 }}>{userPhone}</div>
          </div>
        </div>
      </div>

      {/* ── 专属智库 ── */}
      <SectionCard
        title="专属智库"
        badge="需授权"
        items={[
          { Icon: IcReport, label: "餐厅体检分析报告", desc: "专属 AI 诊断，免费领取" },
          { Icon: IcBook,   label: "餐饮 AI 实战提效手册", desc: "2025 最新版，限时获取" },
        ]}
      />

      {/* ── 学习中心 ── */}
      <SectionCard
        title="学习中心"
        items={[
          { Icon: IcTrain, label: "AI培训课程", desc: "9.9元快速上手AI赚钱" },
          { Icon: IcHelp,  label: "帮助中心",   desc: "常见问题与使用指南" },
        ]}
      />

      {/* ── 培训中心（最新与历史任务） ── */}
      <div className="px-3 pt-3 pb-6">
        <div className="flex items-center justify-between px-1 mb-2">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 14, fontWeight: 700, color: "#2d2040" }}>培训中心</span>
            {initiatedUpdateCount > 0 && (
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "2px 7px",
                borderRadius: 999,
                background: "rgba(232,117,10,0.12)",
                border: "1px solid rgba(232,117,10,0.22)",
                fontSize: 11,
                color: "#e8750a",
                fontWeight: 700,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#e8750a" }} />
                {initiatedUpdateCount} 条新进度
              </div>
            )}
          </div>
          <button
            onClick={() => setShowAllTrainingTasks(prev => !prev)}
            style={{ fontSize: 12.5, color: "#e8750a", background: "none", border: "none", fontWeight: 600 }}
          >
            {showAllTrainingTasks ? "收起" : "查看全部"}
          </button>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.78)",
          backdropFilter: "blur(12px)",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.9)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}>
          <button
            onClick={() => setShowAllTrainingTasks(prev => !prev)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "13px 16px",
              background: "linear-gradient(90deg, rgba(255,244,234,0.96), rgba(255,251,247,0.9))",
              border: "none",
              borderBottom: "1px solid rgba(232,117,10,0.08)",
              textAlign: "left",
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, rgba(255,210,160,0.45), rgba(255,235,200,0.35))",
              border: "1px solid rgba(232,117,10,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              <IcTrain />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#2d2040" }}>最新及历史培训任务</div>
              <div style={{ fontSize: 12, color: "#9a8aaa", marginTop: 2 }}>展开查看我发起的与我参加的全部培训任务</div>
            </div>
            <IcChevronRight />
          </button>

          {([
            { title: "我发起的", tasks: visibleInitiatedTasks },
            { title: "我参加的", tasks: visibleJoinedTasks },
          ] as const).map((group, groupIndex) => (
            <div key={group.title} style={{ borderBottom: groupIndex === 0 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px 8px",
              }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "#5f4a72" }}>{group.title}</span>
                <span style={{ fontSize: 11.5, color: "#b0a0c0" }}>{group.title === "我发起的" ? initiatedTasks.length : joinedTasks.length} 条任务</span>
              </div>

              {group.tasks.map((task, taskIndex) => (
                <button
                  key={task.id}
                  onClick={() => {
                    if (task.group === "我发起的") {
                      onOpenTrainingConversation?.();
                    } else {
                      toast.info(`${task.title}详情即将开放`);
                    }
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 16px 12px",
                    background: "none",
                    border: "none",
                    borderBottom: taskIndex < group.tasks.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
                    textAlign: "left",
                  }}
                >
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: task.group === "我发起的" ? "rgba(232,117,10,0.1)" : "rgba(255,210,160,0.22)",
                    border: "1px solid rgba(232,117,10,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <IcChatBubble />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: "#2d2040",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        minWidth: 0,
                        flex: 1,
                      }}>{task.title}</div>
                      {task.hasUpdate && (
                        <span style={{
                          flexShrink: 0,
                          padding: "1px 6px",
                          borderRadius: 999,
                          background: "rgba(232,117,10,0.12)",
                          color: "#e8750a",
                          fontSize: 10.5,
                          fontWeight: 700,
                        }}>新进度</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#8f7b9f", marginTop: 2 }}>{task.progress}</div>
                    <div style={{ fontSize: 11, color: "#b7a7c6", marginTop: 3 }}>{task.time}</div>
                  </div>
                  <IcChevronRight />
                </button>
              ))}
            </div>
          ))}

          <button
            onClick={() => setShowAllTrainingTasks(prev => !prev)}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: "rgba(255,248,240,0.65)",
              border: "none",
              borderTop: "1px solid rgba(232,117,10,0.06)",
              fontSize: 12.5,
              color: "#e8750a",
              fontWeight: 700,
            }}
          >
            {showAllTrainingTasks ? "收起培训任务" : "展开查看全部培训任务"}
          </button>
        </div>
      </div>
    </div>
  );
}
