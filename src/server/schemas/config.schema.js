import { z } from 'zod';

export const ConfigSchema = z.object({
  name: z.string().min(1).regex(/^[a-zA-Z0-9_-]+(\.json)?$/),
  config: z.any()
});

export const LicenseSchema = z.object({
  key: z.string().min(10)
});
