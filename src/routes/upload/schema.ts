import { z } from 'zod';

export const formSchema = z.object({
	releaseTitle: z.string().min(5, 'Release title must be at least 5 characters long'),
	releaseImage: z.string()
});

export type FormSchema = typeof formSchema;
