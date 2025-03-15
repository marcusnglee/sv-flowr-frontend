import type { PageServerLoad, Actions } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		// validation
		// server stuff
		// etc.
	}
};
