"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ApiRecord, CrmModule } from "../components/crmTypes";
import { normalizeRecords } from "../components/crmUtils";
import { apiGet } from "../lib/apiClient";
import { useSession } from "../lib/session";

export function moduleQueryKey(
  moduleId: string,
  search: string,
  organizationId?: unknown,
  branchId?: unknown,
) {
  return [
    "crm-module",
    moduleId,
    search,
    String(organizationId ?? ""),
    String(branchId ?? ""),
  ] as const;
}

type ModuleQueryData = {
  records: ApiRecord[];
  dashboard: Record<string, unknown> | null;
};

export function useModuleData(
  module: CrmModule,
  search: string,
  onNotify?: (message: string) => void,
) {
  const { session } = useSession();

  const query = useQuery({
    queryKey: moduleQueryKey(
      module.id,
      search,
      session?.user.organizationId,
      session?.user.branchId,
    ),
    queryFn: async (): Promise<ModuleQueryData> => {
      if (module.id === "dashboard") {
        const dashboard = await apiGet<Record<string, unknown>>(
          "tripos/dashboard",
          {
            session,
            cache: "no-store",
            errorMessage: "Dashboard API unavailable",
          },
        );
        return { dashboard, records: [] };
      }
      if (!module.endpoint) return { dashboard: null, records: [] };
      const params = new URLSearchParams({ limit: "100" });
      if (search.trim()) params.set("search", search.trim());
      const payload = await apiGet<unknown>(
        `${module.endpoint}?${params.toString()}`,
        {
          session,
          cache: "no-store",
          errorMessage: `${module.title} API unavailable`,
        },
      );
      return { dashboard: null, records: normalizeRecords(payload) };
    },
    enabled: Boolean(session),
  });

  useEffect(() => {
    if (query.isSuccess)
      onNotify?.(`${module.title} refreshed from TripOS API.`);
  }, [query.dataUpdatedAt, query.isSuccess, module.title, onNotify]);

  useEffect(() => {
    if (query.isError)
      onNotify?.(
        query.error instanceof Error ? query.error.message : "API unavailable.",
      );
  }, [query.errorUpdatedAt, query.isError, query.error, onNotify]);

  return {
    records: query.data?.records ?? [],
    dashboard: query.data?.dashboard ?? null,
    isLoading: query.isFetching,
    refetch: query.refetch,
  };
}
