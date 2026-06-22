"use client";

import {
  type MotionStyle,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { type ReactNode, useRef } from "react";
import { cn } from "@/lib/cn";

type CardTilt3DProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
};

const tiltSpring = { stiffness: 320, damping: 20, mass: 0.38 };
const MAX_TILT = 24;
const HOVER_LIFT = -6;
const HOVER_SCALE = 1.02;

export function CardTilt3D({
  children,
  className,
  disabled = false,
}: CardTilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const active = useMotionValue(0);

  const rotateX = useSpring(
    useTransform([pointerY, active], ([y, on]) =>
      on ? (0.5 - Number(y)) * MAX_TILT : 0,
    ),
    tiltSpring,
  );
  const rotateY = useSpring(
    useTransform([pointerX, active], ([x, on]) =>
      on ? (Number(x) - 0.5) * MAX_TILT : 0,
    ),
    tiltSpring,
  );
  const lift = useSpring(
    useTransform(active, (on) => Number(on) * HOVER_LIFT),
    tiltSpring,
  );
  const scale = useSpring(
    useTransform(active, (on) => 1 + Number(on) * (HOVER_SCALE - 1)),
    tiltSpring,
  );
  const depth = useSpring(
    useTransform(active, (on) => Number(on) * 14),
    tiltSpring,
  );

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || reduceMotion || !ref.current) return;
    if (event.pointerType === "touch") return;

    const rect = ref.current.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
    active.set(1);
  };

  const resetTilt = () => {
    pointerX.set(0.5);
    pointerY.set(0.5);
    active.set(0);
  };

  const style: MotionStyle | undefined =
    disabled || reduceMotion
      ? undefined
      : {
          rotateX,
          rotateY,
          y: lift,
          z: depth,
          scale,
          transformStyle: "preserve-3d",
        };

  return (
    <motion.div
      ref={ref}
      className={cn("card-tilt-root", className)}
      style={style}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
    >
      {children}
    </motion.div>
  );
}
