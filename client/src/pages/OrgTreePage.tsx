/*
 * 培训智能体 · 组织架构选择页
 * 当前页面设计提醒：遵循飞书通讯录式两层选择体验。第一页展示可勾选组织层级与层级入口；第二页展示该层级下的成员勾选。
 * 设计规范：微信小程序比例、暖白背景、橙色品牌强调、蓝色组织图标、底部固定确认栏。
 */
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface OrgTreeSelectionPayload {
  departmentIds: string[];
  memberIds: string[];
}

interface OrgTreePageProps {
  onBack: () => void;
  onInvite: () => void;
  selectedDeptIds?: string[];
  selectedMemberIds?: string[];
  onApplySelection?: (payload: OrgTreeSelectionPayload) => void;
}

type MemberStatus = "active" | "pending";

interface DepartmentMember {
  id: string;
  name: string;
  role: string;
  store: string;
  tag?: string;
  status?: MemberStatus;
}

interface OrgDepartment {
  id: string;
  name: string;
  countHint: string;
  description: string;
  members: DepartmentMember[];
}

const ORG_DIRECTORY = {
  companyName: "智爱客餐饮集团",
  companyOwner: "王建国",
  companyRole: "企业负责人",
  departments: [
    {
      id: "front-service",
      name: "前厅服务组",
      countHint: "3",
      description: "北京朝阳店 · 服务礼仪与顾客接待",
      members: [
        { id: "S1", name: "曹敏", role: "服务员", store: "北京朝阳店", tag: "培训骨干" },
        { id: "S2", name: "李明", role: "服务员", store: "北京朝阳店" },
        { id: "S5", name: "赵强", role: "服务员", store: "北京朝阳店", status: "pending" },
      ],
    },
    {
      id: "kitchen-pass",
      name: "后厨出品组",
      countHint: "2",
      description: "北京朝阳店 · 食品安全与出品流程",
      members: [
        { id: "S3", name: "张华", role: "厨师", store: "北京朝阳店", tag: "核心岗位" },
        { id: "S6", name: "陈静", role: "厨师", store: "北京朝阳店" },
      ],
    },
    {
      id: "cashier-greeting",
      name: "收银与迎宾组",
      countHint: "2",
      description: "门店综合前场 · 高峰接待与收银操作",
      members: [
        { id: "S4", name: "王芳", role: "收银员", store: "北京朝阳店" },
        { id: "S7", name: "刘宁", role: "迎宾", store: "北京朝阳店", tag: "新人" },
      ],
    },
  ] satisfies OrgDepartment[],
} as const;

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        border: checked ? "1.5px solid #e8750a" : "1.5px solid #D5D9E6",
        background: checked ? "linear-gradient(135deg, #e8750a, #ff9a3c)" : "#ffffff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: checked ? "0 6px 14px rgba(232,117,10,0.18)" : "none",
        flexShrink: 0,
      }}
    >
      {checked && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6.2L4.7 8.8L10 3.4" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

function OrgIcon() {
  return (
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: 21,
        background: "linear-gradient(135deg, #4867ff, #5e54ff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 18px rgba(86, 91, 255, 0.22)",
        flexShrink: 0,
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2.6" />
        <circle cx="6" cy="18" r="2.6" />
        <circle cx="18" cy="18" r="2.6" />
        <path d="M12 7.8v4.2" />
        <path d="M12 12h-6v3.4" />
        <path d="M12 12h6v3.4" />
      </svg>
    </div>
  );
}

function Chevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B7BCC8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export default function OrgTreePage({
  onBack,
  onInvite,
  selectedDeptIds = [],
  selectedMemberIds = [],
  onApplySelection,
}: OrgTreePageProps) {
  const [keyword, setKeyword] = useState("");
  const [activeDeptId, setActiveDeptId] = useState<string | null>(null);
  const [localSelectedDeptIds, setLocalSelectedDeptIds] = useState<Set<string>>(new Set(selectedDeptIds));
  const [localSelectedMemberIds, setLocalSelectedMemberIds] = useState<Set<string>>(new Set(selectedMemberIds));

  useEffect(() => {
    setLocalSelectedDeptIds(new Set(selectedDeptIds));
    setLocalSelectedMemberIds(new Set(selectedMemberIds));
  }, [selectedDeptIds, selectedMemberIds]);

  const departmentMap = useMemo(
    () => new Map(ORG_DIRECTORY.departments.map(department => [department.id, department])),
    [],
  );

  const activeDepartment = activeDeptId ? departmentMap.get(activeDeptId) ?? null : null;
  const normalizedKeyword = keyword.trim().toLowerCase();

  const filteredDepartments = useMemo(() => {
    if (!normalizedKeyword) return ORG_DIRECTORY.departments;
    return ORG_DIRECTORY.departments.filter(department => {
      const haystack = [
        department.name,
        department.description,
        ...department.members.map(member => `${member.name}${member.role}${member.store}`),
      ].join(" ").toLowerCase();
      return haystack.includes(normalizedKeyword);
    });
  }, [normalizedKeyword]);

  const filteredMembers = useMemo(() => {
    if (!activeDepartment) return [];
    if (!normalizedKeyword) return activeDepartment.members;
    return activeDepartment.members.filter(member => {
      const haystack = `${member.name} ${member.role} ${member.store} ${member.tag ?? ""}`.toLowerCase();
      return haystack.includes(normalizedKeyword);
    });
  }, [activeDepartment, normalizedKeyword]);

  const getDepartmentMemberIds = (departmentId: string) => {
    const department = departmentMap.get(departmentId);
    return department ? department.members.map(member => member.id) : [];
  };

  const syncDepartmentSelection = (departmentId: string, nextMemberIds: Set<string>) => {
    const departmentMemberIds = getDepartmentMemberIds(departmentId);
    const allChecked = departmentMemberIds.length > 0 && departmentMemberIds.every(id => nextMemberIds.has(id));
    setLocalSelectedDeptIds(prev => {
      const next = new Set(prev);
      if (allChecked) next.add(departmentId);
      else next.delete(departmentId);
      return next;
    });
  };

  const toggleDepartment = (departmentId: string) => {
    const memberIds = getDepartmentMemberIds(departmentId);
    const isChecked = localSelectedDeptIds.has(departmentId);

    setLocalSelectedDeptIds(prev => {
      const next = new Set(prev);
      if (isChecked) next.delete(departmentId);
      else next.add(departmentId);
      return next;
    });

    setLocalSelectedMemberIds(prev => {
      const next = new Set(prev);
      memberIds.forEach(memberId => {
        if (isChecked) next.delete(memberId);
        else next.add(memberId);
      });
      return next;
    });
  };

  const toggleMember = (departmentId: string, memberId: string) => {
    setLocalSelectedMemberIds(prev => {
      const next = new Set(prev);
      if (next.has(memberId)) next.delete(memberId);
      else next.add(memberId);
      syncDepartmentSelection(departmentId, next);
      return next;
    });
  };

  const handleBack = () => {
    if (activeDeptId) {
      setActiveDeptId(null);
      setKeyword("");
      return;
    }
    onBack();
  };

  const handleApply = () => {
    const payload = {
      departmentIds: Array.from(localSelectedDeptIds),
      memberIds: Array.from(localSelectedMemberIds),
    };

    if (payload.memberIds.length === 0) {
      toast.info("请先勾选组织或成员");
      return;
    }

    if (onApplySelection) {
      onApplySelection(payload);
      return;
    }

    toast.success(`已选择 ${payload.memberIds.length} 位培训对象`);
    onBack();
  };

  const selectedCount = localSelectedMemberIds.size;
  const selectedDeptCount = localSelectedDeptIds.size;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #fcfaf7 0%, #f6f6fb 100%)",
        fontFamily: "'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
      }}
    >
      <div
        style={{
          padding: "44px 16px 10px",
          background: "rgba(255,255,255,0.92)",
          borderBottom: "1px solid rgba(232,117,10,0.08)",
          backdropFilter: "blur(14px)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <button
            onClick={handleBack}
            aria-label={activeDeptId ? "返回组织列表" : "返回上一页"}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              border: "none",
              background: "transparent",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2F3443" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1f2430" }}>
              {activeDepartment ? activeDepartment.name : "组织架构"}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 14px",
            borderRadius: 16,
            background: "#f5f6fa",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B5BBC9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
          <input
            value={keyword}
            onChange={event => setKeyword(event.target.value)}
            placeholder={activeDepartment ? "搜索成员姓名或岗位" : "搜索组织或成员"}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 15,
              color: "#2f3443",
              padding: 0,
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 112px" }}>
        {!activeDepartment ? (
          <>
            <button
              onClick={onInvite}
              style={{
                width: "100%",
                border: "none",
                padding: "14px 16px",
                borderRadius: 20,
                background: "rgba(255,255,255,0.96)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                boxShadow: "0 12px 30px rgba(31,36,48,0.05)",
                marginBottom: 14,
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 14,
                  background: "rgba(72,103,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4867ff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1f2430" }}>添加企业/成员</div>
                <div style={{ fontSize: 12, color: "#98a0b3", marginTop: 3 }}>成员注册后会自动归入对应组织</div>
              </div>
              <Chevron />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#8f97a8", margin: "0 2px 10px" }}>
              <span style={{ color: "#5b84ff", fontWeight: 600 }}>通讯录</span>
              <span>›</span>
              <span>{ORG_DIRECTORY.companyName}</span>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.96)",
                borderRadius: 20,
                padding: "16px",
                boxShadow: "0 14px 32px rgba(31,36,48,0.05)",
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  background: "linear-gradient(135deg, #ffad35, #f48914)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                智
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#1f2430" }}>{ORG_DIRECTORY.companyName}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, color: "#586072", fontWeight: 600 }}>{ORG_DIRECTORY.companyOwner}</span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#4d74f6",
                      background: "rgba(77,116,246,0.1)",
                      borderRadius: 999,
                      padding: "4px 8px",
                      fontWeight: 600,
                    }}
                  >
                    {ORG_DIRECTORY.companyRole}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filteredDepartments.map(department => {
                const checked = localSelectedDeptIds.has(department.id);
                return (
                  <div
                    key={department.id}
                    style={{
                      background: "rgba(255,255,255,0.98)",
                      borderRadius: 20,
                      padding: "14px 14px 14px 12px",
                      boxShadow: "0 12px 28px rgba(31,36,48,0.05)",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <button
                      onClick={() => toggleDepartment(department.id)}
                      aria-label={`勾选${department.name}`}
                      style={{ background: "transparent", border: "none", padding: 0, display: "inline-flex", cursor: "pointer" }}
                    >
                      <Checkbox checked={checked} />
                    </button>
                    <button
                      onClick={() => setActiveDeptId(department.id)}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <OrgIcon />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#1f2430" }}>
                          {department.name}
                          <span style={{ color: "#98a0b3", fontWeight: 500 }}>（{department.countHint}）</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#98a0b3", marginTop: 4 }}>{department.description}</div>
                      </div>
                      <Chevron />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#8f97a8", margin: "0 2px 12px", flexWrap: "wrap" }}>
              <button
                onClick={() => setActiveDeptId(null)}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  color: "#5b84ff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                通讯录
              </button>
              <span>›</span>
              <button
                onClick={() => setActiveDeptId(null)}
                style={{
                  border: "none",
                  background: "transparent",
                  padding: 0,
                  color: "#6d7587",
                  cursor: "pointer",
                }}
              >
                {ORG_DIRECTORY.companyName}
              </button>
              <span>›</span>
              <span style={{ color: "#1f2430" }}>{activeDepartment.name}</span>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.98)",
                borderRadius: 20,
                padding: "16px",
                boxShadow: "0 12px 28px rgba(31,36,48,0.05)",
                marginBottom: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <OrgIcon />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#1f2430" }}>{activeDepartment.name}</div>
                  <div style={{ fontSize: 12, color: "#98a0b3", marginTop: 4 }}>{activeDepartment.description}</div>
                </div>
                <button
                  onClick={() => toggleDepartment(activeDepartment.id)}
                  style={{
                    border: "none",
                    background: "transparent",
                    padding: 0,
                    display: "inline-flex",
                    cursor: "pointer",
                  }}
                >
                  <Checkbox checked={localSelectedDeptIds.has(activeDepartment.id)} />
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filteredMembers.map(member => {
                const checked = localSelectedMemberIds.has(member.id);
                return (
                  <div
                    key={member.id}
                    style={{
                      background: "rgba(255,255,255,0.98)",
                      borderRadius: 18,
                      padding: "14px 14px 14px 12px",
                      boxShadow: "0 10px 26px rgba(31,36,48,0.045)",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <button
                      onClick={() => toggleMember(activeDepartment.id, member.id)}
                      aria-label={`勾选${member.name}`}
                      style={{ background: "transparent", border: "none", padding: 0, display: "inline-flex", cursor: "pointer" }}
                    >
                      <Checkbox checked={checked} />
                    </button>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 21,
                        background: checked ? "linear-gradient(135deg, rgba(232,117,10,0.18), rgba(255,154,60,0.12))" : "linear-gradient(135deg, rgba(91,132,255,0.12), rgba(91,132,255,0.05))",
                        color: checked ? "#c45e00" : "#4867ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {member.name.slice(0, 1)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "#1f2430" }}>{member.name}</span>
                        <span style={{ fontSize: 12, color: "#6d7587" }}>{member.role}</span>
                        {member.tag && (
                          <span
                            style={{
                              fontSize: 11,
                              color: "#4d74f6",
                              background: "rgba(77,116,246,0.1)",
                              borderRadius: 999,
                              padding: "3px 8px",
                              fontWeight: 600,
                            }}
                          >
                            {member.tag}
                          </span>
                        )}
                        {member.status === "pending" && (
                          <span
                            style={{
                              fontSize: 11,
                              color: "#c45e00",
                              background: "rgba(232,117,10,0.1)",
                              borderRadius: 999,
                              padding: "3px 8px",
                              fontWeight: 600,
                            }}
                          >
                            待补训
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: "#98a0b3", marginTop: 5 }}>{member.store}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "12px 14px 18px",
          background: "linear-gradient(180deg, rgba(252,250,247,0.2) 0%, rgba(252,250,247,0.94) 24%, #fcfaf7 100%)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.96)",
            borderRadius: 22,
            padding: "12px 14px",
            boxShadow: "0 16px 32px rgba(31,36,48,0.08)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1f2430" }}>已选 {selectedCount} 位培训人员</div>
          </div>
          <button
            onClick={handleApply}
            style={{
              border: "none",
              borderRadius: 16,
              padding: "12px 18px",
              minWidth: 96,
              background: selectedCount > 0 ? "linear-gradient(135deg, #e8750a, #ff9a3c)" : "#d9dee8",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              boxShadow: selectedCount > 0 ? "0 10px 22px rgba(232,117,10,0.25)" : "none",
              cursor: "pointer",
            }}
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}
