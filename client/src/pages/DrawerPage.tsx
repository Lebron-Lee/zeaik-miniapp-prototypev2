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
  onOpenCurrentTrainingTask?: (task: TrainingTask) => void;
  onOpenTrainingDetail?: (task: TrainingTask) => void;
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

// 对话图标
const IcChatBubble = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" fill="rgba(232,117,10,0.12)" stroke="#e8750a" strokeWidth="1.4" strokeLinejoin="round"/>
    <path d="M8 9h8M8 13h5" stroke="#e8750a" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

// ─── 培训中心模拟任务数据 ─────────────────────────────────────────────────────

type TrainingTaskGroup = "我发起的" | "我参加的";

export interface TrainingTask {
  id: number;
  title: string;
  time: string;
  progress: string;
  group: TrainingTaskGroup;
  hasUpdate?: boolean;
}

interface ChatRecord {
  id: number;
  title: string;
  preview: string;
  time: string;
  isTrainingRelated?: boolean;
}

export const TRAINING_TASKS: TrainingTask[] = [
  { id: 1, title: "茶水区服务标准培训", time: "今天 09:41", progress: "新增 3 人完成，完成率 72%", group: "我发起的", hasUpdate: true },
  { id: 2, title: "门店开档检查培训", time: "昨天 18:20", progress: "新增 1 条待完成提醒", group: "我发起的", hasUpdate: true },
  { id: 3, title: "新品推荐话术培训", time: "昨天 11:08", progress: "培训已发起，待 5 人接收", group: "我发起的" },
  { id: 4, title: "服务礼仪标准培训", time: "今天 14:32", progress: "已完成 4/5 题，待提交反馈", group: "我参加的" },
  { id: 5, title: "食品安全晨会培训", time: "昨天 16:45", progress: "培训完成，得分 96 分", group: "我参加的" },
  { id: 6, title: "值班经理交接培训", time: "3天前", progress: "历史任务，可回看记录", group: "我参加的" },
];

export const TRAINING_DRAWER_BADGE_COUNT = TRAINING_TASKS.filter(
  task => task.group === "我发起的" && task.hasUpdate,
).length;

const CHAT_RECORDS: ChatRecord[] = [
  {
    id: 1,
    title: "茶水区服务标准培训",
    preview: "已进入培训会话，可继续查看题目与完成情况。",
    time: "今天 09:41",
    isTrainingRelated: true,
  },
  {
    id: 2,
    title: "扬州大煮干丝介绍",
    preview: "已为你生成菜品介绍，并支持语音播报。",
    time: "昨天 20:16",
  },
  {
    id: 3,
    title: "门店收银高峰怎么排班",
    preview: "已给出岗位安排建议与高峰应对提醒。",
    time: "昨天 11:28",
  },
];

export default function DrawerPage({ userPhone, onClose, onOpenTrainingConversation, onOpenCurrentTrainingTask, onOpenTrainingDetail }: DrawerPageProps) {
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
                    if (onOpenTrainingDetail) {
                      onOpenTrainingDetail(task);
                      return;
                    }
                    onOpenCurrentTrainingTask?.(task);
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

      <div className="px-3 pb-6">
        <div className="flex items-center justify-between px-1 mb-2">
          <span style={{ fontSize: 14, fontWeight: 700, color: "#2d2040" }}>会话记录</span>
          <span style={{ fontSize: 11.5, color: "#b0a0c0" }}>{CHAT_RECORDS.length} 条记录</span>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.78)",
          backdropFilter: "blur(12px)",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.9)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}>
          {CHAT_RECORDS.map((chat, index) => (
            <button
              key={chat.id}
              onClick={() => {
                if (chat.isTrainingRelated) {
                  onOpenCurrentTrainingTask?.(TRAINING_TASKS[0]);
                } else {
                  toast.info(`${chat.title}会话详情即将开放`);
                }
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 16px",
                background: "none",
                border: "none",
                borderBottom: index < CHAT_RECORDS.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
                textAlign: "left",
              }}
            >
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: chat.isTrainingRelated ? "rgba(232,117,10,0.1)" : "rgba(255,210,160,0.22)",
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
                  }}>{chat.title}</div>
                  {chat.isTrainingRelated && (
                    <span style={{
                      flexShrink: 0,
                      padding: "1px 6px",
                      borderRadius: 999,
                      background: "rgba(232,117,10,0.12)",
                      color: "#e8750a",
                      fontSize: 10.5,
                      fontWeight: 700,
                    }}>培训</span>
                  )}
                </div>
                <div style={{ fontSize: 11.5, color: "#8f7b9f", marginTop: 2 }}>{chat.preview}</div>
                <div style={{ fontSize: 11, color: "#b7a7c6", marginTop: 3 }}>{chat.time}</div>
              </div>
              <IcChevronRight />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
