"use client";

import { motion } from "framer-motion";
import { ReactNode, CSSProperties } from "react";

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delayChildren?: number;
  staggerChildren?: number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  className = "",
  style,
  delayChildren = 0.1,
  staggerChildren = 0.1,
  once = true,
}: StaggerContainerProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-50px" }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
