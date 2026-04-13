/**
 * 智爱客-餐饮AI 产品矩阵页
 * 设计：淡蓝灰渐变背景，产品卡片列表（左文右图），底部固定「免费体验」CTA
 */
import { toast } from "sonner";

interface ProductPageProps {
  onBack: () => void;
  onApply: () => void;
}

interface Product {
  tag: string;
  title: string;
  desc: string;
  color: string;
  bgColor: string;
  screenshotBg: string;
  renderScreenshot: () => React.ReactNode;
}

import React from "react";

const PRODUCTS: Product[] = [
  {
    tag: "智能点餐",
    title: "AI 菜单",
    desc: "个性化推荐，提升客单价 15-30%",
    color: "#e8750a",
    bgColor: "rgba(232,117,10,0.08)",
    screenshotBg: "linear-gradient(135deg, #ff9a3c 0%, #e8750a 100%)",
    renderScreenshot: () => (
      <div style={{ padding: "6px 8px", color: "#fff" }}>
        <div style={{ fontWeight: 700, fontSize: 10, marginBottom: 4 }}>今日推荐</div>
        {[
          { name: "口水鸡", price: "38", hot: true },
          { name: "拢芙豆腐", price: "28", hot: false },
          { name: "宫保鸡丁", price: "32", hot: true },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3, fontSize: 8 }}>
            <span>{item.name}{item.hot && <span style={{ color: "#ffe066", marginLeft: 2 }}>热</span>}</span>
            <span style={{ fontWeight: 700 }}>￥{item.price}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: "智能预订",
    title: "预定智能体",
    desc: "7⅑24h 自动接单，预订不漏单",
    color: "#7c3aed",
    bgColor: "rgba(124,58,237,0.08)",
    screenshotBg: "linear-gradient(135deg, #2d1a4e 0%, #4a2d7a 100%)",
    renderScreenshot: () => (
      <div style={{ padding: "6px 8px", color: "#fff" }}>
        <div style={{ fontWeight: 700, fontSize: 10, marginBottom: 4 }}>今日预订</div>
        {[
          { time: "18:00", name: "张先生", seats: "4人桁", status: "已确认", color: "#52c41a" },
          { time: "19:30", name: "李女士", seats: "6人桁", status: "待到店", color: "#faad14" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3, fontSize: 7.5 }}>
            <span style={{ opacity: 0.8 }}>{item.time} {item.name}</span>
            <span style={{ color: item.color }}>{item.status}</span>
          </div>
        ))}
        <div style={{ background: "rgba(124,58,237,0.3)", borderRadius: 4, padding: "2px 5px", fontSize: 7, marginTop: 2 }}>AI已自动回复确认</div>
      </div>
    ),
  },
  {
    tag: "运营分析",
    title: "店面运营模型",
    desc: "实时数据看板，经营决策有依据",
    color: "#059669",
    bgColor: "rgba(5,150,105,0.08)",
    screenshotBg: "linear-gradient(135deg, #0a2e1a 0%, #1a4a2e 100%)",
    renderScreenshot: () => (
      <div style={{ padding: "6px 8px", color: "#fff" }}>
        <div style={{ fontWeight: 700, fontSize: 10, marginBottom: 4 }}>今日运营</div>
        <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
          {[
            { label: "营业额", val: "¥12,480", color: "#52c41a" },
            { label: "翻台率", val: "3.2次", color: "#faad14" },
          ].map((item, i) => (
            <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 4, padding: "3px 4px", textAlign: "center" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: item.color }}>{item.val}</div>
              <div style={{ fontSize: 7, opacity: 0.7 }}>{item.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          {[
            { label: "红色预警", color: "#ff4d4f", count: 1 },
            { label: "黄色提示", color: "#faad14", count: 3 },
            { label: "绿色正常", color: "#52c41a", count: 12 },
          ].map((item, i) => (
            <div key={i} style={{ flex: 1, background: `rgba(${item.color === "#ff4d4f" ? "255,77,79" : item.color === "#faad14" ? "250,173,20" : "82,196,26"},0.2)`, borderRadius: 4, padding: "2px 3px", textAlign: "center" }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: item.color }}>{item.count}</div>
              <div style={{ fontSize: 6.5, opacity: 0.8 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    tag: "集团管控",
    title: "集团运营 AI 模型",
    desc: "多店红黄绿预警，集团管控一目了然",
    color: "#dc2626",
    bgColor: "rgba(220,38,38,0.08)",
    screenshotBg: "linear-gradient(135deg, #1a0a0a 0%, #3a1010 100%)",
    renderScreenshot: () => (
      <div style={{ padding: "6px 8px", color: "#fff" }}>
        <div style={{ fontWeight: 700, fontSize: 10, marginBottom: 4 }}>集团门店总览</div>
        {[
          { name: "朝阳路店", status: "红", statusText: "异常", color: "#ff4d4f" },
          { name: "大学路店", status: "黄", statusText: "注意", color: "#faad14" },
          { name: "商城店", status: "绿", statusText: "正常", color: "#52c41a" },
          { name: "广场店", status: "绿", statusText: "正常", color: "#52c41a" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2.5, fontSize: 7.5 }}>
            <span style={{ opacity: 0.85 }}>{item.name}</span>
            <span style={{ color: item.color, fontWeight: 600 }}>● {item.statusText}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: "人力管理",
    title: "自动排班",
    desc: "AI 智能排班，人力成本降 20%",
    color: "#0891b2",
    bgColor: "rgba(8,145,178,0.08)",
    screenshotBg: "linear-gradient(135deg, #0a1a2e 0%, #1a2e4a 100%)",
    renderScreenshot: () => (
      <div style={{ padding: "6px 8px", color: "#fff" }}>
        <div style={{ fontWeight: 700, fontSize: 10, marginBottom: 4 }}>本周排班</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 3 }}>
          {["一", "二", "三", "四", "五", "六", "日"].map((d, i) => (
            <div key={i} style={{ textAlign: "center", fontSize: 6.5, opacity: 0.6 }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
          {[8, 6, 7, 9, 8, 10, 5].map((n, i) => (
            <div key={i} style={{
              background: n >= 9 ? "rgba(8,145,178,0.6)" : n >= 7 ? "rgba(8,145,178,0.35)" : "rgba(255,255,255,0.1)",
              borderRadius: 3, padding: "3px 0", textAlign: "center", fontSize: 8, fontWeight: 600
            }}>{n}</div>
          ))}
        </div>
        <div style={{ fontSize: 7, opacity: 0.6, marginTop: 3 }}>AI推荐人数 • 单位:人</div>
      </div>
    ),
  },
  {
    tag: "AI 预测",
    title: "AI 预测",
    desc: "客流与菜品预测，备货准流失少",
    color: "#7c3aed",
    bgColor: "rgba(124,58,237,0.08)",
    screenshotBg: "linear-gradient(135deg, #1a0a2e 0%, #2d1a4e 100%)",
    renderScreenshot: () => (
      <div style={{ padding: "6px 8px", color: "#fff" }}>
        <div style={{ fontWeight: 700, fontSize: 10, marginBottom: 4 }}>明日预测</div>
        <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
          <div style={{ flex: 1, background: "rgba(124,58,237,0.3)", borderRadius: 4, padding: "3px 4px", textAlign: "center" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#c4b5fd" }}>328人</div>
            <div style={{ fontSize: 7, opacity: 0.7 }}>客流预测</div>
          </div>
          <div style={{ flex: 1, background: "rgba(124,58,237,0.3)", borderRadius: 4, padding: "3px 4px", textAlign: "center" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#c4b5fd" }}>+18%</div>
            <div style={{ fontSize: 7, opacity: 0.7 }}>周末增幅</div>
          </div>
        </div>
        <div style={{ fontSize: 7.5, opacity: 0.8, marginBottom: 2 }}>菜品预订排行</div>
        {[
          { name: "口水鸡", pct: 85 },
          { name: "麦小肉", pct: 62 },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
            <div style={{ fontSize: 7, width: 30, opacity: 0.8 }}>{item.name}</div>
            <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2 }}>
              <div style={{ width: `${item.pct}%`, height: "100%", background: "#a78bfa", borderRadius: 2 }}/>
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

const PRODUCTS_LEGACY: Product[] = [
  {
    tag: "薪酬管理",
    title: "工资日预结",
    desc: "多劳多得工单制，日薪结算干劲足",
    color: "#4a7cf0",
    bgColor: "rgba(74,124,240,0.08)",
    screenshotBg: "linear-gradient(135deg, #4a7cf0 0%, #6a9cf8 100%)",
    renderScreenshot: () => (
      <div style={{ padding: "8px 10px", color: "#fff" }}>
        <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 11 }}>¥348元 <span style={{ fontSize: 9, opacity: 0.8 }}>+51单</span></div>
        <div style={{ display: "flex", gap: 3, marginBottom: 6 }}>
          {["今日完成", "绩效奖金", "出勤"].map((t, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.2)", borderRadius: 4, padding: "2px 4px", fontSize: 7 }}>{t}</div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[{ label: "接单", val: "12单" }, { label: "完成", val: "100%" }, { label: "评分", val: "4.9" }].map((item, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 11 }}>{item.val}</div>
              <div style={{ opacity: 0.7, fontSize: 7 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    tag: "质量管控",
    title: "AI 智能巡检",
    desc: "自查自拍 AI 评，门店巡检不用盯",
    color: "#2d9cdb",
    bgColor: "rgba(45,156,219,0.08)",
    screenshotBg: "linear-gradient(135deg, #1a1a2e 0%, #2d2d4e 100%)",
    renderScreenshot: () => (
      <div style={{ padding: "6px 8px", color: "#fff" }}>
        <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 4, padding: "3px 6px", marginBottom: 4, fontSize: 9, fontWeight: 600 }}>常规巡检</div>
        <div style={{ background: "rgba(255,80,80,0.3)", borderRadius: 4, padding: "2px 5px", marginBottom: 4, fontSize: 8, color: "#ff8080" }}>⚠ 发现问题 3 项</div>
        <div style={{ display: "flex", gap: 3 }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 4, padding: "3px", textAlign: "center", fontSize: 7 }}>地面清洁<br/><span style={{ color: "#ff8080" }}>待整改</span></div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 4, padding: "3px", textAlign: "center", fontSize: 7 }}>员工仪容<br/><span style={{ color: "#52c41a" }}>合格</span></div>
        </div>
      </div>
    ),
  },
  {
    tag: "服务提升",
    title: "AI 服务检测",
    desc: "AI 智检关键词，服务水平稳提升",
    color: "#e8750a",
    bgColor: "rgba(232,117,10,0.08)",
    screenshotBg: "linear-gradient(135deg, #2d1a0e 0%, #4a2a10 100%)",
    renderScreenshot: () => (
      <div style={{ padding: "6px 8px", color: "#fff" }}>
        <div style={{ marginBottom: 4, fontWeight: 600, fontSize: 10 }}>服务检测报告</div>
        {[
          { label: "欢迎语", score: 95, color: "#52c41a" },
          { label: "推荐话术", score: 78, color: "#faad14" },
          { label: "送客语", score: 88, color: "#52c41a" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
            <div style={{ fontSize: 7, width: 38, opacity: 0.8 }}>{item.label}</div>
            <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2 }}>
              <div style={{ width: `${item.score}%`, height: "100%", background: item.color, borderRadius: 2 }}/>
            </div>
            <div style={{ fontSize: 8, color: item.color }}>{item.score}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: "团队协作",
    title: "AI 智能对讲",
    desc: "同等对讲成本，多享 AI 功能",
    color: "#722ed1",
    bgColor: "rgba(114,46,209,0.08)",
    screenshotBg: "linear-gradient(135deg, #1a0a2e 0%, #2d1a4e 100%)",
    renderScreenshot: () => (
      <div style={{ padding: "6px 8px", color: "#fff" }}>
        <div style={{ marginBottom: 4, fontWeight: 600, fontSize: 10 }}>智能对讲</div>
        {[
          { name: "前厅", msg: "3号桌需要加汤", time: "14:23" },
          { name: "后厨", msg: "好的，马上准备", time: "14:23" },
          { name: "AI助手", msg: "已记录服务需求", time: "14:24" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 4, marginBottom: 3, alignItems: "flex-start" }}>
            <div style={{ background: "rgba(114,46,209,0.5)", borderRadius: 3, padding: "1px 4px", fontSize: 7, whiteSpace: "nowrap", flexShrink: 0 }}>{item.name}</div>
            <div style={{ fontSize: 8, opacity: 0.9, flex: 1 }}>{item.msg}</div>
            <div style={{ fontSize: 7, opacity: 0.5, whiteSpace: "nowrap" }}>{item.time}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: "员工培训",
    title: "碎片化培训",
    desc: "利用碎片时间，AI 陪练快速成长",
    color: "#13c2c2",
    bgColor: "rgba(19,194,194,0.08)",
    screenshotBg: "linear-gradient(135deg, #0a2e2e 0%, #1a4a4a 100%)",
    renderScreenshot: () => (
      <div style={{ padding: "6px 8px", color: "#fff" }}>
        <div style={{ marginBottom: 4, fontWeight: 600, fontSize: 10 }}>今日学习</div>
        <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
          <div style={{ background: "rgba(19,194,194,0.3)", borderRadius: 6, padding: "4px 6px", flex: 1, textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>3</div>
            <div style={{ fontSize: 7, opacity: 0.8 }}>已完成</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: "4px 6px", flex: 1, textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>12</div>
            <div style={{ fontSize: 7, opacity: 0.8 }}>分钟</div>
          </div>
        </div>
        <div style={{ background: "rgba(19,194,194,0.2)", borderRadius: 4, padding: "3px 6px", fontSize: 8 }}>🎯 今日目标完成 60%</div>
      </div>
    ),
  },
];

export default function ProductPage({ onBack, onApply }: ProductPageProps) {
  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: "linear-gradient(180deg, #fff8f2 0%, #fdf4ec 30%, #f5f0ff 60%, #eef2ff 100%)",
        overflowY: "auto",
        position: "relative",
      }}
    >
      {/* ── 微信小程序顶部区域（状态栏 + 导航栏）── */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "linear-gradient(135deg, #ff9a3c 0%, #e8750a 100%)",
        boxShadow: "0 2px 12px rgba(232,117,10,0.25)",
        flexShrink: 0,
      }}>
        {/* 状态栏：高度 44px，模拟 iOS 刘海屏 */}
        <div style={{
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px 0 20px",
        }}>
          {/* 左侧时间 */}
          <span style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.95)", letterSpacing: 0.3 }}>9:41</span>
          {/* 右侧系统图标组 */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* 信号 */}
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
              <rect x="0" y="5" width="3" height="7" rx="1" fill="#fff" opacity="0.45"/>
              <rect x="4.5" y="3" width="3" height="9" rx="1" fill="#fff" opacity="0.65"/>
              <rect x="9" y="1" width="3" height="11" rx="1" fill="#fff" opacity="0.85"/>
              <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#fff"/>
            </svg>
            {/* WiFi */}
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 9.5a1.2 1.2 0 110 2.4A1.2 1.2 0 018 9.5z" fill="#fff"/>
              <path d="M4.5 7.2C5.5 6.2 6.7 5.6 8 5.6s2.5.6 3.5 1.6" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.8"/>
              <path d="M1.5 4.5C3.2 2.8 5.5 1.8 8 1.8s4.8 1 6.5 2.7" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/>
            </svg>
            {/* 电池 */}
            <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
              <div style={{
                width: 24, height: 12,
                border: "1.5px solid rgba(255,255,255,0.7)",
                borderRadius: 3,
                padding: "1.5px 2px",
                display: "flex", alignItems: "center",
              }}>
                <div style={{ width: "76%", height: "100%", background: "#fff", borderRadius: 1.5 }}/>
              </div>
              <div style={{
                width: 2, height: 5,
                background: "rgba(255,255,255,0.5)",
                borderRadius: "0 1px 1px 0",
              }}/>
            </div>
          </div>
        </div>

        {/* 导航栏：高度 44px，微信标准 */}
        <div style={{
          height: 44,
          display: "flex",
          alignItems: "center",
          position: "relative",
          padding: "0 16px",
        }}>
          {/* 左侧返回按钮 */}
          <button
            onClick={onBack}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              background: "none", border: "none",
              padding: "6px 4px 6px 0",
              cursor: "pointer",
            }}
          >
            <svg width="11" height="18" viewBox="0 0 11 18" fill="none">
              <path d="M9.5 1.5L2 9l7.5 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: 17, color: "#fff", lineHeight: 1, fontWeight: 500 }}>返回</span>
          </button>

          {/* 居中标题 */}
          <div style={{
            position: "absolute",
            left: "50%", transform: "translateX(-50%)",
            fontSize: 17,
            fontWeight: 600,
            color: "#fff",
            letterSpacing: 0.3,
            whiteSpace: "nowrap",
          }}>产品体验</div>

          {/* 右侧微信胶囊按钮占位（模拟真实小程序右上角胶囊） */}
          <div style={{
            position: "absolute", right: 8,
            display: "flex", alignItems: "center",
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.35)",
            borderRadius: 20,
            padding: "5px 10px",
            gap: 10,
          }}>
            {/* 更多 */}
            <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
              <circle cx="2" cy="2" r="1.8" fill="#fff" opacity="0.85"/>
              <circle cx="8" cy="2" r="1.8" fill="#fff" opacity="0.85"/>
              <circle cx="14" cy="2" r="1.8" fill="#fff" opacity="0.85"/>
            </svg>
            {/* 分割线 */}
            <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.35)" }}/>
            {/* 关闭 */}
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1.5 1.5l10 10M11.5 1.5l-10 10" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.85"/>
            </svg>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="px-4 pb-28">
        {/* 大标题 */}
        <div style={{ textAlign: "center", marginBottom: 8, marginTop: 20 }}>
          <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.2, color: "#1a1a2e" }}>
            智爱客<span style={{
                background: "linear-gradient(90deg, #FF6B35 0%, #FF9A3C 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>产品矩阵</span>
          </div>
        </div>
        <div style={{ textAlign: "center", fontSize: 15, color: "#6a7a9a", marginBottom: 24 }}>
          深入业务骨髓的 AI 解决方案
        </div>

        {/* 产品卡片列表 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[...PRODUCTS_LEGACY, ...PRODUCTS].map((product, index) => (
            <div
              key={index}
              style={{
                background: "rgba(255,255,255,0.88)",
                borderRadius: 14,
                padding: "12px 14px",
                boxShadow: "0 2px 12px rgba(100,120,200,0.07), 0 1px 3px rgba(0,0,0,0.04)",
                border: "1px solid rgba(200,210,240,0.4)",
                display: "flex",
                alignItems: "center",
                gap: 12,
                backdropFilter: "blur(12px)",
              }}
            >
              {/* 左侧文字 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: "inline-block",
                  background: product.bgColor,
                  color: product.color,
                  fontSize: 9.5,
                  fontWeight: 700,
                  padding: "1.5px 7px",
                  borderRadius: 5,
                  marginBottom: 5,
                }}>
                  {product.tag}
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#1a1a2e", marginBottom: 3, lineHeight: 1.3 }}>
                  {product.title}
                </div>
                <div style={{ fontSize: 12, color: "#6a7a9a", lineHeight: 1.45 }}>
                  {product.desc}
                </div>
              </div>

              {/* 右侧截图预览 */}
              <div style={{
                width: 96,
                height: 70,
                borderRadius: 10,
                overflow: "hidden",
                flexShrink: 0,
                background: product.screenshotBg,
                boxShadow: "0 3px 12px rgba(0,0,0,0.15)",
              }}>
                {product.renderScreenshot()}
              </div>
            </div>
          ))}
        </div>

        {/* 底部说明 */}
        <div style={{ textAlign: "center", marginTop: 24, padding: "0 16px" }}>
          <div style={{ fontSize: 12, color: "#b8aac8" }}>
            预约后顾问将在 2 小时内联系您
          </div>
        </div>
      </div>

      {/* 底部固定 CTA */}
      <div style={{
        position: "sticky",
        bottom: 0,
        padding: "12px 20px",
        paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(200,210,240,0.3)",
        zIndex: 100,
      }}>
        <button
          onClick={onApply}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #ff9a3c 0%, #e8750a 100%)",
            border: "none",
            borderRadius: 50,
            padding: "14px 24px",
            color: "#fff",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            boxShadow: "0 6px 24px rgba(232,117,10,0.35)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          免费预约现场考察
        </button>
      </div>
    </div>
  );
}
