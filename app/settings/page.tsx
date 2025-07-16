"use client"

import { motion } from "framer-motion"
import { Settings, Volume2, Palette, User, Bell, Gamepad2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useAudio } from "@/components/audio-player"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
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

  const { theme, setTheme } = useTheme()
  const { isPlaying, togglePlay } = useAudio()

  return (
    <motion.div className="p-4 md:p-6 lg:p-8" variants={containerVariants} initial="hidden" animate="visible">
      <motion.h2 className="text-4xl font-bold text-fantasy-gold mb-8 font-magic text-glow shadow-fantasy-gold/50">
        Cài Đặt
      </motion.h2>

      <motion.div variants={itemVariants} className="mb-8">
        <Card className="bg-card border border-border shadow-lg shadow-fantasy-purple/20">
          <CardHeader className="flex flex-row items-center space-x-4">
            <Settings className="h-12 w-12 text-fantasy-gold" />
            <div>
              <CardTitle className="text-3xl font-magic text-fantasy-gold">Cài Đặt Chung</CardTitle>
              <p className="text-lg text-fantasy-light/80">Tùy chỉnh trải nghiệm chơi game của bạn.</p>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="bg-card border border-border shadow-lg shadow-fantasy-blue/20">
            <CardHeader>
              <CardTitle className="font-magic text-xl text-fantasy-gold flex items-center gap-2">
                <Volume2 className="h-6 w-6" />
                Âm Thanh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="music-mode" className="text-fantasy-light/90">
                  Nhạc Nền
                </Label>
                <Switch id="music-mode" checked={isPlaying} onCheckedChange={togglePlay} />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="sfx-mode" className="text-fantasy-light/90">
                  Hiệu Ứng Âm Thanh
                </Label>
                <Switch id="sfx-mode" defaultChecked /> {/* Placeholder for SFX */}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card border border-border shadow-lg shadow-fantasy-blue/20">
            <CardHeader>
              <CardTitle className="font-magic text-xl text-fantasy-gold flex items-center gap-2">
                <Palette className="h-6 w-6" />
                Giao Diện
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="dark-mode" className="text-fantasy-light/90">
                  Chế Độ Tối
                </Label>
                <Switch
                  id="dark-mode"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card border border-border shadow-lg shadow-fantasy-blue/20">
            <CardHeader>
              <CardTitle className="font-magic text-xl text-fantasy-gold flex items-center gap-2">
                <Bell className="h-6 w-6" />
                Thông Báo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="game-notifications" className="text-fantasy-light/90">
                  Thông Báo Trong Game
                </Label>
                <Switch id="game-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="email-notifications" className="text-fantasy-light/90">
                  Thông Báo Email
                </Label>
                <Switch id="email-notifications" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card border border-border shadow-lg shadow-fantasy-blue/20">
            <CardHeader>
              <CardTitle className="font-magic text-xl text-fantasy-gold flex items-center gap-2">
                <Gamepad2 className="h-6 w-6" />
                Lối Chơi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="battle-animations" className="text-fantasy-light/90">
                  Hiển Thị Animation Chiến Đấu
                </Label>
                <Switch id="battle-animations" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="auto-feed" className="text-fantasy-light/90">
                  Tự Động Cho Ăn (Khi đói)
                </Label>
                <Switch id="auto-feed" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card border border-border shadow-lg shadow-fantasy-blue/20">
            <CardHeader>
              <CardTitle className="font-magic text-xl text-fantasy-gold flex items-center gap-2">
                <User className="h-6 w-6" />
                Tài Khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-fantasy-light/90">
                  Tên Người Dùng
                </Label>
                <Input id="username" defaultValue="Dragon Master" className="bg-input border-border text-foreground" />
              </div>
              <Button className="w-full rounded-xl bg-fantasy-red hover:bg-fantasy-red/80 text-fantasy-light shadow-md shadow-fantasy-red/30">
                Đổi Mật Khẩu
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-xl border-border text-muted-foreground hover:bg-muted bg-transparent"
              >
                Đăng Xuất
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
