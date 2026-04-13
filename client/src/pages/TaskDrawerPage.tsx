/**
 * TaskDrawerPage.tsx
 * 工作清单页专属抽屉内容
 * 设计规范：服务员信息 + 今日/本月收入 + 今日班次 + 数字岗位
 */
import React from "react";

interface TaskDrawerPageProps {
  onClose: () => void;
  onOpenDailySalary?: () => void;
  onOpenQuotaDetail?: (code: string) => void;
}

const SHIFTS = [
  { label: "值早班", time: "09:30～10:00", active: false },
  { label: "午班",   time: "10:00～14:30", active: true  },
  { label: "晚班",   time: "14:00～21:00", active: false },
];

const POSITIONS = [
  "BZ-0001 马来西亚茶台整理",
  "BZ-0003 柏林茶台整理",
  "BZ-0006 菲律宾摆台",
  "BZ-0017 维也纳茶台整理",
  "BZ-0015 春满园摆台",
  "LC-0001 收银",
  "LC-0005 引导落座",
  "LC-0009 送客",
  "LC-0006 洗碗",
  "LC-0002 迎宾",
  "LC-0003 餐中服务",
];

export default function TaskDrawerPage({ onClose, onOpenDailySalary, onOpenQuotaDetail }: TaskDrawerPageProps) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#F2F3F7",
      display: "flex", flexDirection: "column",
      fontFamily: "'PingFang SC', 'Helvetica Neue', Arial, sans-serif",
      overflowY: "auto",
    }}>
      {/* 顶部状态栏占位 */}
      <div style={{ height: 44, background: "#fff", flexShrink: 0 }} />

      {/* 服务员标题行 */}
      <div style={{
        background: "#fff",
        padding: "16px 20px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}
          onClick={onClose}
        >
          <span style={{ fontSize: 22, fontWeight: 700, color: "#111" }}>服务员：曹敏</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="#333" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="#999" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* 收入卡片 */}
      <div style={{ padding: "12px 16px 0" }}>
        <div
          style={{
            background: "#fff", borderRadius: 14,
            padding: "20px 24px",
            display: "flex", gap: 0,
            cursor: onOpenDailySalary ? "pointer" : "default",
            boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
          }}
          onClick={onOpenDailySalary}
        >
          {/* 今日收入 */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#111", letterSpacing: -0.5 }}>
              58.00<span style={{ fontSize: 16, fontWeight: 500 }}>元</span>
            </div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>今日收入</div>
          </div>
          {/* 分隔线 */}
          <div style={{ width: 1, background: "#F0F0F0", margin: "0 16px" }} />
          {/* 本月收入 */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#111", letterSpacing: -0.5 }}>
              1532.00<span style={{ fontSize: 16, fontWeight: 500 }}>元</span>
            </div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>本月收入</div>
          </div>
        </div>
      </div>

      {/* 今日班次 */}
      <div style={{ padding: "14px 16px 0" }}>
        <div style={{
          background: "#fff", borderRadius: 14,
          padding: "16px 16px",
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        }}>
          {/* 标题 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 4, height: 18, background: "#4B7BF5", borderRadius: 2 }} />
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>今日班次</span>
          </div>
          {/* 班次列表 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {SHIFTS.map((shift) => (
              <div
                key={shift.label}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: shift.active
                    ? "linear-gradient(90deg, #4B9FFF 0%, #74C3FF 100%)"
                    : "#F5F6FA",
                }}
              >
                <span style={{
                  fontSize: 15, fontWeight: shift.active ? 700 : 500,
                  color: shift.active ? "#fff" : "#333",
                }}>
                  {shift.label}
                </span>
                <span style={{
                  fontSize: 14, fontWeight: 500,
                  color: shift.active ? "#fff" : "#555",
                }}>
                  {shift.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 数字岗位 */}
      <div style={{ padding: "14px 16px 24px" }}>
        <div style={{
          background: "#fff", borderRadius: 14,
          padding: "16px 16px",
          boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
        }}>
          {/* 标题 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 4, height: 18, background: "#4B7BF5", borderRadius: 2 }} />
            <span style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>数字岗位</span>
          </div>
          {/* 岗位标签 */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {POSITIONS.map((pos) => {
              // 将「BZ-0001 马来西亚茶台整理」拆分为编号+名称两部分
              const match = pos.match(/^([A-Z]+-\d+)\s(.+)$/);
              return (
                <span
                  key={pos}
                  style={{
                    padding: "6px 12px",
                    background: "#F5F6FA",
                    borderRadius: 8,
                    fontSize: 13, color: "#333",
                    border: "1px solid #EBEBEB",
                    whiteSpace: "nowrap",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {match ? (
                    <>
                      <span
                        style={{
                          color: "#3B5BDB",
                          fontWeight: 700,
                          fontSize: 13,
                          textDecoration: "underline",
                          textUnderlineOffset: 2,
                          cursor: "pointer",
                        }}
                        onClick={() => onOpenQuotaDetail?.(match[1])}
                      >{match[1]}</span>
                      <span style={{ color: "#333" }}>{match[2]}</span>
                    </>
                  ) : pos}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
