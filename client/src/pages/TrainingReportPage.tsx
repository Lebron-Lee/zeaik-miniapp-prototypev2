/**
 * 培训智能体 · 培训报告页
 * 设计规范：橙色主题，5分制评分展示，题目掌握情况，专项练习入口
 */
import React, { useState } from "react";
import type { TrainingResult } from "./TrainingAnswerPage";
import type { TrainingTask } from "./TrainingPage";

interface TrainingReportPageProps {
  result: TrainingResult;
  task: TrainingTask;
  onBack: () => void;
  onRetry: (questionIds: number[]) => void;
  onHome: () => void;
}

// ── 图标 ──────────────────────────────────────────────────────────────────────
const IcBack = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
);
const IcStar = ({ filled, half }: { filled: boolean; half?: boolean }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill={filled ? "#FF9A3C" : half ? "url(#half)" : "none"} stroke="#FF9A3C" strokeWidth="1.5">
    {half && (
      <defs>
        <linearGradient id="half" x1="0" x2="1" y1="0" y2="0">
          <stop offset="50%" stopColor="#FF9A3C"/>
          <stop offset="50%" stopColor="none"/>
        </linearGradient>
      </defs>
    )}
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IcCheck = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#43A047" strokeWidth="2.5" strokeLinecap="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);
const IcWarn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9800" strokeWidth="2" strokeLinecap="round">
    <path d="M12 9v4M12 17h.01"/>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
  </svg>
);
const IcRepeat = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
    <path d="M17 1l4 4-4 4"/>
    <path d="M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4"/>
    <path d="M21 13v2a4 4 0 01-4 4H3"/>
  </svg>
);
const IcHome = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e8750a" strokeWidth="2" strokeLinecap="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

// ── Mock 报告数据（当无真实结果时使用）──────────────────────────────────────
const MOCK_RESULT: TrainingResult = {
  taskId: "T001",
  taskTitle: "茶水区服务标准专项培训",
  totalQuestions: 3,
  questions: [
    { id: 1, question: "茶水区台面清洁的标准是什么？", correct: true, attempts: 1, usedHint: false },
    { id: 2, question: "服务员在顾客点餐时应该注意哪些礼仪要点？", correct: true, attempts: 2, usedHint: true },
    { id: 3, question: "发现顾客投诉时，处理的第一步是什么？", correct: true, attempts: 3, usedHint: true },
  ],
  score: 3.8,
  duration: 8,
};

// ── 评分等级 ──────────────────────────────────────────────────────────────────
function getGrade(score: number) {
  if (score >= 4.5) return { label: "优秀", color: "#43A047", bg: "#E8F5E9", emoji: "🏆" };
  if (score >= 3.5) return { label: "良好", color: "#1976D2", bg: "#E3F2FD", emoji: "🌟" };
  if (score >= 2.5) return { label: "合格", color: "#F57C00", bg: "#FFF3E0", emoji: "👍" };
  return { label: "需加强", color: "#E53935", bg: "#FFEBEE", emoji: "💪" };
}

// ── 主组件 ────────────────────────────────────────────────────────────────────
export default function TrainingReportPage({ result, task, onBack, onRetry, onHome }: TrainingReportPageProps) {
  const [selectedForRetry, setSelectedForRetry] = useState<Set<number>>(new Set());
  const displayResult = result || MOCK_RESULT;
  const grade = getGrade(displayResult.score);

  // 需要加强的题目（使用了提示或多次尝试）
  const weakQuestions = displayResult.questions.filter(q => q.usedHint || q.attempts > 1);
  const strongQuestions = displayResult.questions.filter(q => !q.usedHint && q.attempts === 1);

  const toggleRetry = (id: number) => {
    setSelectedForRetry(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleRetry = () => {
    const ids = selectedForRetry.size > 0
      ? Array.from(selectedForRetry)
      : weakQuestions.map(q => q.id);
    onRetry(ids);
  };

  return (
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      background: "#F7F8FC", fontFamily: "-apple-system, 'PingFang SC', sans-serif",
      overflowY: "auto",
    }}>
      {/* 顶部导航 */}
      <div style={{
        background: "linear-gradient(135deg, #e8750a 0%, #ff9a3c 100%)",
        padding: "44px 16px 20px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", padding: 4, cursor: "pointer" }}>
            <IcBack />
          </button>
          <span style={{ fontSize: 17, fontWeight: 700, color: "white" }}>培训报告</span>
          <div style={{ width: 28 }} />
        </div>

        {/* 评分展示 */}
        <div style={{
          background: "rgba(255,255,255,0.15)", borderRadius: 16,
          padding: "20px 16px", textAlign: "center",
        }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 8 }}>
            {displayResult.taskTitle}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 10 }}>
            {[1, 2, 3, 4, 5].map(i => (
              <IcStar key={i} filled={i <= Math.floor(displayResult.score)} half={i === Math.ceil(displayResult.score) && displayResult.score % 1 >= 0.5} />
            ))}
          </div>
          <div style={{ fontSize: 40, fontWeight: 900, color: "white", lineHeight: 1 }}>
            {displayResult.score.toFixed(1)}
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>满分 5.0 分</div>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: grade.bg, borderRadius: 20, padding: "5px 14px", marginTop: 10,
          }}>
            <span style={{ fontSize: 16 }}>{grade.emoji}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: grade.color }}>{grade.label}</span>
          </div>
        </div>
      </div>

      {/* 统计数据 */}
      <div style={{
        display: "flex", background: "white", margin: "12px 14px 0",
        borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      }}>
        {[
          { label: "答题总数", value: displayResult.totalQuestions, unit: "题" },
          { label: "用时", value: displayResult.duration, unit: "分钟" },
          { label: "一次答对", value: strongQuestions.length, unit: "题" },
        ].map((item, i) => (
          <div key={i} style={{
            flex: 1, padding: "14px 0", textAlign: "center",
            borderRight: i < 2 ? "1px solid #F5F5F5" : "none",
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A" }}>
              {item.value}<span style={{ fontSize: 13, fontWeight: 400, color: "#888" }}>{item.unit}</span>
            </div>
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 3 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* AI 综合评语 */}
      <div style={{
        margin: "10px 14px 0", background: "#FFF8F0",
        borderRadius: 14, padding: "14px 16px",
        border: "1px solid #FFE0B2",
      }}>
        <div style={{ fontSize: 12, color: "#e8750a", fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
          <span>🤖</span> AI 培训评语
        </div>
        <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>
          {displayResult.score >= 4.5
            ? `太厉害了！这次培训你表现非常出色，${strongQuestions.length} 道题都是一次性答对，说明你对这些知识点掌握得非常扎实！继续保持这种学习态度！`
            : displayResult.score >= 3.5
            ? `表现不错！大部分知识点都掌握了。${weakQuestions.length > 0 ? `有 ${weakQuestions.length} 个知识点需要再巩固一下，建议做专项练习加深印象。` : "继续保持！"}`
            : `这次培训有几个知识点还需要加强，不用担心，每个人都是这样一步步学会的！建议针对薄弱题目做专项练习，相信你下次一定会更好！💪`
          }
        </div>
      </div>

      {/* 题目掌握情况 */}
      <div style={{ margin: "10px 14px 0" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 10 }}>题目掌握情况</div>

        {displayResult.questions.map((q, i) => {
          const needsWork = q.usedHint || q.attempts > 1;
          const isSelected = selectedForRetry.has(q.id);

          return (
            <div
              key={q.id}
              onClick={() => needsWork && toggleRetry(q.id)}
              style={{
                background: "white", borderRadius: 12, padding: "12px 14px",
                marginBottom: 8, boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                border: isSelected ? "1.5px solid #e8750a" : "1.5px solid transparent",
                cursor: needsWork ? "pointer" : "default",
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: needsWork ? "#FFF3E0" : "#E8F5E9",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {needsWork ? <IcWarn /> : <IcCheck />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#333", lineHeight: 1.5, marginBottom: 6 }}>
                    Q{i + 1}. {q.question}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: 11, padding: "2px 8px", borderRadius: 8,
                      background: q.attempts === 1 ? "#E8F5E9" : "#FFF3E0",
                      color: q.attempts === 1 ? "#43A047" : "#E65100",
                    }}>
                      {q.attempts === 1 ? "一次答对" : `尝试 ${q.attempts} 次`}
                    </span>
                    {q.usedHint && (
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 8, background: "#FFF3E0", color: "#E65100" }}>
                        查看了提示
                      </span>
                    )}
                    {isSelected && (
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 8, background: "#FFF3E0", color: "#e8750a", fontWeight: 700 }}>
                        ✓ 已选择练习
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 专项练习 CTA */}
      {weakQuestions.length > 0 && (
        <div style={{ margin: "10px 14px 0", padding: "14px 16px", background: "white", borderRadius: 14, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 13, color: "#555", marginBottom: 12, lineHeight: 1.6 }}>
            💡 有 <strong style={{ color: "#e8750a" }}>{weakQuestions.length}</strong> 个知识点建议专项练习，点击上方题目可选择练习范围
          </div>
          <button
            onClick={handleRetry}
            style={{
              width: "100%", padding: "12px 0", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg, #e8750a, #ff9a3c)",
              color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 3px 12px rgba(232,117,10,0.35)",
            }}
          >
            <IcRepeat />
            {selectedForRetry.size > 0 ? `练习已选 ${selectedForRetry.size} 道题` : `专项练习薄弱题目（${weakQuestions.length} 题）`}
          </button>
        </div>
      )}

      {/* 返回首页 */}
      <div style={{ margin: "10px 14px 24px" }}>
        <button
          onClick={onHome}
          style={{
            width: "100%", padding: "12px 0", borderRadius: 12,
            border: "1.5px solid #e8750a", background: "white",
            color: "#e8750a", fontSize: 14, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <IcHome />
          返回培训首页
        </button>
      </div>
    </div>
  );
}
