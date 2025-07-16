"use client"

import { useGame } from "@/lib/game-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShopItemCard } from "@/components/shop-item-card"
import { motion } from "framer-motion"
import { Gem } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DragonSkinCard } from "@/components/dragon-skin-card"
import { PlayerSkinCard } from "@/components/player-skin-card"
import Link from "next/link"

export default function ShopPage() {
  const { player, shopItems, dragonSkins, playerSkins } = useGame()

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

  const eggItems = shopItems.filter((item) => item.type === "egg")
  const foodPotionSkillItems = shopItems.filter(
    (item) => item.type === "food" || item.type === "potion" || item.type === "skill",
  )
  const gachaItems = shopItems.filter((item) => item.type === "gacha_roll")

  return (
    <motion.div className="p-4 md:p-6 lg:p-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.h2 className="text-4xl font-bold text-fantasy-gold mb-8 font-magic text-glow shadow-fantasy-gold/50">
        Cửa Hàng Rồng
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

      <Tabs defaultValue="items" className="w-full">
        <motion.div variants={itemVariants}>
          <TabsList className="grid w-full grid-cols-4 bg-muted/50 border border-border rounded-lg p-1 mb-6">
            <TabsTrigger
              value="items"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/30 rounded-md font-semibold"
            >
              Vật Phẩm
            </TabsTrigger>
            <TabsTrigger
              value="eggs"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/30 rounded-md font-semibold"
            >
              Trứng Rồng
            </TabsTrigger>
            <TabsTrigger
              value="dragon-skins"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/30 rounded-md font-semibold"
            >
              Skin Rồng
            </TabsTrigger>
            <TabsTrigger
              value="player-skins"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:shadow-primary/30 rounded-md font-semibold"
            >
              Skin Nhân Vật
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="items">
          <motion.h3 className="text-3xl font-bold text-fantasy-gold mb-6 font-magic text-glow shadow-fantasy-gold/50">
            Vật Phẩm & Kỹ Năng
          </motion.h3>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {foodPotionSkillItems.map((item) => (
              <ShopItemCard key={item.id} item={item} />
            ))}
            {gachaItems.map((item) => (
              <Link href="/gacha" key={item.id}>
                <ShopItemCard item={item} />
              </Link>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="eggs">
          <motion.h3 className="text-3xl font-bold text-fantasy-gold mb-6 font-magic text-glow shadow-fantasy-gold/50">
            Trứng Rồng
          </motion.h3>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {eggItems.map((item) => (
              <ShopItemCard key={item.id} item={item} />
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="dragon-skins">
          <motion.h3 className="text-3xl font-bold text-fantasy-gold mb-6 font-magic text-glow shadow-fantasy-gold/50">
            Skin Rồng
          </motion.h3>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {dragonSkins.map((skin) => (
              <DragonSkinCard key={skin.id} skin={skin} />
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="player-skins">
          <motion.h3 className="text-3xl font-bold text-fantasy-gold mb-6 font-magic text-glow shadow-fantasy-gold/50">
            Skin Nhân Vật
          </motion.h3>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {playerSkins.map((skin) => (
              <PlayerSkinCard key={skin.id} skin={skin} />
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
