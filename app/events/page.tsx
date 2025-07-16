"use client"

import { motion } from "framer-motion"
import { CalendarDays, Gift, Swords, Flame, Gem, ScrollText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function EventsPage() {
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

  const events = [
    {
      id: 1,
      title: "Sự Kiện Rồng Lửa: Thử Thách Hỏa Long",
      date: "20/07/2025 - 27/07/2025",
      description:
        "Tham gia các thử thách rồng lửa đặc biệt, đánh bại Hỏa Long cổ đại để nhận trứng rồng lửa hiếm và vật phẩm tăng cường sức mạnh.",
      icon: Flame,
      status: "Đang diễn ra",
      rewards: ["Trứng Rồng Lửa Hiếm", "Đá Tăng Cường Sức Mạnh"],
    },
    {
      id: 2,
      title: "Giải Đấu Đấu Trường Mùa Hè: Vinh Quang Chiến Binh",
      date: "01/08/2025 - 15/08/2025",
      description:
        "Chứng tỏ kỹ năng của bạn trong giải đấu PvP lớn nhất mùa hè. Leo lên bảng xếp hạng để giành danh hiệu Chiến Binh Huyền Thoại và phần thưởng Coin khổng lồ.",
      icon: Swords,
      status: "Sắp tới",
      rewards: ["Coin Vàng", "Danh Hiệu Độc Quyền"],
    },
    {
      id: 3,
      title: "Sự Kiện Trứng Rồng Hiếm: Mở Rương Kho Báu",
      date: "10/08/2025 - 12/08/2025",
      description:
        "Cơ hội hiếm có để nhận trứng rồng huyền thoại từ các rương kho báu đặc biệt trong cửa hàng. Mỗi rương chứa một bất ngờ!",
      icon: Gift,
      status: "Sắp tới",
      rewards: ["Trứng Rồng Huyền Thoại", "Vật Phẩm May Mắn"],
    },
    {
      id: 4,
      title: "Thử Thách Huấn Luyện Rồng: Bậc Thầy Rồng",
      date: "25/07/2025 - 05/08/2025",
      description:
        "Hoàn thành các nhiệm vụ huấn luyện hàng ngày và hàng tuần để tăng cấp độ rồng nhanh chóng và nhận các vật phẩm huấn luyện cao cấp.",
      icon: ScrollText,
      status: "Đang diễn ra",
      rewards: ["XP Boost", "Thức Ăn Cao Cấp"],
    },
    {
      id: 5,
      title: "Ưu Đãi Cửa Hàng: Giảm Giá Đặc Biệt",
      date: "28/07/2025 - 31/07/2025",
      description: "Tận hưởng ưu đãi giảm giá lớn cho tất cả các vật phẩm trong cửa hàng. Đừng bỏ lỡ cơ hội này!",
      icon: Gem,
      status: "Sắp tới",
      rewards: ["Giảm Giá Vật Phẩm", "Bonus Coin"],
    },
  ]

  return (
    <motion.div className="p-4 md:p-6 lg:p-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.h2 className="text-4xl font-bold text-fantasy-gold mb-8 font-magic text-glow shadow-fantasy-gold/50">
        Sự Kiện
      </motion.h2>

      <motion.div variants={itemVariants} className="mb-8">
        <Card className="bg-card border border-border shadow-lg shadow-fantasy-purple/20">
          <CardHeader className="flex flex-row items-center space-x-4">
            <CalendarDays className="h-12 w-12 text-fantasy-gold" />
            <div>
              <CardTitle className="text-3xl font-magic text-fantasy-gold">Lịch Sự Kiện</CardTitle>
              <p className="text-lg text-fantasy-light/80">Cập nhật các sự kiện sắp tới trong thế giới rồng.</p>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {events.map((event) => (
          <motion.div key={event.id} variants={itemVariants}>
            <Card className="bg-card border border-border shadow-lg shadow-fantasy-blue/20 h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="font-magic text-xl text-fantasy-gold flex items-center gap-2">
                    <event.icon className="h-6 w-6" />
                    {event.title}
                  </CardTitle>
                  <Badge
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.status === "Đang diễn ra"
                        ? "bg-green-600/80 text-white shadow-md shadow-green-600/30"
                        : "bg-blue-600/80 text-white shadow-md shadow-blue-600/30"
                    }`}
                  >
                    {event.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{event.date}</p>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <p className="text-fantasy-light/90 mb-4">{event.description}</p>
                <div>
                  <h4 className="text-md font-semibold text-fantasy-gold mb-2">Phần Thưởng:</h4>
                  <ul className="list-disc list-inside text-sm text-fantasy-light/80">
                    {event.rewards.map((reward, index) => (
                      <li key={index}>{reward}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
