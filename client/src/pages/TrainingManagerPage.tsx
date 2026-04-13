/**
 * 培训智能体 · 店长管理端
 * 设计提醒（本文件）：保持微信小程序单任务流，首页培训入口可一键直达“发起培训”子功能弹层；管理页本身仍作为培训运营容器承接返回与组织架构扩展。
 * 功能：发起培训任务 + 完成率看板 + 问题清单排名
 * 设计规范：橙色主题，数据看板卡片，问题清单可下钻
 */
import React, { useEffect, useState } from "react";

interface TrainingManagerPageProps {
  onBack: () => void;
  onOpenOrgTree?: () => void;
  autoOpenCreate?: boolean;
  onAutoOpenConsumed?: () => void;
}

// ── 类型定义 ──────────────────────────────────────────────────────────────────
interface StaffStat {
  id: string;
  name: string;
  role: string;
  tasksTotal: number;
  tasksCompleted: number;
  avgScore: number;
  lastActive: string;
}

interface ProblemItem {
  rank: number;
  question: string;
  wrongCount: number;
  category: string;
  trend: "up" | "down" | "stable";
}

// ── Mock 数据 ─────────────────────────────────────────────────────────────────
const STAFF_STATS: StaffStat[] = [
  { id: "S1", name: "曹敏", role: "服务员", tasksTotal: 5, tasksCompleted: 5, avgScore: 4.5, lastActive: "今天" },
  { id: "S2", name: "李明", role: "服务员", tasksTotal: 5, tasksCompleted: 4, avgScore: 3.9, lastActive: "今天" },
  { id: "S3", name: "张华", role: "厨师", tasksTotal: 3, tasksCompleted: 2, avgScore: 3.2, lastActive: "昨天" },
  { id: "S4", name: "王芳", role: "收银员", tasksTotal: 4, tasksCompleted: 4, avgScore: 4.8, lastActive: "今天" },
  { id: "S5", name: "赵强", role: "服务员", tasksTotal: 5, tasksCompleted: 1, avgScore: 2.8, lastActive: "3天前" },
  { id: "S6", name: "陈静", role: "厨师", tasksTotal: 3, tasksCompleted: 0, avgScore: 0, lastActive: "未开始" },
];

const PROBLEM_LIST: ProblemItem[] = [
  { rank: 1, question: "顾客投诉处理的第一步", wrongCount: 8, category: "服务礼仪", trend: "up" },
  { rank: 2, question: "茶水区清洁标准要点", wrongCount: 6, category: "卫生标准", trend: "stable" },
  { rank: 3, question: "点餐礼仪规范", wrongCount: 5, category: "服务礼仪", trend: "down" },
  { rank: 4, question: "食品安全操作规程", wrongCount: 4, category: "食品安全", trend: "up" },
  { rank: 5, question: "翻台流程与标准", wrongCount: 4, category: "运营流程", trend: "stable" },
  { rank: 6, question: "宫保鸡丁制作要点", wrongCount: 3, category: "菜品知识", trend: "down" },
  { rank: 7, question: "备餐区整理标准", wrongCount: 3, category: "卫生标准", trend: "stable" },
  { rank: 8, question: "收银操作流程", wrongCount: 2, category: "运营流程", trend: "down" },
  { rank: 9, question: "员工仪容仪表规范", wrongCount: 2, category: "服务礼仪", trend: "stable" },
  { rank: 10, question: "门店开关店流程", wrongCount: 1, category: "运营流程", trend: "down" },
];

const QUESTION_BANK = [
  "茶水区台面清洁的标准是什么？",
  "服务员在顾客点餐时应该注意哪些礼仪要点？",
  "发现顾客投诉时，处理的第一步是什么？",
  "翻台流程的标准步骤是什么？",
  "食品安全操作中，生熟食品应如何分开存放？",
  "宫保鸡丁的正确炒制时间和火候是多少？",
  "员工仪容仪表的基本要求有哪些？",
  "备餐区整理的标准是什么？",
];

const CATEGORY_COLOR: Record<string, { bg: string; text: string }> = {
  服务礼仪: { bg: "#E3F2FD", text: "#1565C0" },
  卫生标准: { bg: "#E8F5E9", text: "#2E7D32" },
  食品安全: { bg: "#FFF3E0", text: "#E65100" },
  运营流程: { bg: "#F3E5F5", text: "#6A1B9A" },
  菜品知识: { bg: "#FFF8E1", text: "#F57F17" },
};

// ── 图标 ──────────────────────────────────────────────────────────────────────
const IcBack = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
    <path d="M15 18l-6-6 6-6"/>
  </svg>
);
const IcPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);
const IcTrend = ({ dir }: { dir: "up" | "down" | "stable" }) => {
  if (dir === "up") return <span style={{ color: "#E53935", fontSize: 12 }}>↑</span>;
  if (dir === "down") return <span style={{ color: "#43A047", fontSize: 12 }}>↓</span>;
  return <span style={{ color: "#888", fontSize: 12 }}>—</span>;
};
const IcClose = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);
const IcCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

// ── 发起培训弹层 ──────────────────────────────────────────────────────────────
// 模拟当前用户是否已绑定上级（中间层级场景：区域经理，已绑定上级为总监）
const CURRENT_USER = {
  name: "王店长",
  level: "门店级",
  hasSuperior: false,
  superiors: ["李区域经理", "张人力资源经理"],
  isFirstLaunch: true,
};

const ORG_LEVEL_GROUPS = [
  { id: "front-service", label: "前厅服务组", hint: "门店级 · 服务岗", staffIds: ["S1", "S2", "S5"] },
  { id: "kitchen", label: "后厨出品组", hint: "门店级 · 后厨岗", staffIds: ["S3", "S6"] },
  { id: "cashier", label: "收银与迎宾组", hint: "门店级 · 收银岗", staffIds: ["S4"] },
];

function CreateTaskModal({ onClose, onSend }: { onClose: () => void; onSend: (data: any) => void }) {
  const [selectedStaff, setSelectedStaff] = useState<Set<string>>(new Set());
  const [selectedQuestions, setSelectedQuestions] = useState<Set<number>>(new Set());
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [deadline, setDeadline] = useState("今日 22:00");
  const [linkCopied, setLinkCopied] = useState(false);
  const [inviteTarget, setInviteTarget] = useState<"wechat" | "link" | null>(null);
  const [selectMode, setSelectMode] = useState<"org" | "staff">("org");
  const [syncSuperior, setSyncSuperior] = useState(true); // 默认开启同步上级
  const [superiorNotified, setSuperiorNotified] = useState(false);

  const mockInviteLink = `https://zeaik.com/training/join?task=T${Date.now().toString().slice(-4)}&inviter=王店长&org=朝阳旗舰店&role=服务员`;

  const handleCopyLink = () => {
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const toggleStaff = (id: string) => {
    setSelectedStaff(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleQuestion = (idx: number) => {
    if (selectedQuestions.size >= 5 && !selectedQuestions.has(idx)) return;
    setSelectedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200,
      display: "flex", alignItems: "flex-end",
    }}>
      <div style={{
        width: "min(100%, 375px)", background: "white", borderRadius: "22px 22px 0 0",
        maxHeight: "80vh", display: "flex", flexDirection: "column", margin: "0 auto",
        boxShadow: "0 -12px 32px rgba(99, 55, 10, 0.16)",
      }}>
        {/* 弹层头部 */}
        <div style={{
          padding: "16px 18px 12px", borderBottom: "1px solid #F5F5F5",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>发起培训任务</div>
            <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>
              步骤 {step}/4：{step === 1 ? "选择员工" : step === 2 ? "选择题目" : step === 3 ? "确认发送" : "邀请未注册成员"}
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <IcClose />
          </button>
        </div>

        {/* 步骤进度 */}
        <div style={{ display: "flex", padding: "10px 18px 0", gap: 6, flexShrink: 0 }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{
              flex: 1, height: 3, borderRadius: 3,
              background: s <= step ? "linear-gradient(90deg, #e8750a, #ff9a3c)" : "#F0F0F0",
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        {/* 步骤内容 */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px" }}>
          {step === 1 && (
            <>
              {CURRENT_USER.hasSuperior && CURRENT_USER.isFirstLaunch && (
                <div style={{
                  background: "linear-gradient(135deg, #E3F2FD, #EDE7F6)",
                  border: "1.5px solid #90CAF9", borderRadius: 12,
                  padding: "12px 14px", marginBottom: 14,
                  display: "flex", alignItems: "flex-start", gap: 10,
                }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1565C0", marginBottom: 4 }}>
                      首次发起培训
                    </div>
                    <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>
                      本次培训将同步通知你的上级（{CURRENT_USER.superiors.join("、")}），
                      他们将能看到你的团队培训数据，并可在其管理端查看汇总情况。
                    </div>
                  </div>
                </div>
              )}

              <div style={{
                background: "linear-gradient(180deg, #FFF9F3 0%, #FFFFFF 100%)",
                border: "1px solid #F6D1AE", borderRadius: 14, padding: 12, marginBottom: 12,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A" }}>选择培训对象</div>
                    <div style={{ fontSize: 11, color: "#8A6B52", marginTop: 3 }}>可先按组织层级批量勾选，再切换到人员视图精细补充。</div>
                  </div>
                  <div style={{
                    minWidth: 56, padding: "5px 10px", borderRadius: 999,
                    background: selectedStaff.size > 0 ? "#FFF3E0" : "#F5F5F5",
                    color: selectedStaff.size > 0 ? "#e8750a" : "#999", fontSize: 11, fontWeight: 700, textAlign: "center",
                  }}>
                    已选 {selectedStaff.size} 人
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setSelectMode("org")}
                    style={{
                      flex: 1, border: "none", borderRadius: 10, padding: "9px 0", cursor: "pointer",
                      background: selectMode === "org" ? "linear-gradient(135deg, #e8750a, #ff9a3c)" : "#FFF1E5",
                      color: selectMode === "org" ? "white" : "#a85d18", fontSize: 12, fontWeight: 700,
                    }}
                  >
                    按组织架构选择
                  </button>
                  <button
                    onClick={() => setSelectMode("staff")}
                    style={{
                      flex: 1, border: "none", borderRadius: 10, padding: "9px 0", cursor: "pointer",
                      background: selectMode === "staff" ? "linear-gradient(135deg, #e8750a, #ff9a3c)" : "#FFF1E5",
                      color: selectMode === "staff" ? "white" : "#a85d18", fontSize: 12, fontWeight: 700,
                    }}
                  >
                    按人员选择
                  </button>
                </div>
              </div>

              {selectMode === "org" ? (
                <>
                  {ORG_LEVEL_GROUPS.map(group => {
                    const groupStaff = STAFF_STATS.filter(staff => group.staffIds.includes(staff.id));
                    const allSelected = groupStaff.every(staff => selectedStaff.has(staff.id));
                    const selectedCount = groupStaff.filter(staff => selectedStaff.has(staff.id)).length;

                    return (
                      <div key={group.id} style={{
                        borderRadius: 14, marginBottom: 10, overflow: "hidden",
                        border: allSelected ? "1.5px solid #f0a154" : "1px solid #F1E4D8", background: "#FFFCF8",
                      }}>
                        <button
                          onClick={() => groupStaff.forEach(staff => toggleStaff(staff.id))}
                          style={{
                            width: "100%", border: "none", background: "none", cursor: "pointer",
                            padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                          }}
                        >
                          <div style={{ textAlign: "left" }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A" }}>{group.label}</div>
                            <div style={{ fontSize: 11, color: "#8B7B6A", marginTop: 3 }}>{group.hint} · 共 {groupStaff.length} 人</div>
                          </div>
                          <div style={{
                            padding: "5px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                            background: allSelected ? "#FFF3E0" : "#F6EFE7", color: allSelected ? "#e8750a" : "#8A6B52",
                          }}>
                            {selectedCount === groupStaff.length ? "已全选" : `已选 ${selectedCount}/${groupStaff.length}`}
                          </div>
                        </button>
                        <div style={{ padding: "0 14px 12px", display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {groupStaff.map(staff => (
                            <button
                              key={staff.id}
                              onClick={() => toggleStaff(staff.id)}
                              style={{
                                border: selectedStaff.has(staff.id) ? "1px solid #e8750a" : "1px solid #ECDDCF",
                                background: selectedStaff.has(staff.id) ? "#FFF3E0" : "white",
                                borderRadius: 999, padding: "7px 10px", cursor: "pointer",
                                display: "flex", alignItems: "center", gap: 6,
                              }}
                            >
                              <span style={{
                                width: 18, height: 18, borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center",
                                background: selectedStaff.has(staff.id) ? "linear-gradient(135deg, #e8750a, #ff9a3c)" : "#EFE7DE",
                                color: selectedStaff.has(staff.id) ? "white" : "#8A7B6C", fontSize: 10, fontWeight: 700,
                              }}>{selectedStaff.has(staff.id) ? "✓" : staff.name[0]}</span>
                              <span style={{ fontSize: 12, color: "#3B3027", fontWeight: 600 }}>{staff.name}</span>
                              <span style={{ fontSize: 11, color: "#9C8D7E" }}>{staff.role}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>按人员逐个选择，更适合临时加训或补训。</div>
                  {STAFF_STATS.map(s => (
                    <div
                      key={s.id}
                      onClick={() => toggleStaff(s.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "11px 12px",
                        borderRadius: 12, marginBottom: 8, cursor: "pointer",
                        background: selectedStaff.has(s.id) ? "#FFF3E0" : "#FAFAFA",
                        border: selectedStaff.has(s.id) ? "1.5px solid #e8750a" : "1.5px solid #F0F0F0",
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                        background: selectedStaff.has(s.id) ? "linear-gradient(135deg, #e8750a, #ff9a3c)" : "#F0F0F0",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 14, fontWeight: 700, color: selectedStaff.has(s.id) ? "white" : "#888",
                      }}>
                        {selectedStaff.has(s.id) ? <IcCheck /> : s.name[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: "#888" }}>{s.role}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 12, color: s.avgScore >= 4 ? "#43A047" : s.avgScore >= 3 ? "#F57C00" : "#888" }}>
                          {s.avgScore > 0 ? `均分 ${s.avgScore}` : "未答题"}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
                选择培训题目（最多5题，已选 {selectedQuestions.size}/5）
              </div>
              {QUESTION_BANK.map((q, i) => (
                <div
                  key={i}
                  onClick={() => toggleQuestion(i)}
                  style={{
                    padding: "12px 14px", borderRadius: 12, marginBottom: 8, cursor: "pointer",
                    background: selectedQuestions.has(i) ? "#FFF3E0" : "#FAFAFA",
                    border: selectedQuestions.has(i) ? "1.5px solid #e8750a" : "1.5px solid #F0F0F0",
                    transition: "all 0.15s",
                    opacity: selectedQuestions.size >= 5 && !selectedQuestions.has(i) ? 0.4 : 1,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0, marginTop: 1,
                      background: selectedQuestions.has(i) ? "linear-gradient(135deg, #e8750a, #ff9a3c)" : "#E0E0E0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {selectedQuestions.has(i)
                        ? <IcCheck />
                        : <span style={{ fontSize: 11, color: "#888", fontWeight: 700 }}>{i + 1}</span>
                      }
                    </div>
                    <span style={{ fontSize: 13, color: "#333", lineHeight: 1.5 }}>{q}</span>
                  </div>
                </div>
              ))}
            </>
          )}

          {step === 4 && (
            <>
              {/* 已发送成功提示 */}
              <div style={{
                background: "linear-gradient(135deg, #F0FFF4, #E8F5E9)",
                border: "1.5px solid #A5D6A7", borderRadius: 14,
                padding: "14px 16px", marginBottom: 12,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: "linear-gradient(135deg, #43A047, #66BB6A)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20,
                }}>✅</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#2E7D32" }}>培训任务已发送</div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
                    已推送至 {selectedStaff.size} 位已注册员工的手机
                  </div>
                </div>
              </div>

              {/* 上级同步状态 */}
              {CURRENT_USER.hasSuperior && syncSuperior && (
                <div style={{
                  background: "linear-gradient(135deg, #E3F2FD, #EDE7F6)",
                  border: "1.5px solid #90CAF9", borderRadius: 14,
                  padding: "14px 16px", marginBottom: 12,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1565C0", marginBottom: 10 }}>
                    📤 已同步至上级
                  </div>
                  {CURRENT_USER.superiors.map((sup, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "8px 0",
                      borderBottom: i < CURRENT_USER.superiors.length - 1 ? "1px solid rgba(144,202,249,0.3)" : "none",
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                        background: "linear-gradient(135deg, #1565C0, #1976D2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 800, color: "white",
                      }}>{sup[0]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{sup}</div>
                        <div style={{ fontSize: 11, color: "#888" }}>已收到培训通知，可查看汇总数据</div>
                      </div>
                      <span style={{
                        fontSize: 10, padding: "3px 8px", borderRadius: 6,
                        background: "#E3F2FD", color: "#1565C0", fontWeight: 700,
                      }}>已通知</span>
                    </div>
                  ))}
                  <div style={{
                    marginTop: 10, padding: "8px 10px", borderRadius: 8,
                    background: "rgba(144,202,249,0.2)", fontSize: 11, color: "#555", lineHeight: 1.6,
                  }}>
                    💡 上级可在其管理端「下级培训汇总」中查看本次培训的完成率和问题清单
                  </div>
                </div>
              )}
              {/* 未同步上级提示 */}
              {CURRENT_USER.hasSuperior && !syncSuperior && (
                <div style={{
                  background: "#FFF8F0", border: "1px dashed #FFB74D",
                  borderRadius: 12, padding: "10px 14px", marginBottom: 12,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ fontSize: 14 }}>🔕</span>
                  <div style={{ fontSize: 12, color: "#888" }}>
                    本次培训未通知上级，数据仅在本层级可见
                  </div>
                </div>
              )}

              {/* ── 邀请更多人加入（无上级时显示额外说明）── */}
              {!CURRENT_USER.hasSuperior && (
                <div style={{
                  background: "linear-gradient(135deg, #FFF8E1, #FFF3CD)",
                  border: "1.5px solid #FFD54F", borderRadius: 12,
                  padding: "12px 14px", marginBottom: 12,
                  display: "flex", alignItems: "flex-start", gap: 10,
                }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
                  <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7 }}>
                    你目前尚未加入上级组织，培训数据仅在本层级可见。
                    可将下方<span style={{ color: "#e8750a", fontWeight: 600 }}>通用邀请链接</span>发给你的上级，
                    他们点击后会自行选择与你的层级关系，注册完成后自动归位到组织树中。
                  </div>
                </div>
              )}

              {/* 邀请更多人加入 */}
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 4 }}>
                邀请更多人加入
              </div>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 14, lineHeight: 1.6 }}>
                将培训链接发给任何人，收到链接的人点击后<span style={{ color: "#e8750a", fontWeight: 600 }}>自行选择与你的关系</span>（上级 / 同级 / 下级），
                <span style={{ color: "#e8750a", fontWeight: 600 }}>无需提前注册账号</span>，
                完成培训后自动加入团队，组织架构同步更新。
              </div>

              {/* 链接预览卡片 */}
              <div style={{
                background: "#FAFAFA", borderRadius: 14, padding: "14px 16px",
                marginBottom: 14, border: "1.5px solid #F0F0F0",
              }}>
                <div style={{ fontSize: 11, color: "#aaa", marginBottom: 6 }}>邀请链接（含培训任务参数）</div>
                <div style={{
                  fontSize: 11, color: "#555", wordBreak: "break-all",
                  background: "white", borderRadius: 8, padding: "8px 10px",
                  border: "1px solid #E0E0E0", lineHeight: 1.6,
                }}>
                  {mockInviteLink}
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                  {[
                    { key: "inviter", label: "邀请人", value: "王店长" },
                    { key: "org", label: "门店", value: "朝阳旗舰店" },
                    { key: "role", label: "接收者自选", value: "上级/下级" },
                  ].map(p => (
                    <div key={p.key} style={{
                      flex: 1, textAlign: "center", background: "#FFF3E0",
                      borderRadius: 8, padding: "6px 4px",
                    }}>
                      <div style={{ fontSize: 10, color: "#aaa" }}>{p.label}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#e8750a" }}>{p.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 分享方式 */}
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <button
                  onClick={() => { setInviteTarget("wechat"); handleCopyLink(); }}
                  style={{
                    flex: 1, padding: "12px 0", borderRadius: 12, border: "none",
                    background: inviteTarget === "wechat" ? "#07C160" : "#F0F0F0",
                    color: inviteTarget === "wechat" ? "white" : "#555",
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: 16 }}>💬</span> 发送到微信群
                </button>
                <button
                  onClick={() => { setInviteTarget("link"); handleCopyLink(); }}
                  style={{
                    flex: 1, padding: "12px 0", borderRadius: 12,
                    border: inviteTarget === "link" ? "1.5px solid #e8750a" : "1.5px solid #E0E0E0",
                    background: inviteTarget === "link" ? "#FFF3E0" : "white",
                    color: inviteTarget === "link" ? "#e8750a" : "#555",
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: 16 }}>🔗</span> 复制链接
                </button>
              </div>

              {/* 复制成功提示 */}
              {linkCopied && (
                <div style={{
                  background: "linear-gradient(135deg, #43A047, #66BB6A)",
                  borderRadius: 10, padding: "10px 14px", marginBottom: 10,
                  display: "flex", alignItems: "center", gap: 8,
                  animation: "fadeIn 0.3s ease",
                }}>
                  <span style={{ fontSize: 16 }}>✅</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>
                      {inviteTarget === "wechat" ? "已准备好，请粘贴到微信群" : "链接已复制到剪贴板"}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>
                      员工点击链接后，2步完成注册即可开始培训
                    </div>
                  </div>
                </div>
              )}


            </>
          )}

          {step === 3 && (
            <>
              <div style={{ fontSize: 13, color: "#888", marginBottom: 14 }}>确认培训任务信息</div>
              <div style={{ background: "#FAFAFA", borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>培训员工（{selectedStaff.size} 人）</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {STAFF_STATS.filter(s => selectedStaff.has(s.id)).map(s => (
                    <span key={s.id} style={{
                      fontSize: 12, padding: "4px 10px", borderRadius: 10,
                      background: "#FFF3E0", color: "#e8750a", fontWeight: 600,
                    }}>{s.name}</span>
                  ))}
                </div>
              </div>
              <div style={{ background: "#FAFAFA", borderRadius: 12, padding: "14px 16px", marginBottom: 12 }}>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>培训题目（{selectedQuestions.size} 题）</div>
                {QUESTION_BANK.filter((_, i) => selectedQuestions.has(i)).map((q, i) => (
                  <div key={i} style={{ fontSize: 13, color: "#333", padding: "4px 0", borderBottom: "1px solid #F5F5F5" }}>
                    {i + 1}. {q}
                  </div>
                ))}
              </div>
              {/* 同步上级开关 */}
              {CURRENT_USER.hasSuperior && (
                <div style={{
                  background: syncSuperior ? "linear-gradient(135deg, #E3F2FD, #EDE7F6)" : "#FAFAFA",
                  border: syncSuperior ? "1.5px solid #90CAF9" : "1.5px solid #F0F0F0",
                  borderRadius: 12, padding: "12px 14px", marginBottom: 12,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  transition: "all 0.2s",
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: syncSuperior ? "#1565C0" : "#555", marginBottom: 3 }}>
                      📤 同步培训数据至上级
                    </div>
                    <div style={{ fontSize: 11, color: "#888", lineHeight: 1.5 }}>
                      {syncSuperior
                        ? `将通知 ${CURRENT_USER.superiors.join("、")}，他们可在管理端查看本次培训汇总`
                        : "上级将无法看到本次培训情况"}
                    </div>
                  </div>
                  {/* 开关 */}
                  <div
                    onClick={() => setSyncSuperior(v => !v)}
                    style={{
                      width: 44, height: 24, borderRadius: 12, flexShrink: 0, marginLeft: 12,
                      background: syncSuperior ? "linear-gradient(135deg, #e8750a, #ff9a3c)" : "#D0D0D0",
                      position: "relative", cursor: "pointer", transition: "background 0.2s",
                    }}
                  >
                    <div style={{
                      position: "absolute", top: 3, left: syncSuperior ? 22 : 3,
                      width: 18, height: 18, borderRadius: 9, background: "white",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                      transition: "left 0.2s",
                    }} />
                  </div>
                </div>
              )}
              <div style={{ background: "#FAFAFA", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>截止时间</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["今日 22:00", "明日 12:00", "明日 22:00"].map(t => (
                    <button
                      key={t}
                      onClick={() => setDeadline(t)}
                      style={{
                        padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                        background: deadline === t ? "linear-gradient(135deg, #e8750a, #ff9a3c)" : "#F0F0F0",
                        color: deadline === t ? "white" : "#666",
                        fontSize: 12, fontWeight: deadline === t ? 700 : 400,
                      }}
                    >{t}</button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 底部按钮 */}
        <div style={{ padding: "12px 18px 28px", borderTop: "1px solid #F5F5F5", flexShrink: 0, display: "flex", gap: 10 }}>
          {step > 1 && step < 4 && (
            <button
              onClick={() => setStep(s => (s - 1) as any)}
              style={{
                flex: 1, padding: "12px 0", borderRadius: 12,
                border: "1.5px solid #e8750a", background: "white",
                color: "#e8750a", fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}
            >上一步</button>
          )}
          <button
            onClick={() => {
              if (step < 3) setStep(s => (s + 1) as any);
              else if (step === 3) {
                onSend({ staff: selectedStaff, questions: selectedQuestions, deadline });
                setStep(4);
              } else {
                onClose();
              }
            }}
            disabled={step === 1 ? selectedStaff.size === 0 : step === 2 ? selectedQuestions.size === 0 : false}
            style={{
              flex: 2, padding: "12px 0", borderRadius: 12, border: "none",
              background: (step === 1 && selectedStaff.size === 0) || (step === 2 && selectedQuestions.size === 0)
                ? "#F0F0F0" : "linear-gradient(135deg, #e8750a, #ff9a3c)",
              color: (step === 1 && selectedStaff.size === 0) || (step === 2 && selectedQuestions.size === 0) ? "#aaa" : "white",
              fontSize: 14, fontWeight: 700, cursor: "pointer",
              boxShadow: "0 3px 12px rgba(232,117,10,0.3)",
            }}
          >
            {step === 3 ? "确认发送培训任务" : step === 4 ? "完成" : "下一步"}
          </button>
        </div>
        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    </div>
  );
}

// ── 主组件 ────────────────────────────────────────────────────────────────────
export default function TrainingManagerPage({ onBack, onOpenOrgTree, autoOpenCreate = false, onAutoOpenConsumed }: TrainingManagerPageProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "problems">("overview");
  const [showCreate, setShowCreate] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [expandedProblem, setExpandedProblem] = useState<number | null>(null);

  const totalStaff = STAFF_STATS.length;
  const completedAll = STAFF_STATS.filter(s => s.tasksCompleted === s.tasksTotal).length;
  const avgScore = STAFF_STATS.filter(s => s.avgScore > 0).reduce((sum, s) => sum + s.avgScore, 0) / STAFF_STATS.filter(s => s.avgScore > 0).length;

  const handleSend = () => {
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  useEffect(() => {
    if (!autoOpenCreate) return;
    setShowCreate(true);
    onAutoOpenConsumed?.();
  }, [autoOpenCreate, onAutoOpenConsumed]);

  return (
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      background: "#F7F8FC", fontFamily: "-apple-system, 'PingFang SC', sans-serif",
    }}>
      {/* 顶部导航 */}
      <div style={{
        background: "linear-gradient(135deg, #e8750a 0%, #ff9a3c 100%)",
        padding: "44px 16px 0", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", padding: 4, cursor: "pointer" }}>
            <IcBack />
          </button>
          <span style={{ fontSize: 17, fontWeight: 700, color: "white" }}>培训管理</span>
          <div style={{ display: "flex", gap: 6 }}>
            {onOpenOrgTree && (
              <button
                onClick={onOpenOrgTree}
                style={{
                  background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 20,
                  padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                  <circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>
                  <path d="M12 7v4M12 11l-7 6M12 11l7 6"/>
                </svg>
                <span style={{ fontSize: 12, color: "white", fontWeight: 700 }}>组织架构</span>
              </button>
            )}
            <button
              onClick={() => setShowCreate(true)}
              style={{
                background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 20,
                padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
              }}
            >
              <IcPlus />
              <span style={{ fontSize: 12, color: "white", fontWeight: 700 }}>发起培训</span>
            </button>
          </div>
        </div>

        {/* 概览数据 */}
        <div style={{
          background: "rgba(255,255,255,0.15)", borderRadius: "14px 14px 0 0",
          padding: "14px 16px", display: "flex", gap: 0,
        }}>
          {[
            { label: "全部完成", value: `${completedAll}/${totalStaff}`, sub: "人" },
            { label: "完成率", value: `${Math.round(completedAll / totalStaff * 100)}%`, sub: "" },
            { label: "平均得分", value: avgScore.toFixed(1), sub: "分" },
          ].map((item, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.2)" : "none" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "white" }}>
                {item.value}<span style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.7)" }}>{item.sub}</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab */}
      <div style={{ background: "white", display: "flex", borderBottom: "1px solid #F0F0F0", flexShrink: 0 }}>
        {[
          { key: "overview", label: "员工完成情况" },
          { key: "problems", label: "问题清单 TOP10" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              flex: 1, border: "none", background: "none", padding: "13px 0",
              fontSize: 14, fontWeight: activeTab === tab.key ? 700 : 400,
              color: activeTab === tab.key ? "#e8750a" : "#888",
              borderBottom: activeTab === tab.key ? "2.5px solid #e8750a" : "2.5px solid transparent",
              cursor: "pointer",
            }}
          >{tab.label}</button>
        ))}
      </div>

      {/* 内容区 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px 80px" }}>
        {activeTab === "overview" && (
          <>
            {/* 进度条汇总 */}
            <div style={{ background: "white", borderRadius: 14, padding: "14px 16px", marginBottom: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>本期培训完成率</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#e8750a" }}>{Math.round(completedAll / totalStaff * 100)}%</span>
              </div>
              <div style={{ height: 8, background: "#F0F0F0", borderRadius: 8 }}>
                <div style={{
                  height: "100%", borderRadius: 8,
                  width: `${completedAll / totalStaff * 100}%`,
                  background: "linear-gradient(90deg, #e8750a, #ff9a3c)",
                  transition: "width 0.5s ease",
                }} />
              </div>
            </div>

            {/* 员工列表 */}
            {STAFF_STATS.map(s => {
              const rate = s.tasksTotal > 0 ? s.tasksCompleted / s.tasksTotal : 0;
              const isComplete = rate === 1;
              const isLow = s.avgScore > 0 && s.avgScore < 3.5;

              return (
                <div key={s.id} style={{
                  background: "white", borderRadius: 12, padding: "12px 14px",
                  marginBottom: 8, boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                  border: isLow ? "1.5px solid #FFD54F" : "1.5px solid transparent",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: isComplete ? "linear-gradient(135deg, #43A047, #66BB6A)" : "linear-gradient(135deg, #F5F5F5, #E0E0E0)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14, fontWeight: 700, color: isComplete ? "white" : "#888",
                    }}>
                      {s.name[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{s.name}</span>
                        <span style={{ fontSize: 12, color: "#aaa" }}>{s.lastActive}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 4, background: "#F0F0F0", borderRadius: 4 }}>
                          <div style={{
                            height: "100%", borderRadius: 4,
                            width: `${rate * 100}%`,
                            background: isComplete ? "linear-gradient(90deg, #43A047, #66BB6A)" : "linear-gradient(90deg, #e8750a, #ff9a3c)",
                          }} />
                        </div>
                        <span style={{ fontSize: 12, color: "#888", whiteSpace: "nowrap" }}>
                          {s.tasksCompleted}/{s.tasksTotal}
                        </span>
                        {s.avgScore > 0 && (
                          <span style={{
                            fontSize: 11, padding: "2px 7px", borderRadius: 8, whiteSpace: "nowrap",
                            background: isLow ? "#FFF3E0" : "#E8F5E9",
                            color: isLow ? "#E65100" : "#2E7D32",
                            fontWeight: 600,
                          }}>{s.avgScore}分</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {isLow && (
                    <div style={{ marginTop: 8, fontSize: 12, color: "#E65100", background: "#FFF3E0", borderRadius: 8, padding: "5px 10px" }}>
                      ⚠️ 得分偏低，建议安排专项辅导
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {activeTab === "problems" && (
          <>
            <div style={{ fontSize: 12, color: "#aaa", marginBottom: 10 }}>
              统计近30天全员答题错误频率，点击可查看明细
            </div>
            {PROBLEM_LIST.map((p, i) => {
              const catStyle = CATEGORY_COLOR[p.category] || { bg: "#F5F5F5", text: "#666" };
              const isExpanded = expandedProblem === i;

              return (
                <div
                  key={i}
                  onClick={() => setExpandedProblem(isExpanded ? null : i)}
                  style={{
                    background: "white", borderRadius: 12, padding: "12px 14px",
                    marginBottom: 8, boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {/* 排名 */}
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: i < 3 ? "linear-gradient(135deg, #e8750a, #ff9a3c)" : "#F5F5F5",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 800, color: i < 3 ? "white" : "#888",
                    }}>
                      {p.rank}
                    </div>

                    {/* 内容 */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.question}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <span style={{
                          fontSize: 10, padding: "2px 7px", borderRadius: 8,
                          background: catStyle.bg, color: catStyle.text, fontWeight: 600,
                        }}>{p.category}</span>
                        <span style={{ fontSize: 11, color: "#E53935", fontWeight: 600 }}>
                          错误 {p.wrongCount} 次
                        </span>
                        <IcTrend dir={p.trend} />
                      </div>
                    </div>

                    {/* 错误率条 */}
                    <div style={{ width: 50, textAlign: "right" }}>
                      <div style={{ height: 4, background: "#F0F0F0", borderRadius: 4, marginBottom: 4 }}>
                        <div style={{
                          height: "100%", borderRadius: 4,
                          width: `${(p.wrongCount / 8) * 100}%`,
                          background: i < 3 ? "linear-gradient(90deg, #e8750a, #ff9a3c)" : "#FFB74D",
                        }} />
                      </div>
                    </div>
                  </div>

                  {/* 展开明细 */}
                  {isExpanded && (
                    <div style={{
                      marginTop: 12, padding: "10px 12px", background: "#FFF8F0",
                      borderRadius: 10, border: "1px solid #FFE0B2",
                    }}>
                      <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>答错员工明细</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {STAFF_STATS.slice(0, p.wrongCount).map(s => (
                          <span key={s.id} style={{
                            fontSize: 12, padding: "3px 10px", borderRadius: 10,
                            background: "#FFF3E0", color: "#e8750a",
                          }}>{s.name}</span>
                        ))}
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); setShowCreate(true); }}
                        style={{
                          marginTop: 10, width: "100%", padding: "8px 0", borderRadius: 8, border: "none",
                          background: "linear-gradient(135deg, #e8750a, #ff9a3c)",
                          color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer",
                        }}
                      >
                        针对此题发起专项培训
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* 发起培训弹层 */}
      {showCreate && (
        <CreateTaskModal
          onClose={() => setShowCreate(false)}
          onSend={handleSend}
        />
      )}

      {/* 发送成功提示 */}
      {sentSuccess && (
        <div style={{
          position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.75)", color: "white", borderRadius: 20,
          padding: "10px 20px", fontSize: 13, fontWeight: 600, zIndex: 300,
          whiteSpace: "nowrap",
        }}>
          ✅ 培训任务已发送至员工手机
        </div>
      )}
    </div>
  );
}
