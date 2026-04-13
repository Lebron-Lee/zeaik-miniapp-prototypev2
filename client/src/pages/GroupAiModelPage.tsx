/**
 * GroupAiModelPage.tsx
 * 集团运营AI模型 — 产品功能介绍单页
 * 设计规范：深蓝金色科技风，与集团驾驶舱视觉一致；顶部导航保持橙色主题
 * 内容来源：zeaik.com 首页「集团运营AI模型」板块
 * 布局：固定顶部导航 + 可滚动内容（Hero → 截图 → 三大功能 → 5A架构 → 愿景 → CTA）
 */
import React from "react";

// ── 截图 CDN ──────────────────────────────────────────────────────────────────
const IMG_COCKPIT = "https://d2xsxph8kpxj0f.cloudfront.net/310519663518710373/QXycpLBxSeowbm34BVNxpL/group_ai_cockpit_official_20cd1b6e.png";

// ── 三大核心功能 ──────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "🚀",
    title: "运营效率提升",
    subtitle: "集团标准，落地每一家店",
    desc: "AI 自动同步集团运营标准到每家门店，实时监控执行情况，让总部政策不再停留在文件里，真正落地为每日行动。",
    color: "#FFF3EE",
    border: "#FFD4C0",
  },
  {
    icon: "🛡️",
    title: "风险预警与应对",
    subtitle: "问题还没发生，AI 已经知道",
    desc: "基于多维度数据模型，AI 提前识别食安风险、服务下滑、营收异常等信号，推送精准预警，让集团管理层在问题扩大前及时介入。",
    color: "#F0F9FF",
    border: "#BAE0FF",
  },
  {
    icon: "⭐",
    title: "客户体验优化",
    subtitle: "每位顾客都值得最好的服务",
    desc: "跨店汇聚顾客反馈与行为数据，AI 识别体验短板，生成改进建议，让每家门店都能持续提升顾客满意度，打造集团口碑护城河。",
    color: "#F6FFED",
    border: "#B7EB8F",
  },
];

// ── 5A架构 ────────────────────────────────────────────────────────────────────
const FIVE_A = [
  { icon: "🍽️", name: "产品AI", desc: "菜品研发与优化" },
  { icon: "🤝", name: "服务AI", desc: "服务流程智能化" },
  { icon: "🏠", name: "环境AI", desc: "门店环境监测" },
  { icon: "👥", name: "客户AI", desc: "顾客画像与洞察" },
  { icon: "💰", name: "财务AI", desc: "收支分析与预测" },
];

// ── 数据亮点 ──────────────────────────────────────────────────────────────────
const STATS = [
  { value: "全局", label: "多店统一管控" },
  { value: "5A", label: "智能处方架构" },
  { value: "实时", label: "风险预警推送" },
  { value: "跨店", label: "数据汇聚分析" },
];

interface GroupAiModelPageProps {
  onBack: () => void;
}

export default function GroupAiModelPage({ onBack }: GroupAiModelPageProps) {
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
        }}>集团运营AI模型</span>
      </div>

      {/* ── 可滚动内容区 ── */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* ── Hero 区（深色科技风） ── */}
        <div style={{
          background: "linear-gradient(160deg, #1A2744 0%, #0D1B3E 60%, #162040 100%)",
          padding: "24px 20px 28px",
          position: "relative", overflow: "hidden",
        }}>
          {/* 装饰光晕 */}
          <div style={{
            position: "absolute", top: -60, right: -60,
            width: 180, height: 180, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,180,50,0.15) 0%, transparent 70%)",
          }} />
          <div style={{
            position: "absolute", bottom: -40, left: -40,
            width: 120, height: 120, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)",
          }} />

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "rgba(255,180,50,0.15)", borderRadius: 20,
            border: "1px solid rgba(255,180,50,0.3)",
            padding: "4px 12px", marginBottom: 12,
          }}>
            <span style={{ fontSize: 12 }}>🏢</span>
            <span style={{ fontSize: 12, color: "#FFB432", fontWeight: 600 }}>智爱客 · 集团产品</span>
          </div>

          <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", lineHeight: 1.3, marginBottom: 8 }}>
            集团运营AI模型
            <br />
            <span style={{ fontSize: 17, fontWeight: 600, color: "#FFB432" }}>全局掌控，营业额飞升！</span>
          </div>
          <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: 20 }}>
            从单店到集团，AI 驾驶舱统一管控所有门店。运营效率提升、风险提前预警、客户体验持续优化，让集团每一家店都跑在最佳状态。
          </div>

          {/* 数据格 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {STATS.map((s, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,180,50,0.2)",
                borderRadius: 10, padding: "10px 12px",
              }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#FFB432" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 驾驶舱截图 ── */}
        <div style={{ background: "#0D1B3E", padding: "20px 16px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#FFB432", marginBottom: 10 }}>
            AI 餐饮驾驶舱 · 全国门店一屏掌控
          </div>
          <div style={{
            borderRadius: 12, overflow: "hidden",
            boxShadow: "0 4px 24px rgba(255,180,50,0.2)",
            border: "1px solid rgba(255,180,50,0.2)",
          }}>
            <img src={IMG_COCKPIT} alt="集团AI驾驶舱" style={{ width: "100%", display: "block" }} />
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: "rgba(255,255,255,0.45)", textAlign: "center" }}>
            智爱客AI餐饮驾驶舱 — 多店数据实时汇聚
          </div>
        </div>

        {/* ── 三大功能 ── */}
        <div style={{ padding: "20px 16px", background: "#fff" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#111", marginBottom: 4 }}>三大核心能力</div>
          <div style={{ fontSize: 12.5, color: "#999", marginBottom: 16 }}>运营效率 · 风险预警 · 客户体验</div>
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

        {/* ── 5A架构 ── */}
        <div style={{ padding: "20px 16px", background: "#F7F8FA" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#111", marginBottom: 4 }}>5A 智能处方架构</div>
          <div style={{ fontSize: 12.5, color: "#999", marginBottom: 14 }}>产品AI · 服务AI · 环境AI · 客户AI · 财务AI</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {FIVE_A.map((a, i) => (
              <div key={i} style={{
                background: "#fff",
                border: "1px solid #E8E8E8",
                borderRadius: 12, padding: "14px 12px",
                display: "flex", alignItems: "center", gap: 10,
                boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                ...(i === 4 ? { gridColumn: "1 / -1", maxWidth: "50%", margin: "0 auto" } : {}),
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "linear-gradient(135deg, #1A2744, #2A3F6F)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, flexShrink: 0,
                }}>{a.icon}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{a.name}</div>
                  <div style={{ fontSize: 11.5, color: "#888" }}>{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 愿景 ── */}
        <div style={{ padding: "20px 16px", background: "#fff" }}>
          <div style={{
            background: "linear-gradient(135deg, #1A2744 0%, #2A3F6F 100%)",
            borderRadius: 16, padding: "18px 16px",
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#FFB432", marginBottom: 12 }}>
              🎯 智爱客愿景目标
            </div>
            {[
              { title: "数据驱动餐饮人", desc: "全员拥有AI助手" },
              { title: "集团标准执行到位", desc: "单店因地制宜，特色AI训练运营" },
              { title: "致广大尽精微", desc: "大到任何地方可查可控，细到一言一行可知可考" },
            ].map((v, i) => (
              <div key={i} style={{
                display: "flex", gap: 10, alignItems: "flex-start",
                marginBottom: i < 2 ? 12 : 0,
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#FFB432", marginTop: 6, flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#fff" }}>{v.title}</div>
                  <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{ padding: "20px 16px 36px", background: "#fff" }}>
          <button style={{
            width: "100%",
            background: "linear-gradient(90deg, #1A2744 0%, #2A3F6F 100%)",
            border: "none", borderRadius: 28,
            padding: "15px 0",
            fontSize: 16, fontWeight: 700, color: "#FFB432",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(26,39,68,0.35)",
            letterSpacing: 1,
          }}>
            预约集团方案演示
          </button>
          <div style={{ marginTop: 10 }}>
            <button style={{
              width: "100%",
              background: "transparent",
              border: "1.5px solid #FF6B35",
              borderRadius: 28, padding: "13px 0",
              fontSize: 15, fontWeight: 600, color: "#FF6B35",
              cursor: "pointer",
            }}>
              免费咨询
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
