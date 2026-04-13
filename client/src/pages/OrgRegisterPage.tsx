/**
 * 培训智能体 · 无感注册页
 * 场景：员工通过上级分享的小程序链接/二维码进入，
 *       完成姓名+职位填写+上级绑定，自动构建组织架构
 * 设计规范：橙色主题，步骤引导，最小化填写成本
 */
import React, { useState } from "react";

interface OrgRegisterPageProps {
  onBack: () => void;
  onComplete: (info: RegisterInfo) => void;
  /** 邀请人信息（从链接参数解析） */
  inviter?: { name: string; role: string; dept: string };
}

export interface RegisterInfo {
  name: string;
  phone: string;
  jobTitle: string;
  dept: string;
  superiorId: string;
  superiorName: string;
}

// ── 数据 ──────────────────────────────────────────────────────────────────────
const JOB_TITLES = [
  { group: "前厅", items: ["服务员", "领班", "收银员", "迎宾员", "传菜员"] },
  { group: "后厨", items: ["厨师长", "炒锅厨师", "切配厨师", "打荷", "洗碗工"] },
  { group: "管理", items: ["店长", "副店长", "区域经理", "经理助理"] },
  { group: "职能", items: ["人力资源", "数据分析员", "财务", "采购"] },
];

const MOCK_SUPERIORS = [
  { id: "M1", name: "王建国", role: "店长", dept: "北京朝阳店" },
  { id: "M2", name: "李秀梅", role: "副店长", dept: "北京朝阳店" },
  { id: "M3", name: "张志远", role: "区域经理", dept: "华北区" },
  { id: "M4", name: "陈丽华", role: "人力资源经理", dept: "总部" },
];

// ── 图标 ──────────────────────────────────────────────────────────────────────
const IcBack = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);
const IcCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
const IcUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e8750a" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const IcPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e8750a" strokeWidth="2" strokeLinecap="round">
    <rect x="5" y="2" width="14" height="20" rx="2" /><circle cx="12" cy="17" r="1" />
  </svg>
);
const IcBriefcase = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e8750a" strokeWidth="2" strokeLinecap="round">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);
const IcLink = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e8750a" strokeWidth="2" strokeLinecap="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);
const IcArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

// ── 职位选择弹层 ──────────────────────────────────────────────────────────────
function JobPickerModal({ value, onSelect, onClose }: {
  value: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "flex-end" }}>
      <div style={{ width: "100%", background: "white", borderRadius: "20px 20px 0 0", maxHeight: "70vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid #F5F5F5", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>选择职位</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 14, color: "#888", cursor: "pointer" }}>取消</button>
        </div>
        <div style={{ overflowY: "auto", padding: "8px 0 24px" }}>
          {JOB_TITLES.map(g => (
            <div key={g.group}>
              <div style={{ fontSize: 11, color: "#aaa", padding: "10px 18px 4px", fontWeight: 600, letterSpacing: 1 }}>{g.group}</div>
              {g.items.map(item => (
                <button
                  key={item}
                  onClick={() => { onSelect(item); onClose(); }}
                  style={{
                    width: "100%", padding: "12px 18px", border: "none", background: value === item ? "#FFF3E0" : "white",
                    display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 14, color: value === item ? "#e8750a" : "#333", fontWeight: value === item ? 700 : 400 }}>{item}</span>
                  {value === item && <IcCheck />}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 上级选择弹层 ──────────────────────────────────────────────────────────────
function SuperiorPickerModal({ value, onSelect, onClose }: {
  value: string;
  onSelect: (id: string, name: string) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = MOCK_SUPERIORS.filter(s =>
    s.name.includes(search) || s.role.includes(search) || s.dept.includes(search)
  );
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "flex-end" }}>
      <div style={{ width: "100%", background: "white", borderRadius: "20px 20px 0 0", maxHeight: "70vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid #F5F5F5", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>选择直属上级</span>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 14, color: "#888", cursor: "pointer" }}>取消</button>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#F5F5F5", borderRadius: 10, padding: "8px 12px",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索姓名、职位或部门"
              style={{ border: "none", background: "none", flex: 1, fontSize: 13, color: "#333", outline: "none" }}
            />
          </div>
        </div>
        <div style={{ overflowY: "auto", padding: "8px 0 24px" }}>
          {filtered.map(s => (
            <button
              key={s.id}
              onClick={() => { onSelect(s.id, s.name); onClose(); }}
              style={{
                width: "100%", padding: "12px 18px", border: "none",
                background: value === s.id ? "#FFF3E0" : "white",
                display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: value === s.id ? "linear-gradient(135deg, #e8750a, #ff9a3c)" : "linear-gradient(135deg, #F5F5F5, #E0E0E0)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, color: value === s.id ? "white" : "#888",
              }}>
                {s.name[0]}
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: value === s.id ? "#e8750a" : "#1A1A1A" }}>{s.name}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{s.role} · {s.dept}</div>
              </div>
              {value === s.id && (
                <div style={{ width: 20, height: 20, borderRadius: 10, background: "linear-gradient(135deg, #e8750a, #ff9a3c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IcCheck />
                </div>
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: "30px 0", textAlign: "center", color: "#aaa", fontSize: 13 }}>未找到匹配的上级</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── 主组件 ────────────────────────────────────────────────────────────────────
export default function OrgRegisterPage({ onBack, onComplete, inviter }: OrgRegisterPageProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [dept, setDept] = useState("北京朝阳店");
  const [superiorId, setSuperiorId] = useState(inviter ? "M1" : "");
  const [superiorName, setSuperiorName] = useState(inviter ? inviter.name : "");
  const [showJobPicker, setShowJobPicker] = useState(false);
  const [showSuperiorPicker, setShowSuperiorPicker] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const defaultInviter = inviter ?? { name: "王建国", role: "店长", dept: "北京朝阳店" };

  const canStep1 = name.trim().length >= 2 && phone.length === 11;
  const canStep2 = jobTitle.length > 0 && superiorId.length > 0;

  const handleSubmit = () => {
    if (!agreed) return;
    onComplete({ name, phone, jobTitle, dept, superiorId, superiorName });
    setStep(3);
  };

  return (
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      background: "#F7F8FC", fontFamily: "-apple-system, 'PingFang SC', sans-serif",
    }}>
      {/* 顶部导航 */}
      <div style={{
        background: "linear-gradient(135deg, #e8750a 0%, #ff9a3c 100%)",
        padding: "44px 16px 20px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", padding: 4, cursor: "pointer" }}>
            <IcBack />
          </button>
          <span style={{ fontSize: 17, fontWeight: 700, color: "white" }}>加入团队</span>
        </div>

        {/* 邀请人信息卡 */}
        <div style={{
          background: "rgba(255,255,255,0.18)", borderRadius: 14, padding: "12px 16px",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 800, color: "white",
          }}>
            {defaultInviter.name[0]}
          </div>
          <div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>邀请你加入</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "white" }}>
              {defaultInviter.name} · {defaultInviter.role}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{defaultInviter.dept}</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <div style={{
              background: "rgba(255,255,255,0.25)", borderRadius: 20, padding: "4px 10px",
              fontSize: 11, color: "white", fontWeight: 600,
            }}>智爱客</div>
          </div>
        </div>
      </div>

      {/* 步骤指示 */}
      <div style={{ background: "white", padding: "14px 18px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
          {[
            { n: 1, label: "基本信息" },
            { n: 2, label: "职位绑定" },
            { n: 3, label: "完成" },
          ].map((s, i) => (
            <React.Fragment key={s.n}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 14,
                  background: step >= s.n ? "linear-gradient(135deg, #e8750a, #ff9a3c)" : "#F0F0F0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800, color: step >= s.n ? "white" : "#bbb",
                  transition: "all 0.3s",
                }}>
                  {step > s.n ? <IcCheck /> : s.n}
                </div>
                <span style={{ fontSize: 10, color: step >= s.n ? "#e8750a" : "#bbb", fontWeight: step === s.n ? 700 : 400 }}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div style={{
                  flex: 1, height: 2, margin: "0 6px", marginBottom: 16,
                  background: step > s.n ? "linear-gradient(90deg, #e8750a, #ff9a3c)" : "#F0F0F0",
                  borderRadius: 2, transition: "background 0.3s",
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 内容区 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px 100px" }}>

        {/* ── Step 1: 基本信息 ── */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", marginBottom: 4 }}>填写基本信息</div>
            <div style={{ fontSize: 13, color: "#aaa", marginBottom: 20 }}>仅需 30 秒，填写完成即可开始使用</div>

            {/* 姓名 */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 }}>
                真实姓名 <span style={{ color: "#E53935" }}>*</span>
              </label>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "white", borderRadius: 12, padding: "12px 14px",
                border: name.length > 0 ? "1.5px solid #e8750a" : "1.5px solid #F0F0F0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}>
                <IcUser />
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="请输入真实姓名"
                  style={{ flex: 1, border: "none", outline: "none", fontSize: 15, color: "#1A1A1A", background: "none" }}
                />
              </div>
            </div>

            {/* 手机号 */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 }}>
                手机号码 <span style={{ color: "#E53935" }}>*</span>
              </label>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "white", borderRadius: 12, padding: "12px 14px",
                border: phone.length > 0 ? "1.5px solid #e8750a" : "1.5px solid #F0F0F0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}>
                <IcPhone />
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  placeholder="请输入手机号"
                  type="tel"
                  style={{ flex: 1, border: "none", outline: "none", fontSize: 15, color: "#1A1A1A", background: "none" }}
                />
              </div>
              <div style={{ fontSize: 11, color: "#aaa", marginTop: 4, paddingLeft: 4 }}>
                手机号将作为登录账号，请确保准确
              </div>
            </div>

            {/* 提示 */}
            <div style={{
              background: "#FFF8F0", borderRadius: 12, padding: "12px 14px",
              border: "1px solid #FFE0B2", marginTop: 8,
            }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <IcLink />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e8750a", marginBottom: 3 }}>通过邀请链接注册</div>
                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>
                    你将自动加入 <strong style={{ color: "#333" }}>{defaultInviter.dept}</strong>，
                    系统会根据你的职位自动分配权限，无需手动设置
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: 职位绑定 ── */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1A1A1A", marginBottom: 4 }}>确认职位信息</div>
            <div style={{ fontSize: 13, color: "#aaa", marginBottom: 20 }}>职位决定你的权限范围，可后续修改</div>

            {/* 职位选择 */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 }}>
                我的职位 <span style={{ color: "#E53935" }}>*</span>
              </label>
              <button
                onClick={() => setShowJobPicker(true)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  background: "white", borderRadius: 12, padding: "12px 14px",
                  border: jobTitle ? "1.5px solid #e8750a" : "1.5px solid #F0F0F0",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)", cursor: "pointer",
                }}
              >
                <IcBriefcase />
                <span style={{ flex: 1, textAlign: "left", fontSize: 15, color: jobTitle ? "#1A1A1A" : "#bbb" }}>
                  {jobTitle || "请选择职位"}
                </span>
                <IcArrowRight />
              </button>
            </div>

            {/* 所属门店 */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 }}>
                所属门店/部门
              </label>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#FAFAFA", borderRadius: 12, padding: "12px 14px",
                border: "1.5px solid #F0F0F0",
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e8750a" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span style={{ fontSize: 15, color: "#888" }}>{dept}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#aaa" }}>由邀请人确定</span>
              </div>
            </div>

            {/* 直属上级 */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 }}>
                直属上级 <span style={{ color: "#E53935" }}>*</span>
              </label>
              <button
                onClick={() => setShowSuperiorPicker(true)}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 12,
                  background: "white", borderRadius: 12, padding: "12px 14px",
                  border: superiorId ? "1.5px solid #e8750a" : "1.5px solid #F0F0F0",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)", cursor: "pointer",
                }}
              >
                {superiorId ? (
                  <>
                    <div style={{
                      width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                      background: "linear-gradient(135deg, #e8750a, #ff9a3c)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 700, color: "white",
                    }}>
                      {superiorName[0]}
                    </div>
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{superiorName}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>
                        {MOCK_SUPERIORS.find(s => s.id === superiorId)?.role} · {MOCK_SUPERIORS.find(s => s.id === superiorId)?.dept}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e8750a" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                    <span style={{ flex: 1, textAlign: "left", fontSize: 15, color: "#bbb" }}>请选择直属上级</span>
                  </>
                )}
                <IcArrowRight />
              </button>
              <div style={{ fontSize: 11, color: "#aaa", marginTop: 4, paddingLeft: 4 }}>
                上级可以向你发起培训任务，并查看你的培训记录
              </div>
            </div>

            {/* 多上级说明 */}
            <div style={{
              background: "#F0F4FF", borderRadius: 12, padding: "12px 14px",
              border: "1px solid #C5D5FF",
            }}>
              <div style={{ fontSize: 12, color: "#3B5BDB", lineHeight: 1.7 }}>
                <strong>💡 可以有多个上级</strong><br />
                例如：你的直属店长 + 区域人力资源经理，都可以向你发起培训。注册后可在「组织架构」中添加更多上级关系。
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: 完成 ── */}
        {step === 3 && (
          <div style={{ textAlign: "center", paddingTop: 20 }}>
            {/* 成功动画 */}
            <div style={{
              width: 80, height: 80, borderRadius: 24, margin: "0 auto 20px",
              background: "linear-gradient(135deg, #e8750a, #ff9a3c)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(232,117,10,0.35)",
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <div style={{ fontSize: 22, fontWeight: 800, color: "#1A1A1A", marginBottom: 8 }}>
              欢迎加入！🎉
            </div>
            <div style={{ fontSize: 14, color: "#888", marginBottom: 24, lineHeight: 1.7 }}>
              你已成功加入 <strong style={{ color: "#333" }}>{dept}</strong><br />
              直属上级：<strong style={{ color: "#e8750a" }}>{superiorName}</strong>
            </div>

            {/* 账号信息卡 */}
            <div style={{
              background: "white", borderRadius: 16, padding: "16px 18px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)", textAlign: "left", marginBottom: 16,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#888", marginBottom: 12 }}>你的账号信息</div>
              {[
                { label: "姓名", value: name },
                { label: "职位", value: jobTitle },
                { label: "门店", value: dept },
                { label: "登录账号", value: phone },
              ].map(item => (
                <div key={item.label} style={{
                  display: "flex", justifyContent: "space-between", padding: "8px 0",
                  borderBottom: "1px solid #F5F5F5",
                }}>
                  <span style={{ fontSize: 13, color: "#888" }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* 下一步提示 */}
            <div style={{
              background: "#FFF8F0", borderRadius: 12, padding: "12px 14px",
              border: "1px solid #FFE0B2", textAlign: "left",
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#e8750a", marginBottom: 6 }}>接下来你可以</div>
              {[
                "等待上级发起培训任务",
                "在「组织架构」中查看团队成员",
                "完成第一次培训，获得积分奖励",
              ].map((tip, i) => (
                <div key={i} style={{ fontSize: 12, color: "#888", padding: "3px 0", display: "flex", gap: 6 }}>
                  <span style={{ color: "#e8750a", fontWeight: 700 }}>{i + 1}.</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 底部按钮 */}
      {step < 3 && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "12px 18px 32px", background: "white",
          borderTop: "1px solid #F5F5F5",
        }}>
          {step === 2 && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 12 }}>
              <button
                onClick={() => setAgreed(!agreed)}
                style={{
                  width: 20, height: 20, borderRadius: 6, border: "none", flexShrink: 0, marginTop: 1,
                  background: agreed ? "linear-gradient(135deg, #e8750a, #ff9a3c)" : "#F0F0F0",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                }}
              >
                {agreed && <IcCheck />}
              </button>
              <span style={{ fontSize: 11, color: "#888", lineHeight: 1.6 }}>
                我已阅读并同意《智爱客用户协议》和《隐私政策》，同意上级查看我的培训记录
              </span>
            </div>
          )}
          <button
            onClick={() => {
              if (step === 1 && canStep1) setStep(2);
              else if (step === 2 && canStep2 && agreed) handleSubmit();
            }}
            disabled={step === 1 ? !canStep1 : !canStep2 || !agreed}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
              background: (step === 1 ? canStep1 : canStep2 && agreed)
                ? "linear-gradient(135deg, #e8750a, #ff9a3c)" : "#F0F0F0",
              color: (step === 1 ? canStep1 : canStep2 && agreed) ? "white" : "#bbb",
              fontSize: 16, fontWeight: 700, cursor: "pointer",
              boxShadow: (step === 1 ? canStep1 : canStep2 && agreed) ? "0 4px 16px rgba(232,117,10,0.35)" : "none",
              transition: "all 0.2s",
            }}
          >
            {step === 1 ? "下一步" : "完成注册，加入团队"}
          </button>
        </div>
      )}

      {step === 3 && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "12px 18px 32px", background: "white", borderTop: "1px solid #F5F5F5",
        }}>
          <button
            onClick={() => onComplete({ name, phone, jobTitle, dept, superiorId, superiorName })}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 14, border: "none",
              background: "linear-gradient(135deg, #e8750a, #ff9a3c)",
              color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer",
              boxShadow: "0 4px 16px rgba(232,117,10,0.35)",
            }}
          >
            开始使用培训智能体
          </button>
        </div>
      )}

      {/* 弹层 */}
      {showJobPicker && (
        <JobPickerModal value={jobTitle} onSelect={setJobTitle} onClose={() => setShowJobPicker(false)} />
      )}
      {showSuperiorPicker && (
        <SuperiorPickerModal
          value={superiorId}
          onSelect={(id, n) => { setSuperiorId(id); setSuperiorName(n); }}
          onClose={() => setShowSuperiorPicker(false)}
        />
      )}
    </div>
  );
}
