import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from 'react';

type Option = {
  value: string;
  label: string;
};

type DropdownProps = {
  icon?: ReactNode;
  label: string;
  placeholder?: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
};

export function Dropdown({
  icon,
  label,
  placeholder = "Select",
  options,
  value,
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  const selected = options.find(o => o.value === value);

  return (
    <div className="w-full relative">
      {/* Label */}
      <label className="block mb-3 text-foreground font-medium flex items-center gap-3">
        {icon && <span className="w-4 h-4 text-primary flex-shrink-0">{icon}</span>}
        {label}
      </label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full h-12 px-4 flex items-center justify-between",
          "rounded-xl border bg-background border-border",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          "transition-all duration-200"
        )}
      >
        <span className={cn("text-base", !selected && "text-muted-foreground")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="mt-2 rounded-xl border bg-card shadow-md overflow-hidden z-50 absolute w-full">
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-3 text-sm transition-colors",
                value === option.value
                  ? "bg-primary/10 font-medium text-primary"
                  : "hover:bg-muted/50"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
