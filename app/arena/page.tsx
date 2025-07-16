"use client"

import type React from "react"
import { Shield } from "lucide-react" // Import Shield here

import { useState, useMemo } from "react"
import { useGame, type Dragon, type BattleState } from "@/lib/game-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Swords, Trophy, XCircle, Heart, Zap, Flame, Snowflake, Ghost, Leaf, Sun, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const speciesIcons = {
  Fire: Flame,
  Ice: Snowflake,
  Dark: Ghost,
  Nature: Leaf,
  Light: Sun,
}

const skillIcons: Record<string, React.ElementType> = {
  Flame: Flame,
  Shield: Shield,
  Heart: Heart,
  Ghost: Ghost,
  Leaf: Leaf,
  // Add more skill icons as needed
}

export default function ArenaPage() {
  const { dragons, opponents, startBattle, performBattleAction, skills } = useGame()
  const [selectedPlayerDragon, setSelectedPlayerDragon] = useState<Dragon | null>(null)
  const [selectedOpponent, setSelectedOpponent] = useState<Dragon | null>(null)
  const [battleState, setBattleState] = useState<BattleState | null>(null)
  const [isPerformingAction, setIsPerformingAction] = useState(false)

  const playerDragon = useMemo(() => {
    if (!battleState) return null
    // Find the latest state of the player's dragon from the main game context
    // This ensures HP/XP updates are reflected after battle
    return dragons.find((d) => d.id === battleState.playerDragon.id) || battleState.playerDragon
  }, [battleState, dragons])

  const opponentDragon = useMemo(() => {
    if (!battleState) return null
    return opponents.find((o) => o.id === battleState.opponentDragon.id) || battleState.opponentDragon
  }, [battleState, opponents])

  const handleStartBattle = () => {
    if (selectedPlayerDragon && selectedOpponent) {
      const initialState = startBattle(selectedPlayerDragon.id, selectedOpponent.id)
      setBattleState(initialState)
      toast({
        title: "Bắt đầu chiến đấu!",
        description: `${selectedPlayerDragon.name} vs ${selectedOpponent.name}`,
        variant: "info",
      })
    } else {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn rồng của bạn và đối thủ.",
        variant: "destructive",
      })
    }
  }

  const handlePlayerAction = async (actionType: "attack" | "skill", skillId?: string) => {
    if (!battleState || isPerformingAction || battleState.isBattleOver) return

    setIsPerformingAction(true)
    // Simulate action delay for animation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newState = performBattleAction(battleState, actionType, skillId)
    setBattleState(newState)

    if (newState.isBattleOver) {
      if (newState.result?.winner === "player") {
        toast({
          title: "Chiến thắng!",
          description: newState.result.message,
          variant: "success",
        })
      } else if (newState.result?.winner === "opponent") {
        toast({
          title: "Thất bại!",
          description: newState.result.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Hòa!",
          description: newState.result?.message || "Trận đấu kết thúc hòa.",
          variant: "info",
        })
      }
    }
    setIsPerformingAction(false)
  }

  const resetBattle = () => {
    setSelectedPlayerDragon(null)
    setSelectedOpponent(null)
    setBattleState(null)
    setIsPerformingAction(false)
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

  const dragonCombatVariants = {
    initial: { y: 0 },
    attack: { y: -20, transition: { duration: 0.2, yoyo: 1 } },
    hit: { x: [-5, 5, -5, 5, 0], transition: { duration: 0.4 } },
  }

  const formatTime = (seconds: number) => {
    if (seconds === 0) return "Sẵn sàng"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes > 0 ? `${minutes}m ` : ""}${remainingSeconds}s`
  }

  return (
    <motion.div className="p-4 md:p-6 lg:p-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.h2 className="text-4xl font-bold text-fantasy-gold mb-8 font-magic text-glow shadow-fantasy-gold/50">
        Đấu Trường Rồng
      </motion.h2>

      {!battleState ? (
        <>
          <motion.div variants={itemVariants} className="mb-8">
            <Card className="bg-card border border-border shadow-lg shadow-fantasy-purple/20">
              <CardHeader>
                <CardTitle className="font-magic text-2xl text-fantasy-gold">Chọn Rồng Của Bạn</CardTitle>
                <CardDescription className="text-fantasy-light/80">
                  Chọn một chú rồng để tham gia chiến đấu.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {dragons.length === 0 ? (
                  <p className="col-span-full text-muted-foreground">Bạn chưa có rồng nào để chiến đấu.</p>
                ) : (
                  dragons.map((dragon) => (
                    <motion.div
                      key={dragon.id}
                      className={`cursor-pointer rounded-lg p-2 border-2 ${
                        selectedPlayerDragon?.id === dragon.id
                          ? "border-fantasy-gold shadow-md shadow-fantasy-gold/50"
                          : "border-transparent hover:border-border"
                      } transition-all duration-200`}
                      onClick={() => setSelectedPlayerDragon(dragon)}
                      variants={itemVariants}
                    >
                      <Image
                        src={dragon.image || "/placeholder.svg"}
                        alt={dragon.name}
                        width={100}
                        height={100}
                        className="rounded-full mx-auto mb-2"
                      />
                      <p className="text-center text-sm font-semibold text-fantasy-light">{dragon.name}</p>
                      <p className="text-center text-xs text-muted-foreground">Cấp {dragon.level}</p>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8">
            <Card className="bg-card border border-border shadow-lg shadow-fantasy-red/20">
              <CardHeader>
                <CardTitle className="font-magic text-2xl text-fantasy-gold">Chọn Đối Thủ</CardTitle>
                <CardDescription className="text-fantasy-light/80">Chọn một đối thủ để thách đấu.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {opponents.map((opponent) => (
                  <motion.div
                    key={opponent.id}
                    className={`cursor-pointer rounded-lg p-2 border-2 ${
                      selectedOpponent?.id === opponent.id
                        ? "border-fantasy-red shadow-md shadow-fantasy-red/50"
                        : "border-transparent hover:border-border"
                    } transition-all duration-200`}
                    onClick={() => setSelectedOpponent(opponent)}
                    variants={itemVariants}
                  >
                    <Image
                      src={opponent.image || "/placeholder.svg"}
                      alt={opponent.name}
                      width={100}
                      height={100}
                      className="rounded-full mx-auto mb-2"
                    />
                    <p className="text-center text-sm font-semibold text-fantasy-light">{opponent.name}</p>
                    <p className="text-center text-xs text-muted-foreground">Cấp {opponent.level}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <Button
              onClick={handleStartBattle}
              disabled={!selectedPlayerDragon || !selectedOpponent}
              size="lg"
              className="px-8 py-4 text-lg rounded-full bg-fantasy-red hover:bg-fantasy-red/80 text-fantasy-light font-bold shadow-lg shadow-fantasy-red/50 transition-all duration-300 hover:scale-105 animate-glow"
              style={{ "--tw-shadow-color": "hsl(340 80% 50%)" } as React.CSSProperties}
            >
              <Swords className="mr-2 h-6 w-6" />
              Bắt đầu chiến đấu
            </Button>
          </motion.div>
        </>
      ) : (
        <AnimatePresence mode="wait">
          {!battleState.isBattleOver ? (
            <motion.div
              key="battle-active"
              className="flex flex-col items-center justify-center bg-card p-8 rounded-xl shadow-lg border border-border max-w-4xl mx-auto"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-3xl font-magic text-fantasy-gold mb-6 animate-pulse">
                Lượt {battleState.turn + 1}: {playerDragon?.name} vs {opponentDragon?.name}
              </h3>
              <div className="flex items-center justify-around w-full mb-8">
                <div className="flex flex-col items-center">
                  <motion.div
                    key={playerDragon?.id}
                    variants={dragonCombatVariants}
                    initial="initial"
                    animate={isPerformingAction ? "attack" : "initial"}
                  >
                    <Image
                      src={playerDragon?.image || "/placeholder.svg"}
                      alt={playerDragon?.name || "Player Dragon"}
                      width={150}
                      height={150}
                      className="rounded-full border-4 border-fantasy-purple shadow-lg shadow-fantasy-purple/50"
                    />
                  </motion.div>
                  <p className="text-center mt-2 text-lg font-semibold text-fantasy-light">
                    {playerDragon?.name} (Cấp {playerDragon?.level})
                  </p>
                  <div className="w-full max-w-[150px] mt-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>HP:</span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" /> {battleState.playerCurrentHp}/{playerDragon?.maxHp}
                      </span>
                    </div>
                    <Progress
                      value={(battleState.playerCurrentHp / (playerDragon?.maxHp || 1)) * 100}
                      className="h-2 bg-red-900 [&::-webkit-progress-bar]:bg-red-500 [&::-webkit-progress-value]:bg-red-500"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
                      <span>Năng lượng:</span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-4 w-4 text-blue-500" /> {battleState.playerCurrentEnergy}/
                        {playerDragon?.maxEnergy}
                      </span>
                    </div>
                    <Progress
                      value={(battleState.playerCurrentEnergy / (playerDragon?.maxEnergy || 1)) * 100}
                      className="h-2 bg-blue-900 [&::-webkit-progress-bar]:bg-blue-500 [&::-webkit-progress-value]:bg-blue-500"
                    />
                  </div>
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <Swords className="h-16 w-16 text-fantasy-gold animate-bounce" />
                </motion.div>

                <div className="flex flex-col items-center">
                  <motion.div
                    key={opponentDragon?.id}
                    variants={dragonCombatVariants}
                    initial="initial"
                    animate={isPerformingAction ? "hit" : "initial"}
                  >
                    <Image
                      src={opponentDragon?.image || "/placeholder.svg"}
                      alt={opponentDragon?.name || "Opponent Dragon"}
                      width={150}
                      height={150}
                      className="rounded-full border-4 border-fantasy-red shadow-lg shadow-fantasy-red/50"
                    />
                  </motion.div>
                  <p className="text-center mt-2 text-lg font-semibold text-fantasy-light">
                    {opponentDragon?.name} (Cấp {opponentDragon?.level})
                  </p>
                  <div className="w-full max-w-[150px] mt-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>HP:</span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" /> {battleState.opponentCurrentHp}/
                        {opponentDragon?.maxHp}
                      </span>
                    </div>
                    <Progress
                      value={(battleState.opponentCurrentHp / (opponentDragon?.maxHp || 1)) * 100}
                      className="h-2 bg-red-900 [&::-webkit-progress-bar]:bg-red-500 [&::-webkit-progress-value]:bg-red-500"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
                      <span>Năng lượng:</span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-4 w-4 text-blue-500" /> {battleState.opponentCurrentEnergy}/
                        {opponentDragon?.maxEnergy}
                      </span>
                    </div>
                    <Progress
                      value={(battleState.opponentCurrentEnergy / (opponentDragon?.maxEnergy || 1)) * 100}
                      className="h-2 bg-blue-900 [&::-webkit-progress-bar]:bg-blue-500 [&::-webkit-progress-value]:bg-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full mb-6">
                <h4 className="text-xl font-magic text-fantasy-gold mb-3 text-center">Hành Động Của Bạn</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handlePlayerAction("attack")}
                    disabled={isPerformingAction}
                    className="px-6 py-3 text-lg rounded-full bg-primary hover:bg-primary/80 text-fantasy-light font-bold shadow-md shadow-primary/30"
                  >
                    Tấn Công Cơ Bản
                  </Button>
                  <TooltipProvider>
                    <div className="grid grid-cols-2 gap-2">
                      {playerDragon?.skills.map((skill) => {
                        const Icon = skillIcons[skill.icon as keyof typeof skillIcons] || Flame
                        const onCooldown = (playerDragon.cooldowns.skill?.[skill.id] || 0) > 0
                        const notEnoughEnergy = battleState.playerCurrentEnergy < skill.energyCost
                        const disabled = isPerformingAction || onCooldown || notEnoughEnergy

                        return (
                          <Tooltip key={skill.id}>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={() => handlePlayerAction("skill", skill.id)}
                                disabled={disabled}
                                className="px-4 py-3 text-md rounded-full bg-accent hover:bg-accent/80 text-fantasy-light font-bold shadow-md shadow-accent/30 flex items-center justify-center gap-2"
                              >
                                <Icon className="h-5 w-5" />
                                {skill.name}
                                {onCooldown && <Clock className="h-4 w-4 ml-1" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{skill.description}</p>
                              <p>Năng lượng: {skill.energyCost}</p>
                              {onCooldown && (
                                <p>Hồi chiêu: {formatTime(playerDragon.cooldowns.skill?.[skill.id] || 0)}</p>
                              )}
                              {notEnoughEnergy && <p className="text-red-400">Không đủ năng lượng!</p>}
                            </TooltipContent>
                          </Tooltip>
                        )
                      })}
                    </div>
                  </TooltipProvider>
                </div>
              </div>

              <div className="w-full bg-muted p-4 rounded-lg max-h-48 overflow-y-auto text-sm text-muted-foreground">
                <h4 className="font-semibold text-fantasy-gold mb-2">Nhật Ký Chiến Đấu:</h4>
                {battleState.log.map((entry, index) => (
                  <p key={index} className="mb-1">
                    {entry}
                  </p>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="battle-result"
              className={`flex flex-col items-center justify-center p-8 rounded-xl shadow-lg border max-w-2xl mx-auto mt-8 ${
                battleState.result?.winner === "player"
                  ? "bg-green-900/30 border-green-600 shadow-green-600/30"
                  : battleState.result?.winner === "opponent"
                    ? "bg-red-900/30 border-red-600 shadow-red-600/30"
                    : "bg-blue-900/30 border-blue-600 shadow-blue-600/30"
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              {battleState.result?.winner === "player" ? (
                <Trophy className="h-20 w-20 text-green-500 mb-4 animate-bounce" />
              ) : battleState.result?.winner === "opponent" ? (
                <XCircle className="h-20 w-20 text-red-500 mb-4 animate-shake" />
              ) : (
                <Swords className="h-20 w-20 text-blue-500 mb-4" />
              )}
              <h3 className="text-4xl font-magic text-fantasy-gold mb-4">
                {battleState.result?.winner === "player"
                  ? "Chiến Thắng!"
                  : battleState.result?.winner === "opponent"
                    ? "Thất Bại!"
                    : "Hòa!"}
              </h3>
              <p className="text-lg text-fantasy-light/90 text-center mb-4">{battleState.result?.message}</p>
              {battleState.result?.winner === "player" && (
                <div className="text-md text-fantasy-gold">
                  <p>+ {battleState.result.rewardCoins} Coin</p>
                  <p>+ {battleState.result.rewardXp} XP</p>
                </div>
              )}
              <Button
                onClick={resetBattle}
                className="mt-6 rounded-full bg-primary hover:bg-primary/80 text-fantasy-light shadow-md shadow-primary/30"
              >
                Tiếp tục
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  )
}
