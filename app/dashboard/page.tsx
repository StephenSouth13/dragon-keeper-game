"use client"

import { useGame } from "@/lib/game-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { DragonCard } from "@/components/dragon-card"
import { motion } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { player, dragons, playerSkins, equipPlayerSkin } = useGame()

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

  const equippedPlayerSkin = player.equippedSkinId ? playerSkins.find((s) => s.id === player.equippedSkinId) : undefined
  const availablePlayerSkins = playerSkins.filter((s) => s.id !== player.equippedSkinId)

  return (
    <motion.div className="p-4 md:p-6 lg:p-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.h2 className="text-4xl font-bold text-fantasy-gold mb-8 font-magic text-glow shadow-fantasy-gold/50">
        Dashboard Game
      </motion.h2>

      <motion.div variants={itemVariants}>
        <Card className="mb-8 bg-card border border-border shadow-lg shadow-fantasy-purple/20">
          <CardHeader className="flex flex-row items-center space-x-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-fantasy-gold shadow-md shadow-fantasy-gold/30">
                <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.name} />
                <AvatarFallback className="text-3xl font-bold text-fantasy-gold bg-fantasy-purple">
                  {player.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-background border-border"
                  >
                    <span className="sr-only">Đổi skin nhân vật</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-shirt h-4 w-4"
                    >
                      <path d="M20.3 1.7a2.4 2.4 0 0 1 3 3L7.3 20.7a2.4 2.4 0 0 1-3 3L.7 3.7a2.4 2.4 0 0 1 3-3Z" />
                      <path d="m6 15 7 7" />
                      <path d="m10 11 7 7" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                  {equippedPlayerSkin && (
                    <DropdownMenuItem onClick={() => equipPlayerSkin(undefined)}>
                      Gỡ Skin ({equippedPlayerSkin.name})
                    </DropdownMenuItem>
                  )}
                  {availablePlayerSkins.length > 0 ? (
                    availablePlayerSkins.map((skin) => (
                      <DropdownMenuItem key={skin.id} onClick={() => equipPlayerSkin(skin.id)}>
                        {skin.name}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>Không có skin khác</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              <CardTitle className="text-3xl font-magic text-fantasy-gold text-glow shadow-fantasy-gold/50">
                {player.name}
              </CardTitle>
              <p className="text-lg text-fantasy-light/80">Cấp độ: {player.level}</p>
              <p className="text-lg text-fantasy-gold">Coin: {player.coins}</p>
              {equippedPlayerSkin && (
                <p className="text-sm text-muted-foreground mt-1">
                  Skin: <span className="font-semibold text-fantasy-blue">{equippedPlayerSkin.name}</span>
                </p>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-2">
              <div className="flex items-center justify-between mb-1">
                <span>Điểm kinh nghiệm:</span>
                <span>
                  {player.xp}/{player.level * 100}
                </span>
              </div>
              <Progress
                value={(player.xp / (player.level * 100)) * 100}
                className="h-3 bg-green-900 [&::-webkit-progress-bar]:bg-green-500 [&::-webkit-progress-value]:bg-green-500"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.h3 className="text-3xl font-bold text-fantasy-gold mb-6 font-magic text-glow shadow-fantasy-gold/50">
        Rồng của bạn
      </motion.h3>
      {dragons.length === 0 ? (
        <motion.p variants={itemVariants} className="text-lg text-muted-foreground">
          Bạn chưa sở hữu chú rồng nào. Hãy đến Cửa Hàng để mua trứng rồng!
        </motion.p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {dragons.map((dragon) => (
            <DragonCard key={dragon.id} dragon={dragon} />
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
