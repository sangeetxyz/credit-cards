import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
  valid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, valid, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="text-label-13 text-[var(--geist-gray-900)]"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "geist-focus h-10 w-full rounded-[6px] border border-[var(--geist-gray-alpha-400)] bg-[var(--geist-background-100)] px-3 text-label-14 text-[var(--geist-gray-1000)] transition-colors duration-150 placeholder:text-[var(--geist-gray-700)] hover:border-[var(--geist-gray-alpha-500)]",
            error && "border-[var(--geist-red-800)]",
            valid && !error && "border-[var(--geist-green-700)]",
            className,
          )}
          {...props}
        />
        {error && (
          <p className="text-copy-13 text-[var(--geist-red-800)]">{error}</p>
        )}
        {!error && hint && (
          <p className="text-copy-13 text-[var(--geist-green-700)]">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
