import { z } from 'zod';

export const formSchema = z.object({
	releaseTitle: z.string().min(5, 'Release title must be at least 5 characters long'),
	releaseImage: z.instanceof(File, { message: 'Please upload a file.' })
});

export type FormSchema = typeof formSchema;
