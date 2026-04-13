/**
 * 智爱客-餐饮AI 第三阶段：店铺信息采集页
 * 功能：AI引导填写店铺基础信息 → 申请全功能试用 → 一键电话咨询
 * 设计风格：橙色品牌色，卡片式表单，AI引导气泡
 */
import { useState } from "react";
import { toast } from "sonner";

const LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663518710373/QXycpLBxSeowbm34BVNxpL/产品icon144_23ce91eb.png";
const EXPERT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663518710373/QXycpLBxSeowbm34BVNxpL/zeaik_expert_nobg_f210d4f5.png";

interface StoreInfoPageProps {
  userPhone: string;
  onBack: () => void;
}

type StoreType = "快餐" | "正餐" | "火锅" | "烧烤" | "奶茶" | "其他";
type AreaRange = "50㎡以下" | "50-100㎡" | "100-300㎡" | "300㎡以上";
type StaffRange = "1-5人" | "6-15人" | "16-30人" | "30人以上";

interface StoreInfo {
  name: string;
  address: string;
  type: StoreType | "";
  area: AreaRange | "";
  staff: StaffRange | "";
}

const STORE_TYPES: StoreType[] = ["快餐", "正餐", "火锅", "烧烤", "奶茶", "其他"];
const AREA_RANGES: AreaRange[] = ["50㎡以下", "50-100㎡", "100-300㎡", "300㎡以上"];
const STAFF_RANGES: StaffRange[] = ["1-5人", "6-15人", "16-30人", "30人以上"];

export default function StoreInfoPage({ userPhone, onBack }: StoreInfoPageProps) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [info, setInfo] = useState<StoreInfo>({
    name: "", address: "", type: "", area: "", staff: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);

  const isComplete = info.name && info.address && info.type && info.area && info.staff;

  const handleSubmit = () => {
    if (!isComplete) {
      toast.error("请填写完整的店铺信息");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep("success");
    }, 1500);
  };

  const handleCall = () => {
    setShowCallModal(true);
  };

  if (step === "success") {
    return (
      <div style={{
        height: "100%", display: "flex", flexDirection: "column",
        background: "linear-gradient(170deg, #fdf4ec 0%, #f8eefc 35%, #ede8f8 65%, #e8eaf5 100%)",
        overflow: "auto",
      }}>
        {/* 顶部导航 */}
        <div style={{ display: "flex", alignItems: "center", padding: "12px 16px 8px", flexShrink: 0 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="#2d2040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* 成功内容 */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px 32px" }}>
          {/* 成功图标 */}
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, #ff9a3c, #e8750a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 32px rgba(232,117,10,0.35)",
            marginBottom: 20,
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div style={{ fontSize: 22, fontWeight: 800, color: "#2d2040", marginBottom: 8 }}>申请已提交！</div>
          <div style={{ fontSize: 14, color: "#9a8aaa", textAlign: "center", lineHeight: 1.7, marginBottom: 28 }}>
            智爱客顾问将在 <strong style={{ color: "#e8750a" }}>2小时内</strong> 联系您<br/>
            为「{info.name}」定制专属AI解决方案
          </div>

          {/* 店铺信息摘要 */}
          <div style={{
            width: "100%", background: "rgba(255,255,255,0.92)",
            borderRadius: 16, padding: "16px",
            boxShadow: "0 4px 20px rgba(100,80,140,0.08)",
            border: "1px solid rgba(220,210,240,0.4)",
            marginBottom: 24,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#2d2040", marginBottom: 12 }}>您的店铺信息</div>
            {[
              { label: "店铺名称", value: info.name },
              { label: "经营地址", value: info.address },
              { label: "店铺类型", value: info.type },
              { label: "店铺面积", value: info.area },
              { label: "员工数量", value: info.staff },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(220,210,240,0.3)" }}>
                <span style={{ fontSize: 13, color: "#9a8aaa" }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#2d2040" }}>{value}</span>
              </div>
            ))}
          </div>

          {/* 一键电话咨询 */}
          <button
            onClick={handleCall}
            style={{
              width: "100%", padding: "15px",
              background: "linear-gradient(135deg, #ff9a3c, #e8750a)",
              border: "none", borderRadius: 16,
              color: "#fff", fontSize: 16, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 4px 20px rgba(232,117,10,0.4)",
              cursor: "pointer", marginBottom: 10,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
            立即电话咨询
          </button>
          <button
            onClick={onBack}
            style={{
              width: "100%", padding: "12px",
              background: "transparent", border: "1px solid rgba(200,190,220,0.4)",
              borderRadius: 12, color: "#9a8aaa", fontSize: 14, cursor: "pointer",
            }}
          >
            返回首页继续体验
          </button>
        </div>

        {/* 电话咨询弹窗 */}
        {showCallModal && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 300,
            background: "rgba(30,15,50,0.55)", backdropFilter: "blur(6px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 24px",
          }}>
            <div style={{
              width: "100%", background: "#fff",
              borderRadius: 20, padding: "28px 24px",
              boxShadow: "0 8px 40px rgba(100,60,160,0.2)",
              textAlign: "center",
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: "50%",
                background: "linear-gradient(135deg, #ff9a3c, #e8750a)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
                  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
                </svg>
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#2d2040", marginBottom: 6 }}>智爱客顾问热线</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#e8750a", letterSpacing: 2, marginBottom: 8 }}>
                400-888-8888
              </div>
              <div style={{ fontSize: 13, color: "#9a8aaa", marginBottom: 24 }}>
                周一至周日 9:00 - 21:00<br/>专属顾问1对1服务
              </div>
              <a
                href="tel:4008888888"
                style={{
                  display: "block", width: "100%", padding: "14px",
                  background: "linear-gradient(135deg, #ff9a3c, #e8750a)",
                  borderRadius: 14, color: "#fff",
                  fontSize: 16, fontWeight: 700, textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(232,117,10,0.35)",
                  marginBottom: 10,
                }}
              >
                立即拨打
              </a>
              <button
                onClick={() => setShowCallModal(false)}
                style={{
                  width: "100%", padding: "12px",
                  background: "transparent", border: "none",
                  color: "#9a8aaa", fontSize: 14, cursor: "pointer",
                }}
              >
                稍后再说
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      background: "linear-gradient(170deg, #fdf4ec 0%, #f8eefc 35%, #ede8f8 65%, #e8eaf5 100%)",
    }}>
      {/* 顶部导航 */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 16px 8px", flexShrink: 0,
      }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#2d2040" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#2d2040" }}>申请全功能试用</div>
          <div style={{ fontSize: 11, color: "#9a8aaa" }}>填写店铺信息，获取精准方案</div>
        </div>
        <div style={{ width: 28 }}/>
      </div>

      {/* 滚动内容区 */}
      <div style={{ flex: 1, overflow: "auto", padding: "0 16px 24px" }}>

        {/* AI引导气泡 */}
        <div style={{
          display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 20,
        }}>
          <img src={EXPERT_IMG} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", objectPosition: "top", flexShrink: 0 }} alt="小智"/>
          <div style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: "4px 18px 18px 18px",
            padding: "12px 14px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            border: "1px solid rgba(230,220,245,0.7)",
            fontSize: 14.5, color: "#2d2040", lineHeight: 1.6,
            maxWidth: "85%",
          }}>
            您好！我是小智 👋<br/>
            填写您的店铺基础信息，我可以为您提供<strong>更精准的AI解决方案</strong>，并安排顾问为您申请<strong style={{ color: "#e8750a" }}>全功能免费试用</strong>！
          </div>
        </div>

        {/* 表单卡片 */}
        <div style={{
          background: "rgba(255,255,255,0.92)",
          borderRadius: 20,
          boxShadow: "0 4px 20px rgba(100,80,140,0.08)",
          border: "1px solid rgba(220,210,240,0.4)",
          overflow: "hidden",
          marginBottom: 16,
        }}>
          {/* 店铺名称 */}
          <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid rgba(220,210,240,0.3)" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#2d2040", display: "block", marginBottom: 8 }}>
              <span style={{ color: "#e8750a" }}>*</span> 店铺名称
            </label>
            <input
              type="text"
              placeholder="请输入您的店铺名称"
              value={info.name}
              onChange={e => setInfo(prev => ({ ...prev, name: e.target.value }))}
              style={{
                width: "100%", padding: "10px 12px",
                background: "rgba(245,240,255,0.5)",
                border: "1px solid rgba(200,190,220,0.4)",
                borderRadius: 10, fontSize: 15, color: "#2d2040",
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          {/* 经营地址 */}
          <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid rgba(220,210,240,0.3)" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#2d2040", display: "block", marginBottom: 8 }}>
              <span style={{ color: "#e8750a" }}>*</span> 经营地址
            </label>
            <input
              type="text"
              placeholder="请输入店铺所在城市/区域"
              value={info.address}
              onChange={e => setInfo(prev => ({ ...prev, address: e.target.value }))}
              style={{
                width: "100%", padding: "10px 12px",
                background: "rgba(245,240,255,0.5)",
                border: "1px solid rgba(200,190,220,0.4)",
                borderRadius: 10, fontSize: 15, color: "#2d2040",
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          {/* 店铺类型 */}
          <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid rgba(220,210,240,0.3)" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#2d2040", display: "block", marginBottom: 10 }}>
              <span style={{ color: "#e8750a" }}>*</span> 店铺类型
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {STORE_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setInfo(prev => ({ ...prev, type: t }))}
                  style={{
                    padding: "7px 16px", borderRadius: 20,
                    background: info.type === t
                      ? "linear-gradient(135deg, #ff9a3c, #e8750a)"
                      : "rgba(245,240,255,0.6)",
                    border: info.type === t ? "none" : "1px solid rgba(200,190,220,0.4)",
                    color: info.type === t ? "#fff" : "#6a5a7a",
                    fontSize: 14, fontWeight: info.type === t ? 600 : 400,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* 店铺面积 */}
          <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid rgba(220,210,240,0.3)" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#2d2040", display: "block", marginBottom: 10 }}>
              <span style={{ color: "#e8750a" }}>*</span> 店铺面积
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {AREA_RANGES.map(a => (
                <button
                  key={a}
                  onClick={() => setInfo(prev => ({ ...prev, area: a }))}
                  style={{
                    padding: "7px 14px", borderRadius: 20,
                    background: info.area === a
                      ? "linear-gradient(135deg, #ff9a3c, #e8750a)"
                      : "rgba(245,240,255,0.6)",
                    border: info.area === a ? "none" : "1px solid rgba(200,190,220,0.4)",
                    color: info.area === a ? "#fff" : "#6a5a7a",
                    fontSize: 14, fontWeight: info.area === a ? 600 : 400,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* 员工数量 */}
          <div style={{ padding: "16px 16px 16px" }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "#2d2040", display: "block", marginBottom: 10 }}>
              <span style={{ color: "#e8750a" }}>*</span> 员工数量
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {STAFF_RANGES.map(s => (
                <button
                  key={s}
                  onClick={() => setInfo(prev => ({ ...prev, staff: s }))}
                  style={{
                    padding: "7px 14px", borderRadius: 20,
                    background: info.staff === s
                      ? "linear-gradient(135deg, #ff9a3c, #e8750a)"
                      : "rgba(245,240,255,0.6)",
                    border: info.staff === s ? "none" : "1px solid rgba(200,190,220,0.4)",
                    color: info.staff === s ? "#fff" : "#6a5a7a",
                    fontSize: 14, fontWeight: info.staff === s ? 600 : 400,
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 试用权益说明 */}
        <div style={{
          background: "rgba(255,154,60,0.08)",
          border: "1px solid rgba(255,154,60,0.2)",
          borderRadius: 14, padding: "14px 16px", marginBottom: 20,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#c45e00", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#e8750a">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            全功能试用权益（14天）
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[
              "✅ 工资日结系统",
              "✅ AI智能巡检",
              "✅ 服务质检检测",
              "✅ 智能对讲系统",
              "✅ 碎片化AI培训",
              "✅ 经营数据分析",
            ].map(item => (
              <div key={item} style={{ fontSize: 12.5, color: "#7a5a30" }}>{item}</div>
            ))}
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          onClick={handleSubmit}
          disabled={!isComplete || submitting}
          style={{
            width: "100%", padding: "15px",
            background: isComplete
              ? "linear-gradient(135deg, #ff9a3c, #e8750a)"
              : "rgba(200,190,220,0.4)",
            border: "none", borderRadius: 16,
            color: isComplete ? "#fff" : "#9a8aaa",
            fontSize: 17, fontWeight: 700,
            cursor: isComplete ? "pointer" : "not-allowed",
            boxShadow: isComplete ? "0 4px 20px rgba(232,117,10,0.4)" : "none",
            transition: "all 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            marginBottom: 12,
          }}
        >
          {submitting ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                <path d="M12 2a10 10 0 0110 10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              提交中...
            </>
          ) : (
            <>
              申请全功能试用
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
          )}
        </button>

        {/* 一键电话咨询 */}
        <button
          onClick={handleCall}
          style={{
            width: "100%", padding: "13px",
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(232,117,10,0.3)",
            borderRadius: 16, color: "#e8750a",
            fontSize: 15, fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#e8750a">
            <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
          </svg>
          不想填表？直接电话咨询
        </button>
      </div>

      {/* 电话咨询弹窗 */}
      {showCallModal && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 300,
          background: "rgba(30,15,50,0.55)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 24px",
        }}>
          <div style={{
            width: "100%", background: "#fff",
            borderRadius: 20, padding: "28px 24px",
            boxShadow: "0 8px 40px rgba(100,60,160,0.2)",
            textAlign: "center",
          }}>
            <div style={{
              width: 60, height: 60, borderRadius: "50%",
              background: "linear-gradient(135deg, #ff9a3c, #e8750a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
              </svg>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#2d2040", marginBottom: 6 }}>智爱客顾问热线</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#e8750a", letterSpacing: 2, marginBottom: 8 }}>
              400-888-8888
            </div>
            <div style={{ fontSize: 13, color: "#9a8aaa", marginBottom: 24 }}>
              周一至周日 9:00 - 21:00<br/>专属顾问1对1服务
            </div>
            <a
              href="tel:4008888888"
              style={{
                display: "block", width: "100%", padding: "14px",
                background: "linear-gradient(135deg, #ff9a3c, #e8750a)",
                borderRadius: 14, color: "#fff",
                fontSize: 16, fontWeight: 700, textDecoration: "none",
                boxShadow: "0 4px 16px rgba(232,117,10,0.35)",
                marginBottom: 10,
              }}
            >
              立即拨打
            </a>
            <button
              onClick={() => setShowCallModal(false)}
              style={{
                width: "100%", padding: "12px",
                background: "transparent", border: "none",
                color: "#9a8aaa", fontSize: 14, cursor: "pointer",
              }}
            >
              稍后再说
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
