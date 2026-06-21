"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Result {
  title: string;
  slug: string;
  category?: string;
}

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [results, _setResults] = useState<Result[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_query, _setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const search = useCallback(async (q: string) => {
    _setQuery(q);
  }, []);

  return (
    <>
      <Button variant="outline" size="sm" className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:w-64" onClick={() => setOpen(true)}>
        <Search className="mr-2 h-4 w-4" />
        Search templates...
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Search templates..." onValueChange={search} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Templates">
              {results.map((r) => (
                <CommandItem
                  key={r.slug}
                  value={r.title}
                  onSelect={() => {
                    router.push(`/template/${r.slug}`);
                    setOpen(false);
                  }}
                >
                  {r.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
