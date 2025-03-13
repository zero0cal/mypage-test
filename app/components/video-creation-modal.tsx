"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Sparkles } from "lucide-react"

interface VideoCreationModalProps {
  isOpen: boolean
  onClose: () => void
  progress: number
  currentStep: number
  remainingTime: number
  storeName: string
}

export default function VideoCreationModal({
  isOpen,
  onClose,
  progress,
  currentStep,
  remainingTime,
  storeName,
}: VideoCreationModalProps) {
  const steps = [
    { id: 1, text: "가게 정보 수집", status: "완료" },
    { id: 2, text: "사진 선별", status: "완료" },
    { id: 3, text: "Gummy AI가 영상을 만들고 있어요", status: "완료" },
    { id: 4, text: `${storeName}의 광고가 완성되고 있어요`, status: "진행중", time: 8 },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
          >
            {/* 헤더 */}
            <div className="flex items-start justify-between p-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">영상 생성 중</h2>
                <p className="mt-1 text-sm text-gray-500">Gummy AI가 최적의 영상을 제작하고 있습니다</p>
              </div>
              <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* 프로그레스 원형 */}
            <div className="px-6 pb-6">
              <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* 배경 원 */}
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#FFF5F5" strokeWidth="10" />
                    {/* 프로그레스 원 */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#C02B2B"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 45}
                      initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                      animate={{
                        strokeDashoffset: 2 * Math.PI * 45 * (1 - progress / 100),
                      }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-[#C02B2B]">{progress}%</span>
                    <span className="text-sm text-gray-500 mt-1">완료</span>
                  </div>
                </div>
              </div>

              {/* 현재 단계 카드 */}
              <div className="bg-[#FFF5F5] rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#C02B2B]" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-gray-900 truncate">{steps[currentStep - 1].text}</h3>
                    <p className="text-sm text-gray-500">최종 광고를 완성하고 있습니다</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-[#C02B2B] font-bold">{remainingTime}초</span>
                  </div>
                </div>
              </div>

              {/* 단계별 타임라인 */}
              <div className="space-y-4">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-center gap-4">
                    <div className="relative">
                      {step.status === "완료" ? (
                        <div className="w-8 h-8 rounded-full bg-[#C02B2B] flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full border-2 border-[#C02B2B] flex items-center justify-center">
                          <span className="text-sm font-bold text-[#C02B2B]">{step.id}</span>
                        </div>
                      )}
                      {step.id < steps.length && (
                        <div className="absolute top-8 left-1/2 w-0.5 h-4 -translate-x-1/2 bg-gray-200" />
                      )}
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <span className={`text-sm ${step.status === "완료" ? "text-gray-900" : "text-gray-600"}`}>
                        {step.text}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          step.status === "완료" ? "text-emerald-500" : "text-[#C02B2B]"
                        }`}
                      >
                        {step.status === "완료" ? "완료" : `${step.time}초`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

