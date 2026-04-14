import React from 'react';
import { prisma } from '@/lib/prisma';
import { Tag, Plus } from 'lucide-react';
import { saveCategoryAction } from '@/actions/admin-categories-actions';
import { DeleteCategoryButton } from '@/components/admin/DeleteCategoryButton';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white">Categorias</h1>
          <p className="text-xs md:text-sm text-zinc-500 mt-1">Organize e divida as seções do seu catálogo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Formulário Fixo Lateral */}
        <div className="md:col-span-1 sticky top-6">
          <form action={saveCategoryAction} className="bg-zinc-950 p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="p-2 bg-indigo-500/10 rounded-xl">
                 <Tag className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="text-white font-bold">Criar Nova</h3>
            </div>
            
            <label className="flex flex-col gap-2">
              <span className="text-xs font-bold text-zinc-400">Nome Oficial</span>
              <input 
                type="text" 
                name="name" 
                placeholder="Ex: Máquinas Pen"
                required 
                className="h-12 bg-black/50 border border-white/10 rounded-xl px-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" 
              />
            </label>

            <button 
              type="submit" 
              className="mt-2 h-12 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-900/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" /> Cadastrar Categoria
            </button>
            <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest font-bold">
              O Hash (URL Slug) será gerado automaticamente
            </p>
          </form>
        </div>

        {/* Tabela de Dados */}
        <div className="md:col-span-2">
          <div className="bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-white/5 bg-black/20">
                    <th className="px-6 py-5 text-xs font-bold text-zinc-400 uppercase tracking-wider">Identificação</th>
                    <th className="px-6 py-5 text-xs font-bold text-zinc-400 uppercase tracking-wider text-right">Cadastros Ativos</th>
                    <th className="px-6 py-5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                            <span className="font-black text-zinc-500">{cat.name.charAt(0)}</span>
                          </div>
                          <div>
                             <p className="font-bold text-white tracking-tight">{cat.name}</p>
                             <p className="text-xs font-medium text-emerald-500 bg-emerald-500/10 inline-flex px-2 py-0.5 rounded-full mt-1">/{cat.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-zinc-300 text-right">
                        <span className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                          {cat._count.products} item{cat._count.products !== 1 && 's'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                         <DeleteCategoryButton id={cat.id} productCount={cat._count.products} />
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center">
                        <p className="text-zinc-500 font-medium">Não há divisões</p>
                        <p className="text-xs text-zinc-600">O sistema precisa de categorias para organizar os produtos.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
