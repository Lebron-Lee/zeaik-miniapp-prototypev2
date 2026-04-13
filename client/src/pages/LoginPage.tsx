/**
 * 智爱客-餐饮AI 登录页
 * 设计：logo+专家形象居中展示，功能气泡随机散布在专家形象四周
 */
import { useState } from "react";

const EXPERT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663518710373/QXycpLBxSeowbm34BVNxpL/zeaik_expert_nobg_f210d4f5.png";
const LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663518710373/QXycpLBxSeowbm34BVNxpL/产品icon144_23ce91eb.png";

// 气泡随机散布：左右两侧各3个，高度错落、角度微倾，营造自然感
// 文案与5大功能点对齐：工资日结 / AI巡检 / 服务检测 / 智能对讲 / 碎片化培训
const FEATURE_BUBBLES = [
  { text: "工资日结不用等",     side: "left",  top: "8%",  rotate: "-3deg", delay: "0s"    },
  { text: "AI巡检不漏项",      side: "right", top: "12%", rotate: "4deg",  delay: "0.1s"  },
  { text: "服务检测自动化",     side: "left",  top: "32%", rotate: "2deg",  delay: "0.2s"  },
  { text: "智能对讲省人力",     side: "right", top: "38%", rotate: "-5deg", delay: "0.15s" },
  { text: "碎片时间学AI",      side: "left",  top: "55%", rotate: "-2deg", delay: "0.25s" },
  { text: "餐饮AI来帮你赚钱",  side: "right", top: "60%", rotate: "3deg",  delay: "0.3s"  },
];

interface LoginPageProps {
  onLogin: (phone: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [agreed, setAgreed] = useState(false);

  const handleLogin = () => {
    if (!agreed) setAgreed(true);
    onLogin("138****8888");
  };

  return (
    <div
      className="relative flex flex-col h-full overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #f0f0fa 0%, #f8f0ff 40%, #fff8f0 70%, #ffffff 100%)",
      }}
    >
      {/* 状态栏 */}
      <div className="flex items-center justify-between px-6 pt-3 pb-1" style={{ fontSize: 14, fontWeight: 600 }}>
        <span style={{ color: "#1a1a2e" }}>9:41</span>
        <div className="flex items-center gap-1.5">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect x="0" y="4" width="3" height="8" rx="1" fill="#1a1a2e" opacity="0.4"/>
            <rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill="#1a1a2e" opacity="0.6"/>
            <rect x="9" y="0.5" width="3" height="11.5" rx="1" fill="#1a1a2e" opacity="0.9"/>
            <rect x="13.5" y="0" width="2.5" height="12" rx="1" fill="#1a1a2e"/>
          </svg>
          <svg width="16" height="12" viewBox="0 0 24 18" fill="none">
            <path d="M12 4C15.5 4 18.5 5.5 20.5 8L22.5 6C19.9 3.1 16.2 1.5 12 1.5S4.1 3.1 1.5 6L3.5 8C5.5 5.5 8.5 4 12 4Z" fill="#1a1a2e" opacity="0.4"/>
            <path d="M12 8C14.2 8 16.2 8.9 17.7 10.4L19.7 8.4C17.6 6.3 14.9 5 12 5S6.4 6.3 4.3 8.4L6.3 10.4C7.8 8.9 9.8 8 12 8Z" fill="#1a1a2e" opacity="0.7"/>
            <path d="M12 12C13.1 12 14.1 12.4 14.8 13.2L16.8 11.2C15.5 9.8 13.8 9 12 9S8.5 9.8 7.2 11.2L9.2 13.2C9.9 12.4 10.9 12 12 12Z" fill="#1a1a2e"/>
            <circle cx="12" cy="16" r="2" fill="#1a1a2e"/>
          </svg>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <div style={{ width: 22, height: 11, border: "1.5px solid #1a1a2e", borderRadius: 3, padding: "1px 2px", display: "flex", alignItems: "center" }}>
              <div style={{ width: "80%", height: "100%", background: "#1a1a2e", borderRadius: 1.5 }}/>
            </div>
          </div>
        </div>
      </div>

      {/* 顶部 Logo + 品牌名：居中 */}
      <div className="flex flex-col items-center pt-4 pb-2">
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: "rgba(255,255,255,0.9)",
          boxShadow: "0 4px 20px rgba(232,117,10,0.18), 0 0 0 1px rgba(255,255,255,0.9)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 8,
        }}>
          <img src={LOGO_IMG} alt="zeaik" style={{ width: 48, height: 48, borderRadius: 12 }} />
        </div>
        <div style={{ fontWeight: 800, fontSize: 20, color: "#1a1a2e", letterSpacing: 1 }}>智爱客</div>
        <div style={{ fontSize: 12, color: "#bbadd0", marginTop: 2, fontWeight: 400 }}>餐饮AI赋能平台</div>
      </div>

      {/* 功能气泡区 + 专家形象（居中） */}
      <div className="relative flex-1 flex flex-col items-center justify-center" style={{ minHeight: 0 }}>
        {/* 气泡标签：左右散布 */}
        {FEATURE_BUBBLES.map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: b.top,
              ...(b.side === "left"
                ? { left: i % 2 === 0 ? "2%" : "4%" }
                : { right: i % 2 === 0 ? "2%" : "4%" }),
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(10px)",
              borderRadius: 20,
              padding: "5px 13px",
              fontSize: 11.5,
              color: "#e8750a",
              fontWeight: 600,
              boxShadow: "0 2px 14px rgba(232,117,10,0.13), 0 0 0 1px rgba(255,255,255,0.95)",
              whiteSpace: "nowrap",
              transform: `rotate(${b.rotate})`,
              zIndex: 2,
              animation: `floatBubble 3s ease-in-out ${b.delay} infinite alternate`,
            }}
          >
            {b.text}
          </div>
        ))}

        {/* 专家形象：居中 */}
        <div style={{ position: "relative", width: 200, height: 240, zIndex: 3 }}>
          <img
            src={EXPERT_IMG}
            alt="小智"
            style={{
              width: "100%", height: "100%",
              objectFit: "contain",
              objectPosition: "bottom center",
              filter: "drop-shadow(0 8px 28px rgba(232,117,10,0.18))",
            }}
          />
          {/* 底部光晕 */}
          <div style={{
            position: "absolute", bottom: 0, left: "50%",
            transform: "translateX(-50%)",
            width: 160, height: 36,
            background: "radial-gradient(ellipse, rgba(232,117,10,0.18) 0%, transparent 70%)",
          }}/>
        </div>

        {/* 打招呼文字：居中 */}
        <div className="text-center mt-3 px-6">
          <div style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e" }}>
            Hi，我是 <span style={{ color: "#e8750a" }}>小智</span>
          </div>
          <div style={{ fontSize: 13.5, color: "#9a8aaa", marginTop: 4, fontWeight: 400 }}>
            餐饮AI专家，赚钱的事就找小智～
          </div>
        </div>
      </div>

      {/* 登录区域 */}
      <div className="px-6 pb-8 pt-4">
        {/* 手机号展示 */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <span style={{ fontSize: 22, fontWeight: 700, color: "#1a1a2e", letterSpacing: 1 }}>
            138****8888
          </span>
          <button
            style={{
              background: "#f0f0f5",
              border: "none",
              borderRadius: 12,
              padding: "3px 10px",
              fontSize: 12,
              color: "#666",
              fontWeight: 500,
            }}
          >
            换号
          </button>
        </div>

        {/* 微信一键登录按钮 */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            height: 52,
            borderRadius: 26,
            background: "linear-gradient(135deg, #07c160 0%, #06ad56 100%)",
            border: "none",
            color: "#fff",
            fontSize: 17,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: "0 4px 16px rgba(7,193,96,0.35)",
            transition: "all 0.2s ease",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M8.5 13.5C9.33 13.5 10 12.83 10 12S9.33 10.5 8.5 10.5 7 11.17 7 12 7.67 13.5 8.5 13.5ZM15.5 13.5C16.33 13.5 17 12.83 17 12S16.33 10.5 15.5 10.5 14 11.17 14 12 14.67 13.5 15.5 13.5Z" fill="white"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.36 14.99 3 16.27L2 22L7.73 21C9.01 21.64 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C10.57 20 9.22 19.64 8.05 19L4 20L5 15.95C4.36 14.78 4 13.43 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="white"/>
          </svg>
          微信手机号一键登录
        </button>

        {/* 协议 */}
        <div
          className="flex items-start gap-2 mt-4"
          onClick={() => setAgreed(!agreed)}
          style={{ cursor: "pointer" }}
        >
          <div
            style={{
              width: 18, height: 18, borderRadius: "50%",
              border: agreed ? "none" : "1.5px solid #ccc",
              background: agreed ? "#e8750a" : "transparent",
              flexShrink: 0, marginTop: 1,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            {agreed && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span style={{ fontSize: 11, color: "#999", lineHeight: 1.6 }}>
            阅读并同意
            <a href="#" style={{ color: "#e8750a" }} onClick={e => e.stopPropagation()}>《服务协议》</a>
            <a href="#" style={{ color: "#e8750a" }} onClick={e => e.stopPropagation()}>《隐私政策》</a>
            <a href="#" style={{ color: "#e8750a" }} onClick={e => e.stopPropagation()}>《用户授权协议》</a>
          </span>
        </div>
      </div>

      {/* 气泡浮动动画 */}
      <style>{`
        @keyframes floatBubble {
          0%   { transform: translateY(0px) rotate(var(--r, 0deg)); }
          100% { transform: translateY(-6px) rotate(var(--r, 0deg)); }
        }
      `}</style>
    </div>
  );
}
