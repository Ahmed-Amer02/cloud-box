import { z } from 'zod';

const nameRegex = /^[^<>:"/\\|?*]+$/;

export const fileRenameSchema = z.object({
  name: z
    .string()
    .min(1, 'File name cannot be empty')
    .max(255, 'File name is too long')
    .regex(nameRegex, 'File name contains invalid characters'),
});
export type FileRenameValues = z.infer<typeof fileRenameSchema>;
