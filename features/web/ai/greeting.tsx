"use client";
import { motion } from "motion/react";

export const Greeting = () => (
  <div>
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="font-medium font-serif text-xl md:text-2xl"
      exit={{ opacity: 0, y: 10 }}
      initial={{ opacity: 0, y: 10 }}
      transition={{ delay: 0.5 }}
    >
      Hello there!
    </motion.div>
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="text-muted-foreground text-xl md:text-2xl"
      exit={{ opacity: 0, y: 10 }}
      initial={{ opacity: 0, y: 10 }}
      transition={{ delay: 0.6 }}
    >
      Start a new chat
    </motion.div>
  </div>
);
