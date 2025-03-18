import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export type TrackData = {
	title: string;
	number: number;
	fileName: string;
	mimeType: string;
	suiId?: string;
	uploadUrl?: string;
	blobName?: string;
};
