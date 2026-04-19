import type { TrainingTask } from "./DrawerPage";

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

const DETAIL_DATA: Record<number, {
  feedbackCount: number;
  words: FeedbackWord[];
  mastered: RankingItem[];
  improving: RankingItem[];
  notStarted: RankingItem[];
}> = {
  1: {
    feedbackCount: 18,
    words: [
      { text: "更接地气", size: 20, tone: "orange" },
      { text: "案例清楚", size: 18, tone: "blue" },
      { text: "能直接上手", size: 24, tone: "orange" },
      { text: "想多看示范", size: 16, tone: "neutral" },
      { text: "记忆点强", size: 17, tone: "green" },
      { text: "适合早会复盘", size: 15, tone: "blue" },
      { text: "希望增加错题回顾", size: 14, tone: "neutral" },
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
      { text: "流程更清晰", size: 20, tone: "orange" },
      { text: "适合开档前看", size: 17, tone: "green" },
      { text: "再加照片更好", size: 15, tone: "neutral" },
      { text: "提醒及时", size: 16, tone: "blue" },
      { text: "责任点明确", size: 22, tone: "orange" },
    ],
    mastered: [
      { id: 1, name: "黄蓉", role: "店长", score: 97, note: "检查点记忆完整" },
      { id: 2, name: "蒋楠", role: "值班经理", score: 95, note: "风险点识别清晰" },
    ],
    improving: [
      { id: 3, name: "邹磊", role: "前厅主管", score: 82, note: "需加强先后顺序" },
      { id: 4, name: "何欣", role: "服务员", score: 79, note: "细节点位还需复盘" },
    ],
    notStarted: [
      { id: 5, name: "丁路", role: "新员工", score: 60, note: "遗漏多个开档动作" },
    ],
  },
  3: {
    feedbackCount: 12,
    words: [
      { text: "话术更自然", size: 21, tone: "orange" },
      { text: "适合新人", size: 17, tone: "blue" },
      { text: "再多一点场景", size: 15, tone: "neutral" },
      { text: "记住推荐顺序", size: 19, tone: "green" },
      { text: "转化技巧好用", size: 23, tone: "orange" },
    ],
    mastered: [
      { id: 1, name: "韩雪", role: "店长", score: 95, note: "推荐逻辑顺畅" },
      { id: 2, name: "唐佳", role: "服务员", score: 92, note: "回应异议较自然" },
    ],
    improving: [
      { id: 3, name: "杨晨", role: "服务员", score: 81, note: "语气与节奏还可加强" },
      { id: 4, name: "肖敏", role: "收银员", score: 77, note: "卖点表达偏少" },
    ],
    notStarted: [
      { id: 5, name: "谢航", role: "兼职", score: 59, note: "关键信息提炼不足" },
    ],
  },
  4: {
    feedbackCount: 15,
    words: [
      { text: "更有代入感", size: 21, tone: "orange" },
      { text: "想看优秀示范", size: 15, tone: "neutral" },
      { text: "礼貌用语更清楚", size: 20, tone: "blue" },
      { text: "很适合班前会", size: 17, tone: "green" },
      { text: "容易记住", size: 22, tone: "orange" },
      { text: "希望加情景题", size: 14, tone: "neutral" },
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
      { text: "重点很明确", size: 18, tone: "orange" },
      { text: "适合轮训", size: 15, tone: "green" },
      { text: "还想看案例", size: 14, tone: "neutral" },
      { text: "警示性强", size: 22, tone: "orange" },
      { text: "容易记住高风险点", size: 19, tone: "blue" },
    ],
    mastered: [
      { id: 1, name: "沈悦", role: "店长", score: 98, note: "风险识别准确" },
      { id: 2, name: "杜晓", role: "后厨主管", score: 95, note: "标准动作执行稳" },
    ],
    improving: [
      { id: 3, name: "郭森", role: "后厨", score: 84, note: "遗漏个别清洁节点" },
      { id: 4, name: "宋雅", role: "后厨", score: 80, note: "温控知识需巩固" },
    ],
    notStarted: [
      { id: 5, name: "尹超", role: "学徒", score: 63, note: "风险点判断偏弱" },
    ],
  },
  6: {
    feedbackCount: 7,
    words: [
      { text: "适合交班前看", size: 18, tone: "orange" },
      { text: "重点明确", size: 15, tone: "green" },
      { text: "责任边界清楚", size: 20, tone: "blue" },
      { text: "再多一点案例", size: 14, tone: "neutral" },
    ],
    mastered: [
      { id: 1, name: "孔凡", role: "值班经理", score: 94, note: "交接表达完整" },
      { id: 2, name: "顾宁", role: "店长", score: 92, note: "异常说明清晰" },
    ],
    improving: [
      { id: 3, name: "钱程", role: "领班", score: 81, note: "注意遗漏待办同步" },
    ],
    notStarted: [
      { id: 4, name: "曹真", role: "领班", score: 60, note: "交接条理需要带教" },
    ],
  },
};

function toneStyle(tone: FeedbackWord["tone"]) {
  if (tone === "orange") return { color: "#b85a00", background: "rgba(232,117,10,0.14)" };
  if (tone === "blue") return { color: "#2754c5", background: "rgba(59,91,219,0.12)" };
  if (tone === "green") return { color: "#2f7a4a", background: "rgba(47,122,74,0.12)" };
  return { color: "#6b6572", background: "rgba(107,101,114,0.10)" };
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
  const toneMap = {
    orange: { color: "#b85a00", background: "rgba(232,117,10,0.14)" },
    blue: { color: "#2754c5", background: "rgba(59,91,219,0.12)" },
    gray: { color: "#5f6368", background: "rgba(95,99,104,0.12)" },
  } as const;

  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: 14, boxShadow: "0 8px 24px rgba(27,33,58,0.06)", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#1f2430" }}>{title}</span>
        <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, ...toneMap[tone] }}>{items.length} 人</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item, index) => (
          <div key={`${title}-${item.id}`} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderTop: index === 0 ? "none" : "1px solid rgba(15,23,42,0.06)" }}>
            <div style={{ width: 24, height: 24, borderRadius: 12, background: "#eef2ff", color: "#3b5bdb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
              {index + 1}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1f2430" }}>{item.name}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#e8750a" }}>{item.score}分</div>
              </div>
              <div style={{ fontSize: 12, color: "#80838d", marginTop: 2 }}>{item.role}</div>
              <div style={{ fontSize: 12.5, color: "#4b5563", marginTop: 6, lineHeight: 1.5 }}>{item.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TrainingDetailPage({ task, onBack }: TrainingDetailPageProps) {
  const detail = DETAIL_DATA[task.id] ?? DETAIL_DATA[1];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "oklch(0.965 0.005 270)" }}>
      <div style={{ padding: "14px 14px 10px", background: "linear-gradient(180deg, rgba(255,249,243,0.98) 0%, rgba(255,255,255,0.92) 100%)", borderBottom: "1px solid rgba(232,117,10,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onBack} style={{ width: 34, height: 34, borderRadius: 17, border: "none", background: "rgba(232,117,10,0.12)", color: "#b85a00", fontSize: 18, fontWeight: 700, cursor: "pointer", lineHeight: 1 }}>‹</button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#1f2430" }}>培训详情</div>
            <div style={{ fontSize: 12.5, color: "#7a7f87", marginTop: 2 }}>{task.title}</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 20px" }}>
        <div style={{ background: "linear-gradient(180deg, #fff9f3 0%, #ffffff 100%)", borderRadius: 20, padding: 16, boxShadow: "0 10px 28px rgba(232,117,10,0.08)", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#1f2430" }}>最后一题反馈词云</div>
              <div style={{ fontSize: 12.5, color: "#7a7f87", marginTop: 4 }}>聚合员工对“这次培训对你有什么帮助”的吐槽与反馈，用于快速判断培训体感。</div>
            </div>
            <div style={{ minWidth: 64, textAlign: "center", padding: "6px 8px", borderRadius: 14, background: "rgba(232,117,10,0.12)", color: "#b85a00" }}>
              <div style={{ fontSize: 11, fontWeight: 700 }}>反馈人数</div>
              <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.2, marginTop: 2 }}>{detail.feedbackCount}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {detail.words.map((word) => {
              const tone = toneStyle(word.tone);
              return (
                <span
                  key={word.text}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 999,
                    fontSize: word.size,
                    lineHeight: 1.2,
                    fontWeight: word.size >= 20 ? 800 : 700,
                    letterSpacing: "0.01em",
                    ...tone,
                  }}
                >
                  {word.text}
                </span>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#1f2430", marginBottom: 8 }}>掌握排名</div>
          <div style={{ fontSize: 12.5, color: "#7a7f87", marginBottom: 12 }}>根据答题表现、反馈质量与关键点完整度，分段展示当前培训对象的掌握情况。</div>
        </div>

        <GroupCard title="掌握" tone="orange" items={detail.mastered} />
        <GroupCard title="提升中" tone="blue" items={detail.improving} />
        <GroupCard title="未掌握" tone="gray" items={detail.notStarted} />
      </div>
    </div>
  );
}
