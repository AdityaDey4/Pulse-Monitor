"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, TableProperties } from "lucide-react";

import type { CheckResultType } from "@/types/monitor.type";
import { CheckResultsTable } from "./check-results-table";
import { CheckResultsSkeleton } from "./check-results-skeleton";
import { getCheckResultsAction } from "@/actions/check-result.action";

interface Props {
  monitorId: number;
}

export function CheckResultsSheet({ monitorId }: Props) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<CheckResultType[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);
  const cursorRef = useRef<number | null>(null);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    cursorRef.current = cursor;
  }, [cursor]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await getCheckResultsAction(
      monitorId,
      cursorRef.current ?? undefined,
    );

    if (response.status === "success") {
      const data = response.data;

      if (!data) return;

      setResults((prev) => [...prev, ...data.checkResults]);

      setCursor(data.nextCursor);

      if (data.checkResults.length < 20) {
        setHasMore(false);
      }
    }

    setLoading(false);
  }, [monitorId]);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) {
      setResults([]);
      setCursor(null);
      setHasMore(true);
      setLoading(false);
      setSearch("");
    }
  }, []);

  useEffect(() => {
    if (open) {
      loadMore();
    }
  }, [open]);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    if (distanceFromBottom < 150) {
      loadMore();
    }
  }, [loadMore]);

  const filteredResults = useMemo(() => {
    if (!search.trim()) return results;

    const query = search.toLowerCase();

    return results.filter(
      (result) =>
        String(result.statusCode ?? "").includes(query) ||
        String(result.responseTime ?? "").includes(query) ||
        (result.errorMessage ?? "").toLowerCase().includes(query),
    );
  }, [results, search]);

  const successfulChecks = results.filter((r) => r.success).length;
  const failedChecks = results.length - successfulChecks;
  const averageResponse =
    results.length > 0
      ? Math.round(
          results.reduce((acc, r) => acc + (r.responseTime ?? 0), 0) /
            results.length,
        )
      : 0;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button>
          <TableProperties className="mr-2 h-4 w-4" />
          Check Results
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[45vw] min-w-212.5 max-w-none">
        <SheetHeader className="px-5 pt-5">
          <SheetTitle>Check Results</SheetTitle>
          <SheetDescription>Full monitoring history</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4 px-5 pb-5">
          <div className="grid grid-cols-4 gap-3">
            <div className="rounded-xl border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="mt-1 text-xl font-bold">{results.length}</p>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
              <p className="text-xs text-muted-foreground">Success</p>
              <p className="mt-1 text-xl font-bold text-emerald-500">
                {successfulChecks}
              </p>
            </div>

            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3">
              <p className="text-xs text-muted-foreground">Failed</p>
              <p className="mt-1 text-xl font-bold text-red-500">
                {failedChecks}
              </p>
            </div>

            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-3">
              <p className="text-xs text-muted-foreground">Avg</p>
              <p className="mt-1 text-xl font-bold text-blue-500">
                {averageResponse}ms
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search status code, response time, error..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="h-[75vh] overflow-y-auto px-1"
          >
            {loading && results.length === 0 ? (
              <CheckResultsSkeleton />
            ) : (
              <>
                <div className="pb-4">
                  <CheckResultsTable checkResults={filteredResults} />
                </div>
                {loading && results.length > 0 && (
                  <div className="space-y-3 py-4">
                    <CheckResultsSkeleton />
                  </div>
                )}

                {/* End Message */}
                {!hasMore && results.length > 0 && (
                  <div className="py-4 text-center">
                    <p className="text-xs text-muted-foreground">
                      All {results.length} results loaded
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
