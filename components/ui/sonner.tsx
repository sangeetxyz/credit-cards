"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      theme="dark"
      position="bottom-center"
      duration={3000}
      toastOptions={{
        classNames: {
          toast:
            "rounded-[6px] border border-[var(--geist-gray-alpha-400)] bg-[var(--geist-background-100)] text-[var(--geist-gray-1000)] shadow-[var(--geist-shadow-popover)]",
        },
      }}
    />
  );
}
