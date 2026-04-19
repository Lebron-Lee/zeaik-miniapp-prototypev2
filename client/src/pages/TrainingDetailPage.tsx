import { useState } from "react";

interface TrainingTask {
  id: number;
  title: string;
}

interface TrainingDetailPageProps {
  task: TrainingTask;
  onBack: () => void;
}

interface FeedbackWord {
  text: string;
  size: number;
  tone: "orange" | "blue" | "green" | "neutral";
}

interface RankingItem {
  id: number;
  name: string;
  role: string;
  score: number;
  note: string;
}

const DETAIL_DATA: Record<
  number,
  {
    feedbackCount: number;
    words: FeedbackWord[];
    mastered: RankingItem[];
    improving: RankingItem[];
    notStarted: RankingItem[];
  }
> = {
  1: {
    feedbackCount: 18,
    words: [
      { text: "题太多了", size: 20, tone: "orange" },
      { text: "讲得有点快", size: 18, tone: "blue" },
      { text: "想看真实示范", size: 24, tone: "orange" },
      { text: "门店太忙没空学", size: 16, tone: "neutral" },
      { text: "案例还不够像现场", size: 17, tone: "green" },
      { text: "希望错题直接讲透", size: 15, tone: "blue" },
      { text: "想要更短一点", size: 14, tone: "neutral" },
    ],
    mastered: [
      { id: 1, name: "张敏", role: "店长", score: 98, note: "反馈完整，能举一反三" },
      { id: 2, name: "李响", role: "前厅主管", score: 96, note: "服务细节掌握稳定" },
      { id: 3, name: "王晴", role: "训练员", score: 94, note: "应答速度快" },
    ],
    improving: [
      { id: 4, name: "周可", role: "服务员", score: 83, note: "基础正确，表达还可更完整" },
      { id: 5, name: "陈卓", role: "服务员", score: 80, note: "需要加强异常处理描述" },
      { id: 6, name: "林悦", role: "兼职", score: 78, note: "流程顺序偶有遗漏" },
    ],
    notStarted: [
      { id: 7, name: "赵晨", role: "服务员", score: 62, note: "关键点仍需带教" },
      { id: 8, name: "吴浩", role: "新员工", score: 58, note: "复述与确认动作薄弱" },
    ],
  },
  2: {
    feedbackCount: 9,
    words: [
      { text: "步骤有点绕", size: 20, tone: "orange" },
      { text: "开档前根本来不及看完", size: 17, tone: "green" },
      { text: "最好配现场照片", size: 15, tone: "neutral" },
      { text: "提醒能再早点", size: 16, tone: "blue" },
      { text: "责任划分还想更清楚", size: 22, tone: "orange" },
    ],
    mastered: [
      { id: 1, name: "黄蓉", role: "店长", score: 97, note: "检查点记忆完整" },
      { id: 2, name: "蒋楠", role: "值班经理", score: 95, note: "风险点识别清晰" },
    ],
    improving: [
      { id: 3, name: "邹磊", role: "前厅主管", score: 82, note: "需加强先后顺序" },
      { id: 4, name: "何欣", role: "服务员", score: 79, note: "细节点位还需复盘" },
    ],
    notStarted: [{ id: 5, name: "丁路", role: "新员工", score: 60, note: "遗漏多个开档动作" }],
  },
  3: {
    feedbackCount: 12,
    words: [
      { text: "话术还是像背稿", size: 21, tone: "orange" },
      { text: "新人容易紧张", size: 17, tone: "blue" },
      { text: "想多一点拒绝场景", size: 15, tone: "neutral" },
      { text: "推荐顺序总记混", size: 19, tone: "green" },
      { text: "转化技巧需要演示", size: 23, tone: "orange" },
    ],
    mastered: [
      { id: 1, name: "韩雪", role: "店长", score: 95, note: "推荐逻辑顺畅" },
      { id: 2, name: "唐佳", role: "服务员", score: 92, note: "回应异议较自然" },
    ],
    improving: [
      { id: 3, name: "杨晨", role: "服务员", score: 81, note: "语气与节奏还可加强" },
      { id: 4, name: "肖敏", role: "收银员", score: 77, note: "卖点表达偏少" },
    ],
    notStarted: [{ id: 5, name: "谢航", role: "兼职", score: 59, note: "关键信息提炼不足" }],
  },
  4: {
    feedbackCount: 15,
    words: [
      { text: "情景还是不够真实", size: 21, tone: "orange" },
      { text: "想看优秀员工示范", size: 15, tone: "neutral" },
      { text: "礼貌用语太书面", size: 20, tone: "blue" },
      { text: "班前会时间太紧", size: 17, tone: "green" },
      { text: "重点太散不好记", size: 22, tone: "orange" },
      { text: "需要更多投诉题", size: 14, tone: "neutral" },
    ],
    mastered: [
      { id: 1, name: "彭琳", role: "店长", score: 97, note: "礼仪规范执行稳定" },
      { id: 2, name: "孙倩", role: "迎宾", score: 94, note: "微笑与迎送动作到位" },
      { id: 3, name: "程浩", role: "服务员", score: 91, note: "服务语句完整" },
    ],
    improving: [
      { id: 4, name: "许乐", role: "服务员", score: 82, note: "面对投诉场景仍需练习" },
      { id: 5, name: "高雯", role: "收银员", score: 79, note: "个别礼貌措辞遗漏" },
    ],
    notStarted: [
      { id: 6, name: "冯凯", role: "新员工", score: 61, note: "流程掌握不完整" },
      { id: 7, name: "陆宁", role: "兼职", score: 56, note: "现场应答还不熟练" },
    ],
  },
  5: {
    feedbackCount: 11,
    words: [
      { text: "重点还可以更直白", size: 18, tone: "orange" },
      { text: "轮训时长还是偏长", size: 15, tone: "green" },
      { text: "还想多看门店案例", size: 14, tone: "neutral" },
      { text: "警示有了但不够具体", size: 22, tone: "orange" },
      { text: "高风险点太多记不住", size: 19, tone: "blue" },
    ],
    mastered: [
      { id: 1, name: "沈悦", role: "店长", score: 98, note: "风险识别准确" },
      { id: 2, name: "杜晓", role: "后厨主管", score: 95, note: "标准动作执行稳" },
    ],
    improving: [
      { id: 3, name: "郭森", role: "后厨", score: 84, note: "遗漏个别清洁节点" },
      { id: 4, name: "宋雅", role: "后厨", score: 80, note: "温控知识需巩固" },
    ],
    notStarted: [{ id: 5, name: "尹超", role: "学徒", score: 63, note: "风险点判断偏弱" }],
  },
  6: {
    feedbackCount: 7,
    words: [
      { text: "交班前根本没空看", size: 18, tone: "orange" },
      { text: "重点还是有点散", size: 15, tone: "green" },
      { text: "责任边界还会混", size: 20, tone: "blue" },
      { text: "想再多一点案例", size: 14, tone: "neutral" },
    ],
    mastered: [
      { id: 1, name: "孔凡", role: "值班经理", score: 94, note: "交接表达完整" },
      { id: 2, name: "顾宁", role: "店长", score: 92, note: "异常说明清晰" },
    ],
    improving: [{ id: 3, name: "钱程", role: "领班", score: 81, note: "注意遗漏待办同步" }],
    notStarted: [{ id: 4, name: "曹真", role: "领班", score: 60, note: "交接条理需要带教" }],
  },
};

function toneStyle(tone: FeedbackWord["tone"]) {
  if (tone === "orange") return { color: "#b85a00", background: "linear-gradient(180deg, rgba(255,214,176,0.72) 0%, rgba(255,242,228,0.96) 100%)" };
  if (tone === "blue") return { color: "#2754c5", background: "linear-gradient(180deg, rgba(209,223,255,0.76) 0%, rgba(239,244,255,0.98) 100%)" };
  if (tone === "green") return { color: "#2f7a4a", background: "linear-gradient(180deg, rgba(215,242,223,0.76) 0%, rgba(242,250,245,0.98) 100%)" };
  return { color: "#6b6572", background: "linear-gradient(180deg, rgba(236,236,240,0.78) 0%, rgba(247,247,250,0.98) 100%)" };
}

function GroupCard({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "orange" | "blue" | "gray";
  items: RankingItem[];
}) {
  const [collapsed, setCollapsed] = useState(true);

  const toneMap = {
    orange: { color: "#b85a00", background: "rgba(232,117,10,0.14)" },
    blue: { color: "#2754c5", background: "rgba(59,91,219,0.12)" },
    gray: { color: "#5f6368", background: "rgba(95,99,104,0.12)" },
  } as const;

  return (
    <div style={{ background: "#EEF2FF", borderRadius: 14, overflow: "hidden", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "12px 14px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A" }}>{title}</span>
          <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, ...toneMap[tone] }}>{items.length} 人</span>
        </div>
        <button
          onClick={() => setCollapsed((value) => !value)}
          style={{
            border: "none",
            background: "#3B5BDB",
            color: "#fff",
            borderRadius: 20,
            padding: "4px 12px",
            fontSize: 11,
            fontWeight: 700,
            lineHeight: 1.2,
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(59,91,219,0.18)",
            flexShrink: 0,
          }}
        >
          {collapsed ? "展开" : "收起"}
        </button>
      </div>
      {!collapsed && (
        <div style={{ background: "#fff", borderRadius: "0 0 14px 14px", overflow: "hidden" }}>
          {items.map((item, index) => (
            <div
              key={`${title}-${item.id}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 12px",
                borderBottom: index < items.length - 1 ? "1px solid #F5F5F5" : "none",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  background: "#E8EAED",
                  color: "#666",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: "#1A1A1A", whiteSpace: "nowrap" }}>{item.name}</span>
                  <span style={{ fontSize: 11, color: "#666", background: "#F5F7FA", borderRadius: 10, padding: "1px 6px", flexShrink: 0 }}>{item.role}</span>
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#3B5BDB", flexShrink: 0 }}>{item.score}分</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TrainingDetailPage({ task, onBack }: TrainingDetailPageProps) {
  const detail = DETAIL_DATA[task.id] ?? DETAIL_DATA[1];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#F7F8FA" }}>
      <div style={{ padding: "14px 14px 10px", background: "linear-gradient(180deg, #4B6BFF 0%, #3B5BDB 100%)", borderBottom: "1px solid rgba(59,91,219,0.18)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onBack} style={{ width: 34, height: 34, borderRadius: 17, border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.16)", color: "#fff", fontSize: 18, fontWeight: 700, cursor: "pointer", lineHeight: 1, backdropFilter: "blur(8px)" }}>
            ‹
          </button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>培训详情</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 20px" }}>
        <div style={{ background: "#EEF2FF", borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
          <div style={{ position: "relative", background: "#fff", borderRadius: 14, padding: "12px 12px 12px", display: "flex", flexWrap: "wrap", gap: 8 }}>
            {detail.words.map((word) => {
              const tone = toneStyle(word.tone);
              const wordCount = Math.max(3, Math.round(word.size * 0.75));
              return (
                <span
                  key={word.text}
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "7px 24px 7px 11px",
                    borderRadius: 999,
                    fontSize: Math.max(13, word.size - 3),
                    lineHeight: 1.15,
                    fontWeight: word.size >= 20 ? 800 : 700,
                    letterSpacing: "0.01em",
                    border: "1px solid rgba(255,255,255,0.88)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.58), 0 6px 14px rgba(59,91,219,0.10)",
                    backdropFilter: "blur(8px)",
                    ...tone,
                  }}
                >
                  <span style={{ position: "relative", zIndex: 1 }}>{word.text}</span>
                  <span style={{ position: "absolute", inset: 0, borderRadius: 999, background: "linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 100%)", pointerEvents: "none" }} />
                  <span
                    style={{
                      position: "absolute",
                      top: -5,
                      right: 4,
                      minWidth: 17,
                      height: 17,
                      padding: "0 4px",
                      borderRadius: 999,
                      background: "linear-gradient(180deg, #ffffff 0%, #eef4ff 100%)",
                      color: "#3B5BDB",
                      fontSize: 9.5,
                      fontWeight: 800,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 10px rgba(59,91,219,0.14)",
                      border: "1px solid rgba(59,91,219,0.10)",
                    }}
                  >
                    {wordCount}
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1A", marginBottom: 8 }}>掌握排名</div>
        </div>
        <GroupCard title="掌握" tone="orange" items={detail.mastered} />
        <GroupCard title="提升中" tone="blue" items={detail.improving} />
        <GroupCard title="未掌握" tone="gray" items={detail.notStarted} />
      </div>
    </div>
  );
}
