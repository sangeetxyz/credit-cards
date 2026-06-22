import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full max-w-[360px] max-[380px]:max-w-full",
        className,
      )}
    >
      <div className="card-surface relative aspect-[1.586/1] overflow-hidden border-white/6 p-4 min-[380px]:p-5 sm:p-6">
        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-start justify-between gap-3">
            <Skeleton className="h-5 w-[42%] max-w-[140px]" />
            <Skeleton className="h-6 w-10 shrink-0 rounded-[4px]" />
          </div>

          <div className="flex flex-1 flex-col justify-center gap-3 py-2">
            <Skeleton className="h-3.5 w-[28%]" />
            <Skeleton className="h-8 w-[52%] min-[380px]:h-9" />
          </div>

          <div className="flex items-end justify-between gap-3">
            <Skeleton className="h-4 w-[38%] max-w-[120px]" />
            <Skeleton className="h-3.5 w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CardGallerySkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-6 px-1 py-6 min-[380px]:gap-8 min-[380px]:px-2 min-[380px]:py-8 lg:grid-cols-2 xl:grid-cols-3"
      aria-busy
      aria-label="Loading cards"
    >
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="flex w-full justify-center">
          <CardSkeleton />
        </div>
      ))}
    </div>
  );
}

function WalletHeaderSkeleton() {
  return (
    <div
      className="mb-6 flex items-center justify-between gap-4 min-[380px]:mb-8 sm:mb-10"
      aria-busy
      aria-label="Loading wallet"
    >
      <div className="flex min-w-0 items-center gap-3">
        <Skeleton className="h-9 w-9 shrink-0 rounded-[var(--geist-radius-sm)]" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-6 w-20 sm:h-7 sm:w-24" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      </div>
      <Skeleton className="hidden h-10 w-[108px] shrink-0 rounded-[6px] md:block" />
    </div>
  );
}

export { CardSkeleton, CardGallerySkeleton, WalletHeaderSkeleton };
