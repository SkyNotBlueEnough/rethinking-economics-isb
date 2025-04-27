"use client";

import { Search } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useState, type FormEvent } from "react";
import type { SearchResult } from "~/lib/types/search";
import Link from "next/link";

interface SearchDialogProps {
  className?: string;
}

export function SearchDialog({ className }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // This would be replaced with your actual search API call
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`,
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Error searching:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-md"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSearch} className="mt-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search for anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button type="submit" disabled={isSearching}>
              {isSearching ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </form>

        {isSearching ? (
          <div className="mt-6 space-y-4">
            <div className="flex flex-col gap-2">
              <div className="h-6 w-2/3 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-6 w-2/3 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-6 w-2/3 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
            </div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="mt-6 max-h-[300px] space-y-4 overflow-y-auto">
            {searchResults.map((result) => (
              <Link
                key={result.id}
                href={result.url || `/search-result/${result.id}`}
                className="block border-b pb-2 hover:bg-accent/10 hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                <div className="font-medium">{result.title}</div>
                <div className="text-sm text-muted-foreground">
                  {result.description}
                </div>
                {result.type && (
                  <div className="mt-1">
                    <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                      {result.type.charAt(0).toUpperCase() +
                        result.type.slice(1)}
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : searchQuery && !isSearching ? (
          <div className="mt-6 text-center text-muted-foreground">
            No results found for &quot;{searchQuery}&quot;
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
