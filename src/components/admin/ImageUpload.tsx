"use client";

import { useSyncExternalStore } from "react";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onRemove: (value: string) => void;
}

export const ImageUpload = ({
  value,
  onChange,
  onRemove
}: ImageUploadProps) => {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const onUpload = (result: CloudinaryUploadWidgetResults) => {
    if (result.event === "success") {
      const info = result.info;
      if (typeof info !== "string" && info?.secure_url) {
        // Pega a URL processada pelo Eager Transformation do Preset (recorte + bg removal + fundo negro)
        // Se ainda não estiver disponível, usa a URL original com a premissa de processamento on-the-fly.
        const cldInfo = info as Record<string, unknown>;
        const eagerRes = Array.isArray(cldInfo.eager) ? cldInfo.eager[0] as Record<string, string> : null;
        const finalUrl = eagerRes?.secure_url || info.secure_url;
        onChange([...value, finalUrl]);
      }
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        {value.map((url) => (
          <div key={url} className="relative w-[140px] h-[140px] md:w-[160px] md:h-[160px] rounded-2xl overflow-hidden border border-slate-200 group shadow-sm bg-white">
            <div className="absolute top-2 right-2 z-20 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
              <Button 
                type="button" 
                onClick={() => onRemove(url)} 
                variant="destructive" 
                size="icon"
                className="h-8 w-8 rounded-lg shadow-lg bg-rose-500 hover:bg-rose-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
              alt="Imagem do Produto"
              src={url}
              sizes="(max-width: 768px) 140px, 160px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ))}
      </div>
      
      <CldUploadWidget 
        onSuccess={onUpload} 
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            maxFiles: 5,
            multiple: true,
            sources: ['local', 'url'],
            cropping: true,
            croppingAspectRatio: 1,
            language: "pt",
            text: {
                pt: {
                    menu: {
                        files: "Meus Arquivos",
                        url: "URL da Web",
                        camera: "Câmera"
                    },
                    local: {
                        browse: "Escolher arquivo",
                        dd_title_single: "Arraste sua imagem aqui",
                        dd_title_multi: "Arraste suas imagens aqui"
                    }
                }
            },
            styles: {
                palette: {
                    window: '#ffffff',
                    windowBorder: '#e2e8f0',
                    tabIcon: '#4f46e5',
                    menuIcons: '#64748b',
                    textDark: '#0f172a',
                    textLight: '#ffffff',
                    link: '#4f46e5',
                    action: '#4f46e5',
                    inactiveTabIcon: '#94a3b8',
                    error: '#ef4444',
                    inProgress: '#4f46e5',
                    complete: '#10b981',
                    sourceBg: '#f8fafc'
                }
            }
        }}
      >
        {({ open }) => {
          const onClick = () => {
             if (value.length < 5) open();
          };

          return (
            <Button
              type="button"
              disabled={value.length >= 5}
              variant="outline"
              onClick={onClick}
              className="w-full h-40 border-dashed border-2 border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-indigo-500/50 flex flex-col items-center justify-center gap-3 group transition-all rounded-3xl"
            >
              <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all group-hover:scale-110 shadow-xs">
                <ImagePlus className="h-6 w-6" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-slate-900 font-black uppercase text-[10px] tracking-widest leading-none">Adicionar Fotos</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Recomendado: 1080x1080px • Máx. 5 fotos</span>
              </div>
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};
