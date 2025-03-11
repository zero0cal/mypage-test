"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Zap, ArrowRight } from "lucide-react"

interface CreateVideoButtonProps {
  onClick: () => void
  credits: number
  isPremiumPlus?: boolean // 프리미엄+ 구독자 여부
}

export default function CreateVideoButton({ onClick, credits, isPremiumPlus = false }: CreateVideoButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  // 크레딧에 따른 버튼 스타일 및 텍스트 설정
  const buttonConfig =
    credits > 0
      ? {
          text: "영상 생성하기",
          icon: <Sparkles className="h-6 w-6 text-white" />,
          gradientFrom: isPremiumPlus ? "from-[#FF4B4B]" : "from-[#FF4B4B]",
          gradientTo: isPremiumPlus ? "to-[#FF7676]" : "to-[#FF7676]",
          innerFrom: isPremiumPlus ? "from-[#FF3A3A]" : "from-[#FF3A3A]",
          innerTo: isPremiumPlus ? "to-[#FF6B6B]" : "to-[#FF6B6B]",
          hoverShadow: isPremiumPlus ? "hover:shadow-red-500/20" : "hover:shadow-red-500/20",
          creditsText: `영상 생성권 ${credits}개 남음`,
        }
      : {
          text: "충전하기",
          icon: <Zap className="h-6 w-6 text-white" />,
          gradientFrom: "from-[#4B7BFF]",
          gradientTo: "to-[#76A8FF]",
          innerFrom: "from-[#3A6BFF]",
          innerTo: "to-[#6B9BFF]",
          hoverShadow: "hover:shadow-blue-500/20",
          creditsText: "영상 생성권이 필요해요",
        }

  // Ruby Diamond 스타일을 위한 추가 클래스
  const rubyDiamondClasses = isPremiumPlus
    ? `
      relative overflow-hidden rounded-xl
      before:absolute before:inset-0 
      before:bg-[url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='50,0 100,50 50,100 0,50' fill='rgba(255,255,255,0.1)'/%3E%3C/svg%3E")]
      before:bg-repeat before:opacity-20
      after:absolute after:inset-0
      after:bg-gradient-to-br after:from-[#FF0000] after:to-[#FF4D4D]
      after:opacity-80
    `
    : ""

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative w-full" layout>
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        className={`
          group relative w-full overflow-hidden
          ${isPremiumPlus ? "rounded-xl" : "rounded-2xl"}
          border ${isPremiumPlus ? "border-[#FFD700]" : "border-white/20"}
          bg-gradient-to-br ${buttonConfig.gradientFrom} ${buttonConfig.gradientTo}
          p-1 shadow-xl transition-all duration-300
          hover:shadow-2xl ${buttonConfig.hoverShadow}
          ${rubyDiamondClasses}
        `}
        layout
      >
        {/* Ruby Diamond 테두리 효과 */}
        {isPremiumPlus && (
          <>
            {/* 외부 테두리 */}
            <div className="absolute inset-0 rounded-xl border-2 border-[#FFD700]" />

            {/* 코너 장식 */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#FFD700]" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#FFD700]" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#FFD700]" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#FFD700]" />

            {/* 빛나는 효과 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />
          </>
        )}

        {/* 내부 컨테이너 */}
        <motion.div
          className={`
            relative z-10 flex items-center justify-between rounded-xl
            bg-gradient-to-br ${buttonConfig.innerFrom} ${buttonConfig.innerTo}
            px-4 sm:px-6 py-4 transition-all duration-300
          `}
          layout
        >
          {/* 왼쪽: 아이콘과 텍스트 */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* 아이콘 컨테이너 */}
            <div className="relative">
              <motion.div
                className="absolute -inset-1 animate-pulse rounded-full bg-white/20 blur-md"
                animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                {buttonConfig.icon}
              </div>
            </div>

            {/* 텍스트 */}
            <motion.h3
              className="text-lg sm:text-xl font-bold text-white whitespace-nowrap"
              layout
              key={buttonConfig.text}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {buttonConfig.text}
            </motion.h3>
          </div>

          {/* 오른쪽: 생성권 정보 */}
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div
              className="rounded-full bg-white/10 px-3 sm:px-4 py-1.5 backdrop-blur-sm"
              layout
              key={buttonConfig.creditsText}
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm sm:text-base font-bold text-white whitespace-nowrap">{buttonConfig.creditsText}</p>
            </motion.div>
            <motion.div
              animate={isHovered ? { x: 5 } : { x: 0 }}
              className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
            >
              <ArrowRight className="w-5 h-5 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* 호버 효과 */}
        <AnimatePresence>
          {isHovered && (
            <>
              {/* 빛나는 효과 */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute inset-0 z-0"
                style={{
                  background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.2) 0%, transparent 60%)`,
                }}
              />

              {/* 파티클 효과 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-0"
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, x: "50%", y: "50%" }}
                    animate={{
                      scale: [1, 2],
                      x: ["50%", `${50 + (Math.random() * 40 - 20)}%`],
                      y: ["50%", `${50 + (Math.random() * 40 - 20)}%`],
                      opacity: [0.8, 0],
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                    className="absolute h-4 w-4 rounded-full bg-white/20 blur-sm"
                  />
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.button>

      {/* 버튼 아래 그림자 효과 */}
      <motion.div
        className={`absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-br ${
          credits > 0 ? "from-red-500 to-red-600" : "from-blue-500 to-blue-600"
        } opacity-50 blur-2xl transition-all duration-300 group-hover:opacity-70`}
        layout
        animate={{
          opacity: isHovered ? 0.7 : 0.5,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

