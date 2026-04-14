import React from "react";

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-24 px-6 animate-pulse">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col gap-4">
          <div className="h-4 w-32 rounded bg-white/5" />
          <div className="h-12 w-64 rounded bg-white/5" />
          <div className="h-6 w-96 rounded bg-white/5" />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl bg-zinc-950 p-4 border border-white/5">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white/5" />
              
              <div className="flex flex-col gap-2 p-2">
                <div className="h-4 w-1/3 rounded bg-white/5" />
                <div className="h-6 w-3/4 rounded bg-white/5" />
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="h-8 w-1/2 rounded bg-white/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
