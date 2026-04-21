"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Link
        href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-slate-950/50 text-slate-400 transition-all hover:bg-slate-900 hover:text-white",
          currentPage <= 1 && "pointer-events-none opacity-20"
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>

      <div className="flex items-center gap-1.5 mx-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          // Logic to show only a few pages around the current one if there are many
          if (
            totalPages > 7 &&
            page !== 1 &&
            page !== totalPages &&
            (page < currentPage - 1 || page > currentPage + 1)
          ) {
            if (page === currentPage - 2 || page === currentPage + 2) {
              return <span key={page} className="text-slate-600 px-1">...</span>;
            }
            return null;
          }

          const isActive = page === currentPage;
          return (
            <Link
              key={page}
              href={createPageURL(page)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black transition-all",
                isActive
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 scale-110"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
              )}
            >
              {page}
            </Link>
          );
        })}
      </div>

      <Link
        href={currentPage < totalPages ? createPageURL(currentPage + 1) : "#"}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-slate-950/50 text-slate-400 transition-all hover:bg-slate-900 hover:text-white",
          currentPage >= totalPages && "pointer-events-none opacity-20"
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </Link>
    </div>
  );
}
