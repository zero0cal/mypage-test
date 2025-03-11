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
    isPremiumPlus: true,
  },
]

export default function SubscriptionPage() {
  // selectedPlan 상태의 초기값을 null에서 "basic"으로 변경합니다.
  const [selectedPlan, setSelectedPlan] = useState<string | null>("basic")

  const handleSubscribe = () => {
    if (selectedPlan) {
      // 구독 처리 로직
      console.log(`Subscribing to ${selectedPlan} plan`)
      // 결제 페이지로 이동 또는 결제 처리
    }
  }

  // Ruby Diamond 스타일의 배경 패턴을 위한 CSS 클래스
  const rubyPatternClass = `
    relative overflow-hidden
    before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#FF4D4D] before:to-[#FF0000]
    before:opacity-80 before:transform before:rotate-45
    after:absolute after:inset-0 after:bg-[url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='50,0 100,50 50,100 0,50' fill='rgba(255,255,255,0.1)'/%3E%3C/svg%3E")]
    after:bg-repeat after:opacity-20 after:animate-shine
  `

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
                  className={`relative h-full ${plan.bgColor} ${
                    plan.highlight ? "border-2 border-[#C02B2B]" : "border border-gray-200"
                  } ${selectedPlan === plan.id ? "ring-2 ring-[#C02B2B]" : ""} ${
                    plan.isPremiumPlus ? rubyPatternClass : ""
                  }`}
                >
                  {/* Ruby Diamond 효과를 위한 추가 장식 요소들 */}
                  {plan.isPremiumPlus && (
                    <>
                      {/* 골드 테두리 효과 */}
                      <div className="absolute inset-0 border-2 border-[#FFD700] rounded-lg"></div>

                      {/* 코너 장식 */}
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#FFD700]"></div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#FFD700]"></div>
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#FFD700]"></div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#FFD700]"></div>

                      {/* 빛나는 효과 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine"></div>
                    </>
                  )}

                  <CardHeader className="relative z-10">
                    <CardTitle
                      className={`text-2xl ${plan.isPremiumPlus ? "text-white" : plan.highlight ? "text-[#C02B2B]" : ""}`}
                    >
                      {plan.name}
                    </CardTitle>
                    <CardDescription>
                      <span
                        className={`text-3xl font-bold ${
                          plan.isPremiumPlus ? "text-white" : plan.highlight ? "text-[#C02B2B]" : "text-gray-900"
                        }`}
                      >
                        {plan.price}
                      </span>
                      <span className={`text-sm ${plan.isPremiumPlus ? "text-white/80" : "text-gray-500"}`}>/월</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <Check
                            className={`h-5 w-5 ${plan.isPremiumPlus ? "text-white" : "text-[#C02B2B]"} mr-2 flex-shrink-0`}
                          />
                          <span className={plan.isPremiumPlus ? "text-white" : ""}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="relative z-10">
                    <Button
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full ${
                        plan.isPremiumPlus
                          ? "bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:from-[#FFD700] hover:to-[#FF8C00] text-black shadow-lg"
                          : plan.highlight || selectedPlan === plan.id
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

