/**
 * 智爱客-餐饮AI 小程序原型外壳 v5
 * 三阶段营销落地页产品设计：
 * Stage 1: 广告落地 → 未登录AI对话（首页即对话页）
 * Stage 2: 快捷按钮触发登录提示 → 登录后产品体验
 * Stage 3: AI深度交流 → 店铺信息采集 → 申请全功能试用 + 一键电话咨询
 */
import { useState } from "react";
import { toast } from "sonner";
import HomePage from "./HomePage";
import VideoPage from "./VideoPage";
import StoreInfoPage from "./StoreInfoPage";
import ProductPage from "./ProductPage";
import CurrentTaskPage from "./CurrentTaskPage";
import InspectionPage from "./InspectionPage";
import DailySalaryPage from "./DailySalaryPage";
import QuotaDetailPage from "./QuotaDetailPage";
import AiMenuPage from "./AiMenuPage";
import StoreAiModelPage from "./StoreAiModelPage";
import GroupAiModelPage from "./GroupAiModelPage";
import TrainingPage from "./TrainingPage";
import TrainingAnswerPage from "./TrainingAnswerPage";
import TrainingReportPage from "./TrainingReportPage";
import TrainingManagerPage from "./TrainingManagerPage";
import OrgTreePage from "./OrgTreePage";
import OrgRegisterPage from "./OrgRegisterPage";
import type { TrainingTask } from "./TrainingPage";
import type { TrainingResult } from "./TrainingAnswerPage";

// ── 全局阶段类型 ─────────────────────────────────────────────────────────────
export type UserStage = 1 | 2 | 3;
export type AppView = "home" | "video" | "store-info" | "product" | "current-task" | "inspection" | "daily-salary" | "quota-detail" | "ai-menu" | "store-ai-model" | "group-ai-model" | "training" | "training-answer" | "training-report" | "training-manager" | "org-tree" | "org-register";
type OrgTreeSource = "training-manager" | "home-training";

// ── 登录弹窗组件 ─────────────────────────────────────────────────────────────
function LoginModal({
  onLogin,
  onClose,
  trigger,
}: {
  onLogin: (phone: string) => void;
  onClose: () => void;
  trigger?: string;
}) {
  const LOGO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663518710373/QXycpLBxSeowbm34BVNxpL/产品icon144_23ce91eb.png";
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 200,
      background: "rgba(30,15,50,0.55)",
      backdropFilter: "blur(6px)",
      display: "flex", alignItems: "flex-end",
    }}>
      <div style={{
        width: "100%",
        background: "linear-gradient(170deg, #fff9f4 0%, #fdf4ff 100%)",
        borderRadius: "24px 24px 0 0",
        padding: "24px 24px 32px",
        boxShadow: "0 -8px 40px rgba(100,60,160,0.18)",
        animation: "slide-up-modal 0.32s cubic-bezier(0.32,0.72,0,1) forwards",
      }}>
        {/* 拖拽条 */}
        <div style={{
          width: 36, height: 4, borderRadius: 2,
          background: "rgba(180,160,200,0.4)",
          margin: "0 auto 20px",
        }}/>

        {/* 标题区 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <img src={LOGO_IMG} style={{ width: 44, height: 44, borderRadius: 12 }} alt="logo"/>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#2d2040" }}>登录智爱客</div>
            <div style={{ fontSize: 13, color: "#9a8aaa", marginTop: 2 }}>
              {trigger ? `使用「${trigger}」需要先登录` : "登录后解锁全部功能"}
            </div>
          </div>
        </div>

        {/* 功能亮点 */}
        <div style={{
          background: "rgba(255,154,60,0.08)",
          border: "1px solid rgba(255,154,60,0.2)",
          borderRadius: 14, padding: "12px 14px", marginBottom: 20,
        }}>
          <div style={{ fontSize: 13, color: "#c45e00", fontWeight: 600, marginBottom: 8 }}>登录后可体验</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["工资日结", "AI巡检", "服务检测", "智能对讲", "碎片化培训"].map(f => (
              <span key={f} style={{
                padding: "4px 10px", borderRadius: 20,
                background: "rgba(255,154,60,0.15)",
                color: "#e8750a", fontSize: 12.5, fontWeight: 500,
              }}>{f}</span>
            ))}
          </div>
        </div>

        {/* 微信一键登录按钮 */}
        <button
          onClick={() => onLogin("138****8888")}
          style={{
            width: "100%", padding: "15px",
            background: "linear-gradient(135deg, #07c160, #06ad56)",
            border: "none", borderRadius: 16,
            color: "#fff", fontSize: 17, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            boxShadow: "0 4px 16px rgba(7,193,96,0.35)",
            cursor: "pointer",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
            <path d="M8.5 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM15.5 13.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5c-3.31 0-6-2.24-6-5s2.69-5 6-5 6 2.24 6 5-2.69 5-6 5z" opacity="0.3"/>
            <path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
          </svg>
          微信一键登录
        </button>

        {/* 关闭 */}
        <button
          onClick={onClose}
          style={{
            width: "100%", marginTop: 10, padding: "12px",
            background: "transparent", border: "none",
            color: "#9a8aaa", fontSize: 14, cursor: "pointer",
          }}
        >
          暂不登录，继续体验
        </button>
      </div>
      <style>{`
        @keyframes slide-up-modal {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─// ── 阶段切换演示快捷按鈕 ────────────────────────────────────────────
const STAGE_TIPS: Record<number, string> = {
  1: "📱 第一阶段：广告点击进入，免登录体验AI对话",
  2: "🔓 第二阶段：已登录，可体验工资日结、AI巡检等全功能",
  3: "⭐ 第三阶段：深度交流，填写店铺信息申请全功能试用",
};

function StageSwitcher({
  stage,
  onSwitch,
  onScanTraining,
  fromTrainingScan,
}: {
  stage: UserStage;
  onSwitch: (s: UserStage) => void;
  onScanTraining?: () => void;
  fromTrainingScan?: boolean;
}) {
  const stages: { id: UserStage; label: string; desc: string; color: string }[] = [
    { id: 1, label: "第一阶段", desc: "广告落地", color: "#e8750a" },
    { id: 2, label: "第二阶段", desc: "产品体验", color: "#07c160" },
    { id: 3, label: "第三阶段", desc: "深度转化", color: "#7c4bc8" },
  ];
  return (
    <div style={{
      display: "flex", gap: 6, padding: "8px 12px 6px",
      background: "rgba(255,255,255,0.85)",
      backdropFilter: "blur(8px)",
      borderBottom: "1px solid rgba(200,190,220,0.2)",
    }}>
      <div style={{ fontSize: 10, color: "#9a8aaa", alignSelf: "center", flexShrink: 0, marginRight: 2 }}>演示</div>
      {stages.map(s => (
        <button
          key={s.id}
          onClick={() => onSwitch(s.id)}
          style={{
            flex: 1, padding: "5px 4px",
            background: stage === s.id
              ? s.color
              : "rgba(255,255,255,0.6)",
            border: stage === s.id ? "none" : "1px solid rgba(200,190,220,0.4)",
            borderRadius: 10,
            color: stage === s.id ? "#fff" : "#6a5a7a",
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: stage === s.id ? `0 2px 8px ${s.color}44` : "none",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700 }}>{s.label}</div>
          <div style={{ fontSize: 9.5, opacity: 0.85, marginTop: 1 }}>{s.desc}</div>
        </button>
      ))}
      <button
        onClick={onScanTraining}
        style={{
          flexShrink: 0, padding: "5px 8px",
          background: fromTrainingScan ? "#1a6bbf" : "rgba(255,255,255,0.6)",
          border: fromTrainingScan ? "none" : "1px solid rgba(200,190,220,0.4)",
          borderRadius: 10,
          color: fromTrainingScan ? "#fff" : "#6a5a7a",
          cursor: "pointer", transition: "all 0.2s",
          boxShadow: fromTrainingScan ? "0 2px 8px rgba(26,107,191,0.44)" : "none",
          fontSize: 10, fontWeight: 700, whiteSpace: "nowrap",
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700 }}>扫码培训</div>
        <div style={{ fontSize: 9.5, opacity: 0.85, marginTop: 1 }}>员工视角</div>
      </button>
    </div>
  );
}

// ── 主组件 ────────────────────────────────────────────────────────────────────
export default function MiniAppShell() {
  const [stage, setStage] = useState<UserStage>(1);
  const [fromTrainingScan, setFromTrainingScan] = useState(false);
  const [appView, setAppView] = useState<AppView>("home");
  const [currentTaskInitialTab, setCurrentTaskInitialTab] = useState<string>("current");
  const [quotaDetailCode, setQuotaDetailCode] = useState<string>("BZ-102");
  const [trainingTask, setTrainingTask] = useState<TrainingTask | null>(null);
  const [trainingResult, setTrainingResult] = useState<TrainingResult | null>(null);
  const [userPhone, setUserPhone] = useState("138****8888");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginTrigger, setLoginTrigger] = useState<string | undefined>();
  const [orgTreeSource, setOrgTreeSource] = useState<OrgTreeSource>("training-manager");
  const [trainingOrgSelection, setTrainingOrgSelection] = useState<{ departmentIds: string[]; memberIds: string[]; version: number }>({
    departmentIds: [],
    memberIds: [],
    version: 0,
  });

  const isLoggedIn = stage >= 2;

  const handleLogin = (phone: string) => {
    setUserPhone(phone);
    setStage(2);
    setShowLoginModal(false);
    // 登录后根据触发来源自动跳转对应页面
    if (loginTrigger === "AI巡检") {
      setAppView("inspection");
    } else if (loginTrigger === "工资日结") {
      setAppView("daily-salary");
    } else if (loginTrigger === "产品体验" || loginTrigger === "免费体验" || loginTrigger === "视频体验") {
      setAppView("product");
    }
  };

  const handleLogout = () => {
    setStage(1);
    setAppView("home");
  };

  const handleRequestLogin = (trigger?: string) => {
    setLoginTrigger(trigger);
    setShowLoginModal(true);
  };

  const handleStageSwitch = (s: UserStage) => {
    setFromTrainingScan(false);
    setStage(s);
    setAppView("home");
    setShowLoginModal(false);
    toast.info(STAGE_TIPS[s], { duration: 3000 });
  };

  const handleEnterStage3 = () => {
    setStage(3);
    setAppView("store-info");
  };

  const handleOpenProduct = () => {
    setAppView("product");
  };

  const handleOpenCurrentTask = (tab?: string) => {
    setCurrentTaskInitialTab(tab ?? "current");
    setAppView("current-task");
  };

  const handleOpenDailySalary = () => {
    setAppView("daily-salary");
  };

  const handleOpenInspection = () => {
    setAppView("inspection");
  };

  const handleOpenQuotaDetail = (code: string) => {
    setQuotaDetailCode(code);
    setAppView("quota-detail");
  };

  const handleOpenTraining = () => {
    setAppView("training");
  };

  const handleOpenOrgTree = (source: OrgTreeSource = "training-manager") => {
    setOrgTreeSource(source);
    setAppView("org-tree");
  };

  const handleApplyTrainingOrgSelection = (payload: { departmentIds: string[]; memberIds: string[] }) => {
    setTrainingOrgSelection({ ...payload, version: Date.now() });
    toast.success(`已同步 ${payload.memberIds.length} 位培训对象`);
    setAppView("home");
  };

  const handleOpenOrgRegister = () => {
    setAppView("org-register");
  };

  const handleStartTask = (task: TrainingTask) => {
    setTrainingTask(task);
    setAppView("training-answer");
  };

  const handleTrainingComplete = (result: TrainingResult) => {
    setTrainingResult(result);
    setAppView("training-report");
  };

  const bgColor = appView === "video" ? "#0d0d1a" : "#f2f3f7";
  const showDemoSwitcher = false;

  const renderContent = () => (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* 顶部演示切换条先隐藏，后续如需演示多阶段切换可再恢复 */}
      {showDemoSwitcher && (
        <StageSwitcher
          stage={stage}
          onSwitch={handleStageSwitch}
          onScanTraining={() => { setFromTrainingScan(true); setAppView("home"); }}
          fromTrainingScan={fromTrainingScan}
        />
      )}
      {/* 主内容区 */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {(appView === "home" || (appView === "org-tree" && orgTreeSource === "home-training")) && (
          <HomePage
            userPhone={userPhone}
            isLoggedIn={isLoggedIn}
            stage={stage}
            onLogout={handleLogout}
            onOpenVideo={() => setAppView("video")}
            onRequestLogin={handleRequestLogin}
            onEnterStage3={handleEnterStage3}
            onOpenProduct={handleOpenProduct}
            onOpenCurrentTask={handleOpenCurrentTask}
            onOpenDailySalary={handleOpenDailySalary}
            onOpenInspection={handleOpenInspection}
            onOpenAiMenu={() => setAppView("ai-menu")}
            onOpenStoreAiModel={() => setAppView("store-ai-model")}
            onOpenGroupAiModel={() => setAppView("group-ai-model")}
            onOpenTraining={handleOpenTraining}
            onOpenTrainingConversation={() => {
              setAppView("home");
              setFromTrainingScan(false);
              window.setTimeout(() => setFromTrainingScan(true), 0);
            }}
            onOpenOrgTree={() => handleOpenOrgTree("home-training")}
            orgTreeSelectedMemberIds={trainingOrgSelection.memberIds}
            orgTreeSelectionVersion={trainingOrgSelection.version}
            fromTrainingScan={fromTrainingScan}
            onExitTrainingScan={() => setFromTrainingScan(false)}
          />
        )}
        {appView === "video" && (
          <VideoPage
            onBack={() => setAppView("home")}
            onTryProduct={() => {
              setAppView("home");
              if (!isLoggedIn) handleRequestLogin("视频体验");
            }}
          />
        )}
        {appView === "store-info" && (
          <StoreInfoPage
            userPhone={userPhone}
            onBack={() => setAppView("home")}
          />
        )}
        {appView === "product" && (
          <ProductPage
            onBack={() => setAppView("home")}
            onApply={() => {
              if (!isLoggedIn) {
                handleRequestLogin("免费体验");
              } else {
                handleEnterStage3();
              }
            }}
          />
        )}
        {appView === "current-task" && (
          <CurrentTaskPage
            onBack={() => setAppView("home")}
            initialTab={currentTaskInitialTab}
            onOpenQuotaDetail={handleOpenQuotaDetail}
          />
        )}
        {appView === "inspection" && (
          <InspectionPage
            onBack={() => setAppView("home")}
          />
        )}
        {appView === "daily-salary" && (
          <DailySalaryPage
            onBack={() => setAppView("home")}
            onOpenCurrentTask={() => handleOpenCurrentTask()}
          />
        )}
        {appView === "quota-detail" && (
          <QuotaDetailPage
            onBack={() => setAppView("current-task")}
            code={quotaDetailCode}
          />
        )}
        {appView === "ai-menu" && (
          <AiMenuPage
            onBack={() => setAppView("home")}
          />
        )}
        {appView === "store-ai-model" && (
          <StoreAiModelPage
            onBack={() => setAppView("home")}
          />
        )}
        {appView === "group-ai-model" && (
          <GroupAiModelPage
            onBack={() => setAppView("home")}
          />
        )}
        {appView === "training" && (
          <TrainingPage
            onBack={() => setAppView("home")}
            onStartTask={handleStartTask}
            onViewReport={(task) => {
              setTrainingTask(task);
              setAppView("training-report");
            }}
            onOpenManager={() => setAppView("training-manager")}
            isManager={true}
          />
        )}
        {appView === "training-answer" && trainingTask && (
          <TrainingAnswerPage
            task={trainingTask}
            onBack={() => setAppView("training")}
            onComplete={handleTrainingComplete}
          />
        )}
        {appView === "training-report" && (
          <TrainingReportPage
            result={trainingResult!}
            task={trainingTask!}
            onBack={() => setAppView("training")}
            onRetry={() => setAppView("training-answer")}
            onHome={() => setAppView("training")}
          />
        )}
        {appView === "training-manager" && (
          <TrainingManagerPage
            onBack={() => setAppView("training")}
            onOpenOrgTree={() => handleOpenOrgTree("training-manager")}
          />
        )}
        {appView === "org-tree" && (
          <div style={{ position: "absolute", inset: 0, zIndex: 20 }}>
            <OrgTreePage
              onBack={() => setAppView(orgTreeSource === "home-training" ? "home" : "training-manager")}
              onInvite={handleOpenOrgRegister}
              selectedDeptIds={trainingOrgSelection.departmentIds}
              selectedMemberIds={trainingOrgSelection.memberIds}
              onApplySelection={handleApplyTrainingOrgSelection}
            />
          </div>
        )}
        {appView === "org-register" && (
          <OrgRegisterPage
            onBack={() => setAppView(orgTreeSource === "home-training" ? "org-tree" : "org-tree")}
            onComplete={() => setAppView("training")}
          />
        )}

        {/* 登录弹窗（覆盖在内容上方） */}
        {showLoginModal && (
          <LoginModal
            onLogin={handleLogin}
            onClose={() => setShowLoginModal(false)}
            trigger={loginTrigger}
          />
        )}
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #e8eaf6 0%, #f3e5f5 50%, #e8f5e9 100%)" }}
    >
      {/* 桌面端手机外壳 */}
      <div className="hidden md:block phone-frame relative" style={{ background: bgColor, overflow: "hidden" }}>
        {renderContent()}
      </div>

      {/* 移动端全屏 */}
      <div className="md:hidden w-full" style={{ background: bgColor, height: "100dvh", overflow: "hidden" }}>
        {renderContent()}
      </div>
    </div>
  );
}
