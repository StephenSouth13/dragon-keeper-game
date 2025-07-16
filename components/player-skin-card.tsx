"use client"

import { useState } from "react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { type PlayerSkin, useGame } from "@/lib/game-context"
import { motion } from "framer-motion"
import { Gem } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface PlayerSkinCardProps {
  skin: PlayerSkin
}

export function PlayerSkinCard({ skin }: PlayerSkinCardProps) {
  const { buyItem, player } = useGame()
  const [isBought, setIsBought] = useState(false) // Simulate ownership

  const handleBuySkin = () => {
    if (player.coins >= skin.price) {
      // In a real app, you'd add this skin to the player's inventory
      // For now, we'll just simulate purchase and mark as bought
      buyItem(skin.id) // This will deduct coins
      setIsBought(true)
      toast({
        title: "Mua Skin thành công !",
        description: `Bạn đã mua skin ${skin.name}.`,
        variant: "success",
      })
    } else {
      toast({
        title: "Không đủ Coin rồi chiến binh à",
        description: "Bạn không có đủ tiền để mua skin này.",
        variant: "destructive",
      })
    }
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <Card className="w-full max-w-xs bg-card border border-border shadow-lg shadow-fantasy-blue/20 hover:shadow-fantasy-blue/40 transition-shadow duration-300">
        <CardHeader className="flex flex-col items-center text-center">
          <div className="relative w-24 h-24 mb-2">
            <Image
              src={skin.image || "/placeholder.svg"}
              alt={skin.name}
              layout="fill"
              objectFit="contain"
              className="rounded-full border-2 border-fantasy-blue p-1 shadow-md shadow-fantasy-blue/30"
            />
          </div>
          <CardTitle className="font-magic text-xl text-fantasy-gold text-glow shadow-fantasy-gold/50">
            {skin.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-center">
          <p className="text-sm text-muted-foreground mb-4">{skin.description}</p>
          <div className="flex items-center justify-center text-lg font-bold text-fantasy-gold">
            <Gem className="h-5 w-5 mr-1 text-fantasy-gold" />
            {skin.price}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center p-4 pt-0">
          <Button
            onClick={handleBuySkin}
            disabled={player.coins < skin.price || isBought}
            className="w-full rounded-xl bg-fantasy-blue hover:bg-fantasy-blue/80 text-fantasy-light font-bold shadow-md shadow-fantasy-blue/30"
          >
            {isBought ? "Đã Sở Hữu" : player.coins < skin.price ? "Không đủ Coin" : "Mua"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
