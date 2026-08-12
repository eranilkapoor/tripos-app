import { z } from "zod";

export const invoiceEntrySchema = z.object({
  dateProvided: z.string().min(1, "Date is required."),
  description: z.string().trim().min(1, "Description is required."),
  qty: z.coerce.number().min(0, "Qty must be zero or more."),
  qtyType: z.string().trim().min(1, "Unit is required."),
  rate: z.coerce.number().min(0, "Rate must be zero or more."),
  total: z.coerce.number().min(0, "Total must be zero or more."),
});

export const invoiceSchema = z.object({
  countryCode: z.enum(["IN", "AE", "GB", "EU", "US"]),
  series: z.string().trim().min(1, "Series is required."),
  invoiceNo: z.string().trim().min(1, "Invoice number is required."),
  invoiceDate: z.string().min(1, "Invoice date is required."),
  provider: z.object({
    companyName: z.string().trim().min(1, "Provider name is required."),
    taxNo: z.string().trim().min(1, "Provider tax number is required."),
  }),
  customer: z.object({
    companyName: z.string().trim().min(1, "Customer name is required."),
  }),
  entries: z.array(invoiceEntrySchema).min(1, "Add at least one line item."),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
