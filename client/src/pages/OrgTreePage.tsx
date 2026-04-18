/*
 * 培训智能体 · 组织架构选择页
 * 当前页面设计提醒：遵循微信小程序语境下的飞书通讯录体验。第一页展示集团、管理层、店长三个组织层级；第二页展示该层级下的成员，店长层级按业务组分段。
 * 设计规范：暖白底、橙色品牌强调、蓝色组织图标、底部固定确认栏、信息密度紧凑但可扫读。
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

interface OrgGroup {
  id: string;
  label: string;
  hint: string;
  members: DepartmentMember[];
}

interface OrgDepartment {
  id: string;
  name: string;
  countHint: string;
  description: string;
  members?: DepartmentMember[];
  groups?: OrgGroup[];
}

const ORG_DIRECTORY: {
  companyName: string;
  companyOwner: string;
  companyRole: string;
  departments: OrgDepartment[];
} = {
  companyName: "智爱客餐饮集团",
  companyOwner: "王建国",
  companyRole: "企业负责人",
  departments: [
    {
      id: "group",
      name: "集团",
      countHint: "3",
      description: "集团总部 · 统一培训策略与经营标准制定",
      members: [
        { id: "G1", name: "周蕾", role: "集团运营总监", store: "集团总部", tag: "审批人" },
        { id: "G2", name: "顾岩", role: "培训负责人", store: "集团总部", tag: "培训负责人" },
        { id: "G3", name: "宋清", role: "组织发展经理", store: "集团总部" },
      ],
    },
    {
      id: "management",
      name: "管理层",
      countHint: "3",
      description: "大区与门店管理层 · 监督培训执行与人员到岗",
      members: [
        { id: "M1", name: "韩磊", role: "营运经理", store: "北京一区" },
        { id: "M2", name: "徐薇", role: "区域督导", store: "北京一区", tag: "重点门店" },
        { id: "M3", name: "赵毅", role: "值班经理", store: "北京朝阳店", status: "pending" },
      ],
    },
    {
      id: "store-manager",
      name: "店长",
      countHint: "7",
      description: "门店层级 · 店长统筹后按业务组细分培训对象",
      groups: [
        {
          id: "front-service",
          label: "前厅服务组",
          hint: "服务礼仪与顾客接待",
          members: [
            { id: "S1", name: "曹敏", role: "服务员", store: "北京朝阳店", tag: "培训骨干" },
            { id: "S2", name: "李明", role: "服务员", store: "北京朝阳店" },
            { id: "S5", name: "赵强", role: "服务员", store: "北京朝阳店", status: "pending" },
          ],
        },
        {
          id: "kitchen-pass",
          label: "后厨服务组",
          hint: "食品安全与出品流程",
          members: [
            { id: "S3", name: "张华", role: "厨师", store: "北京朝阳店", tag: "核心岗位" },
            { id: "S6", name: "陈静", role: "厨师", store: "北京朝阳店" },
          ],
        },
        {
          id: "cashier-greeting",
          label: "收银与迎宾组",
          hint: "高峰接待与收银操作",
          members: [
            { id: "S4", name: "王芳", role: "收银员", store: "北京朝阳店" },
            { id: "S7", name: "刘宁", role: "迎宾", store: "北京朝阳店", tag: "新人" },
          ],
        },
      ],
    },
  ],
};

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

function QrPreview() {
  const cells = Array.from({ length: 9 }, (_, index) => index);
  return (
    <div
      style={{
        width: 182,
        height: 182,
        borderRadius: 24,
        background: "#fff",
        padding: 14,
        boxShadow: "inset 0 0 0 1px rgba(31,36,48,0.05)",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 8,
      }}
    >
      {cells.map(cell => (
        <div
          key={cell}
          style={{
            borderRadius: 12,
            background: cell % 2 === 0 ? "linear-gradient(135deg, #1f2430, #485064)" : "linear-gradient(135deg, #f0f2f7, #dfe5f2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 6,
              borderRadius: 8,
              border: cell === 4 ? "2px solid rgba(232,117,10,0.7)" : "none",
              background: cell === 4 ? "linear-gradient(135deg, rgba(232,117,10,0.1), rgba(255,154,60,0.22))" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#e8750a",
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            {cell === 4 ? "智" : ""}
          </div>
        </div>
      ))}
    </div>
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
  const [showInviteDialog, setShowInviteDialog] = useState(false);

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

  const getDepartmentMembers = (department: OrgDepartment) => {
    if (department.members) return department.members;
    return department.groups?.flatMap(group => group.members) ?? [];
  };

  const getDepartmentMemberIds = (departmentId: string) => {
    const department = departmentMap.get(departmentId);
    return department ? getDepartmentMembers(department).map(member => member.id) : [];
  };

  const getGroupMemberIds = (departmentId: string, groupId: string) => {
    const department = departmentMap.get(departmentId);
    const group = department?.groups?.find(item => item.id === groupId);
    return group ? group.members.map(member => member.id) : [];
  };

  const filteredDepartments = useMemo(() => {
    if (!normalizedKeyword) return ORG_DIRECTORY.departments;
    return ORG_DIRECTORY.departments.filter(department => {
      const haystack = [
        department.name,
        department.description,
        ...(department.groups?.map(group => `${group.label}${group.hint}`) ?? []),
        ...getDepartmentMembers(department).map(member => `${member.name}${member.role}${member.store}`),
      ].join(" ").toLowerCase();
      return haystack.includes(normalizedKeyword);
    });
  }, [normalizedKeyword]);

  const filteredDirectMembers = useMemo(() => {
    if (!activeDepartment?.members) return [];
    if (!normalizedKeyword) return activeDepartment.members;
    return activeDepartment.members.filter(member => {
      const haystack = `${member.name} ${member.role} ${member.store} ${member.tag ?? ""}`.toLowerCase();
      return haystack.includes(normalizedKeyword);
    });
  }, [activeDepartment, normalizedKeyword]);

  const filteredGroups = useMemo(() => {
    if (!activeDepartment?.groups) return [];
    if (!normalizedKeyword) return activeDepartment.groups;
    return activeDepartment.groups
      .map(group => ({
        ...group,
        members: group.members.filter(member => {
          const haystack = `${group.label} ${group.hint} ${member.name} ${member.role} ${member.store} ${member.tag ?? ""}`.toLowerCase();
          return haystack.includes(normalizedKeyword);
        }),
      }))
      .filter(group => group.members.length > 0 || `${group.label}${group.hint}`.toLowerCase().includes(normalizedKeyword));
  }, [activeDepartment, normalizedKeyword]);

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

  const toggleGroup = (departmentId: string, groupId: string) => {
    const groupMemberIds = getGroupMemberIds(departmentId, groupId);
    const isAllChecked = groupMemberIds.length > 0 && groupMemberIds.every(id => localSelectedMemberIds.has(id));

    setLocalSelectedMemberIds(prev => {
      const next = new Set(prev);
      groupMemberIds.forEach(memberId => {
        if (isAllChecked) next.delete(memberId);
        else next.add(memberId);
      });
      syncDepartmentSelection(departmentId, next);
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
    if (showInviteDialog) {
      setShowInviteDialog(false);
      return;
    }
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

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #fcfaf7 0%, #f6f6fb 100%)",
        fontFamily: "'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif",
        position: "relative",
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
              onClick={() => setShowInviteDialog(true)}
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
                  background: "rgba(232,117,10,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8750a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="7" height="7" rx="1.6" />
                  <rect x="13" y="4" width="7" height="7" rx="1.6" />
                  <rect x="4" y="13" width="7" height="7" rx="1.6" />
                  <path d="M16 13h1" />
                  <path d="M19 13h1" />
                  <path d="M16 16h4" />
                  <path d="M16 19h1" />
                  <path d="M19 19h1" />
                </svg>
              </div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#1f2430" }}>邀请企业/成员</div>
                <div style={{ fontSize: 12, color: "#98a0b3", marginTop: 3 }}>小程序二维码分享注册，成员扫码后自动归位</div>
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

            {activeDepartment.groups ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filteredGroups.map(group => {
                  const groupMemberIds = group.members.map(member => member.id);
                  const groupChecked = groupMemberIds.length > 0 && groupMemberIds.every(id => localSelectedMemberIds.has(id));
                  return (
                    <div
                      key={group.id}
                      style={{
                        background: "rgba(255,255,255,0.98)",
                        borderRadius: 20,
                        padding: "14px 14px 14px 12px",
                        boxShadow: "0 10px 26px rgba(31,36,48,0.045)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                        <button
                          onClick={() => toggleGroup(activeDepartment.id, group.id)}
                          aria-label={`勾选${group.label}`}
                          style={{ background: "transparent", border: "none", padding: 0, display: "inline-flex", cursor: "pointer" }}
                        >
                          <Checkbox checked={groupChecked} />
                        </button>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "#1f2430" }}>{group.label}</div>
                          <div style={{ fontSize: 12, color: "#98a0b3", marginTop: 4 }}>{group.hint}</div>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {group.members.map(member => {
                          const checked = localSelectedMemberIds.has(member.id);
                          return (
                            <div
                              key={member.id}
                              style={{
                                background: checked ? "rgba(255,245,236,0.9)" : "#f8f9fc",
                                borderRadius: 18,
                                padding: "12px 12px 12px 10px",
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
                                  width: 40,
                                  height: 40,
                                  borderRadius: 20,
                                  background: checked ? "linear-gradient(135deg, rgba(232,117,10,0.18), rgba(255,154,60,0.12))" : "linear-gradient(135deg, rgba(91,132,255,0.12), rgba(91,132,255,0.05))",
                                  color: checked ? "#c45e00" : "#4867ff",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 15,
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
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filteredDirectMembers.map(member => {
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
            )}
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

      {showInviteDialog && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(24, 28, 37, 0.34)",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: 14,
            zIndex: 30,
          }}
          onClick={() => setShowInviteDialog(false)}
        >
          <div
            onClick={event => event.stopPropagation()}
            style={{
              width: "100%",
              borderRadius: "22px 22px 16px 16px",
              background: "linear-gradient(180deg, #fffaf3 0%, #ffffff 100%)",
              boxShadow: "0 22px 46px rgba(31,36,48,0.18)",
              padding: "18px 18px 16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "#1f2430" }}>小程序二维码分享注册</div>
                <div style={{ fontSize: 12, color: "#8f97a8", marginTop: 4 }}>转发给企业或成员，扫码后将按邀请关系自动归位</div>
              </div>
              <button
                onClick={() => setShowInviteDialog(false)}
                style={{ border: "none", background: "transparent", fontSize: 18, color: "#9aa2b1", cursor: "pointer" }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "center", margin: "16px 0 14px" }}>
              <QrPreview />
            </div>

            <div
              style={{
                borderRadius: 18,
                background: "rgba(232,117,10,0.08)",
                padding: "12px 14px",
                color: "#8b5b2a",
                fontSize: 12,
                lineHeight: 1.6,
                marginBottom: 14,
              }}
            >
              通用邀请链接不区分上下级，接收者可自行选择与邀请人的关系；完成注册后将自动进入对应组织结构。
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => toast.success("已生成二维码，可转发到微信")}
                style={{
                  flex: 1,
                  border: "none",
                  borderRadius: 16,
                  padding: "13px 14px",
                  background: "linear-gradient(135deg, #e8750a, #ff9a3c)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  boxShadow: "0 10px 22px rgba(232,117,10,0.25)",
                  cursor: "pointer",
                }}
              >
                转发二维码
              </button>
              <button
                onClick={onInvite}
                style={{
                  flex: 1,
                  border: "1px solid rgba(232,117,10,0.18)",
                  borderRadius: 16,
                  padding: "13px 14px",
                  background: "#fff",
                  color: "#c76605",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                完善邀请信息
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
