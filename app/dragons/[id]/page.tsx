"use client"

import type React from "react"

import { useParams } from "next/navigation"
import { useGame } from "@/lib/game-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { motion } from "framer-motion"
import { Flame, Snowflake, Ghost, Leaf, Sun, Heart, Swords, Shield, Clock, Sparkles, Zap } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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

export default function DragonDetailPage() {
  const params = useParams()
  const dragonId = params.id as string
  const { dragons, dragonSkins, feedDragon, trainDragon, evolveDragon, equipDragonSkin } = useGame()

  const dragon = dragons.find((d) => d.id === dragonId)

  if (!dragon) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] text-fantasy-red text-2xl font-bold font-magic">
        Rồng không tìm thấy!
      </div>
    )
  }

  const Icon = speciesIcons[dragon.species] || Sun

  const formatTime = (seconds: number) => {
    if (seconds === 0) return "Sẵn sàng"
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes > 0 ? `${minutes}m ` : ""}${remainingSeconds}s`
  }

  const equippedSkin = dragon.equippedSkinId ? dragonSkins.find((s) => s.id === dragon.equippedSkinId) : undefined
  const availableSkins = dragonSkins.filter((s) => s.id !== dragon.equippedSkinId)

  return (
    <motion.div
      className="p-4 md:p-6 lg:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TooltipProvider>
        <motion.h2 className="text-4xl font-bold text-fantasy-gold mb-8 font-magic text-glow shadow-fantasy-gold/50">
          Chi tiết Rồng: {dragon.name}
        </motion.h2>

        <Card className="bg-card border border-border shadow-lg shadow-fantasy-purple/20 max-w-3xl mx-auto">
          <CardHeader className="flex flex-col items-center text-center pb-4">
            <div className="relative w-48 h-48 md:w-64 md:h-64 mb-4">
              <Image
                src={equippedSkin?.image || dragon.image || "/placeholder.svg"}
                alt={dragon.name}
                layout="fill"
                objectFit="contain"
                className="rounded-full border-4 border-fantasy-purple p-2 shadow-xl shadow-fantasy-purple/50"
              />
            </div>
            <CardTitle className="font-magic text-4xl text-fantasy-gold text-glow shadow-fantasy-gold/50">
              {dragon.name}
            </CardTitle>
            <CardDescription className="text-lg text-fantasy-light/80">
              Cấp độ: {dragon.level} | Loài:{" "}
              <span className="inline-flex items-center gap-1">
                <Icon className="h-5 w-5 text-fantasy-gold" /> {dragon.species}
              </span>
            </CardDescription>
            {equippedSkin && (
              <p className="text-sm text-muted-foreground mt-1">
                Skin: <span className="font-semibold text-fantasy-blue">{equippedSkin.name}</span>
              </p>
            )}
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <p className="text-muted-foreground text-center mb-6 italic">{dragon.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-muted p-4 rounded-lg border border-border">
                <h4 className="font-bold text-fantasy-gold mb-2">Chỉ số</h4>
                <ul className="space-y-1 text-fantasy-light/90">
                  <li className="flex items-center justify-between">
                    <span>
                      <Heart className="inline-block h-4 w-4 mr-2 text-red-500" />
                      HP:
                    </span>
                    <span>
                      {dragon.currentHp}/{dragon.maxHp}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>
                      <Swords className="inline-block h-4 w-4 mr-2 text-primary" />
                      Tấn công:
                    </span>
                    <span>{dragon.attack}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>
                      <Shield className="inline-block h-4 w-4 mr-2 text-primary" />
                      Phòng thủ:
                    </span>
                    <span>{dragon.defense}</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>
                      <Zap className="inline-block h-4 w-4 mr-2 text-blue-500" />
                      Năng lượng:
                    </span>
                    <span>
                      {dragon.currentEnergy}/{dragon.maxEnergy}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-muted p-4 rounded-lg border border-border">
                <h4 className="font-bold text-fantasy-gold mb-2">Tiến độ</h4>
                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
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
                {dragon.evolutionLevel && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Tiến hóa:</span>
                      <span>
                        Cấp {dragon.level}/{dragon.evolutionLevel}
                      </span>
                    </div>
                    <Progress
                      value={(dragon.level / dragon.evolutionLevel) * 100}
                      className="h-2 bg-purple-900 [&::-webkit-progress-bar]:bg-purple-500 [&::-webkit-progress-value]:bg-purple-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <h4 className="font-bold text-fantasy-gold mb-4 text-center font-magic">Kỹ năng</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {dragon.skills.length === 0 ? (
                <p className="col-span-full text-center text-muted-foreground">Rồng này chưa học kỹ năng nào.</p>
              ) : (
                dragon.skills.map((skill) => {
                  const Icon = skillIcons[skill.icon as keyof typeof skillIcons] || Sparkles
                  return (
                    <div
                      key={skill.id}
                      className="bg-muted p-4 rounded-lg border border-border flex items-center gap-3"
                    >
                      <Icon className="h-6 w-6 text-fantasy-blue" />
                      <div>
                        <h5 className="font-semibold text-fantasy-light">{skill.name}</h5>
                        <p className="text-sm text-muted-foreground">{skill.description}</p>
                        <p className="text-xs text-muted-foreground">Năng lượng: {skill.energyCost}</p>
                        {skill.isHidden && <p className="text-xs text-fantasy-gold">Kỹ năng ẩn!</p>}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => feedDragon(dragon.id)}
                    disabled={dragon.cooldowns.feed > 0}
                    className="w-full rounded-xl bg-green-600 hover:bg-green-600/80 text-fantasy-light shadow-md shadow-green-600/30"
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
                    className="w-full rounded-xl bg-yellow-600 hover:bg-yellow-600/80 text-fantasy-light shadow-md shadow-yellow-600/30"
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
                    className="w-full rounded-xl bg-purple-600 hover:bg-purple-600/80 text-fantasy-light shadow-md shadow-purple-600/30"
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

            <div className="mt-6 flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full max-w-xs rounded-xl border-border text-muted-foreground hover:bg-muted bg-transparent"
                  >
                    {equippedSkin ? `Đổi Skin: ${equippedSkin.name}` : "Trang Bị Skin"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                  {equippedSkin && (
                    <DropdownMenuItem onClick={() => equipDragonSkin(dragon.id, undefined)}>
                      Gỡ Skin ({equippedSkin.name})
                    </DropdownMenuItem>
                  )}
                  {availableSkins.length > 0 ? (
                    availableSkins.map((skin) => (
                      <DropdownMenuItem key={skin.id} onClick={() => equipDragonSkin(dragon.id, skin.id)}>
                        {skin.name} (+{skin.statBoost?.attack || 0} ATK, +{skin.statBoost?.defense || 0} DEF, +
                        {skin.statBoost?.hp || 0} HP)
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>Không có skin khác</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>
    </motion.div>
  )
}
