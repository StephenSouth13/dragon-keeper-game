"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { type ShopItem, useGame } from "@/lib/game-context"
import { motion } from "framer-motion"
import { Gem } from "lucide-react"

interface ShopItemCardProps {
  item: ShopItem
}

export function ShopItemCard({ item }: ShopItemCardProps) {
  const { buyItem, player } = useGame()

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
      <Card className="w-full max-w-xs bg-card border border-border shadow-lg shadow-fantasy-blue/20 hover:shadow-fantasy-blue/40 transition-shadow duration-300">
        <CardHeader className="flex flex-col items-center text-center">
          <div className="relative w-24 h-24 mb-2">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              layout="fill"
              objectFit="contain"
              className="rounded-lg border-2 border-fantasy-blue p-1 shadow-md shadow-fantasy-blue/30"
            />
          </div>
          <CardTitle className="font-magic text-xl text-fantasy-gold text-glow shadow-fantasy-gold/50">
            {item.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-center">
          <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
          <div className="flex items-center justify-center text-lg font-bold text-fantasy-gold">
            <Gem className="h-5 w-5 mr-1 text-fantasy-gold" />
            {item.price}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center p-4 pt-0">
          <Button
            onClick={() => buyItem(item.id)}
            disabled={player.coins < item.price}
            className="w-full rounded-xl bg-fantasy-blue hover:bg-fantasy-blue/80 text-fantasy-light font-bold shadow-md shadow-fantasy-blue/30"
          >
            {player.coins < item.price ? "Không đủ Coin" : "Mua"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
