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
import { ClientOnly } from "@/components/client-only" // Import ClientOnly component

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
    generator: 'Dung & Long',
    applicationName: 'Dragon Keeper',
    keywords: ['game', 'nuôi rồng', 'chiến đấu', 'rồng', 'game online'],
    authors: [
      {
        name: 'Dung & Long',
      }],
    creator: 'Dung & Long',
    openGraph: {
      title: 'Dragon Keeper - Thế giới nuôi rồng kỳ ảo',
      description: 'Nuôi dưỡng, huấn luyện và chiến đấu với những chú rồng của bạn!',
      siteName: 'Dragon Keeper',
      images: [
        {
          url: '/dragon-og-image.png', // Open Graph image
          width: 1200,
          height: 630,
          alt: 'Dragon Keeper - Thế giới nuôi rồng kỳ ảo',
        },
      ],
      locale: 'vi_VN',
      type: 'website',
    },
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
          <AudioPlayer> {/* 👈 Bọc toàn bộ bên trong AudioPlayer */}
            <GameProvider>
              <SidebarProvider defaultOpen={true}>
                <AppSidebar />
                <SidebarInset>
                  <main className="flex-1 p-4 md:p-6 lg:p-8">
                    <SidebarTrigger className="mb-4 md:hidden" />
                    {children}
                  </main>
                  <AppFooter />
                </SidebarInset>
              </SidebarProvider>
            </GameProvider>
            <ClientOnly>
              <Chatbot />
            </ClientOnly>
            <Toaster />
          </AudioPlayer>
        </ThemeProvider>
      </body>
    </html>
  )
}
