"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useState, type ReactNode } from "react";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** The signature "gallery curtain" mask reveal. */
  curtain?: boolean;
  rounded?: boolean;
  children?: ReactNode; // caption overlay revealed after image
};

/**
 * Image reveal used across the gallery. With `curtain`, an ivory panel slides
 * up to unveil the artwork — the site's signature exhibition gesture.
 */
export function ArtworkReveal({
  src,
  alt,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  className = "",
  imgClassName = "",
  curtain = false,
  children,
}: Props) {
  const reduce = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={reduce ? { opacity: 0 } : { opacity: 1 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      onViewportEnter={() => setRevealed(true)}
    >
      <motion.div
        initial={reduce ? { scale: 1 } : { scale: 1.06 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="h-full w-full"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
      </motion.div>

      {curtain && !reduce && (
        <motion.div
          aria-hidden
          className="absolute inset-0 z-10 bg-ivory"
          initial={{ y: "0%" }}
          whileInView={{ y: "-101%" }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
        />
      )}

      {children && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={revealed ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: curtain ? 0.9 : 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
