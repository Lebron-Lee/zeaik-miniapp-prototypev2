/**
 * 培训智能体 · 答题交互页
 * 设计规范：橙色主题，AI 对话气泡，语音/文字双模式，提示答案半屏弹层
 * 核心流程：AI出题 → 员工答题 → AI判断 → 答对进下题 / 答错继续追问
 */
import React, { useState, useRef, useEffect } from "react";
import type { TrainingTask } from "./TrainingPage";

interface TrainingAnswerPageProps {
  task: TrainingTask;
  onBack: () => void;
  onComplete: (result: TrainingResult) => void;
  debugScenario?: "default" | "hint";
}

export interface TrainingResult {
  taskId: string;
  taskTitle: string;
  totalQuestions: number;
  questions: QuestionResult[];
  score: number;
  duration: number; // 分钟
}

interface QuestionResult {
  id: number;
  question: string;
  correct: boolean;
  attempts: number;
  usedHint: boolean;
}

// ── Mock 题目数据 ──────────────────────────────────────────────────────────────
const MOCK_QUESTIONS = [
  {
    id: 1,
    question: "茶水区台面清洁的标准是什么？",
    keyPoints: ["台面整洁无杂物", "无垃圾无灰尘", "热水器保持100℃"],
    hint: "参考答案要点：\n① 台面整洁无杂物、无垃圾、无灰尘\n② 热水器开启并保持100℃\n③ 台面必须有茶叶、茶水壶",
    aiIntro: "好的，我们开始第一道题！",
  },
  {
    id: 2,
    question: "服务员在顾客点餐时应该注意哪些礼仪要点？",
    keyPoints: ["微笑服务", "主动推荐", "复述确认订单"],
    hint: "参考答案要点：\n① 保持微笑，站姿端正\n② 主动介绍招牌菜和特色菜\n③ 点餐完成后复述确认，避免出错",
    aiIntro: "太棒了！第一题答得很好，继续加油！",
  },
  {
    id: 3,
    question: "发现顾客投诉时，处理的第一步是什么？",
    keyPoints: ["立即道歉", "倾听诉求", "不争辩"],
    hint: "参考答案要点：\n① 第一时间真诚道歉，不辩解\n② 耐心倾听顾客诉求，表示理解\n③ 立即上报店长，不自行承诺赔偿",
    aiIntro: "你越来越厉害了！来看看第三题：",
  },
];

// ── AI 回复模板 ───────────────────────────────────────────────────────────────
const AI_CORRECT_REPLIES = [
  "非常棒！你说到了所有关键点，这道题完全掌握了！🎉",
  "答得很好！看来你平时工作很认真，继续保持！✨",
  "完全正确！这个知识点你已经掌握得很扎实了，为你点赞！👍",
];
const AI_PARTIAL_REPLIES = [
  "你说到了一部分关键点，还有一个细节没有提到，再想想？",
  "思路是对的！还差一个重要的知识点，提示你想想实际操作中还需要注意什么？",
  "不错的回答！但还有一个关键步骤没有说到，再补充一下？",
];
const AI_WRONG_REPLIES = [
  "没关系，这道题有点难。我来给你一些提示，你可以点击下方「查看提示」看看参考答案。",
  "这个知识点确实不好记。要不要先看看提示答案，然后用自己的话说一遍？",
];

// ── 图标 ──────────────────────────────────────────────────────────────────────
const IcBack = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
);
const IcMic = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? "white" : "#e8750a"} strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"/>
    <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v3M9 22h6"/>
  </svg>
);
const IcSend = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
  </svg>
);
const IcKeyboard = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e8750a" strokeWidth="1.8" strokeLinecap="round">
    <rect x="2" y="6" width="20" height="12" rx="2"/>
    <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/>
  </svg>
);
const IcLightbulb = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M9 21h6M12 3a6 6 0 016 6c0 2.22-1.21 4.16-3 5.2V17H9v-2.8A6 6 0 0112 3z"/>
  </svg>
);
const IcClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);
const IcAI = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#e8750a" opacity="0.15"/>
    <path d="M12 8v4M12 16h.01" stroke="#e8750a" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8.5 10.5c.5-1.5 2-2.5 3.5-2.5s3 1 3.5 2.5" stroke="#e8750a" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ── 消息类型 ──────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  role: "ai" | "user";
  text: string;
  isQuestion?: boolean;
  isCorrect?: boolean;
}

// ── 主组件 ────────────────────────────────────────────────────────────────────
export default function TrainingAnswerPage({ task, onBack, onComplete, debugScenario = "default" }: TrainingAnswerPageProps) {
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [usedHint, setUsedHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFeedbackPhase, setIsFeedbackPhase] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const msgIdRef = useRef(0);

  const questions = MOCK_QUESTIONS.slice(0, task.totalQuestions);
  const currentQ = questions[currentQIdx];
  const progress = currentQIdx / questions.length;

  const newMsg = (role: "ai" | "user", text: string, extra?: Partial<Message>): Message => ({
    id: ++msgIdRef.current, role, text, ...extra,
  });

  // 初始化：AI 发出第一道题 / 文档截图调试场景
  useEffect(() => {
    if (questions.length === 0) return;

    const intro = newMsg("ai", `你好！今天的培训主题是「${task.title}」，共 ${task.totalQuestions} 道题。答对一道才能进入下一题，加油！💪`);
    const q = newMsg("ai", `第 1 题：${questions[0].question}`, { isQuestion: true });

    if (debugScenario === "hint") {
      const userAttempt = newMsg("user", "台面要保持干净就可以了，还要注意服务态度。");
      const aiReply = newMsg("ai", "你说到了一部分关键点，还有一个细节没有提到，再想想？");
      setAttempts(1);
      setUsedHint(true);
      setShowHint(true);
      setMessages([intro, q, userAttempt, aiReply]);
      return;
    }

    setTimeout(() => setMessages([intro, q]), 300);
  }, [debugScenario, questions.length, task.title, task.totalQuestions]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // 模拟 AI 判断答案
  const evaluateAnswer = (answer: string) => {
    if (!currentQ) return;
    setIsThinking(true);
    const userMsg = newMsg("user", answer);
    setMessages(prev => [...prev, userMsg]);
    setInputText("");

    setTimeout(() => {
      setIsThinking(false);
      const lowerAnswer = answer.toLowerCase();
      const matchedPoints = currentQ.keyPoints.filter(kp =>
        lowerAnswer.includes(kp.slice(0, 4)) || answer.length > 15
      );
      const isCorrect = matchedPoints.length >= Math.ceil(currentQ.keyPoints.length * 0.6) || attempts >= 2;

      if (isCorrect) {
        const replyText = AI_CORRECT_REPLIES[Math.floor(Math.random() * AI_CORRECT_REPLIES.length)];
        const aiMsg = newMsg("ai", replyText, { isCorrect: true });
        setMessages(prev => [...prev, aiMsg]);

        const result: QuestionResult = {
          id: currentQ.id,
          question: currentQ.question,
          correct: true,
          attempts: attempts + 1,
          usedHint,
        };
        const newResults = [...questionResults, result];
        setQuestionResults(newResults);

        setTimeout(() => {
          if (currentQIdx + 1 < questions.length) {
            const nextIdx = currentQIdx + 1;
            setCurrentQIdx(nextIdx);
            setAttempts(0);
            setUsedHint(false);
            const nextQ = questions[nextIdx];
            const introMsg = newMsg("ai", nextQ.aiIntro);
            const qMsg = newMsg("ai", `第 ${nextIdx + 1} 题：${nextQ.question}`, { isQuestion: true });
            setMessages(prev => [...prev, introMsg, qMsg]);
          } else {
            // 进入固定反馈题
            setIsFeedbackPhase(true);
            const feedbackMsg = newMsg("ai", `🎊 太厉害了！${task.totalQuestions} 道题全部完成！\n\n最后一个问题：**请用自己的话说说，这次培训让你印象最深的是什么？有什么想法或建议？**`);
            setMessages(prev => [...prev, feedbackMsg]);
          }
        }, 1500);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        const replyText = newAttempts >= 2
          ? AI_WRONG_REPLIES[Math.floor(Math.random() * AI_WRONG_REPLIES.length)]
          : AI_PARTIAL_REPLIES[Math.floor(Math.random() * AI_PARTIAL_REPLIES.length)];
        const aiMsg = newMsg("ai", replyText);
        setMessages(prev => [...prev, aiMsg]);
      }
    }, 1200);
  };

  // 提交反馈后完成培训
  const submitFeedback = (feedback: string) => {
    const userMsg = newMsg("user", feedback);
    setIsThinking(true);
    setMessages(prev => [...prev, userMsg]);
    setInputText("");

    setTimeout(() => {
      setIsThinking(false);
      const score = Math.min(5, Math.max(3, 3.5 + Math.random() * 1.2));
      const finalMsg = newMsg("ai",
        `非常感谢你的反馈！你今天的表现真的很棒！🌟\n\n` +
        `综合本次培训，你的得分是 **${score.toFixed(1)} 分**。` +
        (score >= 4.5 ? "优秀！知识掌握非常扎实！" : score >= 3.5 ? "良好！继续保持这个学习劲头！" : "加油！有几个知识点还需要多练习。")
      );
      setMessages(prev => [...prev, finalMsg]);
      setIsCompleted(true);

      setTimeout(() => {
        const result: TrainingResult = {
          taskId: task.id,
          taskTitle: task.title,
          totalQuestions: task.totalQuestions,
          questions: questionResults,
          score: parseFloat(score.toFixed(1)),
          duration: Math.floor(Math.random() * 10) + 5,
        };
        onComplete(result);
      }, 2000);
    }, 1500);
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    setShowHint(false);
    if (isFeedbackPhase) {
      submitFeedback(text);
    } else {
      evaluateAnswer(text);
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      // 模拟语音识别结果
      const voiceTexts = [
        "台面要整洁无杂物，热水器要保持100度，还要有茶叶和茶水壶",
        "要微笑服务，主动介绍菜品，点完餐要复述确认",
        "第一步要立刻道歉，然后听顾客说，不能跟顾客争辩",
      ];
      const text = voiceTexts[currentQIdx % voiceTexts.length];
      setInputText(text);
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      background: "#F7F8FC", fontFamily: "-apple-system, 'PingFang SC', sans-serif",
    }}>
      {/* 顶部导航 */}
      <div style={{
        background: "linear-gradient(135deg, #e8750a 0%, #ff9a3c 100%)",
        padding: "44px 16px 14px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", padding: 4, cursor: "pointer" }}>
            <IcBack />
          </button>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "white" }}>{task.title}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
              {isFeedbackPhase ? "培训反馈" : `第 ${currentQIdx + 1} 题 / 共 ${questions.length} 题`}
            </div>
          </div>
          <div style={{ width: 28 }} />
        </div>

        {/* 进度条 */}
        {!isFeedbackPhase && (
          <div style={{ height: 4, background: "rgba(255,255,255,0.3)", borderRadius: 4 }}>
            <div style={{
              height: "100%", borderRadius: 4,
              width: `${((currentQIdx + (isCompleted ? 1 : 0)) / questions.length) * 100}%`,
              background: "white", transition: "width 0.5s ease",
            }} />
          </div>
        )}
      </div>

      {/* 对话区域 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px 8px" }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row",
            alignItems: "flex-end", gap: 8, marginBottom: 12,
          }}>
            {/* AI 头像 */}
            {msg.role === "ai" && (
              <div style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: "linear-gradient(135deg, #FFF3E0, #FFE0B2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <IcAI />
              </div>
            )}

            {/* 气泡 */}
            <div style={{
              maxWidth: "75%",
              background: msg.role === "ai"
                ? (msg.isQuestion ? "linear-gradient(135deg, #FFF8F0, #FFF3E0)" : "white")
                : "linear-gradient(135deg, #e8750a, #ff9a3c)",
              color: msg.role === "user" ? "white" : "#1A1A1A",
              borderRadius: msg.role === "ai" ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
              padding: "10px 13px",
              fontSize: 14, lineHeight: 1.6,
              boxShadow: msg.role === "ai" ? "0 2px 8px rgba(0,0,0,0.06)" : "0 3px 10px rgba(232,117,10,0.3)",
              border: msg.isQuestion ? "1.5px solid #FFD54F" : "none",
              whiteSpace: "pre-wrap",
            }}>
              {msg.isQuestion && (
                <div style={{ fontSize: 11, color: "#e8750a", fontWeight: 700, marginBottom: 4 }}>📝 答题</div>
              )}
              {msg.isCorrect && (
                <div style={{ fontSize: 11, color: "#43A047", fontWeight: 700, marginBottom: 4 }}>✅ 回答正确</div>
              )}
              {msg.text.replace(/\*\*/g, "")}
            </div>
          </div>
        ))}

        {/* AI 思考中 */}
        {isThinking && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              background: "linear-gradient(135deg, #FFF3E0, #FFE0B2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <IcAI />
            </div>
            <div style={{
              background: "white", borderRadius: "4px 14px 14px 14px",
              padding: "12px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              display: "flex", gap: 5, alignItems: "center",
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: "50%", background: "#e8750a",
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  opacity: 0.7,
                }} />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 提示答案弹层 */}
      {showHint && currentQ && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "white", borderRadius: "20px 20px 0 0",
          padding: "20px 18px 32px",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.12)",
          zIndex: 100,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <IcLightbulb />
              <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>参考答案</span>
            </div>
            <button onClick={() => setShowHint(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <IcClose />
            </button>
          </div>
          <div style={{
            background: "#FFF8F0", borderRadius: 12, padding: "14px 16px",
            fontSize: 14, color: "#555", lineHeight: 1.8, whiteSpace: "pre-line",
            border: "1px solid #FFE0B2",
          }}>
            {currentQ.hint}
          </div>
          <div style={{ fontSize: 12, color: "#aaa", marginTop: 10, textAlign: "center" }}>
            关闭答案后，用自己的话说一遍给 AI 听 💪
          </div>
        </div>
      )}

      {/* 底部输入区 */}
      {!isCompleted && (
        <div style={{
          background: "white", padding: "10px 14px 28px",
          borderTop: "1px solid #F0F0F0", flexShrink: 0,
        }}>
          {/* 提示按钮 */}
          {!isFeedbackPhase && attempts >= 1 && !showHint && (
            <button
              onClick={() => { setShowHint(true); setUsedHint(true); }}
              style={{
                width: "100%", padding: "9px 0", borderRadius: 10, border: "1.5px dashed #FFB74D",
                background: "#FFF8F0", color: "#e8750a", fontSize: 13, fontWeight: 600,
                cursor: "pointer", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              <IcLightbulb />
              查看提示答案
            </button>
          )}

          {/* 录音状态 */}
          {isVoiceMode && isRecording && (
            <div style={{
              background: "#FFF3E0", borderRadius: 10, padding: "10px 14px",
              marginBottom: 10, display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%", background: "#e8750a",
                animation: "pulse 1s ease-in-out infinite",
              }} />
              <span style={{ fontSize: 13, color: "#e8750a", fontWeight: 600 }}>正在录音，松开停止...</span>
            </div>
          )}

          {/* 文字输入框 */}
          {!isVoiceMode && (
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <textarea
                value={inputText}
                onChange={e => { setInputText(e.target.value); setShowHint(false); }}
                placeholder="输入你的回答..."
                rows={2}
                style={{
                  flex: 1, borderRadius: 12, border: "1.5px solid #F0F0F0",
                  padding: "10px 12px", fontSize: 14, resize: "none",
                  fontFamily: "inherit", outline: "none", background: "#FAFAFA",
                }}
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                style={{
                  width: 46, borderRadius: 12, border: "none",
                  background: inputText.trim() ? "linear-gradient(135deg, #e8750a, #ff9a3c)" : "#F0F0F0",
                  cursor: inputText.trim() ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <IcSend />
              </button>
            </div>
          )}

          {/* 底部按钮行 */}
          <div style={{ display: "flex", gap: 10 }}>
            {/* 语音/键盘切换 */}
            <button
              onClick={() => setIsVoiceMode(!isVoiceMode)}
              style={{
                width: 46, height: 46, borderRadius: 12, border: "1.5px solid #F0F0F0",
                background: "white", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              {isVoiceMode ? <IcKeyboard /> : <IcMic active={false} />}
            </button>

            {/* 语音按钮（主要操作） */}
            {isVoiceMode && (
              <button
                onTouchStart={handleVoiceToggle}
                onMouseDown={handleVoiceToggle}
                style={{
                  flex: 1, height: 46, borderRadius: 12, border: "none",
                  background: isRecording
                    ? "linear-gradient(135deg, #c0392b, #e74c3c)"
                    : "linear-gradient(135deg, #e8750a, #ff9a3c)",
                  color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: isRecording ? "0 4px 15px rgba(192,57,43,0.4)" : "0 3px 12px rgba(232,117,10,0.35)",
                  transition: "all 0.15s",
                }}
              >
                <IcMic active />
                {isRecording ? "松开发送" : "按住说话"}
              </button>
            )}

            {/* 文字模式发送 */}
            {!isVoiceMode && inputText.trim() && (
              <button
                onClick={handleSend}
                style={{
                  flex: 1, height: 46, borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg, #e8750a, #ff9a3c)",
                  color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 3px 12px rgba(232,117,10,0.35)",
                }}
              >
                发送回答
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}
