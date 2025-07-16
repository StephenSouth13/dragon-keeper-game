"use client"

import { Calendar, Home, Inbox, Settings, ChevronDown, Gem, Swords, Store } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useGame } from "@/lib/game-context"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// Menu items.
const mainMenuItems = [
  {
    title: "Trang Chủ",
    url: "/",
    icon: Home,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Gem,
  },
  {
    title: "Đấu Trường",
    url: "/arena",
    icon: Swords,
  },
  {
    title: "Cửa Hàng",
    url: "/shop",
    icon: Store,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { player } = useGame()

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 p-2">
          <img src="/placeholder.svg?height=32&width=32" alt="Dragon Keeper Logo" className="h-8 w-8" />
          <span className="font-magic text-xl font-bold text-fantasy-gold text-glow shadow-fantasy-gold/50">
            Dragon Keeper
          </span>
        </Link>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={player.avatar || "/placeholder.svg"} alt={player.name} />
                    <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{player.name}</span>
                  <ChevronDown className="ml-auto h-4 w-4 shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Cấp độ: {player.level}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>XP: {player.xp}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Coin: {player.coins}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Cài đặt</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Điều Hướng</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Khác</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#">
                    <Inbox />
                    <span>Hộp Thư</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#">
                    <Calendar />
                    <span>Sự Kiện</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#">
                    <Settings />
                    <span>Cài Đặt</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <p className="text-xs text-muted-foreground text-center">&copy; {new Date().getFullYear()} Dragon Keeper.</p>
      </SidebarFooter>
    </Sidebar>
  )
}
