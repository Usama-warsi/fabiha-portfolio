"use client";

import * as React from "react";
import {
  type HTMLMotionProps,
  type MotionValue,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "motion/react";

// Local class joiner (project has no shadcn `cn`; classes here don't conflict).
const cx = (...classes: Array<string | undefined | false>) =>
  classes.filter(Boolean).join(" ");

// Default 5-cell bento layout, adapted from the 21st.dev hero-gallery block.
// Theme-agnostic: the consuming section owns colours/rounding.
const bentoDefault = `
  relative grid gap-4
  [&>*:first-child]:origin-top-right [&>*:nth-child(3)]:origin-bottom-right [&>*:nth-child(4)]:origin-top-right
  grid-cols-8 grid-rows-[1fr_0.5fr_0.5fr_1fr]
  [&>*:first-child]:col-span-8 md:[&>*:first-child]:col-span-6 [&>*:first-child]:row-span-3
  [&>*:nth-child(2)]:col-span-2 md:[&>*:nth-child(2)]:row-span-2 [&>*:nth-child(2)]:hidden md:[&>*:nth-child(2)]:block
  [&>*:nth-child(3)]:col-span-2 md:[&>*:nth-child(3)]:row-span-2 [&>*:nth-child(3)]:hidden md:[&>*:nth-child(3)]:block
  [&>*:nth-child(4)]:col-span-4 md:[&>*:nth-child(4)]:col-span-3
  [&>*:nth-child(5)]:col-span-4 md:[&>*:nth-child(5)]:col-span-3
`;

type CtxValue = { scrollYProgress: MotionValue<number>; isInView: boolean };
const ContainerScrollContext = React.createContext<CtxValue | undefined>(
  undefined
);
function useContainerScrollContext() {
  const ctx = React.useContext(ContainerScrollContext);
  if (!ctx)
    throw new Error(
      "useContainerScrollContext must be used within a <ContainerScroll>"
    );
  return ctx;
}

export const ContainerScroll = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef });
  // Only let the viewport-fixed title show while the section is on screen —
  // otherwise it floats over earlier sections (e.g. the hero).
  const isInView = useInView(scrollRef);
  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress, isInView }}>
      <div
        ref={scrollRef}
        className={cx("relative min-h-screen w-full", className)}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  );
};

export const BentoGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cx(bentoDefault, className)} {...props} />
));
BentoGrid.displayName = "BentoGrid";

export const BentoCell = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, style, ...props }, ref) => {
    const { scrollYProgress } = useContainerScrollContext();
    const translate = useTransform(scrollYProgress, [0.1, 0.9], ["-35%", "0%"]);
    const scale = useTransform(scrollYProgress, [0, 0.9], [0.5, 1]);
    return (
      <motion.div
        ref={ref}
        className={className}
        style={{ translate, scale, ...style }}
        {...props}
      />
    );
  }
);
BentoCell.displayName = "BentoCell";

export const ContainerScale = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>(({ className, style, ...props }, ref) => {
  const { scrollYProgress, isInView } = useContainerScrollContext();
  // Fade in only once the section is actually pinned (progress > 0). At exactly
  // 0 the section is still entering from below, so keep the title hidden — this
  // stops it floating over the previous section.
  const opacity = useTransform(scrollYProgress, [0, 0.06, 0.5], [0, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const position = useTransform(scrollYProgress, (pos) =>
    pos >= 0.6 ? "absolute" : "fixed"
  );
  return (
    <motion.div
      ref={ref}
      className={cx("left-1/2 top-1/2 size-fit", className)}
      style={{
        translate: "-50% -50%",
        scale,
        // keep it out of the way (and invisible) unless the section is visible
        position: isInView ? position : "absolute",
        opacity: isInView ? opacity : 0,
        ...style,
      }}
      {...props}
    />
  );
});
ContainerScale.displayName = "ContainerScale";
