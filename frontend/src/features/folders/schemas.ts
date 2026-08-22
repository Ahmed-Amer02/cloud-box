import { z } from 'zod';

const nameRegex = /^[^<>:"/\\|?*]+$/;

export const folderFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Folder name cannot be empty')
    .max(255, 'Folder name is too long')
    .regex(nameRegex, 'Folder name contains invalid characters'),
});
export type FolderFormValues = z.infer<typeof folderFormSchema>;
