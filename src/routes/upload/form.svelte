<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { formSchema, type FormSchema } from './schema';
	import { type SuperValidated, type Infer, superForm, fileProxy } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(formSchema)
	});
	const files = fileProxy(form, 'image');
	$effect(() => {
		console.log($formData);
		console.log($files);
	});
	let imageName = $state();

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance enctype="multipart/form-data">
	<Form.Field {form} name="image">
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

	<Form.Field {form} name="title">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Title</Form.Label>
				<Input {...props} bind:value={$formData.title} />
			{/snippet}
		</Form.Control>
		<Form.Description>This is the title of the release.</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Submit</Form.Button>
</form>
