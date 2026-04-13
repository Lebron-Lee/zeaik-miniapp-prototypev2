/**
 * 培训智能体 · 组织架构树页
 * 功能：可视化组织层级 + 角色权限标签 + 邀请成员入口 + 同层级多角色展示
 * 设计规范：橙色主题，树形卡片，层级缩进，角色色彩区分
 */
import React, { useState } from "react";
import { toast } from "sonner";

interface OrgTreePageProps {
  onBack: () => void;
  onInvite: () => void;
}

// ── 类型 ──────────────────────────────────────────────────────────────────────
type RoleType = "manager" | "functional" | "observer" | "executor";

interface OrgMember {
  id: string;
  name: string;
  jobTitle: string;
  roleType: RoleType;
  dept: string;
  level: number; // 0=集团, 1=区域, 2=门店, 3=班组
  status: "active" | "pending" | "invited";
  trainingScore?: number;
  children?: OrgMember[];
  expanded?: boolean;
}

// ── 角色类型配置 ──────────────────────────────────────────────────────────────
const ROLE_CONFIG: Record<RoleType, { label: string; bg: string; text: string; desc: string }> = {
  manager:    { label: "管理者", bg: "#FFF3E0", text: "#e8750a", desc: "可发起培训、查看全员数据" },
  functional: { label: "职能支持", bg: "#E3F2FD", text: "#1565C0", desc: "在职能范围内发起培训" },
  observer:   { label: "数据观察", bg: "#F3E5F5", text: "#6A1B9A", desc: "只读全部数据，不可发起" },
  executor:   { label: "执行者", bg: "#E8F5E9", text: "#2E7D32", desc: "接受培训任务，提交答题" },
};

const LEVEL_CONFIG = [
  { label: "集团级", color: "#7B1FA2" },
  { label: "区域级", color: "#1565C0" },
  { label: "门店级", color: "#e8750a" },
  { label: "班组级", color: "#2E7D32" },
];

// ── Mock 组织数据 ──────────────────────────────────────────────────────────────
const ORG_TREE: OrgMember[] = [
  {
    id: "G1", name: "刘总", jobTitle: "集团CEO", roleType: "manager",
    dept: "智爱客餐饮集团", level: 0, status: "active", trainingScore: 5.0,
    children: [
      {
        id: "R1", name: "张志远", jobTitle: "区域经理", roleType: "manager",
        dept: "华北区", level: 1, status: "active", trainingScore: 4.7,
        children: [
          {
            id: "R1F1", name: "陈丽华", jobTitle: "人力资源经理", roleType: "functional",
            dept: "华北区", level: 1, status: "active", trainingScore: 4.5,
          },
          {
            id: "R1F2", name: "赵数据", jobTitle: "数据分析员", roleType: "observer",
            dept: "华北区", level: 1, status: "active",
          },
          {
            id: "R1F3", name: "孙助理", jobTitle: "经理助理", roleType: "functional",
            dept: "华北区", level: 1, status: "active", trainingScore: 4.2,
          },
          {
            id: "S1", name: "王建国", jobTitle: "店长", roleType: "manager",
            dept: "北京朝阳店", level: 2, status: "active", trainingScore: 4.8,
            children: [
              {
                id: "S1D1", name: "李秀梅", jobTitle: "副店长", roleType: "manager",
                dept: "北京朝阳店", level: 2, status: "active", trainingScore: 4.6,
                children: [
                  { id: "E1", name: "曹敏", jobTitle: "服务员", roleType: "executor", dept: "北京朝阳店", level: 3, status: "active", trainingScore: 4.5 },
                  { id: "E2", name: "李明", jobTitle: "服务员", roleType: "executor", dept: "北京朝阳店", level: 3, status: "active", trainingScore: 3.9 },
                  { id: "E3", name: "张华", jobTitle: "厨师", roleType: "executor", dept: "北京朝阳店", level: 3, status: "active", trainingScore: 3.2 },
                  { id: "E4", name: "王芳", jobTitle: "收银员", roleType: "executor", dept: "北京朝阳店", level: 3, status: "active", trainingScore: 4.8 },
                  { id: "E5", name: "赵强", jobTitle: "服务员", roleType: "executor", dept: "北京朝阳店", level: 3, status: "active", trainingScore: 2.8 },
                  { id: "E6", name: "陈静", jobTitle: "厨师", roleType: "executor", dept: "北京朝阳店", level: 3, status: "pending" },
                ],
              },
            ],
          },
          {
            id: "S2", name: "吴丽", jobTitle: "店长", roleType: "manager",
            dept: "北京海淀店", level: 2, status: "active", trainingScore: 4.3,
            children: [
              { id: "E7", name: "周明", jobTitle: "服务员", roleType: "executor", dept: "北京海淀店", level: 3, status: "active", trainingScore: 4.1 },
              { id: "E8", name: "（待邀请）", jobTitle: "服务员", roleType: "executor", dept: "北京海淀店", level: 3, status: "invited" },
            ],
          },
        ],
      },
    ],
  },
];

// ── 展开状态管理 ──────────────────────────────────────────────────────────────
function useExpandState(initial: Set<string>) {
  const [expanded, setExpanded] = useState<Set<string>>(initial);
  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  return { expanded, toggle };
}

// ── 邀请弹层 ──────────────────────────────────────────────────────────────────
function InviteModal({ onClose, onInvite }: { onClose: () => void; onInvite: () => void }) {
  const [copied, setCopied] = useState(false);
  const link = "https://miniapp.zeaik.com/join?inv=WJG001&dept=北京朝阳店";

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("邀请链接已复制");
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
      <div style={{ width: "100%", background: "white", borderRadius: "20px 20px 0 0", padding: "20px 18px 36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#1A1A1A" }}>邀请成员加入</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, color: "#888", cursor: "pointer" }}>×</button>
        </div>

        {/* 邀请方式 */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {[
            { icon: "🔗", label: "复制链接", action: handleCopy },
            { icon: "📱", label: "微信分享", action: () => toast.info("请在微信中打开后分享") },
            { icon: "📷", label: "生成二维码", action: () => toast.info("二维码生成中...") },
          ].map(item => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                flex: 1, padding: "14px 0", borderRadius: 12, border: "1.5px solid #F0F0F0",
                background: "white", cursor: "pointer", display: "flex", flexDirection: "column",
                alignItems: "center", gap: 6,
              }}
            >
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <span style={{ fontSize: 12, color: "#555", fontWeight: 600 }}>{item.label}</span>
            </button>
          ))}
        </div>

        {/* 链接预览 */}
        <div style={{
          background: "#F5F5F5", borderRadius: 10, padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
        }}>
          <span style={{ fontSize: 11, color: "#888", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {link}
          </span>
          <button
            onClick={handleCopy}
            style={{
              padding: "5px 12px", borderRadius: 8, border: "none",
              background: copied ? "#43A047" : "linear-gradient(135deg, #e8750a, #ff9a3c)",
              color: "white", fontSize: 11, fontWeight: 700, cursor: "pointer", flexShrink: 0,
            }}
          >
            {copied ? "已复制" : "复制"}
          </button>
        </div>

        {/* 说明 */}
        <div style={{ background: "#FFF8F0", borderRadius: 10, padding: "10px 14px", border: "1px solid #FFE0B2" }}>
          <div style={{ fontSize: 12, color: "#888", lineHeight: 1.7 }}>
            📌 成员点击链接后，填写姓名+职位即可完成注册，<strong style={{ color: "#e8750a" }}>自动归入你的团队</strong>，无需手动添加
          </div>
        </div>

        <button
          onClick={() => { onInvite(); onClose(); }}
          style={{
            width: "100%", marginTop: 16, padding: "13px 0", borderRadius: 14, border: "none",
            background: "linear-gradient(135deg, #e8750a, #ff9a3c)",
            color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer",
          }}
        >
          确认，发送邀请
        </button>
      </div>
    </div>
  );
}

// ── 成员节点组件 ──────────────────────────────────────────────────────────────
function MemberNode({
  member, depth, expanded, onToggle, onInvite, currentUserId,
}: {
  member: OrgMember;
  depth: number;
  expanded: Set<string>;
  onToggle: (id: string) => void;
  onInvite: () => void;
  currentUserId: string;
}) {
  const hasChildren = member.children && member.children.length > 0;
  const isExpanded = expanded.has(member.id);
  const isCurrentUser = member.id === currentUserId;
  const roleCfg = ROLE_CONFIG[member.roleType];
  const levelCfg = LEVEL_CONFIG[member.level] ?? LEVEL_CONFIG[3];

  // 同层级分组：找出和当前成员同层同父的其他职能角色（仅在 level<=1 时展示分组标签）
  const isPending = member.status === "pending";
  const isInvited = member.status === "invited";

  return (
    <div style={{ marginLeft: depth * 16 }}>
      {/* 连接线 */}
      {depth > 0 && (
        <div style={{
          position: "absolute",
          left: depth * 16 - 10,
          top: 0, bottom: 0,
          width: 1,
          background: "#E8E8E8",
          pointerEvents: "none",
        }} />
      )}

      <div style={{
        background: isCurrentUser ? "#FFF8F0" : "white",
        borderRadius: 12, padding: "10px 12px", marginBottom: 6,
        border: isCurrentUser ? "1.5px solid #e8750a" : isPending ? "1.5px dashed #FFB74D" : "1.5px solid #F0F0F0",
        boxShadow: isCurrentUser ? "0 2px 12px rgba(232,117,10,0.15)" : "0 1px 4px rgba(0,0,0,0.04)",
        display: "flex", alignItems: "center", gap: 10, cursor: hasChildren ? "pointer" : "default",
        position: "relative",
        opacity: isInvited ? 0.6 : 1,
      }}
        onClick={() => hasChildren && onToggle(member.id)}
      >
        {/* 头像 */}
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: isInvited ? "#F5F5F5" :
            isCurrentUser ? "linear-gradient(135deg, #e8750a, #ff9a3c)" :
              `linear-gradient(135deg, ${levelCfg.color}33, ${levelCfg.color}22)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 700,
          color: isInvited ? "#bbb" : isCurrentUser ? "white" : levelCfg.color,
          border: isInvited ? "1.5px dashed #ddd" : "none",
        }}>
          {isInvited ? "+" : member.name[0]}
        </div>

        {/* 信息 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <span style={{
              fontSize: 14, fontWeight: isCurrentUser ? 800 : 600,
              color: isInvited ? "#bbb" : "#1A1A1A",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {member.name}
              {isCurrentUser && <span style={{ fontSize: 10, color: "#e8750a", marginLeft: 4 }}>（我）</span>}
            </span>
            {/* 角色标签 */}
            <span style={{
              fontSize: 9, padding: "2px 6px", borderRadius: 6, flexShrink: 0,
              background: roleCfg.bg, color: roleCfg.text, fontWeight: 700,
            }}>
              {roleCfg.label}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "#888" }}>{member.jobTitle}</span>
            {member.trainingScore !== undefined && (
              <span style={{
                fontSize: 10, padding: "1px 6px", borderRadius: 6,
                background: member.trainingScore >= 4 ? "#E8F5E9" : member.trainingScore >= 3 ? "#FFF3E0" : "#FFEBEE",
                color: member.trainingScore >= 4 ? "#2E7D32" : member.trainingScore >= 3 ? "#E65100" : "#C62828",
                fontWeight: 700,
              }}>
                {member.trainingScore}分
              </span>
            )}
            {isPending && (
              <span style={{ fontSize: 10, color: "#F57C00", background: "#FFF3E0", padding: "1px 6px", borderRadius: 6 }}>
                待完成
              </span>
            )}
            {isInvited && (
              <button
                onClick={e => { e.stopPropagation(); onInvite(); }}
                style={{
                  fontSize: 10, color: "#e8750a", background: "#FFF3E0", padding: "2px 8px",
                  borderRadius: 6, border: "none", cursor: "pointer", fontWeight: 700,
                }}
              >
                + 邀请
              </button>
            )}
          </div>
        </div>

        {/* 展开/收起 */}
        {hasChildren && (
          <div style={{
            width: 22, height: 22, borderRadius: 6, flexShrink: 0,
            background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round"
              style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        )}
      </div>

      {/* 子节点 */}
      {hasChildren && isExpanded && (
        <div style={{ position: "relative" }}>
          {member.children!.map(child => (
            <MemberNode
              key={child.id}
              member={child}
              depth={depth + 1}
              expanded={expanded}
              onToggle={onToggle}
              onInvite={onInvite}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── 主组件 ────────────────────────────────────────────────────────────────────
export default function OrgTreePage({ onBack, onInvite }: OrgTreePageProps) {
  const { expanded, toggle } = useExpandState(new Set(["G1", "R1", "S1", "S1D1"]));
  const [showInvite, setShowInvite] = useState(false);
  const [activeTab, setActiveTab] = useState<"tree" | "legend" | "growth" | "superior">("tree");
  const [growthAnimStep, setGrowthAnimStep] = useState(0);

  // 模拟培训传播构建的时间线数据
  const GROWTH_TIMELINE = [
    {
      time: "今天 09:15", type: "send", icon: "📤",
      title: "王建国发起培训任务",
      desc: "选择 5 道服务礼仪题，发送给北京朝阳店全体员工",
      color: "#e8750a", bg: "#FFF3E0",
    },
    {
      time: "今天 09:16", type: "share", icon: "🔗",
      title: "生成邀请链接分享到微信群",
      desc: "链接携带：邀请人=王建国 · 门店=北京朝阳店 · 推荐职位=服务员",
      color: "#1565C0", bg: "#E3F2FD",
    },
    {
      time: "今天 09:31", type: "register", icon: "✅",
      title: "刘小红 通过链接完成注册",
      desc: "填写姓名+职位（服务员）→ 确认上级（王建国）→ 自动加入北京朝阳店",
      color: "#2E7D32", bg: "#E8F5E9",
      newMember: { name: "刘小红", job: "服务员", dept: "北京朝阳店" },
    },
    {
      time: "今天 09:31", type: "org", icon: "🏗️",
      title: "组织架构自动更新",
      desc: "刘小红已加入组织树 · 北京朝阳店成员 +1 · 无需手动维护",
      color: "#6A1B9A", bg: "#F3E5F5",
    },
    {
      time: "今天 09:33", type: "training", icon: "🎓",
      title: "刘小红开始答题培训",
      desc: "直接进入培训任务，无需额外登录步骤，2 步注册即完成",
      color: "#e8750a", bg: "#FFF3E0",
    },
    {
      time: "今天 10:05", type: "register", icon: "✅",
      title: "陈大明 通过链接完成注册",
      desc: "填写姓名+职位（厨师）→ 确认上级（王建国）→ 自动加入北京朝阳店",
      color: "#2E7D32", bg: "#E8F5E9",
      newMember: { name: "陈大明", job: "厨师", dept: "北京朝阳店" },
    },
    {
      time: "今天 10:05", type: "org", icon: "🏗️",
      title: "组织架构再次自动更新",
      desc: "陈大明已加入组织树 · 北京朝阳店成员 +1 · 组织架构持续完善",
      color: "#6A1B9A", bg: "#F3E5F5",
    },
    // ── 反向拉新：向上传播节点（通用邀请链接，接收者自选层级关系）──
    {
      time: "今天 11:20", type: "superior_invite", icon: "📤",
      title: "王建国发起通用邀请",
      desc: "首次发起培训时尚无上级，生成「通用邀请链接」并分享到微信 — 链接不区分上级/下级，接收者自行选择与邀请人的关系",
      color: "#6A1B9A", bg: "#EDE7F6",
    },
    {
      time: "今天 11:38", type: "superior_register", icon: "👤",
      title: "李区域经理 打开链接，选择「我是TA的上级」",
      desc: "填写姓名+手机号 → 选择「我是王建国的上级」→ 选择职位（区域经理）→ 系统自动将其归入上级层级",
      color: "#6A1B9A", bg: "#EDE7F6",
      newSuperior: { name: "李区域经理", job: "区域经理", dept: "华北区" },
    },
    {
      time: "今天 11:38", type: "org_up", icon: "🏗️",
      title: "组织架构向上扩展",
      desc: "李区域经理已加入组织树 · 王建国的上级节点自动绑定 · 历史培训数据同步至上级管理端",
      color: "#6A1B9A", bg: "#F3E5F5",
    },
    {
      time: "今天 11:40", type: "sync", icon: "📊",
      title: "上级可查看下级团队数据",
      desc: "李区域经理登录管理端，可查看北京朝阳店 8 人的培训完成率、得分分布和问题清单",
      color: "#1565C0", bg: "#E3F2FD",
    },
  ];
  const currentUserId = "S1"; // 模拟当前登录用户为王建国（店长）

  // 统计数据
  const countMembers = (nodes: OrgMember[]): number =>
    nodes.reduce((sum, n) => sum + 1 + (n.children ? countMembers(n.children) : 0), 0);
  const totalMembers = countMembers(ORG_TREE);

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
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span style={{ fontSize: 17, fontWeight: 700, color: "white" }}>组织架构</span>
          <button
            onClick={() => setShowInvite(true)}
            style={{
              background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 20,
              padding: "6px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            <span style={{ fontSize: 12, color: "white", fontWeight: 700 }}>邀请成员</span>
          </button>
        </div>

        {/* 统计行 */}
        <div style={{
          background: "rgba(255,255,255,0.15)", borderRadius: "14px 14px 0 0",
          padding: "12px 16px", display: "flex", gap: 0,
        }}>
          {[
            { label: "总成员", value: totalMembers, unit: "人" },
            { label: "层级深度", value: 4, unit: "级" },
            { label: "待激活", value: 2, unit: "人" },
          ].map((item, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.2)" : "none" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "white" }}>
                {item.value}<span style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.7)" }}>{item.unit}</span>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab */}
      <div style={{ background: "white", display: "flex", borderBottom: "1px solid #F0F0F0", flexShrink: 0 }}>
        {[
          { key: "tree", label: "组织树" },
          { key: "superior", label: "上级视角" },
          { key: "growth", label: "传播记录" },
          { key: "legend", label: "角色说明" },
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
        {activeTab === "tree" && (
          <>
            {/* 层级图例 */}
            <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
              {LEVEL_CONFIG.map((lv, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 4,
                  background: "white", borderRadius: 8, padding: "4px 10px",
                  border: "1px solid #F0F0F0",
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: lv.color }} />
                  <span style={{ fontSize: 11, color: "#555" }}>L{i} {lv.label}</span>
                </div>
              ))}
            </div>

            {/* 树形结构 */}
            {ORG_TREE.map(root => (
              <MemberNode
                key={root.id}
                member={root}
                depth={0}
                expanded={expanded}
                onToggle={toggle}
                onInvite={() => setShowInvite(true)}
                currentUserId={currentUserId}
              />
            ))}

            {/* 快速邀请卡 */}
            <div style={{
              background: "white", borderRadius: 14, padding: "16px",
              border: "1.5px dashed #FFB74D", marginTop: 8,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: "#FFF3E0", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8750a" strokeWidth="2" strokeLinecap="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 2 }}>邀请更多成员</div>
                <div style={{ fontSize: 12, color: "#888" }}>分享链接，成员注册后自动加入团队</div>
              </div>
              <button
                onClick={() => setShowInvite(true)}
                style={{
                  padding: "8px 14px", borderRadius: 10, border: "none",
                  background: "linear-gradient(135deg, #e8750a, #ff9a3c)",
                  color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer",
                }}
              >
                邀请
              </button>
            </div>
          </>
        )}

        {activeTab === "superior" && (
          <>
            {/* 未绑定上级警告 */}
            <div style={{
              background: "linear-gradient(135deg, #FFF3E0, #FFF8F0)",
              border: "1.5px solid #FFB74D", borderRadius: 14,
              padding: "14px 16px", marginBottom: 16,
              display: "flex", alignItems: "flex-start", gap: 12,
            }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>⚠️</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#E65100", marginBottom: 4 }}>你尚未绑定上级</div>
                <div style={{ fontSize: 12, color: "#888", lineHeight: 1.7 }}>
                  你发起的培训数据目前仅在本层级可见，上级无法查看你团队的培训情况，
                  也无法通过你的培训活动扩展上级组织架构。
                </div>
                <button style={{
                  marginTop: 10, padding: "8px 16px", borderRadius: 10, border: "none",
                  background: "linear-gradient(135deg, #e8750a, #ff9a3c)",
                  color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer",
                }}
                  onClick={() => {}}
                >
                  立即绑定上级 →
                </button>
              </div>
            </div>

            {/* 说明：绑定后上级能看到什么 */}
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 10 }}>绑定上级后，上级可见内容</div>
            {[
              { icon: "📊", title: "培训完成率汇总", desc: "上级可在管理端看到你团队的整体完成率和平均分，无需逐一询问" },
              { icon: "🏆", title: "问题清单下钻", desc: "上级的 TOP10 问题清单中，会包含你团队员工的答错记录，支持一键发起专项培训" },
              { icon: "🌱", title: "组织架构扩展", desc: "你的员工通过培训链接注册后，自动出现在上级的组织树中，上级无感知组织扩张" },
              { icon: "🔔", title: "培训通知同步", desc: "你每次发起培训时，上级收到通知摘要，掌握全局培训动态" },
            ].map((item, i) => (
              <div key={i} style={{
                background: "white", borderRadius: 12, padding: "14px 16px", marginBottom: 8,
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                display: "flex", alignItems: "flex-start", gap: 12,
              }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}

            {/* 模拟：上级视角的下级培训汇总 */}
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", margin: "16px 0 10px" }}>上级视角预览（绑定后效果）</div>
            <div style={{
              background: "white", borderRadius: 14, padding: "14px 16px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)", border: "1.5px solid #F0F0F0",
              opacity: 0.6,
            }}>
              <div style={{ fontSize: 12, color: "#aaa", marginBottom: 12, textAlign: "center" }}>— 绑定上级后解锁 —</div>
              {[
                { name: "张志远（区域经理）", label: "你的上级", score: "4.7", rate: "92%", color: "#1565C0" },
                { name: "北京朝阳店（你的团队）", label: "本店汇总", score: "4.2", rate: "85%", color: "#e8750a" },
                { name: "北京海淀店（同级）", label: "同级对比", score: "4.3", rate: "88%", color: "#2E7D32" },
              ].map((row, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 0", borderBottom: i < 2 ? "1px solid #F5F5F5" : "none",
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: 4, flexShrink: 0,
                    background: row.color,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{row.name}</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>{row.label}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: row.color }}>{row.score}分</div>
                    <div style={{ fontSize: 10, color: "#aaa" }}>完成率 {row.rate}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* 多上级场景说明 */}
            <div style={{
              background: "#E3F2FD", borderRadius: 12, padding: "12px 14px",
              border: "1px solid #90CAF9", marginTop: 12,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1565C0", marginBottom: 4 }}>💡 多上级场景</div>
              <div style={{ fontSize: 11, color: "#555", lineHeight: 1.7 }}>
                若你绑定了多位上级（如区域经理 + 人力资源经理），培训数据会同步至所有上级的管理视图。
                每位上级只能看到与自己职能相关的数据维度，数据隔离保护隐私。
              </div>
            </div>
          </>
        )}

        {activeTab === "growth" && (
          <>
            {/* 说明横幅 */}
            <div style={{
              background: "linear-gradient(135deg, #FFF3E0, #FFF8F0)",
              border: "1.5px solid #FFB74D", borderRadius: 14,
              padding: "14px 16px", marginBottom: 16,
              display: "flex", alignItems: "flex-start", gap: 12,
            }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>🌱</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#E65100", marginBottom: 4 }}>
                  组织架构随培训传播自动生长
                </div>
                <div style={{ fontSize: 12, color: "#888", lineHeight: 1.7 }}>
                  每次发起培训并分享邀请链接，未注册员工点击后 2 步完成注册，
                  系统自动将其归入对应层级，无需管理员手动维护人员名单。
                </div>
              </div>
            </div>

            {/* 统计卡片 */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[
                { label: "本月通过培训注册", value: "8", unit: "人", color: "#2E7D32", bg: "#E8F5E9" },
                { label: "组织完整度", value: "76", unit: "%", color: "#e8750a", bg: "#FFF3E0" },
                { label: "待邀请岗位", value: "3", unit: "个", color: "#1565C0", bg: "#E3F2FD" },
              ].map((s, i) => (
                <div key={i} style={{
                  flex: 1, background: s.bg, borderRadius: 12,
                  padding: "12px 10px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>
                    {s.value}<span style={{ fontSize: 11 }}>{s.unit}</span>
                  </div>
                  <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* 时间线 */}
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1A1A1A", marginBottom: 12 }}>今日传播记录</div>
            <div style={{ position: "relative" }}>
              {/* 竖线 */}
              <div style={{
                position: "absolute", left: 19, top: 20, bottom: 20,
                width: 2, background: "linear-gradient(180deg, #e8750a33, #e8750a11)",
                borderRadius: 2,
              }} />

              {GROWTH_TIMELINE.map((item, i) => (
                <div key={i} style={{
                  display: "flex", gap: 12, marginBottom: 12,
                  opacity: growthAnimStep > i || growthAnimStep === 0 ? 1 : 0.3,
                  transition: "opacity 0.4s",
                }}>
                  {/* 时间线节点 */}
                  <div style={{
                    width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                    background: item.bg, border: `1.5px solid ${item.color}33`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 18, zIndex: 1, position: "relative",
                  }}>
                    {item.icon}
                  </div>

                  {/* 内容卡片 */}
                  <div style={{
                    flex: 1, background: "white", borderRadius: 12,
                    padding: "10px 12px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                    border: `1px solid ${item.color}22`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.title}</span>
                      <span style={{ fontSize: 10, color: "#aaa", flexShrink: 0, marginLeft: 6 }}>{item.time}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>{item.desc}</div>
                    {item.newMember && (
                      <div style={{
                        marginTop: 8, display: "flex", alignItems: "center", gap: 8,
                        background: "#F0FFF4", borderRadius: 8, padding: "6px 10px",
                      }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 8,
                          background: "linear-gradient(135deg, #43A047, #66BB6A)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0,
                        }}>{item.newMember.name[0]}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#2E7D32" }}>
                            {item.newMember.name} · {item.newMember.job}
                          </div>
                          <div style={{ fontSize: 10, color: "#888" }}>{item.newMember.dept}</div>
                        </div>
                        <span style={{
                          marginLeft: "auto", fontSize: 10, padding: "2px 8px",
                          background: "#C8E6C9", color: "#2E7D32", borderRadius: 6, fontWeight: 700,
                        }}>已加入组织树</span>
                      </div>
                    )}
                    {(item as any).newSuperior && (
                      <div style={{
                        marginTop: 8, display: "flex", alignItems: "center", gap: 8,
                        background: "#F3E5F5", borderRadius: 8, padding: "6px 10px",
                        border: "1px solid #CE93D8",
                      }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 8,
                          background: "linear-gradient(135deg, #6A1B9A, #8E24AA)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0,
                        }}>{(item as any).newSuperior.name[0]}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#6A1B9A" }}>
                            {(item as any).newSuperior.name} · {(item as any).newSuperior.job}
                          </div>
                          <div style={{ fontSize: 10, color: "#888" }}>{(item as any).newSuperior.dept}</div>
                        </div>
                        <span style={{
                          marginLeft: "auto", fontSize: 10, padding: "2px 8px",
                          background: "#CE93D8", color: "white", borderRadius: 6, fontWeight: 700,
                        }}>已成为上级</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 底部提示 */}
            <div style={{
              background: "#F3E5F5", borderRadius: 12, padding: "12px 14px",
              border: "1px solid #CE93D8", marginTop: 4,
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6A1B9A", marginBottom: 4 }}>💡 设计原理</div>
              <div style={{ fontSize: 11, color: "#555", lineHeight: 1.7 }}>
                邀请链接携带「邀请人 + 门店 + 推荐职位」三个参数，新成员注册时系统自动预填上级候选，
                只需确认即完成绑定，整个过程对员工来说只是「开始培训」，
                组织架构在后台悄然完善。
              </div>
            </div>
          </>
        )}

        {activeTab === "legend" && (
          <>
            <div style={{ fontSize: 13, color: "#aaa", marginBottom: 14 }}>
              每位成员拥有「层级」+「角色类型」两个维度的身份，共同决定其权限范围
            </div>

            {/* 角色类型说明 */}
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", marginBottom: 10 }}>角色类型</div>
            {Object.entries(ROLE_CONFIG).map(([key, cfg]) => (
              <div key={key} style={{
                background: "white", borderRadius: 12, padding: "14px 16px", marginBottom: 8,
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{
                    fontSize: 12, padding: "3px 10px", borderRadius: 8,
                    background: cfg.bg, color: cfg.text, fontWeight: 700,
                  }}>{cfg.label}</span>
                </div>
                <div style={{ fontSize: 13, color: "#555" }}>{cfg.desc}</div>
              </div>
            ))}

            {/* 层级说明 */}
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", margin: "16px 0 10px" }}>组织层级</div>
            {LEVEL_CONFIG.map((lv, i) => (
              <div key={i} style={{
                background: "white", borderRadius: 12, padding: "12px 16px", marginBottom: 8,
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: `${lv.color}22`, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 800, color: lv.color,
                }}>L{i}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{lv.label}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>
                    {["集团总部管理层", "区域/大区管理层", "单店管理层", "班组/岗位执行层"][i]}
                  </div>
                </div>
              </div>
            ))}

            {/* 同层级多角色示例 */}
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1A", margin: "16px 0 10px" }}>同层级多角色示例</div>
            <div style={{
              background: "white", borderRadius: 12, padding: "14px 16px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 10 }}>
                区域级（L1）可同时存在以下不同角色：
              </div>
              {[
                { name: "张志远", job: "区域经理", role: "manager" as RoleType },
                { name: "陈丽华", job: "人力资源经理", role: "functional" as RoleType },
                { name: "赵数据", job: "数据分析员", role: "observer" as RoleType },
                { name: "孙助理", job: "经理助理", role: "functional" as RoleType },
              ].map((m, i) => {
                const cfg = ROLE_CONFIG[m.role];
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
                    borderBottom: i < 3 ? "1px solid #F5F5F5" : "none",
                  }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      background: "#F5F5F5", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, color: "#888",
                    }}>{m.name[0]}</div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{m.name}</span>
                      <span style={{ fontSize: 12, color: "#aaa", marginLeft: 6 }}>{m.job}</span>
                    </div>
                    <span style={{
                      fontSize: 10, padding: "2px 8px", borderRadius: 6,
                      background: cfg.bg, color: cfg.text, fontWeight: 700,
                    }}>{cfg.label}</span>
                  </div>
                );
              })}
              <div style={{ fontSize: 11, color: "#aaa", marginTop: 8, lineHeight: 1.6 }}>
                💡 同层级多角色可同时向下级发起培训，但权限范围不同：人力资源经理只能发起入职/制度类培训，区域经理可发起所有类型
              </div>
            </div>
          </>
        )}
      </div>

      {/* 邀请弹层 */}
      {showInvite && (
        <InviteModal
          onClose={() => setShowInvite(false)}
          onInvite={() => { onInvite(); toast.success("邀请已发送！"); }}
        />
      )}
    </div>
  );
}
