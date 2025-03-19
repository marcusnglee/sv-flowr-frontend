import { db } from '$lib/server/db';
import { Release, User } from '$lib/server/db/schema';
import { desc, sql } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async () => {
	const recentReleases = await db
		.select({
			id: Release.id,
			title: Release.title,
			type: Release.type,
			genre: Release.genre,
			description: Release.description,
			coverUrl: Release.coverUrl,
			releaseDate: Release.releaseDate,
			createdAt: Release.createdAt,
			// Artist info
			artistId: Release.artistId,
			artistName: User.name,
			artistUsername: User.username,
			artistImage: User.image
		})
		.from(Release)
		.innerJoin(User, sql`${User.id} = ${Release.artistId}`)
		.orderBy(desc(Release.createdAt))
		.limit(20);
	console.log(recentReleases);
	return { recentReleases: recentReleases };
};
