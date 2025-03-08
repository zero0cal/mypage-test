"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Zap } from "lucide-react"

interface CreateVideoButtonProps {
  onClick: () => void
  credits: number
}

export default function CreateVideoButton({ onClick, credits }: CreateVideoButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // 마우스 위치에 따른 그라데이션 효과
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
          gradientFrom: "from-[#FF4B4B]",
          gradientTo: "to-[#FF7676]",
          innerFrom: "from-[#FF3A3A]",
          innerTo: "to-[#FF6B6B]",
          hoverShadow: "hover:shadow-red-500/20",
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

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative w-full" layout>
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseMove={handleMouseMove}
        className={`group relative w-full overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br ${buttonConfig.gradientFrom} ${buttonConfig.gradientTo} p-1 shadow-xl transition-all duration-300 hover:shadow-2xl ${buttonConfig.hoverShadow}`}
        layout
      >
        {/* 내부 컨테이너 */}
        <motion.div
          className={`relative z-10 flex items-center justify-between rounded-xl bg-gradient-to-br ${buttonConfig.innerFrom} ${buttonConfig.innerTo} px-6 py-5 transition-all duration-300`}
          layout
        >
          {/* 왼쪽: 아이콘과 텍스트 */}
          <div className="flex items-center gap-4">
            {/* 아이콘 컨테이너 */}
            <div className="relative">
              <motion.div
                className="absolute -inset-1 animate-pulse rounded-full bg-white/20 blur-md"
                animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              ></motion.div>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                {buttonConfig.icon}
              </div>
            </div>

            {/* 텍스트 */}
            <div>
              <motion.h3
                className="text-xl font-bold text-white"
                layout
                key={buttonConfig.text} // 텍스트가 변경될 때 애니메이션 적용
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {buttonConfig.text}
              </motion.h3>
            </div>
          </div>

          {/* 오른쪽: 생성권 정보 */}
          <div className="flex items-center gap-3">
            <motion.div
              className="rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-sm"
              layout
              key={buttonConfig.creditsText} // 텍스트가 변경될 때 애니메이션 적용
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-base font-bold text-white">{buttonConfig.creditsText}</p>
            </motion.div>
            <motion.div
              animate={isHovered ? { x: 5 } : { x: 0 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M4 12H20M20 12L14 6M20 12L14 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
      ></motion.div>
    </motion.div>
  )
}

