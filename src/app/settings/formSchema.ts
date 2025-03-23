import { z } from "zod";

export const formSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  fontSize: z.number().min(14).max(28),
  fontFamily: z.enum(["serif", "sans-serif", "monospace"]),
  lineHeight: z.string(),
  preferredReadingMode: z.enum(["page", "scroll"]),
  enableReadHistory: z.boolean(),
});

export type SettingsFormValues = z.infer<typeof formSchema>;