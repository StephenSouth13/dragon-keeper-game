import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Cinzel_Decorative } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { GameProvider } from "@/lib/game-context"
import { AppFooter } from "@/components/app-footer"
import { Chatbot } from "@/components/chatbot"
import { AudioPlayer } from "@/components/audio-player"

const inter = Inter({ subsets: ["latin"] })

const cinzel = Cinzel_Decorative({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-magic",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Dragon Keeper - Thế giới nuôi rồng kỳ ảo",
  description: "Nuôi dưỡng, huấn luyện và chiến đấu với những chú rồng của bạn!",
  icons: {
    icon: "/dragon-icon.png", // Favicon
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} ${cinzel.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <GameProvider>
            <SidebarProvider defaultOpen={true}>
              {" "}
              {/* Sidebar is open by default [^4] */}
              <AppSidebar />
              <SidebarInset>
                {" "}
                {/* Wrap main content in SidebarInset for proper layout [^4] */}
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                  <SidebarTrigger className="mb-4 md:hidden" /> {/* Mobile trigger */}
                  {children}
                </main>
                <AppFooter />
              </SidebarInset>
            </SidebarProvider>
          </GameProvider>
          <Chatbot />
          <AudioPlayer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
