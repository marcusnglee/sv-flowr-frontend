import type { PageServerLoad } from './$types';
import { Release, Track } from '$lib/server/db/schema';
import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	const { releaseId } = params;
	if (!releaseId) {
		throw error(400, 'Release ID is required');
	}

	const release = await db.query.Release.findFirst({
		where: eq(Release.id, releaseId),
		with: {
			Artist: true,
			Track: {
				with: {
					artist: true
				},
				orderBy: Track.trackNumber
			}
		}
	});

	if (!release) {
		throw error(404, 'Release not found :(');
	}
	return {
		release: {
			...release,
			artist: release.Artist
		},
		tracks: release.Track
	};
};
