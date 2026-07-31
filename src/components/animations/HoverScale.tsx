"use client";

import { motion } from "framer-motion";
import { ReactNode, CSSProperties } from "react";

interface HoverScaleProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  scale?: number;
  as?: "div" | "span" | "li" | "a";
}

export function HoverScale({
  children,
  className = "",
  style,
  scale = 1.03,
  as = "div",
}: HoverScaleProps) {
  const MotionComponent = motion[as as keyof typeof motion] as React.ElementType;

  return (
    <MotionComponent
      whileHover={{ scale }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={className}
      style={style}
    >
      {children}
    </MotionComponent>
  );
}
