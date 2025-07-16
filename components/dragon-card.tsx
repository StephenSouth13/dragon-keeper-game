"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { type Dragon, useGame } from "@/lib/game-context"
import Link from "next/link"
import { motion } from "framer-motion"
import { Flame, Snowflake, Ghost, Leaf, Sun, Heart, Swords, Shield, Clock } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface DragonCardProps {
  dragon: Dragon
}

const speciesIcons = {
  Fire: Flame,
  Ice: Snowflake,
  Dark: Ghost,
  Nature: Leaf,
  Light: Sun,
}

export function DragonCard({ dragon }: DragonCardProps) {
  const { feedDragon, trainDragon, evolveDragon } = useGame()
  const Icon = speciesIcons[dragon.species] || Sun // Default to Sun if not found

  const formatTime = (seconds: number) => {
    if (seconds === 0) return "Sẵn sàng"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes > 0 ? `${minutes}m ` : ""}${remainingSeconds}s`
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <TooltipProvider>
        <Card className="w-full max-w-sm bg-card border border-border shadow-lg shadow-fantasy-purple/20 hover:shadow-fantasy-purple/40 transition-shadow duration-300">
          <CardHeader className="relative pb-0">
            <div className="absolute top-2 right-2 flex items-center gap-1 text-sm text-muted-foreground">
              <Icon className="h-5 w-5 text-fantasy-gold" />
              <span className="font-semibold">{dragon.species}</span>
            </div>
            <CardTitle className="font-magic text-2xl text-fantasy-gold text-glow shadow-fantasy-gold/50">
              {dragon.name}
            </CardTitle>
            <CardDescription className="text-fantasy-light/80">Cấp độ: {dragon.level}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center p-4">
            <div className="relative w-32 h-32 mb-4">
              <Image
                src={dragon.image || "/placeholder.svg"}
                alt={dragon.name}
                layout="fill"
                objectFit="contain"
                className="rounded-full border-2 border-fantasy-purple p-1 shadow-md shadow-fantasy-purple/30"
              />
            </div>
            <div className="w-full text-sm text-muted-foreground mb-2">
              <div className="flex items-center justify-between mb-1">
                <span>HP:</span>
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-red-500" /> {dragon.currentHp}/{dragon.maxHp}
                </span>
              </div>
              <Progress
                value={(dragon.currentHp / dragon.maxHp) * 100}
                className="h-2 bg-red-900 [&::-webkit-progress-bar]:bg-red-500 [&::-webkit-progress-value]:bg-red-500"
              />
            </div>
            <div className="w-full text-sm text-muted-foreground mb-2">
              <div className="flex items-center justify-between mb-1">
                <span>XP:</span>
                <span>
                  {dragon.xp}/{dragon.level * 50}
                </span>
              </div>
              <Progress
                value={(dragon.xp / (dragon.level * 50)) * 100}
                className="h-2 bg-blue-900 [&::-webkit-progress-bar]:bg-blue-500 [&::-webkit-progress-value]:bg-blue-500"
              />
            </div>
            <div className="w-full grid grid-cols-2 gap-2 text-sm text-muted-foreground mt-2">
              <div className="flex items-center gap-1">
                <Swords className="h-4 w-4 text-primary" /> Tấn công: {dragon.attack}
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-primary" /> Phòng thủ: {dragon.defense}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 italic text-center">
              {dragon.description.substring(0, 70)}...
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 p-4 pt-0">
            <Link href={`/dragons/${dragon.id}`} className="w-full">
              <Button
                variant="secondary"
                className="w-full rounded-xl bg-fantasy-blue hover:bg-fantasy-blue/80 text-fantasy-light shadow-md shadow-fantasy-blue/30"
              >
                Chi tiết
              </Button>
            </Link>
            <div className="grid grid-cols-3 gap-2 w-full">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => feedDragon(dragon.id)}
                    disabled={dragon.cooldowns.feed > 0}
                    className="rounded-xl bg-green-600 hover:bg-green-600/80 text-fantasy-light shadow-md shadow-green-600/30"
                  >
                    {dragon.cooldowns.feed > 0 ? <Clock className="h-4 w-4" /> : "Cho ăn"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {dragon.cooldowns.feed > 0
                    ? `Hồi chiêu: ${formatTime(dragon.cooldowns.feed)}`
                    : "Cho rồng ăn để hồi máu."}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => trainDragon(dragon.id)}
                    disabled={dragon.cooldowns.train > 0}
                    className="rounded-xl bg-yellow-600 hover:bg-yellow-600/80 text-fantasy-light shadow-md shadow-yellow-600/30"
                  >
                    {dragon.cooldowns.train > 0 ? <Clock className="h-4 w-4" /> : "Huấn luyện"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {dragon.cooldowns.train > 0
                    ? `Hồi chiêu: ${formatTime(dragon.cooldowns.train)}`
                    : "Huấn luyện rồng để tăng XP và chỉ số."}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => evolveDragon(dragon.id)}
                    disabled={
                      dragon.cooldowns.evolve > 0 || dragon.level < dragon.evolutionLevel || !dragon.nextEvolutionId
                    }
                    className="rounded-xl bg-purple-600 hover:bg-purple-600/80 text-fantasy-light shadow-md shadow-purple-600/30"
                  >
                    {dragon.cooldowns.evolve > 0 ? <Clock className="h-4 w-4" /> : "Tiến hóa"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {dragon.cooldowns.evolve > 0
                    ? `Hồi chiêu: ${formatTime(dragon.cooldowns.evolve)}`
                    : dragon.level < dragon.evolutionLevel
                      ? `Cần cấp ${dragon.evolutionLevel} để tiến hóa`
                      : !dragon.nextEvolutionId
                        ? "Không có dạng tiến hóa tiếp theo"
                        : "Tiến hóa rồng thành dạng mạnh mẽ hơn."}
                </TooltipContent>
              </Tooltip>
            </div>
          </CardFooter>
        </Card>
      </TooltipProvider>
    </motion.div>
  )
}
