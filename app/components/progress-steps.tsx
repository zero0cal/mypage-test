"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

interface Step {
  text: string
  time: number
  description?: string
}

interface ProgressStepsProps {
  steps: Step[]
  currentStep: number
  countdown: number
}

// ProgressSteps 컴포넌트에 안전 검사 추가
export function ProgressSteps({ steps, currentStep, countdown }: ProgressStepsProps) {
  // 안전 검사 추가
  const safeCurrentStep = currentStep >= 0 && currentStep < steps.length ? currentStep : 0

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`relative flex items-start gap-4 p-4 rounded-xl transition-colors ${
            index === safeCurrentStep ? "bg-red-50" : "hover:bg-gray-50"
          }`}
        >
          {/* Status Circle */}
          <div
            className={`relative flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              index < safeCurrentStep
                ? "bg-[#C02B2B]"
                : index === safeCurrentStep
                  ? "bg-white border-2 border-[#C02B2B]"
                  : "bg-gray-100"
            }`}
          >
            {index < safeCurrentStep ? (
              <Check className="w-5 h-5 text-white" />
            ) : (
              <span className={`text-sm font-medium ${index === safeCurrentStep ? "text-[#C02B2B]" : "text-gray-400"}`}>
                {index + 1}
              </span>
            )}

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute top-8 left-1/2 w-0.5 h-12 -translate-x-1/2 ${
                  index < safeCurrentStep ? "bg-[#C02B2B]" : "bg-gray-200"
                }`}
              />
            )}
          </div>

          {/* Step Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-medium ${index <= safeCurrentStep ? "text-gray-900" : "text-gray-400"}`}>
                {step.text}
              </h4>
              <span
                className={`text-sm font-medium ${
                  index < safeCurrentStep
                    ? "text-emerald-500"
                    : index === safeCurrentStep
                      ? "text-[#C02B2B]"
                      : "text-gray-400"
                }`}
              >
                {index < safeCurrentStep ? "완료" : index === safeCurrentStep ? `${countdown}초` : `${step.time}초`}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  index < safeCurrentStep
                    ? "bg-emerald-500"
                    : index === safeCurrentStep
                      ? "bg-[#C02B2B]"
                      : "bg-gray-200"
                }`}
                initial={{ width: "0%" }}
                animate={{
                  width:
                    index < safeCurrentStep
                      ? "100%"
                      : index === safeCurrentStep
                        ? `${((step.time - countdown) / step.time) * 100}%`
                        : "0%",
                }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Step Description */}
            <p className="mt-2 text-sm text-gray-500">
              {index === safeCurrentStep && "진행 중..."}
              {index < safeCurrentStep && "완료되었습니다"}
              {index > safeCurrentStep && "대기 중..."}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

