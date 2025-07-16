"use client";

import type React from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import { useGame } from "@/lib/game-context";

export default function HomePage() {
  const { player } = useGame();
  const isLoggedIn = player.id !== ""; // Simple check for logged in state

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-5xl md:text-7xl font-bold text-fantasy-gold mb-4 font-magic text-glow shadow-fantasy-gold/50"
        variants={itemVariants}
      >
        Dragon Keeper
      </motion.h1>
      <motion.p
        className="text-xl md:text-2xl text-fantasy-light mb-8 max-w-2xl"
        variants={itemVariants}
      >
        Thế giới nuôi rồng kỳ ảo
      </motion.p>

      <motion.div
        className="relative w-64 h-64 md:w-96 md:h-96 mb-12"
        variants={itemVariants}
      >
        <Image
          src="dragon/WordDragon.png"
          alt="Flying Dragon"
          layout="fill"
          objectFit="contain"
          className="animate-float drop-shadow-lg shadow-fantasy-purple/50"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Link href={isLoggedIn ? "/dashboard" : "/dashboard"} passHref>
          <Button
            size="lg"
            className="px-8 py-4 text-lg rounded-full bg-fantasy-purple hover:bg-fantasy-purple/80 text-fantasy-light font-bold shadow-lg shadow-fantasy-purple/50 transition-all duration-300 hover:scale-105 animate-glow"
            style={
              { "--tw-shadow-color": "hsl(260 80% 40%)" } as React.CSSProperties
            }
          >
            {isLoggedIn ? "Tiếp tục chơi" : "Bắt đầu chơi"}
          </Button>
        </Link>
      </motion.div>

      <motion.section
        className="mt-16 max-w-4xl text-fantasy-light/90 grid md:grid-cols-3 gap-8 text-left"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-card p-6 rounded-xl shadow-lg border border-border"
          variants={itemVariants}
        >
          <h3 className="text-2xl font-bold text-fantasy-gold mb-2 font-magic">
            Hệ thống rồng đa dạng
          </h3>
          <p>
            Khám phá và nuôi dưỡng các loài rồng độc đáo: Rồng lửa, rồng băng,
            rồng bóng tối, và nhiều hơn nữa!
          </p>
        </motion.div>
        <motion.div
          className="bg-card p-6 rounded-xl shadow-lg border border-border"
          variants={itemVariants}
        >
          <h3 className="text-2xl font-bold text-fantasy-gold mb-2 font-magic">
            Tiến hóa và Nâng cấp
          </h3>
          <p>
            Huấn luyện rồng của bạn, tăng cấp độ, và chứng kiến chúng tiến hóa
            thành những sinh vật mạnh mẽ hơn.
          </p>
        </motion.div>
        <motion.div
          className="bg-card p-6 rounded-xl shadow-lg border border-border"
          variants={itemVariants}
        >
          <h3 className="text-2xl font-bold text-fantasy-gold mb-2 font-magic">
            Đấu trường PvP
          </h3>
          <p>
            Thử thách kỹ năng của bạn trong các trận chiến PvP gay cấn với những
            người chơi khác để giành vinh quang và phần thưởng.
          </p>
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
