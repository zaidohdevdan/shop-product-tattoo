import React from 'react';

export default function AdminCategoriesLoading() {
  return (
    <div className="w-full space-y-8 animate-pulse pt-4">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 rounded-lg bg-white/5" />
        <div className="h-10 w-32 rounded-xl bg-white/5" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/5 bg-zinc-950">
        <div className="h-14 border-b border-white/5 bg-white/5" />
        <div className="divide-y divide-white/5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-white/5" />
                <div className="h-5 w-32 rounded bg-white/5" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-5 w-16 rounded bg-white/5" />
                <div className="h-8 w-8 rounded-lg bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
