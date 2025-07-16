"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { toast } from "@/hooks/use-toast"
import { LucideIcon } from "lucide-react" // Đây là type hoặc component cho các icon Lucide
import Image from "next/image" // Import component Image từ Next.js

// --- Types ---
export type DragonSpecies = "Fire" | "Ice" | "Dark" | "Light" | "Nature"
export type DragonStatus = "Healthy" | "Hungry" | "Tired" | "Injured" | "Evolving"

export interface Skill {
  id: string
  name: string
  description: string
  type: "attack" | "heal" | "buff" | "debuff"
  damage?: number // For attack skills
  heal?: number // For heal skills
  energyCost: number
  cooldown: number // in seconds
  icon: string // Lucide icon name (e.g., "Flame", "Shield")
  isHidden?: boolean // For hidden skills
}

export interface Dragon {
  id: string
  name: string
  species: DragonSpecies
  level: number
  xp: number
  maxHp: number
  currentHp: number
  attack: number
  defense: number
  image: string
  status: DragonStatus
  description: string
  evolutionLevel: number // Level at which it can evolve
  nextEvolutionId?: string // ID of the next evolution form
  cooldowns: {
    feed: number
    train: number
    evolve: number
    skill?: Record<string, number> // Cooldowns for individual skills
  }
  skills: Skill[] // List of skills the dragon knows
  currentEnergy: number
  maxEnergy: number
  equippedSkinId?: string // ID of the equipped skin
}

export interface Player {
  id: string
  name: string
  avatar: string
  level: number
  xp: number
  coins: number
  equippedSkinId?: string // ID of the equipped player avatar skin
}

export interface ShopItem {
  id: string
  name: string
  type: "egg" | "food" | "skill" | "potion" | "dragon_skin" | "player_skin" | "gacha_roll"
  price: number
  image: string
  description: string
  effect?: any // Specific effect for the item
}

export interface DragonSkin {
  id: string
  name: string
  image: string
  price: number
  description: string
  statBoost?: {
    attack?: number
    defense?: number
    hp?: number
  }
}

export interface PlayerSkin {
  id: string
  name: string
  image: string
  price: number
  description: string
}

export interface BattleResult {
  winner: "player" | "opponent" | "draw"
  rewardCoins: number
  rewardXp: number
  message: string
  log: string[]
}

export interface BattleState {
  playerDragon: Dragon
  opponentDragon: Dragon
  playerCurrentHp: number
  opponentCurrentHp: number
  playerCurrentEnergy: number
  opponentCurrentEnergy: number
  turn: number
  log: string[]
  isBattleOver: boolean
  result?: BattleResult
}

// --- Mock Data ---
const MOCK_PLAYER: Player = {
  id: "player-1",
  name: "Dragon Master",
  avatar: "/placeholder.svg?height=100&width=100",
  level: 1,
  xp: 0,
  coins: 1000,
  equippedSkinId: undefined,
}

const MOCK_SKILLS: Skill[] = [
  {
    id: "skill-fireball",
    name: "Cầu Lửa",
    description: "Phóng một quả cầu lửa gây sát thương lớn.",
    type: "attack",
    damage: 30,
    energyCost: 20,
    cooldown: 10,
    icon: "Flame",
  },
  {
    id: "skill-ice-shield",
    name: "Khiên Băng",
    description: "Tạo một lá chắn băng tăng phòng thủ.",
    type: "buff",
    energyCost: 15,
    cooldown: 15,
    icon: "Shield",
  },
  {
    id: "skill-heal",
    name: "Hồi Phục",
    description: "Hồi phục một lượng máu cho bản thân.",
    type: "heal",
    heal: 40,
    energyCost: 25,
    cooldown: 20,
    icon: "Heart",
  },
  {
    id: "skill-dark-blast",
    name: "Vụ Nổ Bóng Tối",
    description: "Gây sát thương bóng tối và giảm phòng thủ đối thủ.",
    type: "attack",
    damage: 25,
    energyCost: 30,
    cooldown: 12,
    icon: "Ghost",
  },
  {
    id: "skill-nature-regen",
    name: "Tái Tạo Tự Nhiên",
    description: "Hồi phục năng lượng và một ít máu theo thời gian.",
    type: "buff",
    energyCost: 0, // Passive or low cost
    cooldown: 25,
    icon: "Leaf",
    isHidden: true, // Example of a hidden skill
  },
]

const MOCK_DRAGONS: Dragon[] = [
  {
    id: "dragon-1",
    name: "Ignis",
    species: "Fire",
    level: 5,
    xp: 150,
    maxHp: 100,
    currentHp: 90,
    attack: 20,
    defense: 15,
    image: "/dragon/Ignis.png",
    status: "Healthy",
    description: "A fiery dragon, born from volcanic ash. Its breath can melt steel.",
    evolutionLevel: 10,
    nextEvolutionId: "dragon-1-evolved",
    cooldowns: { feed: 0, train: 0, evolve: 0, skill: {} },
    skills: [MOCK_SKILLS[0], MOCK_SKILLS[2]], // Fireball, Heal
    currentEnergy: 50,
    maxEnergy: 100,
    equippedSkinId: undefined,
  },
  {
    id: "dragon-2",
    name: "Frostwing",
    species: "Ice",
    level: 3,
    xp: 80,
    maxHp: 80,
    currentHp: 80,
    attack: 18,
    defense: 12,
    image: "/dragon/Frostwing.png",
    status: "Healthy",
    description: "A majestic ice dragon, capable of freezing entire lakes with a single roar.",
    evolutionLevel: 8,
    cooldowns: { feed: 0, train: 0, evolve: 0, skill: {} },
    skills: [MOCK_SKILLS[1]], // Ice Shield
    currentEnergy: 70,
    maxEnergy: 100,
    equippedSkinId: undefined,
  },
  {
    id: "dragon-3",
    name: "Shadowfang",
    species: "Dark",
    level: 7,
    xp: 250,
    maxHp: 120,
    currentHp: 110,
    attack: 25,
    defense: 18,
    image: "/dragon/Shadowfang.png",
    status: "Healthy",
    description: "A stealthy dragon of the night, its movements are as silent as shadows.",
    evolutionLevel: 12,
    cooldowns: { feed: 0, train: 0, evolve: 0, skill: {} },
    skills: [MOCK_SKILLS[3]], // Dark Blast
    currentEnergy: 80,
    maxEnergy: 100,
    equippedSkinId: undefined,
  },
]

const MOCK_SHOP_ITEMS: ShopItem[] = [
  {
    id: "item-egg-fire",
    name: "Trứng Rồng Lửa",
    type: "egg",
    price: 500,
    image: "/placeholder.svg?height=100&width=100",
    description: "Một quả trứng rồng lửa ấm áp, chờ đợi để nở.",
    effect: { species: "Fire", baseLevel: 1 },
  },
  {
    id: "item-food-basic",
    name: "Thức Ăn Cơ Bản",
    type: "food",
    price: 50,
    image: "/placeholder.svg?height=100&width=100",
    description: "Thức ăn tiêu chuẩn cho rồng, giúp chúng no bụng.",
    effect: { hungerRestore: 20 },
  },
  {
    id: "item-skill-fireball",
    name: "Kỹ Năng: Cầu Lửa",
    type: "skill",
    price: 200,
    image: "/placeholder.svg?height=100&width=100",
    description: "Dạy rồng của bạn phóng ra một quả cầu lửa mạnh mẽ.",
    effect: { skillId: "skill-fireball" },
  },
  {
    id: "item-potion-hp",
    name: "Bình Hồi Máu",
    type: "potion",
    price: 100,
    image: "/placeholder.svg?height=100&width=100",
    description: "Hồi phục một lượng máu cho rồng của bạn.",
    effect: { hpRestore: 50 },
  },
  {
    id: "item-gacha-roll",
    name: "Lượt Quay Gacha",
    type: "gacha_roll",
    price: 250,
    image: "/placeholder.svg?height=100&width=100",
    description: "Quay một lượt để nhận rồng ngẫu nhiên!",
  },
]

const MOCK_DRAGON_SKINS: DragonSkin[] = [
  {
    id: "skin-ignis-golden",
    name: "Ignis Vàng",
    image: "/placeholder.svg?height=200&width=200",
    price: 300,
    description: "Biến Ignis thành một chú rồng vàng lấp lánh.",
    statBoost: { attack: 1, defense: 1 },
  },
  {
    id: "skin-frostwing-crystal",
    name: "Frostwing Pha Lê",
    image: "/placeholder.svg?height=200&width=200",
    price: 350,
    description: "Frostwing với bộ vảy pha lê lấp lánh.",
    statBoost: { hp: 10 },
  },
]

const MOCK_PLAYER_SKINS: PlayerSkin[] = [
  {
    id: "player-skin-knight",
    name: "Hiệp Sĩ Rồng",
    image: "/placeholder.svg?height=100&width=100",
    price: 200,
    description: "Trang phục hiệp sĩ dũng mãnh.",
  },
  {
    id: "player-skin-mage",
    name: "Phù Thủy Rồng",
    image: "/placeholder.svg?height=100&width=100",
    price: 220,
    description: "Trang phục phù thủy bí ẩn.",
  },
]

const MOCK_OPPONENTS: Dragon[] = [
  {
    id: "opponent-1",
    name: "Gargoyle",
    species: "Dark",
    level: 4,
    xp: 0,
    maxHp: 90,
    currentHp: 90,
    attack: 18,
    defense: 10,
    image: "/placeholder.svg?height=200&width=200",
    status: "Healthy",
    description: "Một con rồng đá hung dữ.",
    evolutionLevel: 0,
    cooldowns: { feed: 0, train: 0, evolve: 0, skill: {} },
    skills: [MOCK_SKILLS[3]], // Dark Blast
    currentEnergy: 60,
    maxEnergy: 100,
    equippedSkinId: undefined,
  },
  {
    id: "opponent-2",
    name: "Wyvern",
    species: "Nature",
    level: 6,
    xp: 0,
    maxHp: 110,
    currentHp: 110,
    attack: 22,
    defense: 14,
    image: "/placeholder.svg?height=200&width=200",
    status: "Healthy",
    description: "Một con wyvern nhanh nhẹn.",
    evolutionLevel: 0,
    cooldowns: { feed: 0, train: 0, evolve: 0, skill: {} },
    skills: [MOCK_SKILLS[0], MOCK_SKILLS[4]], // Fireball, Nature Regen (hidden)
    currentEnergy: 80,
    maxEnergy: 100,
    equippedSkinId: undefined,
  },
]

const MOCK_GACHA_POOL: Dragon[] = [
  {
    id: "gacha-dragon-1",
    name: "Aqua Serpent",
    species: "Ice",
    level: 1,
    xp: 0,
    maxHp: 75,
    currentHp: 75,
    attack: 16,
    defense: 11,
    image: "/placeholder.svg?height=200&width=200",
    status: "Healthy",
    description: "Một con rắn biển bí ẩn, có khả năng điều khiển nước.",
    evolutionLevel: 6,
    cooldowns: { feed: 0, train: 0, evolve: 0, skill: {} },
    skills: [MOCK_SKILLS[1]],
    currentEnergy: 50,
    maxEnergy: 100,
    equippedSkinId: undefined,
  },
  {
    id: "gacha-dragon-2",
    name: "Terra Drake",
    species: "Nature",
    level: 1,
    xp: 0,
    maxHp: 80,
    currentHp: 80,
    attack: 15,
    defense: 13,
    image: "/placeholder.svg?height=200&width=200",
    status: "Healthy",
    description: "Một con rồng đất mạnh mẽ, được sinh ra từ lòng đất.",
    evolutionLevel: 7,
    cooldowns: { feed: 0, train: 0, evolve: 0, skill: {} },
    skills: [MOCK_SKILLS[2]],
    currentEnergy: 60,
    maxEnergy: 100,
    equippedSkinId: undefined,
  },
  {
    id: "gacha-dragon-3",
    name: "Storm Wyrm",
    species: "Light",
    level: 2,
    xp: 0,
    maxHp: 85,
    currentHp: 85,
    attack: 19,
    defense: 10,
    image: "/placeholder.svg?height=200&width=200",
    status: "Healthy",
    description: "Một con rồng bão tố nhanh nhẹn, mang theo sấm sét.",
    evolutionLevel: 8,
    cooldowns: { feed: 0, train: 0, evolve: 0, skill: {} },
    skills: [MOCK_SKILLS[0]],
    currentEnergy: 70,
    maxEnergy: 100,
    equippedSkinId: undefined,
  },
]

// --- Context ---
interface GameContextType {
  player: Player
  dragons: Dragon[]
  shopItems: ShopItem[]
  dragonSkins: DragonSkin[]
  playerSkins: PlayerSkin[]
  opponents: Dragon[]
  skills: Skill[]
  feedDragon: (dragonId: string) => void
  trainDragon: (dragonId: string) => void
  evolveDragon: (dragonId: string) => void
  buyItem: (itemId: string) => void
  rollGacha: () => Dragon | null
  equipDragonSkin: (dragonId: string, skinId: string | undefined) => void
  equipPlayerSkin: (skinId: string | undefined) => void
  startBattle: (playerDragonId: string, opponentDragonId: string) => BattleState
  performBattleAction: (currentState: BattleState, action: "attack" | "skill", skillId?: string) => BattleState
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [player, setPlayer] = useState<Player>(MOCK_PLAYER)
  const [dragons, setDragons] = useState<Dragon[]>(MOCK_DRAGONS)
  const [shopItems] = useState<ShopItem[]>(MOCK_SHOP_ITEMS)
  const [dragonSkins] = useState<DragonSkin[]>(MOCK_DRAGON_SKINS)
  const [playerSkins] = useState<PlayerSkin[]>(MOCK_PLAYER_SKINS)
  const [opponents] = useState<Dragon[]>(MOCK_OPPONENTS)
  const [skills] = useState<Skill[]>(MOCK_SKILLS)

  // Simulate cooldowns and energy regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setDragons((prevDragons) =>
        prevDragons.map((dragon) => {
          const newCooldowns = { ...dragon.cooldowns }

          // Handle direct number cooldowns explicitly
          newCooldowns.feed = Math.max(0, newCooldowns.feed - 1)
          newCooldowns.train = Math.max(0, newCooldowns.train - 1)
          newCooldowns.evolve = Math.max(0, newCooldowns.evolve - 1)

          // Handle skill cooldowns if they exist
          if (newCooldowns.skill) {
            const updatedSkillCooldowns: Record<string, number> = {}
            for (const skillId in newCooldowns.skill) {
              updatedSkillCooldowns[skillId] = Math.max(0, newCooldowns.skill[skillId] - 1)
            }
            newCooldowns.skill = updatedSkillCooldowns
          }

          // Regenerate energy
          const newEnergy = Math.min(dragon.maxEnergy, dragon.currentEnergy + 5) // 5 energy per second
          return {
            ...dragon,
            cooldowns: newCooldowns,
            currentEnergy: newEnergy,
          }
        }),
      )
    }, 1000) // Decrement every second
    return () => clearInterval(interval)
  }, [])

  const updatePlayerXP = useCallback((xp: number) => {
    setPlayer((prevPlayer) => {
      const newXp = prevPlayer.xp + xp
      let newLevel = prevPlayer.level
      // Simple level up logic
      if (newXp >= newLevel * 100) {
        newLevel += 1
        toast({
          title: "Chúc mừng!",
          description: `Bạn đã lên cấp ${newLevel}!`,
          variant: "success", // Requires 'success' to be added to ToastProps variant type
        })
      }
      return { ...prevPlayer, xp: newXp, level: newLevel }
    })
  }, [])

  const feedDragon = useCallback((dragonId: string) => {
    setDragons((prevDragons) =>
      prevDragons.map((dragon) => {
        if (dragon.id === dragonId && dragon.cooldowns.feed === 0) {
          const newHp = Math.min(dragon.maxHp, dragon.currentHp + 20)
          toast({
            title: "Cho ăn thành công!",
            description: `${dragon.name} đã hồi phục 20 HP.`,
            variant: "success", // Requires 'success' to be added to ToastProps variant type
          })
          return {
            ...dragon,
            currentHp: newHp,
            status: newHp === dragon.maxHp ? "Healthy" : dragon.status,
            cooldowns: { ...dragon.cooldowns, feed: 10 }, // 10 second cooldown
          }
        }
        return dragon
      }),
    )
  }, [])

  const trainDragon = useCallback(
    (dragonId: string) => {
      setDragons((prevDragons) =>
        prevDragons.map((dragon) => {
          if (dragon.id === dragonId && dragon.cooldowns.train === 0) {
            const xpGain = 20
            const newXp = dragon.xp + xpGain
            let newLevel = dragon.level
            let newAttack = dragon.attack
            let newDefense = dragon.defense

            if (newXp >= newLevel * 50) {
              newLevel += 1
              newAttack += 2
              newDefense += 1
              toast({
                title: "Huấn luyện thành công!",
                description: `${dragon.name} đã lên cấp ${newLevel}!`,
                variant: "success", // Requires 'success' to be added to ToastProps variant type
              })
            } else {
              toast({
                title: "Huấn luyện thành công!",
                description: `${dragon.name} đã nhận được ${xpGain} XP.`,
                variant: "success", // Requires 'success' to be added to ToastProps variant type
              })
            }

            updatePlayerXP(xpGain / 2) // Player also gains some XP

            return {
              ...dragon,
              xp: newXp,
              level: newLevel,
              attack: newAttack,
              defense: newDefense,
              cooldowns: { ...dragon.cooldowns, train: 30 }, // 30 second cooldown
            }
          }
          return dragon
        }),
      )
    },
    [updatePlayerXP],
  )

  const evolveDragon = useCallback(
    (dragonId: string) => {
      setDragons((prevDragons) =>
        prevDragons.map((dragon) => {
          if (
            dragon.id === dragonId &&
            dragon.level >= dragon.evolutionLevel &&
            dragon.nextEvolutionId &&
            dragon.cooldowns.evolve === 0
          ) {
            // Simulate evolution: replace with a new dragon or update stats significantly
            const evolvedDragon: Dragon = {
              ...dragon,
              id: dragon.nextEvolutionId,
              name: `${dragon.name} Prime`, // Example new name
              level: dragon.level + 1,
              maxHp: dragon.maxHp + 50,
              currentHp: dragon.maxHp + 50,
              attack: dragon.attack + 10,
              defense: dragon.defense + 5,
              image: "/placeholder.svg?height=250&width=250", // New image for evolved form
              description: `Dạng tiến hóa của ${dragon.name}. Mạnh mẽ hơn rất nhiều!`,
              evolutionLevel: dragon.evolutionLevel + 10, // Next evolution level
              nextEvolutionId: undefined, // No further evolution for now
              cooldowns: { ...dragon.cooldowns, evolve: 3600 }, // Long cooldown for evolution
            }
            toast({
              title: "Tiến hóa thành công!",
              description: `${dragon.name} đã tiến hóa thành ${evolvedDragon.name}!`,
              variant: "success", // Requires 'success' to be added to ToastProps variant type
            })
            updatePlayerXP(100) // Player gains significant XP for evolution
            return evolvedDragon
          } else if (dragon.id === dragonId) {
            if (dragon.cooldowns.evolve > 0) {
              toast({
                title: "Không thể tiến hóa",
                description: `${dragon.name} đang trong thời gian hồi chiêu tiến hóa.`,
                variant: "warning", // Requires 'warning' to be added to ToastProps variant type
              })
            } else if (dragon.level < dragon.evolutionLevel) {
              toast({
                title: "Không thể tiến hóa",
                description: `${dragon.name} cần đạt cấp ${dragon.evolutionLevel} để tiến hóa.`,
                variant: "warning", // Requires 'warning' to be added to ToastProps variant type
              })
            } else if (!dragon.nextEvolutionId) {
              toast({
                title: "Không thể tiến hóa",
                description: `${dragon.name} không có dạng tiến hóa tiếp theo.`,
                variant: "warning", // Requires 'warning' to be added to ToastProps variant type
              })
            }
          }
          return dragon
        }),
      )
    },
    [updatePlayerXP],
  )

  const buyItem = useCallback(
    (itemId: string) => {
      const item = shopItems.find((i) => i.id === itemId)
      if (!item) {
        toast({
          title: "Lỗi",
          description: "Vật phẩm không tồn tại.",
          variant: "destructive",
        })
        return
      }

      if (player.coins < item.price) {
        toast({
          title: "Không đủ Coin",
          description: "Bạn không có đủ tiền để mua vật phẩm này.",
          variant: "destructive",
        })
        return
      }

      setPlayer((prevPlayer) => ({
        ...prevPlayer,
        coins: prevPlayer.coins - item.price,
      }))

      // Handle item effect (simplified)
      if (item.type === "egg") {
        const newDragon: Dragon = {
          id: `dragon-${Date.now()}`,
          name: `Rồng ${item.effect.species}`,
          species: item.effect.species,
          level: item.effect.baseLevel,
          xp: 0,
          maxHp: 70,
          currentHp: 70,
          attack: 15,
          defense: 10,
          image: "/placeholder.svg?height=200&width=200",
          status: "Healthy",
          description: `Một chú rồng ${item.effect.species} mới nở.`,
          evolutionLevel: 5,
          cooldowns: { feed: 0, train: 0, evolve: 0, skill: {} },
          skills: [], // New dragons start with no skills
          currentEnergy: 50,
          maxEnergy: 100,
          equippedSkinId: undefined,
        }
        setDragons((prevDragons) => [...prevDragons, newDragon])
        toast({
          title: "Mua thành công!",
          description: `Bạn đã mua ${item.name} và nhận được một chú rồng mới!`,
          variant: "success", // Requires 'success' to be added to ToastProps variant type
        })
      } else if (item.type === "skill") {
        // For simplicity, assume skill items teach a skill to the first dragon
        // In a real game, you'd select which dragon to teach
        const skillToAdd = skills.find((s) => s.id === item.effect.skillId)
        if (skillToAdd && dragons.length > 0) {
          setDragons((prevDragons) =>
            prevDragons.map((d, index) =>
              index === 0 && !d.skills.some((s) => s.id === skillToAdd.id)
                ? { ...d, skills: [...d.skills, skillToAdd] }
                : d,
            ),
          )
          toast({
            title: "Mua thành công!",
            description: `Bạn đã học được kỹ năng ${item.name}!`,
            variant: "success", // Requires 'success' to be added to ToastProps variant type
          })
        } else {
          toast({
            title: "Lỗi",
            description: "Không thể học kỹ năng hoặc không có rồng.",
            variant: "destructive",
          })
        }
      } else if (item.type === "dragon_skin") {
        // Logic to add skin to player's inventory (not implemented yet)
        toast({
          title: "Mua thành công!",
          description: `Bạn đã mua skin rồng ${item.name}.`,
          variant: "success", // Requires 'success' to be added to ToastProps variant type
        })
      } else if (item.type === "player_skin") {
        // Logic to add skin to player's inventory (not implemented yet)
        toast({
          title: "Mua thành công!",
          description: `Bạn đã mua skin nhân vật ${item.name}.`,
          variant: "success", // Requires 'success' to be added to ToastProps variant type
        })
      } else if (item.type === "gacha_roll") {
        toast({
          title: "Mua thành công!",
          description: `Bạn đã mua một lượt quay gacha.`,
          variant: "success", // Requires 'success' to be added to ToastProps variant type
        })
      } else {
        toast({
          title: "Mua thành công!",
          description: `Bạn đã mua ${item.name}.`,
          variant: "success", // Requires 'success' to be added to ToastProps variant type
        })
      }
    },
    [player.coins, shopItems, dragons, skills],
  )

  const rollGacha = useCallback((): Dragon | null => {
    if (player.coins < 250) {
      toast({
        title: "Không đủ Coin",
        description: "Bạn cần 250 Coin để quay gacha.",
        variant: "destructive",
      })
      return null
    }

    setPlayer((prevPlayer) => ({
      ...prevPlayer,
      coins: prevPlayer.coins - 250,
    }))

    const randomIndex = Math.floor(Math.random() * MOCK_GACHA_POOL.length)
    const newDragonTemplate = MOCK_GACHA_POOL[randomIndex]

    const newDragon: Dragon = {
      ...newDragonTemplate,
      id: `dragon-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Unique ID
      name: `${newDragonTemplate.name} (Gacha)`,
      level: 1,
      xp: 0,
      currentHp: newDragonTemplate.maxHp,
      status: "Healthy",
      cooldowns: { feed: 0, train: 0, evolve: 0, skill: {} },
      currentEnergy: newDragonTemplate.maxEnergy / 2,
      equippedSkinId: undefined,
    }

    setDragons((prevDragons) => [...prevDragons, newDragon])
    toast({
      title: "Quay Gacha thành công!",
      description: `Bạn đã nhận được một chú rồng mới: ${newDragon.name}!`,
      variant: "success", // Requires 'success' to be added to ToastProps variant type
    })
    return newDragon
  }, [player.coins])

  const equipDragonSkin = useCallback(
    (dragonId: string, skinId: string | undefined) => {
      setDragons((prevDragons) =>
        prevDragons.map((dragon) => {
          if (dragon.id === dragonId) {
            const skin = skinId ? dragonSkins.find((s) => s.id === skinId) : undefined
            let newAttack = dragon.attack
            let newDefense = dragon.defense
            let newMaxHp = dragon.maxHp

            // Remove previous skin's boost if any
            const currentSkin = dragon.equippedSkinId
              ? dragonSkins.find((s) => s.id === dragon.equippedSkinId)
              : undefined
            if (currentSkin?.statBoost) {
              newAttack -= currentSkin.statBoost.attack || 0
              newDefense -= currentSkin.statBoost.defense || 0
              newMaxHp -= currentSkin.statBoost.hp || 0
            }

            // Apply new skin's boost
            if (skin?.statBoost) {
              newAttack += skin.statBoost.attack || 0
              newDefense += skin.statBoost.defense || 0
              newMaxHp += skin.statBoost.hp || 0
            }

            toast({
              title: "Trang bị Skin thành công!",
              description: `${dragon.name} đã trang bị skin ${skin?.name || "mặc định"}.`,
              variant: "success", // Requires 'success' to be added to ToastProps variant type
            })

            return {
              ...dragon,
              equippedSkinId: skinId,
              attack: newAttack,
              defense: newDefense,
              maxHp: newMaxHp,
              currentHp: Math.min(dragon.currentHp, newMaxHp), // Adjust current HP if max HP decreases
            }
          }
          return dragon
        }),
      )
    },
    [dragonSkins],
  )

  const equipPlayerSkin = useCallback(
    (skinId: string | undefined) => {
      const skin = skinId ? playerSkins.find((s) => s.id === skinId) : undefined
      setPlayer((prevPlayer) => ({
        ...prevPlayer,
        equippedSkinId: skinId,
        avatar: skin?.image || MOCK_PLAYER.avatar, // Update avatar image
      }))
      toast({
        title: "Trang bị Skin thành công!",
        description: `Bạn đã trang bị skin nhân vật ${skin?.name || "mặc định"}.`,
        variant: "success", // Requires 'success' to be added to ToastProps variant type
      })
    },
    [playerSkins],
  )

  const startBattle = useCallback(
    (playerDragonId: string, opponentDragonId: string): BattleState => {
      const playerDragon = dragons.find((d) => d.id === playerDragonId)
      const opponentDragon = opponents.find((o) => o.id === opponentDragonId)

      if (!playerDragon || !opponentDragon) {
        toast({
          title: "Lỗi chiến đấu",
          description: "Rồng không hợp lệ.",
          variant: "destructive",
        })
        throw new Error("Invalid dragons for battle.")
      }

      return {
        playerDragon: playerDragon,
        opponentDragon: opponentDragon,
        playerCurrentHp: playerDragon.currentHp,
        opponentCurrentHp: opponentDragon.currentHp,
        playerCurrentEnergy: playerDragon.currentEnergy,
        opponentCurrentEnergy: opponentDragon.currentEnergy,
        turn: 0,
        log: [`Trận chiến giữa ${playerDragon.name} và ${opponentDragon.name} bắt đầu!`],
        isBattleOver: false,
      }
    },
    [dragons, opponents],
  )

  const performBattleAction = useCallback(
    (currentState: BattleState, action: "attack" | "skill", skillId?: string): BattleState => {
      if (currentState.isBattleOver) return currentState

      let {
        playerDragon,
        opponentDragon,
        playerCurrentHp,
        opponentCurrentHp,
        playerCurrentEnergy,
        opponentCurrentEnergy,
        turn,
        log,
      } = currentState
      const newLog = [...log]

      // Player's Turn
      newLog.push(`--- Lượt ${turn + 1} ---`)
      let playerDamageDealt = 0
      let playerHealAmount = 0
      // const playerEnergyCost = 0 // This variable was declared but not used, removed.
      let playerSkillUsed: Skill | undefined

      if (action === "attack") {
        playerDamageDealt = Math.max(1, playerDragon.attack - opponentDragon.defense / 2)
        opponentCurrentHp -= playerDamageDealt
        newLog.push(`${playerDragon.name} tấn công ${opponentDragon.name} gây ${playerDamageDealt} sát thương.`)
      } else if (action === "skill" && skillId) {
        playerSkillUsed = skills.find((s) => s.id === skillId)
        if (playerSkillUsed) {
          if (playerCurrentEnergy >= playerSkillUsed.energyCost) {
            playerCurrentEnergy -= playerSkillUsed.energyCost
            newLog.push(`${playerDragon.name} sử dụng kỹ năng ${playerSkillUsed.name}.`)

            if (playerSkillUsed.type === "attack" && playerSkillUsed.damage) {
              playerDamageDealt = playerSkillUsed.damage
              opponentCurrentHp -= playerDamageDealt
              newLog.push(`Gây ${playerDamageDealt} sát thương lên ${opponentDragon.name}.`)
            } else if (playerSkillUsed.type === "heal" && playerSkillUsed.heal) {
              playerHealAmount = playerSkillUsed.heal
              playerCurrentHp = Math.min(playerDragon.maxHp, playerCurrentHp + playerHealAmount)
              newLog.push(`Hồi phục ${playerHealAmount} HP cho bản thân.`)
            }
            // Handle buff/debuffs here if implemented
          } else {
            newLog.push(`${playerDragon.name} không đủ năng lượng để sử dụng ${playerSkillUsed.name}.`)
            // Fallback to basic attack if not enough energy for skill
            playerDamageDealt = Math.max(1, playerDragon.attack - opponentDragon.defense / 2)
            opponentCurrentHp -= playerDamageDealt
            newLog.push(`${playerDragon.name} tấn công cơ bản gây ${playerDamageDealt} sát thương.`)
          }
        }
      }

      // Check if battle is over after player's turn
      if (opponentCurrentHp <= 0) {
        const rewardCoins = 100 + opponentDragon.level * 10
        const rewardXp = 50 + opponentDragon.level * 5
        setPlayer((prevPlayer) => ({ ...prevPlayer, coins: prevPlayer.coins + rewardCoins }))
        updatePlayerXP(rewardXp)
        setDragons((prevDragons) =>
          prevDragons.map((d) =>
            d.id === playerDragon.id ? { ...d, currentHp: playerCurrentHp, xp: d.xp + rewardXp / 2 } : d,
          ),
        )
        return {
          ...currentState,
          playerCurrentHp,
          opponentCurrentHp: 0,
          playerCurrentEnergy,
          log: newLog,
          isBattleOver: true,
          result: {
            winner: "player",
            rewardCoins,
            rewardXp,
            message: `Bạn đã thắng! Nhận ${rewardCoins} Coin và ${rewardXp} XP.`,
            log: newLog,
          },
        }
      }

      // Opponent's Turn (Simple AI)
      let opponentDamageDealt = 0
      let opponentHealAmount = 0
      let opponentSkillUsed: Skill | undefined
      const availableOpponentSkills = opponentDragon.skills.filter(
        (s) => opponentCurrentEnergy >= s.energyCost && (opponentDragon.cooldowns.skill?.[s.id] || 0) === 0,
      )

      if (availableOpponentSkills.length > 0 && Math.random() > 0.5) {
        // 50% chance to use skill if available
        opponentSkillUsed = availableOpponentSkills[Math.floor(Math.random() * availableOpponentSkills.length)]
        opponentCurrentEnergy -= opponentSkillUsed.energyCost
        newLog.push(`${opponentDragon.name} sử dụng kỹ năng ${opponentSkillUsed.name}.`)

        if (opponentSkillUsed.type === "attack" && opponentSkillUsed.damage) {
          opponentDamageDealt = opponentSkillUsed.damage
          playerCurrentHp -= opponentDamageDealt
          newLog.push(`Gây ${opponentDamageDealt} sát thương lên ${playerDragon.name}.`)
        } else if (opponentSkillUsed.type === "heal" && opponentSkillUsed.heal) {
          opponentHealAmount = opponentSkillUsed.heal
          opponentCurrentHp = Math.min(opponentDragon.maxHp, opponentCurrentHp + opponentHealAmount)
          newLog.push(`Hồi phục ${opponentHealAmount} HP cho bản thân.`)
        }
        // Update opponent skill cooldown
        if (opponentSkillUsed.cooldown > 0) {
          opponentDragon.cooldowns.skill = {
            ...opponentDragon.cooldowns.skill,
            [opponentSkillUsed.id]: opponentSkillUsed.cooldown,
          }
        }
      } else {
        opponentDamageDealt = Math.max(1, opponentDragon.attack - playerDragon.defense / 2)
        playerCurrentHp -= opponentDamageDealt
        newLog.push(`${opponentDragon.name} tấn công ${playerDragon.name} gây ${opponentDamageDealt} sát thương.`)
      }

      // Check if battle is over after opponent's turn
      if (playerCurrentHp <= 0) {
        setDragons((prevDragons) =>
          prevDragons.map((d) => (d.id === playerDragon.id ? { ...d, currentHp: 0, status: "Injured" } : d)),
        )
        return {
          ...currentState,
          playerCurrentHp: 0,
          opponentCurrentHp,
          playerCurrentEnergy,
          log: newLog,
          isBattleOver: true,
          result: {
            winner: "opponent",
            rewardCoins: 0,
            rewardXp: 0,
            message: `Bạn đã thua! ${playerDragon.name} đã bị thương.`,
            log: newLog,
          },
        }
      }

      // If battle continues
      return {
        ...currentState,
        playerCurrentHp,
        opponentCurrentHp,
        playerCurrentEnergy,
        opponentCurrentEnergy,
        turn: turn + 1,
        log: newLog,
        isBattleOver: false,
      }
    },
    [skills, updatePlayerXP, setDragons, setPlayer], // Added dependencies for useCallback
  )

  const value = {
    player,
    dragons,
    shopItems,
    dragonSkins,
    playerSkins,
    opponents,
    skills,
    feedDragon,
    trainDragon,
    evolveDragon,
    buyItem,
    rollGacha,
    equipDragonSkin,
    equipPlayerSkin,
    startBattle,
    performBattleAction,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
