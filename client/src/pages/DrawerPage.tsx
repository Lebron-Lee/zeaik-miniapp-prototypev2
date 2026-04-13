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

const IcTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e05a5a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
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

// ─── 模拟对话记录数据 ────────────────────────────────────────────────────────

const INITIAL_CHATS = [
  { id: 1, title: "餐饮店在哪些环节可以用AI来干活？", time: "今天 14:32" },
  { id: 2, title: "初中毕业的服务员能上手AI吗？", time: "今天 11:08" },
  { id: 3, title: "餐饮店用AI需要投入多少钱？", time: "昨天 16:45" },
  { id: 4, title: "如何用AI提升翻台率？", time: "昨天 09:20" },
  { id: 5, title: "智能巡检功能怎么配置？", time: "3天前" },
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

export default function DrawerPage({ userPhone, onClose }: DrawerPageProps) {
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggleSelect = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const deleteSelected = () => {
    setChats(prev => prev.filter(c => !selected.has(c.id)));
    setSelected(new Set());
    setEditMode(false);
    toast.success("已删除所选对话记录");
  };

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

      {/* ── 对话记录（蚂蚁阿福风格，移至最后） ── */}
      <div className="px-3 pt-3 pb-6">
        <div className="flex items-center justify-between px-1 mb-2">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 14, fontWeight: 700, color: "#2d2040" }}>对话记录</span>
          </div>
          <button
            onClick={() => { setEditMode(!editMode); setSelected(new Set()); }}
            style={{
              fontSize: 12.5, color: editMode ? "#e8750a" : "#9a8aaa",
              background: "none", border: "none", fontWeight: 600,
            }}
          >
            {editMode ? "取消" : "管理"}
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
          {chats.length === 0 ? (
            <div style={{ padding: "28px 0", textAlign: "center", color: "#b0a0c0", fontSize: 13 }}>
              暂无对话记录
            </div>
          ) : (
            chats.map((chat, i) => (
              <button
                key={chat.id}
                onClick={() => editMode ? toggleSelect(chat.id) : toast.info("对话详情即将开放")}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 16px",
                  background: selected.has(chat.id) ? "rgba(255,240,220,0.9)" : "none",
                  border: "none",
                  borderBottom: i < chats.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
              >
                {/* 左侧图标 */}
                {editMode ? (
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    border: `2px solid ${selected.has(chat.id) ? "#e8750a" : "#d0c0e0"}`,
                    background: selected.has(chat.id) ? "#e8750a" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {selected.has(chat.id) && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>
                ) : (
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: "linear-gradient(135deg, rgba(255,210,160,0.45), rgba(255,235,200,0.35))",
                    border: "1px solid rgba(232,117,10,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <IcChatBubble />
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13.5, fontWeight: 600, color: "#2d2040",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{chat.title}</div>
                  <div style={{ fontSize: 11.5, color: "#b0a0c0", marginTop: 2 }}>{chat.time}</div>
                </div>
                {!editMode && <IcChevronRight />}
              </button>
            ))
          )}
        </div>

        {/* 删除按钮（管理模式） */}
        {editMode && selected.size > 0 && (
          <button
            onClick={deleteSelected}
            style={{
              width: "100%", marginTop: 10,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              padding: "11px",
              background: "rgba(255,240,240,0.9)",
              border: "1px solid rgba(224,90,90,0.2)",
              borderRadius: 14,
              fontSize: 13.5, color: "#e05a5a", fontWeight: 600,
            }}
          >
            <IcTrash />
            删除所选 ({selected.size} 条)
          </button>
        )}
      </div>
    </div>
  );
}
