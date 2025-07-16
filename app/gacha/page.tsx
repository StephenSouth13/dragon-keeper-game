"use client"

import { CardDescription } from "@/components/ui/card"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gem, Sparkles } from "lucide-react"
import { useGame, type Dragon } from "@/lib/game-context"
import Image from "next/image"
import { DragonCard } from "@/components/dragon-card"

export default function GachaPage() {
  const { player, rollGacha } = useGame()
  const [isRolling, setIsRolling] = useState(false)
  const [lastRolledDragon, setLastRolledDragon] = useState<Dragon | null>(null)

  const handleRollGacha = async () => {
    if (isRolling) return
    setIsRolling(true)
    setLastRolledDragon(null)

    // Simulate gacha animation/delay
    await new Promise((resolve) => setTimeout(resolve, 2000)) // 2 seconds animation

    const newDragon = rollGacha()
    setLastRolledDragon(newDragon)
    setIsRolling(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const gachaRollVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.5, type: "spring", stiffness: 100 } },
    rolling: {
      scale: [1, 1.1, 1],
      rotate: [0, 360],
      transition: { repeat: Number.POSITIVE_INFINITY, duration: 0.5, ease: "linear" },
    },
    reveal: {
      scale: [0.8, 1.2, 1],
      rotate: [0, 360, 0],
      transition: { duration: 0.8, type: "spring", stiffness: 150 },
    },
  }

  return (
    <motion.div className="p-4 md:p-6 lg:p-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.h2 className="text-4xl font-bold text-fantasy-gold mb-8 font-magic text-glow shadow-fantasy-gold/50">
        Quay Gacha Rồng
      </motion.h2>

      <motion.div variants={itemVariants} className="mb-8">
        <Card className="bg-card border border-border shadow-lg shadow-fantasy-gold/20 max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="font-magic text-2xl text-fantasy-gold">Ví Của Bạn</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center text-4xl font-bold text-fantasy-gold">
            <Gem className="h-8 w-8 mr-2 text-fantasy-gold" />
            {player.coins} Coin
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col items-center justify-center mb-8">
        <Card className="bg-card border border-border shadow-lg shadow-fantasy-purple/20 p-6 text-center max-w-lg w-full">
          <CardTitle className="font-magic text-3xl text-fantasy-gold mb-4">Quay Để Nhận Rồng Mới!</CardTitle>
          <CardDescription className="text-fantasy-light/80 mb-6">
            Mỗi lượt quay tốn 250 Coin. Bạn có thể nhận được một chú rồng ngẫu nhiên từ hồ gacha.
          </CardDescription>
          <div className="relative w-48 h-48 mx-auto mb-8">
            <AnimatePresence mode="wait">
              {isRolling ? (
                <motion.div
                  key="rolling"
                  variants={gachaRollVariants}
                  initial="hidden"
                  animate="rolling"
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Image
                    src="/placeholder.svg?height=200&width=200"
                    alt="Rolling Gacha"
                    width={150}
                    height={150}
                    className="animate-spin-slow"
                  />
                  <Sparkles className="absolute h-24 w-24 text-fantasy-gold animate-pulse" />
                </motion.div>
              ) : lastRolledDragon ? (
                <motion.div
                  key="revealed"
                  variants={gachaRollVariants}
                  initial="hidden"
                  animate="reveal"
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Image
                    src={lastRolledDragon.image || "/placeholder.svg"}
                    alt={lastRolledDragon.name}
                    width={150}
                    height={150}
                    className="rounded-full border-4 border-fantasy-gold p-1 shadow-lg shadow-fantasy-gold/50"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="initial"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Image
                    src="/placeholder.svg?height=200&width=200"
                    alt="Gacha Orb"
                    width={150}
                    height={150}
                    className="opacity-50"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Button
            onClick={handleRollGacha}
            disabled={isRolling || player.coins < 250}
            size="lg"
            className="px-8 py-4 text-lg rounded-full bg-fantasy-blue hover:bg-fantasy-blue/80 text-fantasy-light font-bold shadow-lg shadow-fantasy-blue/50 transition-all duration-300 hover:scale-105 animate-glow"
            style={{ "--tw-shadow-color": "hsl(200 80% 50%)" } as React.CSSProperties}
          >
            {isRolling ? "Đang quay..." : `Quay (250 Coin)`}
          </Button>
        </Card>
      </motion.div>

      <AnimatePresence>
        {lastRolledDragon && !isRolling && (
          <motion.div
            key="last-dragon-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="mt-12 flex justify-center"
          >
            <DragonCard dragon={lastRolledDragon} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
