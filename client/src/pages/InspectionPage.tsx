// InspectionPage.tsx — 常规巡检 2
// 设计规范：微信小程序风格，蓝色主题导航栏
// 页面结构：顶部导航 + 任务名称 + 参考图(黄色虚线标注) + AI拍照对比图(时间戳/重拍) + 评分卡片(问题详情)

import { useState } from "react";
import { toast } from "sonner";

interface InspectionPageProps {
  onBack: () => void;
}

// 状态栏图标
function StatusBarIcons() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <svg width="15" height="11" viewBox="0 0 15 11" fill="white">
        <rect x="0" y="7" width="3" height="4" rx="0.5" opacity="0.5"/>
        <rect x="4" y="5" width="3" height="6" rx="0.5" opacity="0.7"/>
        <rect x="8" y="2.5" width="3" height="8.5" rx="0.5" opacity="0.85"/>
        <rect x="12" y="0" width="3" height="11" rx="0.5"/>
      </svg>
      <svg width="15" height="11" viewBox="0 0 24 17" fill="none">
        <path d="M12 13.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" fill="white"/>
        <path d="M7.5 10.5C8.9 9.1 10.4 8.4 12 8.4s3.1.7 4.5 2.1" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        <path d="M4 7C6.2 4.8 9 3.5 12 3.5s5.8 1.3 8 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7"/>
        <path d="M0.5 3.5C3.6 0.5 7.6-1 12-1s8.4 1.5 11.5 4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.4"/>
      </svg>
      <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
        <rect x="0.5" y="0.5" width="18" height="10" rx="2" stroke="white" strokeWidth="1"/>
        <rect x="2" y="2" width="13" height="7" rx="1" fill="white"/>
        <path d="M19.5 3.5v4c.8-.3 1.5-1 1.5-2s-.7-1.7-1.5-2z" fill="white" opacity="0.6"/>
      </svg>
    </div>
  );
}

// 参考图：烤鸭架区域（CSS模拟，带黄色虚线标注框）
function ReferenceImage() {
  return (
    <div style={{
      width: "100%",
      aspectRatio: "4/3",
      background: "linear-gradient(160deg, #3a2a1a 0%, #5c4030 30%, #8b6a4a 60%, #6b5040 100%)",
      borderRadius: 10,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* 时间标签 */}
      <div style={{
        position: "absolute", top: 8, left: 8,
        background: "rgba(0,0,0,0.65)",
        color: "white", fontSize: 11, padding: "3px 7px",
        borderRadius: 5, lineHeight: 1.5,
      }}>
        <div style={{ fontWeight: 600 }}>09:00 ~ 22:30</div>
        <div style={{ opacity: 0.85 }}>巡检周期：2小时/次</div>
      </div>

      {/* 模拟烤鸭架台面层 */}
      <div style={{
        position: "absolute", bottom: "28%", left: "4%", right: "4%",
        height: "28%",
        background: "linear-gradient(180deg, #9a7a5a 0%, #6b4a2a 100%)",
        borderRadius: 3,
        border: "1.5px solid #c09060",
      }}/>
      <div style={{
        position: "absolute", bottom: "8%", left: "4%", right: "4%",
        height: "18%",
        background: "linear-gradient(180deg, #7a5a3a 0%, #5a3a1a 100%)",
        borderRadius: 3,
        border: "1.5px solid #a07040",
      }}/>

      {/* 黄色虚线标注框 - 主区域 */}
      <div style={{
        position: "absolute",
        top: "22%", left: "6%", right: "6%", bottom: "5%",
        border: "2.5px dashed #FFD700",
        borderRadius: 6,
        pointerEvents: "none",
      }}/>

      {/* 左侧小标注框 */}
      <div style={{
        position: "absolute",
        top: "30%", left: "8%",
        width: "30%", height: "28%",
        border: "2px dashed #FFD700",
        borderRadius: 4,
      }}/>

      {/* 右侧标注线 */}
      <div style={{
        position: "absolute",
        top: "35%", right: "10%",
        width: "22%", height: "20%",
        border: "2px dashed #FFD700",
        borderRadius: 4,
      }}/>
    </div>
  );
}

// AI拍照对比图（带时间戳水印和重拍按钮）
function CapturedImage({ onRetake }: { onRetake: () => void }) {
  return (
    <div style={{
      width: "100%",
      aspectRatio: "4/3",
      background: "linear-gradient(160deg, #2a1a0a 0%, #4a3020 30%, #7a5a3a 60%, #5a4030 100%)",
      borderRadius: 10,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* 模拟实拍烤鸭架 */}
      <div style={{
        position: "absolute", bottom: "30%", left: "3%", right: "3%",
        height: "30%",
        background: "linear-gradient(180deg, #8a6a4a 0%, #5a3a1a 100%)",
        borderRadius: 3,
        border: "1.5px solid #b08050",
      }}/>
      <div style={{
        position: "absolute", bottom: "10%", left: "3%", right: "3%",
        height: "18%",
        background: "linear-gradient(180deg, #6a4a2a 0%, #4a2a0a 100%)",
        borderRadius: 3,
        border: "1.5px solid #906030",
      }}/>
      {/* 中间分隔架 */}
      <div style={{
        position: "absolute", bottom: "28%", left: "30%", right: "30%",
        height: "32%",
        background: "linear-gradient(180deg, #aaa 0%, #888 100%)",
        borderRadius: 2,
        border: "1px solid #ccc",
        opacity: 0.6,
      }}/>

      {/* 时间戳水印 */}
      <div style={{
        position: "absolute", bottom: 8, left: 8,
        color: "rgba(255,255,255,0.95)",
        fontSize: 10.5,
        lineHeight: 1.6,
        textShadow: "0 1px 4px rgba(0,0,0,0.9)",
      }}>
        <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: 0.5 }}>13:22</div>
        <div>2024-08-15  巡检人：陈建强</div>
        <div>星期六  湿度参量 31°C  朝丰店</div>
      </div>

      {/* 重拍按钮 */}
      <button
        onClick={onRetake}
        style={{
          position: "absolute", bottom: 10, right: 10,
          background: "#2a7de1",
          border: "none", borderRadius: 22,
          color: "white", fontSize: 13, fontWeight: 700,
          padding: "7px 16px",
          display: "flex", alignItems: "center", gap: 5,
          cursor: "pointer",
          boxShadow: "0 3px 10px rgba(42,125,225,0.55)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 3a4 4 0 110 8 4 4 0 010-8zm0 14.2a7.2 7.2 0 01-6-3.22c.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08a7.2 7.2 0 01-6 3.22z"/>
        </svg>
        重拍
      </button>
    </div>
  );
}

export default function InspectionPage({ onBack }: InspectionPageProps) {
  const [showDetail, setShowDetail] = useState(true);
  const [retakeCount, setRetakeCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const checkItems = [
    { q: "1.烤鸭架台面是否整洁？", a: "是" },
    { q: "2.洗手台台面不应该有杂物", a: "是" },
    { q: "3.烤鸭架应该摆放整齐", a: "是" },
  ];

  const handleSubmit = () => {
    setSubmitted(true);
    toast.success("巡检结果已提交！");
  };

  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      background: "#f2f3f7",
      fontFamily: "-apple-system, 'PingFang SC', sans-serif",
      overflow: "hidden",
    }}>
      {/* ── 状态栏 ── */}
      <div style={{
        height: 44,
        background: "linear-gradient(135deg, #2a7de1, #1a5fc8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "white" }}>12:00</span>
        <StatusBarIcons />
      </div>

      {/* ── 导航栏 ── */}
      <div style={{
        height: 44,
        background: "linear-gradient(135deg, #2a7de1, #1a5fc8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        flexShrink: 0,
        borderBottom: "1px solid rgba(255,255,255,0.15)",
      }}>
        {/* 返回按钮 */}
        <button
          onClick={onBack}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 3,
            color: "white", fontSize: 15, padding: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        {/* 中间标题 */}
        <span style={{ fontSize: 17, fontWeight: 600, color: "white" }}>常规巡检</span>

        {/* 右侧历史记录图标 */}
        <button style={{
          background: "rgba(255,255,255,0.2)",
          border: "none", borderRadius: "50%",
          width: 32, height: 32,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
        }}
          onClick={() => toast.info("查看历史巡检记录")}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </button>
      </div>

      {/* ── 可滚动内容区 ── */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px 14px 24px",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* 任务名称 */}
        <div style={{
          textAlign: "center",
          fontSize: 17,
          fontWeight: 700,
          color: "#1a1a2e",
          marginBottom: 10,
          letterSpacing: 0.5,
        }}>
          烤鸭架清理
        </div>

        {/* 上方虚线分隔 */}
        <div style={{ borderTop: "1px dashed #ccc", marginBottom: 12 }}/>

        {/* 参考图 */}
        <ReferenceImage />

        {/* 中间虚线分隔 */}
        <div style={{ borderTop: "1px dashed #ccc", margin: "14px 0" }}/>

        {/* AI拍照对比图 */}
        <CapturedImage onRetake={() => setRetakeCount(c => c + 1)} />

        {retakeCount > 0 && (
          <div style={{
            textAlign: "center", fontSize: 12, color: "#07c160",
            marginTop: 6, fontWeight: 500,
          }}>
            已重拍 {retakeCount} 次
          </div>
        )}

        {/* 评分卡片 */}
        <div style={{
          marginTop: 14,
          background: "white",
          borderRadius: 12,
          padding: "14px 16px",
          boxShadow: "0 1px 8px rgba(0,0,0,0.07)",
        }}>
          {/* 得分行 */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>
              得分：<span style={{ color: "#e8750a", fontSize: 19 }}>5分</span>
            </div>
            <button
              onClick={() => setShowDetail(v => !v)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4,
                color: "#888", fontSize: 14, padding: 0,
              }}
            >
              问题详情
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="#888" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                style={{
                  transform: showDetail ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.22s",
                }}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>

          {/* 展开的检查项 */}
          {showDetail && (
            <div style={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}>
              {checkItems.map((item, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 14,
                  color: "#333",
                  padding: "10px 0",
                  borderBottom: i < checkItems.length - 1 ? "1px solid #f2f2f2" : "none",
                }}>
                  <span style={{ color: "#555", flex: 1 }}>{item.q}</span>
                  <span style={{ color: "#333", fontWeight: 500, flexShrink: 0, marginLeft: 10 }}>
                    回答：{item.a}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 提交按钮 */}
        <button
          onClick={handleSubmit}
          disabled={submitted}
          style={{
            marginTop: 18,
            width: "100%",
            padding: "14px",
            background: submitted
              ? "#ccc"
              : "linear-gradient(135deg, #2a7de1, #1a5fc8)",
            border: "none", borderRadius: 12,
            color: "white", fontSize: 16, fontWeight: 700,
            cursor: submitted ? "not-allowed" : "pointer",
            boxShadow: submitted ? "none" : "0 4px 14px rgba(42,125,225,0.38)",
            transition: "all 0.2s",
          }}
        >
          {submitted ? "✓ 已提交" : "提交巡检结果"}
        </button>
      </div>
    </div>
  );
}
