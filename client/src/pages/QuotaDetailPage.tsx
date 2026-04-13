/**
 * QuotaDetailPage.tsx
 * 定额详情页 — 根据任务编号动态加载对应详情数据
 * 设计规范：蓝色导航栏+编号标题、任务名+标准事件标签、工具/耗材卡片、
 *           工作耗时/执行时间/工作标准信息行、底部示例视频缩略图
 */
import React, { useState } from "react";

export interface QuotaDetailData {
  code: string;
  name: string;
  type: string;
  tools: string;
  materials: string;
  duration: string;
  schedule: string;
  standards: string[];
  videoThumb?: string;
  videoDuration?: string;
}

// ── 定额详情数据库（按编号前缀/名称映射） ──────────────────────────────────────
const QUOTA_DB: Record<string, QuotaDetailData> = {
  // 通道/过道清理类
  "BZ-2301": {
    code: "BZ-2301", name: "维也纳门前过道清理", type: "标准事件",
    tools: "扫帚*1把、拖把*1把、垃圾桶*1个",
    materials: "清洁剂20ml、消毒液10ml",
    duration: "10 分钟/次",
    schedule: "每天9:00–22:00，每隔3小时一次",
    standards: ["过道地面无杂物、无水渍、无污迹", "垃圾桶及时清空，不超过八分满", "清洁工具归位存放"],
    videoThumb: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    videoDuration: "1:45",
  },
  // 洗手台/厕所清洁类
  "BZ-1020": {
    code: "BZ-1020", name: "公共厕所洗手台清理", type: "标准事件",
    tools: "抹布*2块、清洁刷*1把、手套*1副",
    materials: "洁厕灵30ml、消毒液15ml、洗手液1瓶",
    duration: "12 分钟/次",
    schedule: "每天9:00–22:00，每隔2小时一次",
    standards: ["洗手台台面无水渍、无污垢、无毛发", "镜面光洁无水痕", "洗手液、纸巾补充充足", "地面干燥无积水"],
    videoThumb: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80",
    videoDuration: "2:10",
  },
  "BZ-230": {
    code: "BZ-230", name: "洗手台清洁", type: "标准事件",
    tools: "抹布*2块、清洁刷*1把、手套*1副",
    materials: "洁厕灵30ml、消毒液15ml",
    duration: "10 分钟/次",
    schedule: "每天9:00–22:00，每隔2小时一次",
    standards: ["台面无水渍、无污垢", "镜面光洁无水痕", "洗手液、纸巾补充充足"],
    videoThumb: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80",
    videoDuration: "1:50",
  },
  // 茶台整理类
  "BZ-102": {
    code: "BZ-102", name: "茶水区清理", type: "标准事件",
    tools: "抹布*1个、清洁桶*1个",
    materials: "清洁剂15ml、茶叶*1盒",
    duration: "8 分钟/次",
    schedule: "每天9:00–22:00，每隔两小时一次",
    standards: ["茶水区台面整洁无杂物，无垃圾，无灰尘", "热水器开启并保持100℃", "台面必须有茶叶、茶水壶"],
    videoThumb: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    videoDuration: "2:30",
  },
  // 切配类
  "BZ-8301": {
    code: "BZ-8301", name: "切土豆丝", type: "标准事件",
    tools: "菜刀*1把、砧板*1块、盆*1个",
    materials: "土豆若干",
    duration: "15 分钟/次",
    schedule: "每天10:00–11:00，备餐时段执行",
    standards: ["土豆丝粗细均匀，宽度约2mm", "切好后立即浸入清水防氧化", "砧板、菜刀清洗消毒后归位"],
    videoThumb: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80",
    videoDuration: "3:20",
  },
  "BZ-1412": {
    code: "BZ-1412", name: "切牛肉块", type: "标准事件",
    tools: "专用肉刀*1把、砧板*1块、保鲜盒*1个",
    materials: "牛肉若干",
    duration: "20 分钟/次",
    schedule: "每天10:30–11:30，备餐时段执行",
    standards: ["牛肉块大小均匀，约3cm×3cm", "顺纹切割，保持肉质纤维完整", "切好后冷藏保存，不超过2小时"],
    videoThumb: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600&q=80",
    videoDuration: "2:50",
  },
  // 备桌/翻台类
  "BZ-2195": {
    code: "BZ-2195", name: "备桌-凯德麓语", type: "标准事件",
    tools: "托盘*1个、餐具若干",
    materials: "消毒湿巾*2张",
    duration: "5 分钟/台",
    schedule: "开餐前30分钟完成，翻台后即时执行",
    standards: ["餐具摆放整齐，位置标准化", "桌面无污迹、无水渍", "椅子摆正，间距均匀"],
    videoThumb: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    videoDuration: "1:30",
  },
  "BZ-9677": {
    code: "BZ-9677", name: "翻台-大厅A区A1", type: "标准事件",
    tools: "托盘*1个、抹布*1块",
    materials: "消毒湿巾*2张",
    duration: "8 分钟/台",
    schedule: "客人离桌后5分钟内完成",
    standards: ["撤走所有餐具及杂物", "桌面消毒擦拭", "重新摆台至标准状态", "椅子归位"],
    videoThumb: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    videoDuration: "2:00",
  },
  // 炒制类
  "BZ-423": {
    code: "BZ-423", name: "炒制-宫保鸡丁", type: "标准事件",
    tools: "炒锅*1口、锅铲*1把、计量勺*1套",
    materials: "鸡丁200g、花生50g、干辣椒5g、调料若干",
    duration: "8 分钟/份",
    schedule: "点单后即时执行，出餐时间≤12分钟",
    standards: ["鸡丁熟透，内部无生肉", "口味咸鲜微辣，花生酥脆", "摆盘整洁，份量标准"],
    videoThumb: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&q=80",
    videoDuration: "4:15",
  },
  // 清洗类
  "BZ-450": {
    code: "BZ-450", name: "清洗餐具", type: "标准事件",
    tools: "洗碗机*1台、洗碗刷*2把、消毒柜*1台",
    materials: "洗洁精50ml、消毒液20ml",
    duration: "30 分钟/批",
    schedule: "餐后立即执行，不得积压超过1小时",
    standards: ["餐具无油污、无食物残渣", "高温消毒≥85℃，时间≥5分钟", "消毒后干燥存放，不叠放"],
    videoThumb: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80",
    videoDuration: "2:45",
  },
  // 默认/通用
  "__default__": {
    code: "", name: "标准作业", type: "标准事件",
    tools: "按需配备",
    materials: "按需配备",
    duration: "按标准执行",
    schedule: "按排班执行",
    standards: ["按照标准操作规程执行", "完成后及时记录", "工具归位，现场整洁"],
    videoThumb: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    videoDuration: "2:00",
  },
};

/** 根据编号查找详情，找不到则返回默认数据并填入编号 */
function getQuotaData(code: string): QuotaDetailData {
  if (QUOTA_DB[code]) return QUOTA_DB[code];
  // 尝试前缀匹配（如 BZ-83 匹配 BZ-8301）
  const prefix = Object.keys(QUOTA_DB).find(k => k !== "__default__" && (code.startsWith(k) || k.startsWith(code)));
  if (prefix) return { ...QUOTA_DB[prefix], code };
  return { ...QUOTA_DB["__default__"], code };
}

interface QuotaDetailPageProps {
  onBack: () => void;
  code?: string;
}

export default function QuotaDetailPage({ onBack, code = "BZ-102" }: QuotaDetailPageProps) {
  const data = getQuotaData(code);
  const [videoPlaying, setVideoPlaying] = useState(false);

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      background: "#fff",
      fontFamily: "'PingFang SC', 'Helvetica Neue', Arial, sans-serif",
      overflow: "hidden",
    }}>
      {/* ── 状态栏 ── */}
      <div style={{
        height: 44, background: "#4B7BF5",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", flexShrink: 0,
      }}>
        <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>12:00</span>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect x="0" y="7" width="3" height="5" rx="0.5" fill="white" />
            <rect x="4.5" y="4.5" width="3" height="7.5" rx="0.5" fill="white" />
            <rect x="9" y="2" width="3" height="10" rx="0.5" fill="white" />
            <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" fill="white" />
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <circle cx="8" cy="11" r="1.5" fill="white" />
            <path d="M4.5 8.5C5.5 7.5 6.7 7 8 7s2.5.5 3.5 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M1.5 5.5C3.2 3.8 5.5 2.8 8 2.8s4.8 1 6.5 2.7" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
          <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
            <rect x="0.5" y="0.5" width="18" height="11" rx="2.5" stroke="white" strokeOpacity="0.35" />
            <rect x="1.5" y="1.5" width="15" height="9" rx="1.5" fill="white" />
            <path d="M19.5 4v4a2 2 0 000-4z" fill="white" fillOpacity="0.4" />
          </svg>
        </div>
      </div>

      {/* ── 导航栏 ── */}
      <div style={{
        height: 44, background: "#4B7BF5",
        display: "flex", alignItems: "center",
        padding: "0 16px", flexShrink: 0,
        position: "relative",
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer",
          padding: 4, display: "flex", alignItems: "center",
          position: "absolute", left: 12,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span style={{
          flex: 1, textAlign: "center",
          fontSize: 17, fontWeight: 700, color: "#fff",
          letterSpacing: 1,
        }}>{data.code}</span>
      </div>

      {/* ── 内容区（可滚动）── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px 32px" }}>

        {/* 任务名 + 类型标签 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#111" }}>{data.name}</span>
          <span style={{
            background: "#4B7BF5", color: "#fff",
            fontSize: 12, fontWeight: 600,
            padding: "3px 10px", borderRadius: 4,
            whiteSpace: "nowrap",
          }}>{data.type}</span>
        </div>

        {/* 工具 & 耗材卡片 */}
        <div style={{
          background: "#F5F6FA", borderRadius: 10,
          padding: "14px 16px",
          marginBottom: 20,
        }}>
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: "#555" }}>
              <span style={{ fontWeight: 600, color: "#333" }}>工具：</span>
              {data.tools}
            </span>
          </div>
          <div>
            <span style={{ fontSize: 14, color: "#555" }}>
              <span style={{ fontWeight: 600, color: "#333" }}>耗材：</span>
              {data.materials}
            </span>
          </div>
        </div>

        {/* 分割线 */}
        <div style={{ height: 1, background: "#EBEBEB", marginBottom: 20 }} />

        {/* 工作耗时 */}
        <InfoRow label="工作耗时：" value={data.duration} />
        {/* 执行时间 */}
        <InfoRow label="执行时间：" value={data.schedule} />
        {/* 工作标准 */}
        <div style={{ display: "flex", marginBottom: 18, alignItems: "flex-start" }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#111", minWidth: 70, flexShrink: 0 }}>
            工作标准：
          </span>
          <div style={{ flex: 1 }}>
            {data.standards.map((s, i) => (
              <div key={i} style={{ fontSize: 14, color: "#888", lineHeight: 1.7 }}>{s}</div>
            ))}
          </div>
        </div>

        {/* 视频缩略图 */}
        {data.videoThumb && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
            <div
              style={{
                position: "relative", width: "72%", maxWidth: 280,
                borderRadius: 10, overflow: "hidden", cursor: "pointer",
                boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
              }}
              onClick={() => setVideoPlaying(!videoPlaying)}
            >
              <img
                src={data.videoThumb}
                alt="示例视频"
                style={{ width: "100%", display: "block", aspectRatio: "4/3", objectFit: "cover" }}
              />
              {data.videoDuration && (
                <span style={{
                  position: "absolute", top: 8, left: 8,
                  background: "rgba(0,0,0,0.55)", color: "#fff",
                  fontSize: 12, padding: "2px 6px", borderRadius: 4,
                }}>{data.videoDuration}</span>
              )}
              {!videoPlaying && (
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0.18)",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "rgba(255,255,255,0.85)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                      <path d="M2 2l14 8-14 8V2z" fill="#4B7BF5" />
                    </svg>
                  </div>
                </div>
              )}
              {videoPlaying && (
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0.35)",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "rgba(255,255,255,0.85)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: 4,
                  }}>
                    <div style={{ width: 4, height: 16, background: "#4B7BF5", borderRadius: 2 }} />
                    <div style={{ width: 4, height: 16, background: "#4B7BF5", borderRadius: 2 }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", marginBottom: 14, alignItems: "flex-start" }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: "#111", minWidth: 70, flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ fontSize: 14, color: "#888", flex: 1, lineHeight: 1.6 }}>{value}</span>
    </div>
  );
}
