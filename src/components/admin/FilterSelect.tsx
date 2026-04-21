"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FilterSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  icon?: React.ReactNode;
  className?: string;
}

export function FilterSelect({
  value,
  onValueChange,
  options,
  placeholder,
  icon,
  className,
}: FilterSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger 
        className={cn(
          "h-12 bg-white border-slate-200 text-slate-900 font-bold rounded-2xl focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm w-full lg:w-[200px]",
          className
        )}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-slate-400">{icon}</span>}
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-2xl shadow-xl">
        {options.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value}
            className="focus:bg-indigo-50 focus:text-indigo-600 font-bold uppercase text-xs tracking-wide py-3 cursor-pointer"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
