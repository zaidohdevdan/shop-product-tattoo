import React from 'react';
import { categoryService } from '@/services/category-service';
import { Tag, Plus, FolderSearch } from 'lucide-react';
import { saveCategoryAction } from '@/actions/admin-categories-actions';
import { DeleteCategoryButton } from '@/components/admin/DeleteCategoryButton';
import { Pagination } from '@/components/admin/Pagination';

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminCategoriesPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 10;

  const categories = await categoryService.getAllCategories(currentPage, limit);
  const totalCategories = await categoryService.getCategoriesCount();
  const totalPages = Math.ceil(totalCategories / limit);

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10 selection:bg-indigo-600 selection:text-white">
      <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-1.5 bg-indigo-600 rounded-full" />
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Taxonomia do Catálogo</h1>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4.5">Estrutura de Categorias e Navegação</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Formulário Lateral */}
        <div className="lg:col-span-1 sticky top-10 animate-in fade-in slide-in-from-left-4 duration-700">
          <form action={saveCategoryAction} className="premium-card p-10 flex flex-col gap-8 shadow-md">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-8">
              <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition-transform">
                 <Tag className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-slate-900 font-black uppercase tracking-tight text-lg">Nova Entrada</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Registrar Categoria</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <label className="flex flex-col gap-2.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome da Categoria</span>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Ex: Maquinário Técnico"
                  required 
                  className="h-14 bg-slate-50 border border-slate-200 rounded-xl px-5 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-sm" 
                />
              </label>

              <button 
                type="submit" 
                className="h-14 w-full rounded-xl bg-zinc-900 hover:bg-indigo-600 text-white font-black uppercase tracking-widest shadow-lg shadow-zinc-900/10 transition-all active:scale-95 flex items-center justify-center gap-3 text-[11px]"
              >
                <Plus className="h-4 w-4" /> 
                <span>Cadastrar Agora</span>
              </button>
            </div>
          </form>
        </div>

        {/* Tabela de Categorias */}
        <div className="lg:col-span-2 space-y-6">
          <div className="premium-card overflow-hidden animate-in fade-in slide-in-from-right-4 duration-700 shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificação</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Cadastros</th>
                    <th className="px-8 py-5 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-5">
                          <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-200 group-hover:border-indigo-200 transition-all">
                            <span className="font-black text-slate-400 group-hover:text-indigo-600 transition-colors text-xs">{cat.name.charAt(0)}</span>
                          </div>
                          <div>
                             <p className="font-black text-slate-900 tracking-tight uppercase group-hover:text-indigo-600 transition-colors text-xs">{cat.name}</p>
                             <p className="text-[9px] font-black text-indigo-600/70 uppercase tracking-widest mt-1">/{cat.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="executive-badge bg-slate-50 text-slate-600 border-slate-100 ring-2 ring-slate-900/5">
                          {cat._count.products} <span className="opacity-60 ml-1">ITENS</span>
                        </span>
                      </td>
                      <td className="px-8 py-5">
                         <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                           <DeleteCategoryButton id={cat.id} productCount={cat._count.products} />
                         </div>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-8 py-32 text-center">
                        <div className="flex flex-col items-center gap-5 text-slate-700 opacity-40">
                          <FolderSearch className="h-20 w-20 stroke-[1]" />
                          <div className="space-y-2">
                            <p className="font-black uppercase tracking-[0.3em] text-sm">Sem divisões</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest">Inicie o catálogo cadastrando uma categoria.</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <Pagination totalPages={totalPages} currentPage={currentPage} />
        </div>
      </div>
    </div>
  );
}
