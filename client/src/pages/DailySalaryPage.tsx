/**
 * DailySalaryPage — 工资日结页面
 * 设计风格：蓝紫渐变顶部 + 黄色金额高亮 + 积分卡片 + 等级进度条
 * 三个Tab：当日 / 当月 / 历史
 */

import { useState } from "react";

interface DailySalaryPageProps {
  onBack: () => void;
  onOpenCurrentTask?: () => void;
}

// ── 星星评分 ──
function StarRating({ score = 3, total = 5 }: { score?: number; total?: number }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: total }).map((_, i) => (
        <svg key={i} width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"
            fill={i < score ? "#e8a0c8" : "none"}
            stroke={i < score ? "#e8a0c8" : "#d0b8c8"}
            strokeWidth="1.5"
          />
        </svg>
      ))}
    </div>
  );
}

// ── 等级徽章 ──
interface LevelBadge {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  current: boolean;
}

function ShieldIcon({ color = "#888", size = 32 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 44" fill="none">
      <path
        d="M20 2L4 8v12c0 10 7 19 16 22 9-3 16-12 16-22V8L20 2z"
        fill={color}
      />
      {/* 钻石图案 */}
      <path d="M14 18l6-6 6 6-6 8-6-8z" fill="white" opacity="0.9" />
      <path d="M14 18h12" stroke="white" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

function PersonIcon({ color = "#F5A623", size = 36 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 44" fill="none">
      <circle cx="20" cy="10" r="7" fill={color} />
      <path d="M6 38c0-8 6-14 14-14s14 6 14 14" fill={color} />
      {/* 举手姿势 */}
      <path d="M28 22l6-8" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx="34" cy="14" r="3" fill={color} />
    </svg>
  );
}

// ── 当日内容 ──
function TodayContent({ onOpenCurrentTask }: { onOpenCurrentTask?: () => void }) {
  return (
    <div style={{ flex: 1, overflowY: "auto" }}>
      {/* 顶部蓝紫渐变区域 */}
      <div style={{
        background: "linear-gradient(180deg, #3B5BDB 0%, #5B7FE8 60%, #7B9FF5 100%)",
        padding: "16px 20px 32px",
        position: "relative",
      }}>
        {/* 日期和打卡时间 */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 12, marginBottom: 20,
          color: "rgba(255,255,255,0.9)", fontSize: 15, fontWeight: 500,
        }}>
          <span>2月22日</span>
          <span>上班：9:20</span>
          <span style={{ color: "rgba(255,255,255,0.5)" }}>|</span>
          <span>下班：21:30</span>
        </div>

        {/* 金额展示 */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", marginBottom: 8 }}>
          {/* 今日战果 */}
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 2, justifyContent: "center" }}>
              <span style={{ color: "#FFE566", fontSize: 16, fontWeight: 600 }}>¥</span>
              <span style={{ color: "#FFE566", fontSize: 52, fontWeight: 900, lineHeight: 1 }}>348</span>
            </div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, marginTop: 4 }}>今日战果</div>
          </div>

          {/* 回头客提成 */}
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 2, justifyContent: "center" }}>
              <span style={{ color: "#FFE566", fontSize: 16, fontWeight: 600 }}>¥</span>
              <span style={{ color: "#FFE566", fontSize: 40, fontWeight: 900, lineHeight: 1 }}>51</span>
            </div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, marginTop: 4 }}>回头客提成</div>
          </div>
        </div>
      </div>

      {/* 白色卡片区域（上移覆盖渐变底部） */}
      <div style={{
        margin: "-20px 12px 0",
        background: "#fff",
        borderRadius: 18,
        padding: "16px 14px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        position: "relative", zIndex: 2,
      }}>
        {/* 积分三格 */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {/* 今日积分 */}
          <div style={{
            flex: 1, background: "linear-gradient(135deg, #4A6CF7, #6A8EFF)",
            borderRadius: 12, padding: "10px 12px",
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>今日积分</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>25</span>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>›</span>
            </div>
          </div>

          {/* 总积分 */}
          <div style={{
            flex: 1, background: "linear-gradient(135deg, #3B9EFF, #5BB8FF)",
            borderRadius: 12, padding: "10px 12px",
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>总积分</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>1657</span>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>›</span>
            </div>
          </div>

          {/* 可兑换积分 */}
          <div style={{
            flex: 1, background: "linear-gradient(135deg, #00C9A7, #00E5C0)",
            borderRadius: 12, padding: "10px 12px",
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>可兑换积分</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ color: "#fff", fontSize: 22, fontWeight: 800 }}>57</span>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>›</span>
            </div>
          </div>
        </div>

        {/* 排名行 */}
        <div style={{
          background: "#FFF5EC", borderRadius: 10,
          padding: "8px 14px", marginBottom: 14,
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <span style={{ color: "#888", fontSize: 13 }}>排名：</span>
          <span style={{ color: "#1A1A1A", fontSize: 13 }}>
            第<span style={{ color: "#FF4D4F", fontWeight: 700 }}>2</span>
            <span style={{ color: "#FF4D4F", fontSize: 10, marginLeft: 2 }}>↑</span>
          </span>
          <span style={{ color: "#1A1A1A", fontSize: 13 }}>
            周：第<span style={{ color: "#1A1A1A", fontWeight: 700 }}>2</span>
            <span style={{ color: "#52C41A", fontSize: 10, marginLeft: 2 }}>↓</span>
          </span>
          <span style={{ color: "#1A1A1A", fontSize: 13 }}>
            月：第<span style={{ color: "#1A1A1A", fontWeight: 700 }}>3</span>
            <span style={{ color: "#FF4D4F", fontSize: 10, marginLeft: 2 }}>↑</span>
          </span>
        </div>

        {/* 等级进度 */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ color: "#1A1A1A", fontSize: 13 }}>再奋战</span>
            <span style={{ color: "#F5A623", fontSize: 15, fontWeight: 700 }}>2100</span>
            <PersonIcon size={28} />
          </div>

          {/* 等级徽章行 */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {/* 人才 - 已过 */}
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{
                background: "#F5F5F5", borderRadius: 10, padding: "8px 4px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}>
                <ShieldIcon color="#F5A623" size={28} />
                <span style={{ fontSize: 11, color: "#F5A623", fontWeight: 600 }}>人才</span>
              </div>
            </div>

            {/* 主管 - 已达到 */}
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{
                background: "linear-gradient(135deg, #FFF3E0, #FFE0B2)",
                border: "1.5px solid #F5A623",
                borderRadius: 10, padding: "8px 4px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}>
                <ShieldIcon color="#F5A623" size={28} />
                <span style={{ fontSize: 11, color: "#F5A623", fontWeight: 700 }}>主管</span>
              </div>
            </div>

            {/* 店长 - 当前冲刺目标（虚线框） */}
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{
                border: "1.5px dashed #F5A623",
                borderRadius: 10, padding: "8px 4px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                background: "rgba(245,166,35,0.05)",
              }}>
                <ShieldIcon color="#F5A623" size={28} />
                <span style={{ fontSize: 11, color: "#F5A623", fontWeight: 700 }}>店长</span>
              </div>
            </div>

            {/* 高管 - 未解锁 */}
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{
                background: "#2A2A2A", borderRadius: 10, padding: "8px 4px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}>
                <ShieldIcon color="#555" size={28} />
                <span style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>高管</span>
              </div>
            </div>

            {/* 股东 - 未解锁 */}
            <div style={{ textAlign: "center", flex: 1 }}>
              <div style={{
                background: "#2A2A2A", borderRadius: 10, padding: "8px 4px",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}>
                <ShieldIcon color="#444" size={28} />
                <span style={{ fontSize: 11, color: "#888", fontWeight: 600 }}>股东</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 工作评价卡片 - 点击进入工作清单 */}
      <div
        onClick={() => onOpenCurrentTask?.()}
        style={{
          margin: "12px 12px 20px",
          background: "#fff",
          borderRadius: 18,
          padding: "16px 16px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          cursor: "pointer",
          transition: "box-shadow 0.15s",
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 18px rgba(59,91,219,0.15)")}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)")}
      >
        <div style={{ fontSize: 17, fontWeight: 700, color: "#1A1A1A", marginBottom: 12 }}>工作评价</div>
        <StarRating score={3} total={5} />
        <div style={{
          display: "flex", gap: 32, marginTop: 14,
          fontSize: 14, color: "#333",
        }}>
          <div>
            <span style={{ color: "#888" }}>完成工作项：</span>
            <span style={{ fontWeight: 600 }}>85项</span>
          </div>
          <div>
            <span style={{ color: "#888" }}>净工时：</span>
            <span style={{ fontWeight: 600 }}>7.6h</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 当月内容 ──
function MonthContent() {
  const days = [
    { date: "2/1", amount: 312, bonus: 0 },
    { date: "2/2", amount: 298, bonus: 20 },
    { date: "2/3", amount: 0, label: "休" },
    { date: "2/4", amount: 356, bonus: 45 },
    { date: "2/5", amount: 321, bonus: 30 },
    { date: "2/6", amount: 0, label: "休" },
    { date: "2/7", amount: 289, bonus: 0 },
    { date: "2/8", amount: 334, bonus: 25 },
    { date: "2/9", amount: 367, bonus: 60 },
    { date: "2/10", amount: 0, label: "休" },
    { date: "2/11", amount: 310, bonus: 15 },
    { date: "2/12", amount: 348, bonus: 51 },
  ];

  const totalAmount = days.reduce((s, d) => s + (d.amount || 0), 0);
  const totalBonus = days.reduce((s, d) => s + (d.bonus || 0), 0);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 20px" }}>
      {/* 月度汇总 */}
      <div style={{
        background: "linear-gradient(135deg, #3B5BDB, #5B7FE8)",
        borderRadius: 16, padding: "16px 20px", marginBottom: 14, marginTop: 12,
      }}>
        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginBottom: 8 }}>2月累计收入</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
          <span style={{ color: "#FFE566", fontSize: 15 }}>¥</span>
          <span style={{ color: "#FFE566", fontSize: 38, fontWeight: 900 }}>{totalAmount.toLocaleString()}</span>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>提成收入</div>
            <div style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>¥{totalBonus}</div>
          </div>
          <div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>出勤天数</div>
            <div style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>{days.filter(d => d.amount > 0).length}天</div>
          </div>
          <div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>休息天数</div>
            <div style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>{days.filter(d => d.amount === 0).length}天</div>
          </div>
        </div>
      </div>

      {/* 日明细列表 */}
      <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "12px 16px 8px", borderBottom: "1px solid #F0F0F0" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>日明细</span>
        </div>
        {days.map((d, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 16px",
            borderBottom: i < days.length - 1 ? "1px solid #F8F8F8" : "none",
          }}>
            <span style={{ fontSize: 14, color: "#555", width: 40 }}>{d.date}</span>
            {d.label ? (
              <span style={{
                background: "#F0F0F0", color: "#888", fontSize: 12,
                padding: "2px 10px", borderRadius: 10,
              }}>{d.label}</span>
            ) : (
              <>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#1A1A1A" }}>¥{d.amount}</span>
                {(d.bonus ?? 0) > 0 ? (
                  <span style={{ fontSize: 12, color: "#F5A623", background: "rgba(245,166,35,0.1)", padding: "2px 8px", borderRadius: 8 }}>
                    +¥{d.bonus} 提成
                  </span>
                ) : (
                  <span style={{ fontSize: 12, color: "#ccc" }}>—</span>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 历史内容 ──
function HistoryContent() {
  const months = [
    { month: "2025年1月", amount: 8920, days: 23, bonus: 680 },
    { month: "2024年12月", amount: 9450, days: 25, bonus: 820 },
    { month: "2024年11月", amount: 8340, days: 22, bonus: 540 },
    { month: "2024年10月", amount: 8780, days: 24, bonus: 620 },
    { month: "2024年9月", amount: 7980, days: 21, bonus: 480 },
    { month: "2024年8月", amount: 8560, days: 23, bonus: 590 },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 20px" }}>
      {/* 年度汇总 */}
      <div style={{
        background: "linear-gradient(135deg, #3B5BDB, #5B7FE8)",
        borderRadius: 16, padding: "16px 20px", marginBottom: 14,
      }}>
        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginBottom: 8 }}>2025年累计收入</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ color: "#FFE566", fontSize: 15 }}>¥</span>
          <span style={{ color: "#FFE566", fontSize: 38, fontWeight: 900 }}>18,370</span>
        </div>
      </div>

      {/* 月度列表 */}
      <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        {months.map((m, i) => (
          <div key={i} style={{
            padding: "14px 16px",
            borderBottom: i < months.length - 1 ? "1px solid #F8F8F8" : "none",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginBottom: 4 }}>{m.month}</div>
              <div style={{ fontSize: 12, color: "#888" }}>出勤{m.days}天 · 提成¥{m.bonus}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#3B5BDB" }}>¥{m.amount.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>›</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 主页面 ──
export default function DailySalaryPage({ onBack, onOpenCurrentTask }: DailySalaryPageProps) {
  const [activeTab, setActiveTab] = useState<"today" | "month" | "history">("today");

  const tabs = [
    { key: "today" as const, label: "当日" },
    { key: "month" as const, label: "当月" },
    { key: "history" as const, label: "历史" },
  ];

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      background: "#F2F3F7",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
    }}>
      {/* 状态栏 */}
      <div style={{
        height: 44, background: "#3B5BDB",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", flexShrink: 0,
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
            <rect x="2" y="2" width="13" height="8" rx="1.5" fill="white" />
            <path d="M20 4.5v3a1.5 1.5 0 000-3z" fill="white" opacity="0.4" />
          </svg>
        </div>
      </div>

      {/* 导航栏 */}
      <div style={{
        height: 48, background: "#3B5BDB",
        display: "flex", alignItems: "center",
        padding: "0 16px", flexShrink: 0,
        position: "relative",
      }}>
        <button
          onClick={onBack}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 4,
            padding: "4px 8px 4px 0",
          }}
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span style={{
          position: "absolute", left: "50%", transform: "translateX(-50%)",
          color: "#fff", fontSize: 17, fontWeight: 700,
        }}>工资日结</span>
      </div>

      {/* Tab 切换 */}
      <div style={{
        background: "#3B5BDB",
        display: "flex", justifyContent: "center", gap: 0,
        padding: "0 0 14px", flexShrink: 0,
      }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "6px 28px",
              color: activeTab === tab.key ? "#FFE566" : "rgba(255,255,255,0.65)",
              fontSize: 15, fontWeight: activeTab === tab.key ? 700 : 400,
              position: "relative",
            }}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div style={{
                position: "absolute", bottom: 0, left: "50%",
                transform: "translateX(-50%)",
                width: 24, height: 2.5,
                background: "#FFE566", borderRadius: 2,
              }} />
            )}
          </button>
        ))}
      </div>

      {/* 内容区 */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {activeTab === "today" && <TodayContent onOpenCurrentTask={onOpenCurrentTask} />}
        {activeTab === "month" && <MonthContent />}
        {activeTab === "history" && <HistoryContent />}
      </div>
    </div>
  );
}
