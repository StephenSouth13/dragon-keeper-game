"use client"

import { motion } from "framer-motion"

export function AppFooter() {
  return (
    <motion.footer
      className="w-full p-4 text-center text-muted-foreground text-sm border-t border-border bg-background mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <p>&copy; 2025 Micheal & Stephen South.</p>
    </motion.footer>
  )
}
