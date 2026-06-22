import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "tertiary" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "geist-focus inline-flex items-center justify-center gap-2 rounded-[6px] text-button-14 transition-colors duration-150 disabled:cursor-not-allowed disabled:bg-[var(--geist-gray-100)] disabled:text-[var(--geist-gray-700)]",
          variant === "primary" &&
            "bg-[var(--geist-gray-1000)] text-[var(--geist-background-100)] hover:bg-[var(--geist-gray-900)] active:bg-[var(--geist-gray-800)]",
          variant === "secondary" &&
            "border border-[var(--geist-gray-alpha-400)] bg-[var(--geist-background-100)] text-[var(--geist-gray-1000)] hover:bg-[var(--geist-gray-100)] active:bg-[var(--geist-gray-200)]",
          variant === "tertiary" &&
            "bg-transparent text-[var(--geist-gray-1000)] hover:bg-[var(--geist-gray-alpha-100)] active:bg-[var(--geist-gray-alpha-200)]",
          variant === "danger" &&
            "bg-[var(--geist-red-800)] text-white hover:opacity-90 active:opacity-95",
          size === "sm" && "h-8 px-1.5 text-label-14",
          size === "md" && "h-10 px-2.5",
          size === "lg" && "h-12 px-3.5 text-[16px] leading-5",
          size === "icon" && "h-10 w-10",
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
