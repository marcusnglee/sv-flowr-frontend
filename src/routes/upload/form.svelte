<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { superForm, fileProxy, defaults } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';

	const formSchema = z.object({
		releaseTitle: z.string().min(1, 'Please create a title'),
		releaseImage: z.instanceof(File, { message: 'Please upload a file.' })
	});

	const form = superForm(defaults(zod(formSchema)), {
		SPA: true,
		validators: zod(formSchema),
		onUpdate({ form }) {
			if (form.valid) {
				// TODO: Use presigned urls for cover and song uploading
				// TODO: Call an external API with form.data and presigned urls, await the result and update form
			}
		}
	});
	const files = fileProxy(form, 'releaseImage');
	let imageName = $state();
	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance enctype="multipart/form-data">
	<Form.Field {form} name="releaseImage">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Image</Form.Label>
				<Input
					accept="image/png, image/jpeg"
					type="file"
					{...props}
					bind:files={$files}
					bind:value={imageName}
				/>
			{/snippet}
		</Form.Control>
		<Form.Description>This is the cover image of the release.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="releaseTitle">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Title</Form.Label>
				<Input {...props} bind:value={$formData.releaseTitle} />
			{/snippet}
		</Form.Control>
		<Form.Description>This is the title of the release.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Submit</Form.Button>
</form>
