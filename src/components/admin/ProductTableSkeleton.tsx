import React from "react";

export function ProductTableSkeleton() {
  return (
    <div className="premium-card overflow-hidden animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-700 border-b border-slate-600">
              <th className="pl-10 pr-6 py-6 h-16 w-[350px]">
                <span className="sr-only">Produto</span>
                <div className="h-3 w-24 bg-slate-600 rounded-full" />
              </th>
              <th className="px-6 py-6 h-16 w-[150px]">
                <span className="sr-only">Categoria</span>
                <div className="h-3 w-20 bg-slate-600 rounded-full" />
              </th>
              <th className="px-6 py-6 h-16 w-[100px]">
                <span className="sr-only">SKU</span>
                <div className="h-3 w-16 bg-slate-600 rounded-full mx-auto" />
              </th>
              <th className="px-6 py-6 h-16 w-[120px]">
                <span className="sr-only">Estoque</span>
                <div className="h-3 w-16 bg-slate-600 rounded-full ml-auto" />
              </th>
              <th className="px-6 py-6 h-16 w-[150px]">
                <span className="sr-only">Preço</span>
                <div className="h-3 w-20 bg-slate-600 rounded-full ml-auto" />
              </th>
              <th className="px-6 py-6 h-16 w-[120px]">
                <span className="sr-only">Status</span>
                <div className="h-3 w-16 bg-slate-600 rounded-full mx-auto" />
              </th>
              <th className="pl-6 pr-10 py-6 h-16 w-[120px]">
                <span className="sr-only">Ações</span>
                <div className="h-3 w-16 bg-slate-600 rounded-full ml-auto" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="bg-white">
                <td className="pl-10 pr-6 py-6">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-xl bg-slate-100 shrink-0" />
                    <div className="space-y-2">
                      <div className="h-4 w-48 bg-slate-100 rounded-full" />
                      <div className="h-3 w-24 bg-slate-50 rounded-full" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="h-7 w-24 bg-slate-100 rounded-lg" />
                </td>
                <td className="px-6 py-6">
                  <div className="h-4 w-20 bg-slate-100 rounded-full mx-auto" />
                </td>
                <td className="px-6 py-6">
                  <div className="h-4 w-16 bg-slate-100 rounded-full ml-auto" />
                </td>
                <td className="px-6 py-6">
                  <div className="h-5 w-24 bg-slate-100 rounded-full ml-auto" />
                </td>
                <td className="px-6 py-6">
                  <div className="h-7 w-20 bg-slate-100 rounded-lg mx-auto" />
                </td>
                <td className="pl-6 pr-10 py-6">
                  <div className="flex justify-end gap-3">
                    <div className="h-9 w-9 bg-slate-100 rounded-xl" />
                    <div className="h-9 w-9 bg-slate-100 rounded-xl" />
                    <div className="h-9 w-9 bg-slate-100 rounded-xl" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
