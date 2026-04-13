/**
 * AiMenuPage.tsx
 * AI 智能菜单 — 产品功能介绍单页 v2
 * 设计规范：橙色主题 #FF6B35，精简情绪价值文案，三张 App 截图横向展示
 * 参照 zeaik.com/ai-menu 官网介绍风格
 */
import React from "react";

// ── App 截图 CDN ──────────────────────────────────────────────────────────────
const SCREEN1 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663518710373/QXycpLBxSeowbm34BVNxpL/ai_menu_screen1-cN4vBWvDoGwaWFgWoLftfW.webp";
const SCREEN2 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663518710373/QXycpLBxSeowbm34BVNxpL/ai_menu_screen2-jPPoqnPVAkvvo5ejPgsmsj.webp";
const SCREEN3 = "https://d2xsxph8kpxj0f.cloudfront.net/310519663518710373/QXycpLBxSeowbm34BVNxpL/ai_menu_screen3-ctyTUqsmPYahRpZ6i3Yg47.webp";

// ── 三大卖点 ──────────────────────────────────────────────────────────────────
const SELLING_POINTS = [
  {
    emoji: "🎯",
    title: "精准画像，懂你口味",
    desc: "AI 智能菜单深谙顾客喜好，精准绘制味蕾画像，让每一次推荐都合你心意。",
  },
  {
    emoji: "✨",
    title: "智能筛选，菜品精选",
    desc: "根据顾客喜好，AI 智能筛选店内菜品，为你量身推荐，让点餐更轻松。",
  },
  {
    emoji: "⚡",
    title: "快捷服务，效率提升",
    desc: "AI 智能菜单提升点餐效率，员工操作简便，顾客享受快捷服务，美味无需等待。",
  },
];

// ── 主组件 ────────────────────────────────────────────────────────────────────
interface AiMenuPageProps {
  onBack: () => void;
}

export default function AiMenuPage({ onBack }: AiMenuPageProps) {
  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      background: "#F7F8FA",
      fontFamily: "'PingFang SC', 'Helvetica Neue', Arial, sans-serif",
      overflow: "hidden",
    }}>
      {/* ── 状态栏 ── */}
      <div style={{
        height: 44, background: "#FF6B35",
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
            <rect x="1.5" y="1.5" width="15" height="9" rx="1.5" fill="white" />
            <path d="M19.5 4v4a2 2 0 000-4z" fill="white" fillOpacity="0.4" />
          </svg>
        </div>
      </div>

      {/* ── 固定导航栏 ── */}
      <div style={{
        height: 44, background: "#FF6B35",
        display: "flex", alignItems: "center",
        padding: "0 16px", flexShrink: 0,
        position: "relative",
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer",
          padding: 4, display: "flex", alignItems: "center",
          position: "absolute", left: 12,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span style={{
          flex: 1, textAlign: "center",
          fontSize: 17, fontWeight: 700, color: "#fff",
        }}>AI 智能菜单</span>
      </div>

      {/* ── 可滚动内容区 ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* ── Hero 标题区 ── */}
        <div style={{
          background: "#fff",
          padding: "28px 20px 20px",
          borderBottom: "1px solid #F0F0F0",
        }}>
          <div style={{
            fontSize: 22, fontWeight: 800, color: "#111",
            lineHeight: 1.35, marginBottom: 10,
          }}>
            AI 智能菜单，
            <br />
            <span style={{ color: "#FF6B35" }}>味蕾的贴心助手！</span>
          </div>
          <div style={{
            fontSize: 13.5, color: "#888", lineHeight: 1.7,
          }}>
            跨越场景界限，化解传统点餐难题。一件解决顾客点餐双向难题，让顾客点餐乐无忧，员工服务更轻松。
          </div>
        </div>

        {/* ── 三张截图横向展示 ── */}
        <div style={{
          background: "#FFF8F5",
          padding: "20px 0 20px 16px",
          borderBottom: "1px solid #F0F0F0",
        }}>
          <div style={{
            display: "flex", gap: 12, overflowX: "auto",
            scrollbarWidth: "none", paddingRight: 16,
          }}>
            {[
              { src: SCREEN1, label: "智能主页" },
              { src: SCREEN2, label: "菜品浏览" },
              { src: SCREEN3, label: "AI 推荐菜单" },
            ].map((item, i) => (
              <div key={i} style={{ flexShrink: 0, textAlign: "center" }}>
                <div style={{
                  width: 130,
                  borderRadius: 14,
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.14)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}>
                  <img
                    src={item.src}
                    alt={item.label}
                    style={{ width: "100%", display: "block" }}
                  />
                </div>
                <div style={{
                  marginTop: 8, fontSize: 12, color: "#FF6B35",
                  fontWeight: 600,
                }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 三大卖点 ── */}
        <div style={{ padding: "20px 16px 28px", background: "#fff" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {SELLING_POINTS.map((sp, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                {/* 序号圆圈 */}
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "#FFF3EE",
                  border: "1.5px solid #FFD4C0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, flexShrink: 0,
                }}>{sp.emoji}</div>
                <div>
                  <div style={{
                    fontSize: 15, fontWeight: 700,
                    color: "#FF6B35", marginBottom: 5,
                  }}>{sp.title}</div>
                  <div style={{
                    fontSize: 13.5, color: "#666", lineHeight: 1.7,
                  }}>{sp.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA 按钮 ── */}
        <div style={{ padding: "0 16px 36px", background: "#fff" }}>
          <button style={{
            width: "100%",
            background: "linear-gradient(90deg, #FF6B35 0%, #FF9A3C 100%)",
            border: "none", borderRadius: 28,
            padding: "15px 0",
            fontSize: 16, fontWeight: 700, color: "#fff",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(255,107,53,0.38)",
            letterSpacing: 1,
          }}>
            免费咨询
          </button>
        </div>

      </div>
    </div>
  );
}
