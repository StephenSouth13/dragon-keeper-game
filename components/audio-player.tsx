"use client"

import type React from "react"

import { useState, useRef, useEffect, createContext, useContext, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"
import { motion } from "framer-motion"

interface AudioContextType {
  isPlaying: boolean
  togglePlay: () => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioPlayer({ children }: { children?: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    audioRef.current = new Audio("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3") // Placeholder audio file
    audioRef.current.loop = true
    audioRef.current.volume = 0.3 // Default volume

    const handleEnded = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    }

    audioRef.current.addEventListener("ended", handleEnded)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener("ended", handleEnded)
      }
    }
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlay }}>
      <motion.div
        className="fixed bottom-4 left-4 z-50"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Button
          onClick={togglePlay}
          size="icon"
          className="rounded-full w-12 h-12 bg-fantasy-blue hover:bg-fantasy-blue/80 shadow-lg shadow-fantasy-blue/50 flex items-center justify-center animate-glow"
          style={{ "--tw-shadow-color": "hsl(200 80% 50%)" } as React.CSSProperties}
          aria-label={isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền"}
        >
          {isPlaying ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
        </Button>
      </motion.div>
      {children}
    </AudioContext.Provider>
  )
}

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioPlayer")
  }
  return context
}
