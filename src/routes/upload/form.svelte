<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { zod } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer, superForm, fileProxy } from 'sveltekit-superforms';
	import { formSchema, type FormSchema } from './schema';
	import { z } from 'zod';

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();

	const form = superForm(data.form, {
		SPA: true,
		validators: zod(formSchema),
		onUpdate({ form }) {
			if (form.valid) {
				console.log(form.data);
				// TODO: Use presigned urls for cover and song uploading
				// TODO: Call an external API with form.data and presigned urls
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
