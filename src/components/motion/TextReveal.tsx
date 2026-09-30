"use client";

import { motion, useReducedMotion } from "motion/react";
import { createElement, type ElementType, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
};

/**
 * Line-by-line mask reveal for editorial headings.
 * Pass one or more <span> lines as children for a staggered effect,
 * or a single string for a one-line reveal.
 */
export function TextReveal({ children, className, as, delay = 0 }: Props) {
  const reduce = useReducedMotion();
  const Comp = (as ?? "div") as ElementType;
  const MotionComp = motion(Comp);

  if (reduce) {
    return createElement(Comp, { className }, children);
  }

  return (
    <MotionComp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ staggerChildren: 0.12, delayChildren: delay }}
    >
      {children}
    </MotionComp>
  );
}

export function RevealLine({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`block overflow-hidden ${className ?? ""}`}>
      <motion.span
        className="block"
        variants={{
          hidden: { y: "110%" },
          show: {
            y: "0%",
            transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
          },
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}
