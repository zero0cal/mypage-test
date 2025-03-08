"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Play, ChevronRight, Sparkles, TrendingUp, ArrowRight, X, MoreVertical, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import PhoneMockup from "@/app/components/PhoneMockup"
import CreateVideoButton from "@/app/components/create-video-button"
import { ProgressSteps } from "@/app/components/progress-steps"

// 아이콘 컴포넌트
const Check = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const Download = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const Share = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
)

// 구독 플랜 타입 정의
type SubscriptionPlan = "starter" | "basic" | "premium" | "premium-plus"

// Mock data - would come from your database in production
const mockStore = {
  name: "에이바이트 키친",
  marketingScore: 87,
  videoCredits: 2,
  subscriptionPlan: "basic" as SubscriptionPlan, // 기본값으로 basic 설정
  recentActivity: [
    { type: "view", count: 1243, change: "+12%" },
    { type: "engagement", count: 356, change: "+8%" },
    { type: "conversion", count: 42, change: "+15%" },
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
  // 영상 생성권 상태 관리 (실제로는 DB에서 가져와야 함)
  const [credits, setCredits] = useState(mockStore.videoCredits)
  // 구독 플랜 상태 관리
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>(mockStore.subscriptionPlan)

  // 단계별 정보 정의 - 순서대로 진행되도록 수정
  const steps = [
    { text: "가게 정보 수집", time: 10, description: "가게의 기본 정보를 수집하고 있습니다" },
    { text: "사진 선별", time: 10, description: "최적의 사진을 선별하고 있습니다" },
    { text: "Gummy AI가 영상을 만들고 있어요", time: 20, description: "Gummy AI가 영상을 제작하고 있습니다" },
    { text: `${mockStore.name}의 광고가 완성되고 있어요`, time: 10, description: "최종 광고를 완성하고 있습니다" },
  ]

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
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </header>

        <main className="space-y-6">
          {/* 마케팅 점수 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-inner">
                <TrendingUp className="w-6 h-6 text-[#C02B2B]" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">마케팅 점수</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900">{mockStore.marketingScore}</p>
                  <div className="flex items-center gap-0.5 text-xs font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 19V5M12 5L5 12M12 5L19 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    5%
                  </div>
                </div>
              </div>
            </div>

            {/* 마케팅 점수 그래프 */}
            <div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C02B2B] to-[#E83A3A]"
                  style={{ width: `${mockStore.marketingScore}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-xs text-gray-400">0</span>
                <span className="text-xs text-gray-400">100</span>
              </div>
            </div>
          </motion.div>

          {/* 영상 생성 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <CreateVideoButton onClick={handleCreateVideo} credits={credits} />
          </motion.div>

          {/* 영상 생성 프로세스 */}
          <AnimatePresence>
            {isCreating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">영상 생성 중</h3>
                      <p className="text-sm text-gray-500">Gummy AI가 최적의 영상을 제작하고 있습니다</p>
                    </div>
                    <button
                      onClick={() => setIsCreating(false)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 왼쪽: 폰 목업 */}
                    <div className="flex justify-center">
                      <PhoneMockup
                        videoSrc={getLoadingVideoSrc()}
                        isLoading={true}
                        loadingStep={creationStep}
                        totalSteps={steps.length}
                        stepText={creationStep >= 0 && creationStep < steps.length ? steps[creationStep].text : ""}
                        className="scale-90"
                      />
                    </div>

                    {/* 오른쪽: 진행 단계 */}
                    <div className="flex flex-col justify-between">
                      <ProgressSteps steps={steps} currentStep={creationStep} countdown={countdown} />

                      {/* 추가 정보 카드 */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          {creationStep >= 0 && creationStep < steps.length
                            ? steps[creationStep].description
                            : "Gummy AI가 영상을 제작 중입니다"}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {mockStore.name}의 특성을 분석하여 맞춤형 광고 영상을 제작 중입니다. 완성된 영상은 바로
                          다운로드하거나 공유할 수 있습니다.
                        </p>
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
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 2 12C6.47715 2 2 6.47715 2 12Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                            <path d="M15 12L10 16V8L15 12Z" fill="currentColor" />
                          </svg>
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

