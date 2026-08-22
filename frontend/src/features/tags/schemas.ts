import { z } from 'zod';


export const tagFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Tag name cannot be empty')
    .max(50, 'Tag name is too long')
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      'Tag name can only contain letters, numbers, spaces, hyphens and underscores',
    ),
});
export type TagFormValues = z.infer<typeof tagFormSchema>;
