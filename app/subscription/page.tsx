"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic",
    price: "7,900원",
    features: ["월 3개 영상 제작", "기본 템플릿 사용", "720p 해상도", "기본 고객 지원"],
    highlight: false,
    bgColor: "bg-white",
  },
  {
    id: "premium",
    name: "Premium",
    price: "22,900원",
    features: ["월 10개 영상 제작", "모든 템플릿 사용", "1080p 해상도", "워터마크 없음", "우선 고객 지원"],
    highlight: true,
    bgColor: "bg-[#FFF5F5]",
  },
  {
    id: "premium-plus",
    name: "Premium+",
    price: "38,900원",
    features: ["무제한 영상 제작", "맞춤형 템플릿 제작", "4K 해상도", "우선 고객 지원", "전용 매니저"],
    highlight: false,
    bgColor: "bg-white",
  },
]

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleSubscribe = () => {
    if (selectedPlan) {
      // 구독 처리 로직
      console.log(`Subscribing to ${selectedPlan} plan`)
      // 결제 페이지로 이동 또는 결제 처리
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF5F5] to-white">
      {/* 헤더 */}
      <header className="py-4 px-6 flex items-center justify-between">
        <Link
          href="/mypage"
          className="inline-flex items-center justify-center hover:text-[#A02323] transition-colors group"
        >
          <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">구독 플랜</h1>
        <div className="w-6"></div> {/* 균형을 위한 빈 공간 */}
      </header>

      <main className="container mx-auto px-4 py-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">합리적인 요금제</h2>
            <p className="text-xl text-gray-600">필요한 만큼만 선택하여 사용하세요</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: plan.highlight ? 1.05 : 1.03 }}
                className={`${plan.highlight ? "md:scale-105" : ""}`}
              >
                <Card
                  className={`h-full ${plan.bgColor} ${
                    plan.highlight ? "border-2 border-[#C02B2B]" : "border border-gray-200"
                  } ${selectedPlan === plan.id ? "ring-2 ring-[#C02B2B]" : ""}`}
                >
                  <CardHeader>
                    <CardTitle className={`text-2xl ${plan.highlight ? "text-[#C02B2B]" : ""}`}>{plan.name}</CardTitle>
                    <CardDescription>
                      <span className={`text-3xl font-bold ${plan.highlight ? "text-[#C02B2B]" : "text-gray-900"}`}>
                        {plan.price}
                      </span>
                      <span className="text-sm text-gray-500">/월</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <Check className="h-5 w-5 text-[#C02B2B] mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full ${
                        plan.highlight || selectedPlan === plan.id
                          ? "bg-[#C02B2B] hover:bg-[#A02323] text-white"
                          : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {selectedPlan === plan.id ? "선택됨" : "선택하기"}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* 하단 고정 버튼 */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="max-w-2xl mx-auto px-2">
          <Button
            onClick={handleSubscribe}
            className={`w-full font-bold py-6 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
              selectedPlan
                ? "bg-[#C02B2B] text-white hover:bg-[#A02323]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!selectedPlan}
          >
            {selectedPlan ? "구독하기" : "구독 플랜을 선택해 주세요"}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

