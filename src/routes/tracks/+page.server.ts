import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as tables from '$lib/server/db/schema';

export const load = (async () => {
	const tracks = await db.select().from(tables.Track);
	const releases = await db.select().from(tables.Release);

	return { tracks, releases };
}) satisfies PageServerLoad;
