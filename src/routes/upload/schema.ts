import { z } from 'zod';

export const formSchema = z.object({
	releaseTitle: z.string().min(5, 'Release title must have at least 1 character'),
	releaseImage: z.instanceof(File, { message: 'Release image is required' }),
	releaseType: z.enum(['SINGLE', 'EP', 'LP', 'MIXTAPE', 'COMPILATION'], {
		errorMap: () => ({ message: 'Please select a valid release type' })
	}),
	releaseGenre: z.string().optional(),
	releaseDescription: z.string().optional(),
	uploadTrackAudio: z.instanceof(File, { message: 'Track audio is required' }),
	uploadTrackTitle: z.string().min(1, 'Track must have at least 1 character')
});

export type FormSchema = typeof formSchema;
