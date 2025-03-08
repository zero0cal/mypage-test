"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { Sparkles } from "lucide-react"

interface PhoneMockupProps {
  videoSrc: string
  isLoading?: boolean
  loadingStep?: number
  totalSteps?: number
  stepText?: string
  className?: string
  delay?: number
  onVideoPlay?: () => void
}

export default function PhoneMockup({
  videoSrc,
  isLoading = false,
  loadingStep = 0,
  totalSteps = 4,
  stepText = "",
  className = "",
  delay = 0,
  onVideoPlay,
}: PhoneMockupProps) {
  const [videoKey, setVideoKey] = useState(0)
  const [showVideo, setShowVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // 로딩 상태가 변경될 때마다 비디오 표시 여부 결정
  useEffect(() => {
    if (isLoading) {
      setShowVideo(false)
    } else {
      // 로딩이 완료되면 비디오 키를 변경하여 새로운 비디오 로드
      setVideoKey((prev) => prev + 1)
      // 약간의 지연 후 비디오 표시
      const timer = setTimeout(() => {
        setShowVideo(true)
        // 비디오 자동 재생
        if (videoRef.current) {
          videoRef.current
            .play()
            .then(() => {
              if (onVideoPlay) onVideoPlay()
            })
            .catch((err) => console.error("Video play failed:", err))
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isLoading, onVideoPlay])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={`relative ${className}`}
    >
      <div className="relative w-[300px] h-[600px] rounded-[40px] bg-black shadow-2xl overflow-hidden border-[6px] border-black">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black z-20 rounded-b-3xl" />

        {/* Screen Content */}
        <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-gray-900">
          {/* Loading Overlay */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-b from-gray-900/90 to-gray-900/50 backdrop-blur-sm"
            >
              <div className="text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>

                {/* Progress Indicator */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-white/90">
                    {stepText || `단계 ${loadingStep + 1}/${totalSteps}`}
                  </div>
                  <div className="w-32 h-1 mx-auto bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white"
                      initial={{ width: "0%" }}
                      animate={{ width: `${((loadingStep + 1) / totalSteps) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Video */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: showVideo ? 1 : 0 }} transition={{ duration: 0.5 }}>
            {showVideo && (
              <video
                ref={videoRef}
                key={videoKey}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                onPlay={() => onVideoPlay && onVideoPlay()}
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
            )}
          </motion.div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
      </div>
    </motion.div>
  )
}

