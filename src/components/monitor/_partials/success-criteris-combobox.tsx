"use client";

import { useState, useMemo } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";;
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SuccessCriteriaType } from "@/types/success-criteria.type";

interface Props {
  successCriteriaList: SuccessCriteriaType[];
  value: number[];
  onChange: (value: number[]) => void;
}

export function SuccessCriteriaCombobox({
  successCriteriaList,
  value,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return successCriteriaList;
    return successCriteriaList.filter((item) =>
      item.name.toLowerCase().includes(q)
    );
  }, [successCriteriaList, query]);

  const selectedItems = useMemo(
    () => successCriteriaList.filter((item) => value.includes(item.id)),
    [successCriteriaList, value]
  );

  const toggle = (id: number) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  const remove = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="button"
          onClick={() => setOpen(true)}
          className={cn(
            "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-3 py-2 text-sm cursor-pointer",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            "hover:bg-accent/10"
          )}
        >
          {selectedItems.length === 0 && (
            <span className="text-muted-foreground">Search criteria...</span>
          )}
          {selectedItems.map((item) => (
            <Badge
              key={item.id}
              variant="secondary"
              className="flex items-center gap-1 pr-1"
            >
              {item.name}
              <button
                type="button"
                onClick={(e) => remove(item.id, e)}
                className="ml-1 rounded-full hover:bg-muted-foreground/20"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-full p-0"
        style={{ width: "var(--radix-popover-trigger-width)" }}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="p-2 border-b">
          <Input
            placeholder="Search criteria..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8"
          />
        </div>

        <div className="max-h-52 overflow-y-auto">
          {filteredItems.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No criteria found.
            </p>
          )}
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => toggle(item.id)}
              className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border border-primary",
                    value.includes(item.id)
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50"
                  )}
                >
                  {value.includes(item.id) && (
                    <Check className="h-3 w-3" />
                  )}
                </div>
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{item.type}</span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}