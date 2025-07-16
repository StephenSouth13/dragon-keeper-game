"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, X } from "lucide-react"

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: "Chào mừng, Dragon Master! Tôi là trợ thủ rồng của bạn. Bạn cần giúp gì?", sender: "bot" },
  ])
  const [input, setInput] = useState("")

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { id: prev.length + 1, text: input, sender: "user" }])
      setInput("")
      // Simulate bot response (replace with actual AI integration)
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: "Tôi đang học hỏi thêm về cách giúp đỡ bạn. Hãy hỏi tôi về rồng hoặc game nhé!",
            sender: "bot",
          },
        ])
      }, 1000)
    }
  }

  return (
    <>
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-16 h-16 bg-fantasy-purple hover:bg-fantasy-purple/80 shadow-lg shadow-fantasy-purple/50 flex items-center justify-center animate-glow"
          style={{ "--tw-shadow-color": "hsl(260 80% 40%)" } as React.CSSProperties}
          aria-label={isOpen ? "Đóng chatbot" : "Mở chatbot"}
        >
          <Image
            src="/dragon-icon.png" // Placeholder dragon icon
            alt="Chatbot Dragon Icon"
            width={40}
            height={40}
            className="animate-float"
          />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-4 z-50 w-80 md:w-96"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card border border-border shadow-xl shadow-fantasy-purple/30">
              <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                <CardTitle className="font-magic text-xl text-fantasy-gold">Trợ Thủ Rồng</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Đóng">
                  <X className="h-5 w-5 text-muted-foreground" />
                </Button>
              </CardHeader>
              <CardContent className="p-4 h-80 overflow-y-auto flex flex-col space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] p-2 rounded-lg ${
                        msg.sender === "user" ? "bg-fantasy-blue text-fantasy-light" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="p-4 pt-2 flex items-center gap-2">
                <Input
                  placeholder="Nhập tin nhắn..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-input border-border text-foreground focus-visible:ring-fantasy-purple"
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  className="bg-fantasy-purple hover:bg-fantasy-purple/80 shadow-md shadow-fantasy-purple/30"
                  aria-label="Gửi tin nhắn"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
