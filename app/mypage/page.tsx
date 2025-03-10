"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion"
import {
  Play,
  ChevronRight,
  Sparkles,
  TrendingUp,
  ArrowRight,
  X,
  Settings,
  Star,
  Check,
  Download,
  Share,
  ArrowUp,
  Eye,
  Info,
  BarChart3,
  Users,
  ShoppingCart,
  Zap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import PhoneMockup from "@/app/components/PhoneMockup"
import CreateVideoButton from "@/app/components/create-video-button"

// 구독 플랜 타입 정의
type SubscriptionPlan = "starter" | "basic" | "premium" | "premium-plus"

// Mock data - would come from your database in production
const mockStore = {
  name: "에이바이트 키친",
  marketingScore: 87,
  videoCredits: 2,
  subscriptionPlan: "premium-plus" as SubscriptionPlan, // 테스트를 위해 premium-plus로 설정
  recentActivity: [
    { type: "view", count: 1243, change: "+12%", icon: <Eye className="w-4 h-4" /> },
    { type: "engagement", count: 356, change: "+8%", icon: <Users className="w-4 h-4" /> },
    { type: "conversion", count: 42, change: "+15%", icon: <ShoppingCart className="w-4 h-4" /> },
  ],
  videos: [
    { id: 1, thumbnail: "/thumbnail/bite1.jpg", title: "여름 프로모션", views: 1200, date: "3일 전" },
    { id: 2, thumbnail: "/thumbnail/bite2.jpg", title: "신메뉴 출시", views: 890, date: "1주 전" },
    { id: 3, thumbnail: "/thumbnail/bite3.jpg", title: "할인 이벤트", views: 750, date: "2주 전" },
  ],
  recommendations: [
    "주간 프로모션 영상을 만들어 매출을 증가시켜보세요",
    "신메뉴 출시 영상이 고객 참여도를 높입니다",
    "할인 이벤트 영상으로 재방문율을 높여보세요",
  ],
}

export default function HomePage() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [creationStep, setCreationStep] = useState(0)
  const [countdown, setCountdown] = useState(0)
  const [videoReady, setVideoReady] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [isPlaying, setIsPlaying] = useState(false)
  const [showScoreDetails, setShowScoreDetails] = useState(false)
  // 영상 생성권 상태 관리 (실제로는 DB에서 가져와야 함)
  const [credits, setCredits] = useState(mockStore.videoCredits)
  // 구독 플랜 상태 관리
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>(mockStore.subscriptionPlan)
  // 프로그레스 상태 관리
  const [progressPercent, setProgressPercent] = useState(0)
  const animatedProgress = useMotionValue(0)
  const displayProgress = useTransform(animatedProgress, Math.round)
  const circleProgress = useMotionValue(0)

  // 마케팅 점수 애니메이션을 위한 상태
  const [isScoreVisible, setIsScoreVisible] = useState(false)
  const scoreValue = useMotionValue(0)
  const displayScore = useTransform(scoreValue, Math.round)

  // 마케팅 점수 애니메이션 시작
  useEffect(() => {
    // 컴포넌트가 마운트되고 약간의 지연 후 애니메이션 시작
    const timer = setTimeout(() => {
      setIsScoreVisible(true)

      const controls = animate(scoreValue, mockStore.marketingScore, {
        duration: 2,
        ease: "easeOut",
      })

      return () => controls.stop()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // 단계별 정보 정의 - 더 간결하고 자연스러운 메시지로 수정
  const steps = [
    { text: "가게 정보 수집", time: 10, description: "기본 정보를 수집하는 중" },
    { text: "사진 선별", time: 10, description: "최적의 사진을 고르는 중" },
    { text: "영상 제작", time: 20, description: "Gummy AI가 영상 제작 중" },
    { text: "최종 편집", time: 10, description: "광고 영상 마무리 중" },
  ]

  // 프로그레스 계산 함수
  const calculateProgress = () => {
    if (creationStep >= steps.length) return 100

    // 완료된 단계의 진행률
    const completedProgress = (creationStep / steps.length) * 100

    // 현재 진행 중인 단계의 진행률
    const currentStepProgress =
      countdown === 0 ? (1 / steps.length) * 100 : (1 / steps.length) * (1 - countdown / steps[creationStep].time) * 100

    return completedProgress + currentStepProgress
  }

  // 애니메이션 프로그레스 업데이트
  useEffect(() => {
    const animation = { progress: animatedProgress.get() }
    const controls = animate(
      animation,
      {
        progress: progressPercent,
      },
      {
        duration: 0.8,
        ease: "easeOut",
        onUpdate: () => {
          animatedProgress.set(animation.progress)
        },
      },
    )

    return () => controls.stop()
  }, [progressPercent, animatedProgress])

  // 프로그레스 업데이트
  useEffect(() => {
    if (isCreating) {
      const newProgress = calculateProgress()
      setProgressPercent(newProgress)
    } else {
      setProgressPercent(0)
    }
  }, [creationStep, countdown, isCreating])

  // 단계 진행 로직 개선
  useEffect(() => {
    // 생성 중이 아니거나 모든 단계가 완료된 경우 타이머를 실행하지 않음
    if (!isCreating || creationStep >= steps.length) return

    // 안전 검사 추가
    if (creationStep < 0 || creationStep >= steps.length) {
      setCreationStep(0)
      return
    }

    console.log(`단계 시작: ${creationStep + 1}/${steps.length} - ${steps[creationStep].text}`)

    // 현재 단계의 카운트다운 시간 설정
    setCountdown(steps[creationStep].time)

    // 카운트다운 타이머 설정
    const timer = setInterval(() => {
      setCountdown((prev) => {
        // 카운트다운이 끝나면
        if (prev <= 1) {
          // 타이머 정리
          clearInterval(timer)
          console.log(`단계 ${creationStep + 1} 완료: ${steps[creationStep].text}`)

          // 다음 단계로 진행하기 전에 약간의 지연 추가
          setTimeout(() => {
            // 다음 단계가 있으면 진행
            if (creationStep < steps.length - 1) {
              console.log(`다음 단계로 진행: ${creationStep + 1} -> ${creationStep + 2}`)
              setCreationStep(creationStep + 1)
            } else {
              // 모든 단계 완료
              console.log("모든 단계 완료")
              setVideoReady(true)
              setIsCreating(false)
              setCreationStep(0)
              setIsPlaying(true)
            }
          }, 1000)

          return 0
        }
        return prev - 1
      })
    }, 1000)

    // 컴포넌트 언마운트 또는 의존성 변경 시 타이머 정리
    return () => {
      console.log(`타이머 정리: 단계 ${creationStep + 1}`)
      clearInterval(timer)
    }
  }, [creationStep, isCreating, steps.length])

  const handleCreateVideo = () => {
    if (credits <= 0) {
      // 크레딧이 0이면 충전 페이지로 이동
      router.push("/subscription")
      return
    }

    // 영상 생성권 차감 (실제로는 DB 업데이트 필요)
    setCredits((prev) => prev - 1)

    // 영상 생성 시작
    setIsCreating(true)
    setCreationStep(0)
    setVideoReady(false)
    setIsPlaying(false)
    setProgressPercent(0)
  }

  // 테스트를 위한 크레딧 리셋 함수 추가 (실제 구현에서는 제거 가능)
  const resetCredits = () => {
    setCredits(0) // 크레딧을 0으로 설정하여 충전하기 버튼으로 변경
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const handlePlayVideo = () => {
    setIsPlaying(!isPlaying)
  }

  // 현재 단계에 따른 로딩 비디오 선택
  const getLoadingVideoSrc = () => {
    // 안전 검사 추가
    if (creationStep < 0 || creationStep >= steps.length) {
      return "/video/abite.mp4"
    }

    // 실제 구현에서는 각 단계별로 다른 로딩 비디오를 반환할 수 있습니다
    const videos = [
      "/video/loading1.mp4", // 가게 정보 수집
      "/video/loading2.mp4", // 사진 선별
      "/video/loading3.mp4", // Gummy AI가 영상을 만들
      "/video/loading4.mp4", // 광고가 만들어질
    ]

    // 실제 비디오가 없는 경우를 대비해 기본 비디오 경로 설정
    return videos[creationStep] || "/video/abite.mp4"
  }

  // 마케팅 점수 상세 정보 토글
  const toggleScoreDetails = () => {
    setShowScoreDetails(!showScoreDetails)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {/* 상단 헤더 */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#C02B2B] to-[#E83A3A] shadow-lg">
                <span className="text-2xl font-bold text-white">G</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{mockStore.name}</h1>
                <p className="text-sm text-gray-500">오늘도 Gummy와 함께 멋진 광고를 만들어보세요</p>
              </div>
            </div>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setCredits(0)} // 테스트용 크레딧 리셋 기능
            >
              <Settings className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </header>

        <main className="space-y-6">
          {/* 마케팅 점수 카드 - 개선된 디자인 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-md"></div>
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#FFF5F5] to-white shadow-inner">
                      <TrendingUp className="w-6 h-6 text-[#C02B2B]" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">마케팅 점수</p>
                    <div className="flex items-baseline gap-2">
                      <motion.p
                        className="text-3xl font-bold text-gray-900"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.span>{displayScore}</motion.span>
                      </motion.p>
                      <div className="flex items-center gap-0.5 text-xs font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <ArrowUp className="w-3 h-3" />
                        5%
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={toggleScoreDetails} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <Info className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* 마케팅 점수 그래프 */}
              <div className="mb-4">
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#C02B2B] to-[#E83A3A]"
                    initial={{ width: "0%" }}
                    animate={{ width: `${mockStore.marketingScore}%` }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  ></motion.div>
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-xs text-gray-400">0</span>
                  <span className="text-xs text-gray-400">100</span>
                </div>
              </div>

              {/* 마케팅 점수 상세 정보 */}
              <AnimatePresence>
                {showScoreDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">마케팅 활동 분석</h4>
                      <div className="grid grid-cols-3 gap-3">
                        {mockStore.recentActivity.map((activity, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-50 rounded-xl p-3 shadow-sm"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                {activity.icon}
                              </div>
                              <p className="text-xs font-medium text-gray-500">
                                {activity.type === "view"
                                  ? "조회수"
                                  : activity.type === "engagement"
                                    ? "참여율"
                                    : "전환율"}
                              </p>
                            </div>
                            <div className="flex items-baseline justify-between">
                              <p className="text-lg font-bold text-gray-900">
                                {activity.type === "view" ? `${activity.count.toLocaleString()}` : `${activity.count}`}
                              </p>
                              <div className="flex items-center text-xs font-medium text-emerald-500">
                                <ArrowUp className="w-3 h-3 mr-0.5" />
                                {activity.change}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-4 p-3 bg-[#FFF5F5] rounded-xl border border-red-100">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                            <BarChart3 className="w-4 h-4 text-[#C02B2B]" />
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-900 mb-1">마케팅 점수 향상 팁</h5>
                            <p className="text-xs text-gray-600">
                              정기적인 콘텐츠 업로드와 타겟 고객층에 맞는 광고 전략으로 마케팅 점수를 높여보세요. 점수가
                              높을수록 더 많은 고객에게 노출됩니다.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* 영상 생성 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <CreateVideoButton
              onClick={handleCreateVideo}
              credits={credits}
              isPremiumPlus={subscriptionPlan === "premium-plus"}
            />
          </motion.div>

          {/* 영상 생성 프로세스 - 시각적으로 개선된 디자인 */}
          <AnimatePresence>
            {isCreating && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  },
                }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                className="relative z-20"
              >
                {/* 모달 외부 효과 - 주변 글로우 */}
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 rounded-3xl blur-lg"></div>

                {/* 메인 모달 */}
                <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
                  {/* 상단 장식 바 */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C02B2B] via-[#FF5050] to-[#C02B2B]"></div>

                  {/* 배경 애니메이션 효과 */}
                  <div className="absolute inset-0 overflow-hidden">
                    {/* 배경 그라데이션 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-[#FFF8F8] to-[#FFF0F0] opacity-80"></div>

                    {/* 움직이는 원형 효과들 */}
                    <motion.div
                      className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br from-red-100/30 via-orange-100/30 to-red-100/30 blur-xl"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.3, 0.2],
                        rotate: [0, 5, 0],
                      }}
                      transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-red-100/20 via-pink-100/20 to-orange-100/20 blur-xl"
                      animate={{
                        scale: [1.1, 1, 1.1],
                        opacity: [0.15, 0.25, 0.15],
                        rotate: [0, -5, 0],
                      }}
                      transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    />

                    {/* 미묘한 패턴 효과 */}
                    <div
                      className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23FF0000' fillOpacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      }}
                    />

                    {/* 빛나는 효과 */}
                    <motion.div
                      className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-200 to-transparent"
                      animate={{
                        opacity: [0, 0.7, 0],
                        left: ["-100%", "200%"],
                      }}
                      transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    />
                    <motion.div
                      className="absolute bottom-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-200 to-transparent"
                      animate={{
                        opacity: [0, 0.7, 0],
                        left: ["200%", "-100%"],
                      }}
                      transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 3 }}
                    />
                  </div>

                  {/* 메인 콘텐츠 */}
                  <div className="relative z-10 p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-md"></div>
                          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#C02B2B] to-[#E83A3A] shadow-md">
                            <Zap className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">영상 생성 중</h3>
                          <p className="text-sm text-gray-600">Gummy AI가 최적의 영상을 제작하고 있습니다</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsCreating(false)}
                        className="p-2 rounded-full hover:bg-gray-100/80 transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* 원형 프로그레스 및 현재 단계 정보 */}
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* 원형 프로그레스 인디케이터 - 개선된 디자인 */}
                        <div className="relative flex-shrink-0">
                          <motion.div
                            className="relative w-36 h-36 md:w-44 md:h-44"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            {/* 배경 그라데이션 효과 */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFF5F5] to-[#FFEBEB] shadow-inner"></div>

                            {/* 진행 원 */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                              <defs>
                                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#C02B2B" />
                                  <stop offset="100%" stopColor="#FF5050" />
                                </linearGradient>
                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                  <feGaussianBlur stdDeviation="2" result="blur" />
                                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                              </defs>
                              <circle cx="50" cy="50" r="42" fill="none" stroke="#F0F0F0" strokeWidth="6" />
                              <motion.circle
                                cx="50"
                                cy="50"
                                r="42"
                                fill="none"
                                strokeWidth="6"
                                stroke="url(#progressGradient)"
                                strokeLinecap="round"
                                filter="url(#glow)"
                                strokeDasharray={2 * Math.PI * 42}
                                animate={{
                                  strokeDashoffset: 2 * Math.PI * 42 * (1 - progressPercent / 100),
                                }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                              />
                            </svg>

                            {/* 중앙 콘텐츠 */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                              <div className="relative">
                                <motion.div
                                  initial={{ scale: 1 }}
                                  animate={{ scale: [1, 1.05, 1] }}
                                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                                  className="absolute -inset-3 rounded-full bg-white/50 blur-md"
                                ></motion.div>
                                <motion.span
                                  className="relative text-4xl font-bold text-[#C02B2B]"
                                  animate={{
                                    scale: [1, 1.05, 1],
                                    transition: { duration: 0.3, ease: "easeInOut" },
                                  }}
                                >
                                  <motion.span>{displayProgress}</motion.span>%
                                </motion.span>
                              </div>
                              <span className="text-xs font-medium text-gray-500 mt-1">완료</span>
                            </div>

                            {/* 미묘한 장식적 요소 */}
                            <motion.div
                              className="absolute -z-10 inset-0 rounded-full"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 1 }}
                            >
                              <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-[#C02B2B]/20"></div>
                              <div className="absolute bottom-5 left-3 w-2 h-2 rounded-full bg-[#C02B2B]/20"></div>
                            </motion.div>
                          </motion.div>
                        </div>

                        {/* 현재 단계 정보 */}
                        <div className="flex-1 w-full">
                          <motion.div
                            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-red-100/50 shadow-sm"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#C02B2B] to-[#E83A3A] flex items-center justify-center shadow-md">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                >
                                  <Sparkles className="w-5 h-5 text-white" />
                                </motion.div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-base font-bold text-gray-900 truncate">
                                  {creationStep >= 0 && creationStep < steps.length
                                    ? steps[creationStep].text
                                    : "영상 생성 중"}
                                </h4>
                                <p className="text-sm text-gray-600 truncate">
                                  {creationStep >= 0 && creationStep < steps.length
                                    ? steps[creationStep].description
                                    : "처리 중..."}
                                </p>
                              </div>
                              <div className="flex-shrink-0 flex flex-col items-center justify-center ml-2">
                                <div className="text-xl font-bold text-[#C02B2B]">{countdown}</div>
                                <p className="text-xs text-gray-500">초</p>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      {/* 단계별 타임라인 */}
                      <div className="relative pt-2 pb-2">
                        {/* 배경 연결선 - 모든 원을 관통하는 하나의 선 */}
                        <div className="absolute left-[23px] top-[16px] bottom-[16px] w-0.5 bg-gray-200 z-0"></div>

                        {steps.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`relative flex items-center gap-4 ${
                              index === steps.length - 1 ? "mb-0" : "mb-4"
                            } pl-2 ${
                              index === creationStep
                                ? "opacity-100"
                                : index < creationStep
                                  ? "opacity-90"
                                  : "opacity-50"
                            }`}
                          >
                            {/* 연결선 - 각 단계별로 개별 연결선 */}
                            {index < steps.length - 1 && (
                              <>
                                {/* 배경 연결선 */}
                                <div
                                  className="absolute left-[23px] top-[16px] w-0.5 bg-gray-200 z-0"
                                  style={{
                                    height: "28px",
                                    transform: "translateX(0)",
                                  }}
                                ></div>

                                {/* 진행 연결선 */}
                                <motion.div
                                  className="absolute left-[23px] top-[16px] w-0.5 bg-[#C02B2B] z-10 origin-top"
                                  style={{
                                    height: "28px",
                                    transform: "translateX(0)",
                                    scaleY:
                                      index < creationStep ? 1 : index === creationStep ? 1 - countdown / step.time : 0,
                                  }}
                                  initial={{ scaleY: 0 }}
                                  animate={{
                                    scaleY:
                                      index < creationStep ? 1 : index === creationStep ? 1 - countdown / step.time : 0,
                                  }}
                                  transition={{ duration: 0.5 }}
                                ></motion.div>
                              </>
                            )}

                            {/* 상태 아이콘 - 크기 축소 */}
                            <div
                              className={`relative z-20 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                index < creationStep
                                  ? "bg-[#C02B2B] text-white"
                                  : index === creationStep
                                    ? "bg-white border-2 border-[#C02B2B] text-[#C02B2B]"
                                    : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {index < creationStep ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <span className="text-sm font-medium">{index + 1}</span>
                              )}

                              {/* 현재 단계 표시기 */}
                              {index === creationStep && (
                                <motion.div
                                  className="absolute -inset-1 rounded-full border-2 border-[#C02B2B]"
                                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                ></motion.div>
                              )}
                            </div>

                            {/* 단계 내용 */}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p
                                  className={`text-base font-bold ${
                                    index <= creationStep ? "text-gray-900" : "text-gray-400"
                                  }`}
                                >
                                  {step.text}
                                </p>
                                <span
                                  className={`text-base font-bold ${
                                    index < creationStep
                                      ? "text-[#C02B2B]"
                                      : index === creationStep
                                        ? "text-[#C02B2B]"
                                        : "text-gray-400"
                                  }`}
                                >
                                  {index < creationStep
                                    ? "완료"
                                    : index === creationStep
                                      ? `${countdown}초`
                                      : `${step.time}초`}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* 추가 정보 카드 */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100/70 shadow-sm"
                        whileHover={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)" }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <Info className="w-5 h-5 text-[#C02B2B]" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-1">
                              {mockStore.name}의 특성을 분석 중입니다
                            </h4>
                            <p className="text-xs text-gray-600">
                              Gummy AI가 맞춤형 광고 영상을 제작 중입니다. 완성된 영상은 바로 다운로드하거나 공유할 수
                              있습니다.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 최근 생성된 영상 */}
          {videoReady && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative flex justify-center">
                      <PhoneMockup
                        videoSrc="/video/abite.mp4"
                        className="scale-90"
                        isLoading={false}
                        onVideoPlay={() => setIsPlaying(true)}
                      />
                      {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <button
                            onClick={handlePlayVideo}
                            className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md hover:bg-white/40 transition-all duration-300 flex items-center justify-center shadow-lg"
                          >
                            <Play className="w-6 h-6 text-white" fill="white" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-between">
                      <div>
                        <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-600 mb-2 shadow-sm">
                          방금 생성됨
                        </div>

                        <h3 className="text-lg font-bold text-gray-900">새로운 광고 영상</h3>
                        <p className="text-sm text-gray-500 mt-1.5">
                          Gummy AI가 {mockStore.name}의 특성을 분석하여 최적화된 광고 영상을 생성했습니다.
                        </p>
                      </div>

                      <div className="space-y-4 mt-4">
                        <div className="flex flex-wrap gap-2">
                          <Button className="bg-gradient-to-r from-[#C02B2B] to-[#E83A3A] hover:from-[#B02020] hover:to-[#D83030] text-sm h-9 px-4 rounded-xl shadow-sm">
                            <Download className="w-4 h-4 mr-1.5" /> 다운로드
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          className="border-gray-200 text-gray-700 text-sm h-9 px-4 rounded-xl shadow-sm"
                        >
                          <Share className="w-4 h-4 mr-1.5" /> 공유하기
                        </Button>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-2 rounded-xl bg-gradient-to-b from-gray-50 to-gray-100 shadow-sm">
                          <p className="text-xs text-gray-500 mb-1">예상 조회수</p>
                          <p className="text-sm font-bold text-gray-900">1.2K+</p>
                        </div>
                        <div className="text-center p-2 rounded-xl bg-gradient-to-b from-gray-50 to-gray-100 shadow-sm">
                          <p className="text-xs text-gray-500 mb-1">예상 참여율</p>
                          <p className="text-sm font-bold text-gray-900">8.5%</p>
                        </div>
                        <div className="text-center p-2 rounded-xl bg-gradient-to-b from-gray-50 to-gray-100 shadow-sm">
                          <p className="text-xs text-gray-500 mb-1">예상 전환율</p>
                          <p className="text-sm font-bold text-gray-900">3.2%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 내 광고 영상 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">내 광고 영상</h2>
              <div className="flex rounded-xl bg-gray-100 p-0.5 shadow-inner">
                <button
                  onClick={() => handleTabChange("all")}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                    activeTab === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                  }`}
                >
                  전체
                </button>
                <button
                  onClick={() => handleTabChange("recent")}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                    activeTab === "recent" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                  }`}
                >
                  최근
                </button>
                <button
                  onClick={() => handleTabChange("popular")}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                    activeTab === "popular" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
                  }`}
                >
                  인기
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {mockStore.videos.map((video, idx) => (
                <motion.div
                  key={video.id}
                  className="group relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * idx }}
                >
                  <div className="relative aspect-[9/16] rounded-xl overflow-hidden shadow-sm">
                    <Image
                      src={video.thumbnail || "/placeholder.svg?height=400&width=225"}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#00000090] to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-sm">
                      <button className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md hover:bg-white/40 transition-all duration-300 flex items-center justify-center transform group-hover:scale-110">
                        <Play className="w-5 h-5 text-white" fill="white" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-sm font-medium text-white truncate">{video.title}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-white/80 flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {video.views} 조회
                        </span>
                        <span className="text-xs text-white/80">{video.date}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full py-3 text-sm font-medium text-gray-600 bg-white rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm flex items-center justify-center">
              더 보기 <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </motion.div>

          {/* Gummy AI 추천 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#C02B2B] to-[#E83A3A] shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Gummy AI 추천</h3>
            </div>

            <div className="space-y-3">
              {mockStore.recommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl shadow-sm border border-gray-100"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index + 0.3 }}
                  whileHover={{ scale: 1.01, boxShadow: "0 5px 15px -5px rgba(0, 0, 0, 0.1)" }}
                >
                  <div className="flex items-center justify-center w-7 h-7 mt-0.5 rounded-full bg-gradient-to-r from-red-50 to-orange-50 text-[#C02B2B] shadow-sm">
                    <Star className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 font-medium">{recommendation}</p>
                    <button className="mt-1.5 text-xs text-[#C02B2B] font-medium hover:underline flex items-center">
                      지금 시도하기 <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

