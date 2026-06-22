import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn("skeleton-shimmer rounded-[6px]", className)}
      {...props}
    />
  );
}
