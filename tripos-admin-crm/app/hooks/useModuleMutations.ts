"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiRecord, CrmModule } from "../components/crmTypes";
import { csvToRecords, getRecordId, toPayload } from "../components/crmUtils";
import { apiPatch, apiPost } from "../lib/apiClient";
import { useSession } from "../lib/session";

export function useModuleMutations(
  module: CrmModule,
  onNotify: (message: string) => void,
) {
  const { session } = useSession();
  const queryClient = useQueryClient();

  function invalidate() {
    return queryClient.invalidateQueries({
      queryKey: ["crm-module", module.id],
    });
  }

  const createRecord = useMutation({
    mutationFn: async (values: Record<string, string>) => {
      if (!module.endpoint) return;
      await apiPost(
        module.createEndpoint ?? module.endpoint,
        toPayload(module.fields, values),
        { session, errorMessage: `Could not create ${module.title}` },
      );
    },
    onSuccess: () => invalidate(),
  });

  const updateRecord = useMutation({
    mutationFn: async ({
      record,
      values,
    }: {
      record: ApiRecord;
      values: Record<string, string>;
    }) => {
      const id = getRecordId(record);
      if (!id || !module.endpoint) return;
      await apiPatch(
        `${module.endpoint}/${id}`,
        toPayload(module.fields, values),
        {
          session,
          errorMessage: `Could not update ${module.title}`,
        },
      );
    },
    onSuccess: () => invalidate(),
    onError: (error) =>
      onNotify(
        error instanceof Error
          ? error.message
          : `Could not update ${module.title}.`,
      ),
  });

  const updateStatus = useMutation({
    mutationFn: async ({
      record,
      status,
    }: {
      record: ApiRecord;
      status: string;
    }) => {
      const id = getRecordId(record);
      if (!id || !module.endpoint) return;
      const path = module.stageEndpoint
        ? `${module.endpoint}/${id}/stage`
        : `${module.endpoint}/${id}/status`;
      const body = module.stageEndpoint ? { stage: status } : { status };
      await apiPatch(path, body, {
        session,
        errorMessage: `Could not update ${module.title} status.`,
      });
    },
    onSuccess: () => invalidate(),
    onError: (error) =>
      onNotify(
        error instanceof Error
          ? error.message
          : `Could not update ${module.title} status.`,
      ),
  });

  const importRecords = useMutation({
    mutationFn: async (file: File) => {
      if (!module.endpoint) return 0;
      const text = await file.text();
      const importedRecords = file.name.toLowerCase().endsWith(".json")
        ? (JSON.parse(text) as Record<string, unknown>[])
        : csvToRecords(text, module.columns, module.rowMap);
      if (!Array.isArray(importedRecords) || !importedRecords.length)
        throw new Error("No importable records found.");
      for (const record of importedRecords) {
        await apiPost(module.createEndpoint ?? module.endpoint, record, {
          session,
          errorMessage: `Import failed for ${module.title}`,
        });
      }
      return importedRecords.length;
    },
    onSuccess: (count) => {
      onNotify(`${count} ${module.title} records imported.`);
      void invalidate();
    },
    onError: (error) =>
      onNotify(error instanceof Error ? error.message : "Import failed."),
  });

  return { createRecord, updateRecord, updateStatus, importRecords };
}
