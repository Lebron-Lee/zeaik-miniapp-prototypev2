/**
 * StoreAiModelPage.tsx
 * 店面运营AI模型 — 产品功能介绍单页
 * 设计规范：橙色主题 #FF6B35，与首页保持一致
 * 内容来源：zeaik.com 首页「店面运营AI模型」板块
 * 布局：固定顶部导航 + 可滚动内容（Hero → 截图 → 三大功能 → 报告体系 → CTA）
 */
import React from "react";

// ── 截图 CDN ──────────────────────────────────────────────────────────────────
const IMG_DASHBOARD = "https://d2xsxph8kpxj0f.cloudfront.net/310519663518710373/QXycpLBxSeowbm34BVNxpL/store_ai_dashboard-MEecroC5hoSNCMwVUFhnJG.webp";
const IMG_ANALYTICS = "https://d2xsxph8kpxj0f.cloudfront.net/310519663518710373/QXycpLBxSeowbm34BVNxpL/store_ai_analytics-eTxo4UPEW2KL2otRGwCVpe.webp";

// ── 三大核心功能 ──────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "📡",
    title: "实时监控",
    subtitle: "一眼掌握全店动态",
    desc: "店面平面图实时呈现桌台状态、客流动向、厨房运转。问题发生的瞬间，AI 第一时间推送预警，让你永远不错过关键信息。",
    color: "#FFF3EE",
    border: "#FFD4C0",
  },
  {
    icon: "📊",
    title: "数据分析",
    subtitle: "数字说话，经营更清晰",
    desc: "营业额趋势、翻台率、客单价、菜品销售占比……多维度数据图表一屏呈现，AI 自动生成经营问题报告，让每一分钱都花在刀刃上。",
    color: "#FFF8E6",
    border: "#FFE4A0",
  },
  {
    icon: "🧠",
    title: "智能决策",
    subtitle: "AI 给建议，你来拍板",
    desc: "基于实时数据与历史规律，AI 主动提出备料调整、排班优化、促销时机等决策建议，把经验变成系统，让新手也能做老板的决定。",
    color: "#F0F9FF",
    border: "#BAE0FF",
  },
];

// ── 报告体系 ──────────────────────────────────────────────────────────────────
const REPORTS = [
  "厨房百元配比分析报告",
  "巡检点分析报告",
  "服务人员考核分析报告",
  "门店收支分析报告",
  "舆情监测预警分析报告",
  "早晚会议问题分析报告",
];

// ── 数据亮点 ──────────────────────────────────────────────────────────────────
const STATS = [
  { value: "实时", label: "数据更新频率" },
  { value: "6+", label: "经营分析报告" },
  { value: "全程", label: "动态追溯" },
  { value: "0延迟", label: "风险预警推送" },
];

interface StoreAiModelPageProps {
  onBack: () => void;
}

export default function StoreAiModelPage({ onBack }: StoreAiModelPageProps) {
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
        }}>店面运营AI模型</span>
      </div>

      {/* ── 可滚动内容区 ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* ── Hero 区 ── */}
        <div style={{
          background: "linear-gradient(160deg, #FF6B35 0%, #FF9A3C 55%, #FFB86A 100%)",
          padding: "24px 20px 28px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -40, right: -40,
            width: 140, height: 140, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }} />
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "rgba(255,255,255,0.2)", borderRadius: 20,
            padding: "4px 12px", marginBottom: 12,
          }}>
            <span style={{ fontSize: 12 }}>🏪</span>
            <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>智爱客 · 店面产品</span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", lineHeight: 1.3, marginBottom: 8 }}>
            店面运营AI模型
            <br />
            <span style={{ fontSize: 17, fontWeight: 600, opacity: 0.9 }}>AI运营模型，智控全局</span>
          </div>
          <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.88)", lineHeight: 1.7, marginBottom: 20 }}>
            实时监控 · 数据分析 · 智能决策，三位一体，让每一家店都拥有专属的 AI 运营大脑，提升顾客体验的同时，让老板轻松省心。
          </div>
          {/* 数据格 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.16)",
                borderRadius: 10, padding: "10px 12px",
              }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 截图展示 ── */}
        <div style={{ background: "#FFF8F5", padding: "20px 16px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 12 }}>
            产品界面预览
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { src: IMG_DASHBOARD, label: "实时监控大屏 — 店面全局一览" },
              { src: IMG_ANALYTICS, label: "经营数据看板 — 多维分析报告" },
            ].map((item, i) => (
              <div key={i}>
                <div style={{
                  borderRadius: 12, overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}>
                  <img src={item.src} alt={item.label} style={{ width: "100%", display: "block" }} />
                </div>
                <div style={{ marginTop: 6, fontSize: 12, color: "#888", textAlign: "center" }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 三大功能 ── */}
        <div style={{ padding: "20px 16px", background: "#fff" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#111", marginBottom: 4 }}>三大核心能力</div>
          <div style={{ fontSize: 12.5, color: "#999", marginBottom: 16 }}>实时监控 · 数据分析 · 智能决策</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: f.color, border: `1px solid ${f.border}`,
                borderRadius: 14, padding: "16px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 22 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>{f.title}</div>
                    <div style={{ fontSize: 12, color: "#FF6B35", fontWeight: 600 }}>{f.subtitle}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 报告体系 ── */}
        <div style={{ padding: "20px 16px", background: "#F7F8FA" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#111", marginBottom: 4 }}>6大经营分析报告</div>
          <div style={{ fontSize: 12.5, color: "#999", marginBottom: 14 }}>全程动态追溯，问题源头一目了然</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {REPORTS.map((r, i) => (
              <div key={i} style={{
                background: "#fff",
                border: "1px solid #FFD4C0",
                borderRadius: 20, padding: "6px 14px",
                fontSize: 12.5, color: "#FF6B35", fontWeight: 600,
                boxShadow: "0 1px 4px rgba(255,107,53,0.1)",
              }}>{r}</div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{ padding: "20px 16px 36px", background: "#fff" }}>
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
