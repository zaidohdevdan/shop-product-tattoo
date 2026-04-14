import React from 'react';

export default function AdminProductsLoading() {
  return (
    <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 animate-ping rounded-full border-2 border-indigo-500/20" />
        <div className="h-12 w-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
      <p className="animate-pulse text-sm font-bold uppercase tracking-widest text-zinc-500">
        Carregando Painel Administrativo...
      </p>
    </div>
  );
}
