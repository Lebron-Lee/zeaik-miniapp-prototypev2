/**
 * 智爱客-餐饮AI 小程序原型 - 视频介绍页
 * 设计风格：深色沉浸式播放器，橙色品牌色，播放完成后展示「体验一下产品」引导
 * 交互：模拟60秒视频播放进度，完成后淡入引导按钮
 */
import { useState, useEffect, useRef } from "react";

interface VideoPageProps {
  onBack: () => void;
  onTryProduct: () => void;
}

const TOTAL_DURATION = 60; // 模拟60秒视频

export default function VideoPage({ onBack, onTryProduct }: VideoPageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100
  const [elapsed, setElapsed] = useState(0);   // 已播放秒数
  const [finished, setFinished] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 播放进度模拟
  useEffect(() => {
    if (isPlaying && !finished) {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          const next = prev + 1;
          setProgress(Math.min((next / TOTAL_DURATION) * 100, 100));
          if (next >= TOTAL_DURATION) {
            clearInterval(intervalRef.current!);
            setIsPlaying(false);
            setFinished(true);
            setTimeout(() => setShowCTA(true), 400);
          }
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, finished]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    if (finished) return;
    setIsPlaying(p => !p);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (finished) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const newElapsed = Math.floor(ratio * TOTAL_DURATION);
    setElapsed(newElapsed);
    setProgress(ratio * 100);
  };

  return (
    <div style={{
      width: "100%", height: "100%",
      background: "linear-gradient(170deg, #0d0d1a 0%, #1a0d2e 50%, #0d1a2e 100%)",
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
    }}>

      {/* 顶部导航栏 */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 16px 8px",
        paddingTop: "calc(12px + env(safe-area-inset-top, 0px))",
        flexShrink: 0,
      }}>
        <button
          onClick={onBack}
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: "rgba(255,255,255,0.1)",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>一分钟看明白</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>智爱客餐饮AI产品介绍</div>
        </div>
        <div style={{ width: 36 }} />
      </div>

      {/* 视频播放区 */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 16px",
        position: "relative",
      }}>

        {/* 视频画面区域 */}
        <div
          onClick={handlePlayPause}
          style={{
            width: "100%",
            aspectRatio: "16/9",
            borderRadius: 16,
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
            position: "relative",
            overflow: "hidden",
            cursor: finished ? "default" : "pointer",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          {/* 视频封面/内容区 - 模拟画面 */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 12,
          }}>
            {/* 品牌logo区 */}
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: "linear-gradient(135deg, #ff9a3c, #e8750a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(232,117,10,0.4)",
              opacity: isPlaying ? 0.7 : 1,
              transition: "opacity 0.3s",
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#fff">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5" opacity="0.6"/>
                <path d="M2 12l10 5 10-5" opacity="0.35"/>
              </svg>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: 1 }}>智爱客</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>餐饮AI赋能平台</div>
            </div>

            {/* 播放中的动态波纹 */}
            {isPlaying && (
              <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 24 }}>
                {[0.6, 1, 0.75, 0.9, 0.5].map((h, i) => (
                  <div key={i} style={{
                    width: 4, borderRadius: 2,
                    background: "rgba(255,154,60,0.8)",
                    animation: `wave-bar 0.8s ease-in-out ${i * 0.12}s infinite alternate`,
                    height: `${h * 24}px`,
                  }}/>
                ))}
              </div>
            )}

            {/* 完成标记 */}
            {finished && (
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(2px)",
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "linear-gradient(135deg, #ff9a3c, #e8750a)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 20px rgba(232,117,10,0.5)",
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                    <path d="M20 6L9 17l-5-5" strokeWidth="2.5" stroke="#fff" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* 未播放时的大播放按钮 */}
          {!isPlaying && !finished && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "2px solid rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                  <path d="M5 3l14 9-14 9V3z"/>
                </svg>
              </div>
            </div>
          )}

          {/* 播放中的暂停提示 */}
          {isPlaying && (
            <div style={{
              position: "absolute", top: 10, right: 10,
              width: 28, height: 28, borderRadius: 8,
              background: "rgba(0,0,0,0.4)",
              backdropFilter: "blur(4px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
                <rect x="6" y="4" width="4" height="16" rx="1"/>
                <rect x="14" y="4" width="4" height="16" rx="1"/>
              </svg>
            </div>
          )}
        </div>

        {/* 进度条区域 */}
        <div style={{ width: "100%", marginTop: 16 }}>
          {/* 进度条 */}
          <div
            onClick={handleSeek}
            style={{
              width: "100%", height: 4, borderRadius: 2,
              background: "rgba(255,255,255,0.15)",
              cursor: finished ? "default" : "pointer",
              position: "relative",
            }}
          >
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: `${progress}%`,
              background: "linear-gradient(90deg, #ff9a3c, #e8750a)",
              borderRadius: 2,
              transition: "width 0.3s linear",
            }}/>
            {/* 进度点 */}
            <div style={{
              position: "absolute", top: "50%",
              left: `${progress}%`,
              transform: "translate(-50%, -50%)",
              width: 12, height: 12, borderRadius: "50%",
              background: "#ff9a3c",
              boxShadow: "0 0 6px rgba(255,154,60,0.6)",
              transition: "left 0.3s linear",
            }}/>
          </div>

          {/* 时间显示 */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            marginTop: 8, fontSize: 12, color: "rgba(255,255,255,0.45)",
          }}>
            <span>{formatTime(elapsed)}</span>
            <span>{formatTime(TOTAL_DURATION)}</span>
          </div>
        </div>

        {/* 播放控制栏 */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 32, marginTop: 16,
        }}>
          {/* 后退15秒 */}
          <button
            onClick={() => { setElapsed(e => Math.max(0, e - 15)); setProgress(p => Math.max(0, p - (15/TOTAL_DURATION)*100)); }}
            disabled={finished}
            style={{ background: "none", border: "none", cursor: "pointer", opacity: finished ? 0.3 : 0.7, padding: 4 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" fill="rgba(255,255,255,0.7)"/>
              <text x="12" y="14" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.7)" fontWeight="bold">15</text>
            </svg>
          </button>

          {/* 播放/暂停主按钮 */}
          <button
            onClick={handlePlayPause}
            disabled={finished}
            style={{
              width: 56, height: 56, borderRadius: "50%",
              background: finished
                ? "rgba(255,255,255,0.1)"
                : "linear-gradient(135deg, #ff9a3c, #e8750a)",
              border: "none", cursor: finished ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: finished ? "none" : "0 4px 16px rgba(232,117,10,0.4)",
              transition: "all 0.2s",
            }}
          >
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                <rect x="6" y="4" width="4" height="16" rx="1"/>
                <rect x="14" y="4" width="4" height="16" rx="1"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill={finished ? "rgba(255,255,255,0.3)" : "#fff"}>
                <path d="M5 3l14 9-14 9V3z"/>
              </svg>
            )}
          </button>

          {/* 前进15秒 */}
          <button
            onClick={() => {
              const newElapsed = Math.min(elapsed + 15, TOTAL_DURATION);
              setElapsed(newElapsed);
              setProgress((newElapsed / TOTAL_DURATION) * 100);
              if (newElapsed >= TOTAL_DURATION) {
                setIsPlaying(false);
                setFinished(true);
                setTimeout(() => setShowCTA(true), 400);
              }
            }}
            disabled={finished}
            style={{ background: "none", border: "none", cursor: "pointer", opacity: finished ? 0.3 : 0.7, padding: 4 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" fill="rgba(255,255,255,0.7)"/>
              <text x="12" y="14" textAnchor="middle" fontSize="7" fill="rgba(255,255,255,0.7)" fontWeight="bold">15</text>
            </svg>
          </button>
        </div>

        {/* 视频介绍文字 */}
        {!finished && (
          <div style={{
            marginTop: 24, textAlign: "center",
            opacity: isPlaying ? 0.5 : 0.8,
            transition: "opacity 0.3s",
          }}>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
              了解智爱客如何帮助餐饮老板
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>
              工资日结 · AI巡检 · 服务检测 · 智能对讲 · 碎片化培训
            </div>
          </div>
        )}
      </div>

      {/* 播放完成后的引导CTA */}
      {showCTA && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "24px 20px",
          paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
          background: "linear-gradient(0deg, rgba(13,13,26,0.98) 0%, rgba(13,13,26,0.8) 70%, transparent 100%)",
          animation: "slide-up-fade 0.5s ease-out forwards",
        }}>
          {/* 完成提示 */}
          <div style={{
            textAlign: "center", marginBottom: 16,
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
              立即行动，用AI赚钱
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)" }}>
              
            </div>
          </div>

          {/* 主CTA按钮 */}
          <button
            onClick={onTryProduct}
            style={{
              width: "100%", padding: "16px 24px",
              background: "linear-gradient(135deg, #ff9a3c 0%, #e8750a 100%)",
              border: "none", borderRadius: 16,
              color: "#fff", fontSize: 17, fontWeight: 800,
              cursor: "pointer", letterSpacing: 0.5,
              boxShadow: "0 6px 24px rgba(232,117,10,0.5), 0 2px 8px rgba(0,0,0,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "transform 0.15s, box-shadow 0.15s",
              animation: "pulse-glow 2s ease-in-out infinite",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(232,117,10,0.65), 0 2px 8px rgba(0,0,0,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(232,117,10,0.5), 0 2px 8px rgba(0,0,0,0.3)"; }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            体验一下产品
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* 次要操作 */}
          <button
            onClick={onBack}
            style={{
              width: "100%", marginTop: 10, padding: "12px",
              background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 12, color: "rgba(255,255,255,0.5)",
              fontSize: 14, cursor: "pointer",
            }}
          >
            稍后再说
          </button>
        </div>
      )}

      {/* CSS动画 */}
      <style>{`
        @keyframes wave-bar {
          from { transform: scaleY(0.4); }
          to { transform: scaleY(1); }
        }
        @keyframes slide-up-fade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 6px 24px rgba(232,117,10,0.5), 0 2px 8px rgba(0,0,0,0.3); }
          50% { box-shadow: 0 6px 32px rgba(232,117,10,0.75), 0 2px 8px rgba(0,0,0,0.3); }
        }
      `}</style>
    </div>
  );
}
