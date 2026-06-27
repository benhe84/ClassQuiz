<script lang="ts">
	import { getLocalization } from '$lib/i18n';
	import { navbarVisible } from '$lib/stores.svelte.ts';
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	navbarVisible.visible = true;

	const { t } = getLocalization();

	let url_input = $state('');
	let file_input: File[] = $state();
	let is_loading = $state(false);

	const kahoot_regex = /^https:\/\/create\.kahoot\.it\/details\/.*\/?([a-zA-Z-\d]{36})\/?$/;

	let url_valid = $derived(kahoot_regex.test(url_input));

	const submit = async (e: Event) => {
		e.preventDefault();
		if (!url_valid) return;

		is_loading = true;

		const match = kahoot_regex.exec(url_input);
		const id = match?.[1];

		const res = await fetch(`/api/v1/quiz/import/${id}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }
		});

		if (res.status === 200) {
			window.location.href = '/dashboard';
		} else if (res.status === 400) {
			alert("This quiz isn't supported yet!");
		} else if (res.status === 403) {
			alert('Quiz is probably private!');
		} else {
			alert(`Kahoot replied with ${res.status}`);
		}

		is_loading = false;
	};

	const file_submit = async (e: Event) => {
		e.preventDefault();
		is_loading = true;

		const formdata = new FormData();
		formdata.append('file', file_input?.[0]);

		let res;

		if (file_input?.[0]?.name?.includes('.xlsx')) {
			res = await fetch('/api/v1/quiz/excel-import', {
				method: 'POST',
				body: formdata
			});
		} else if (file_input?.[0]?.name?.includes('.cqa')) {
			res = await fetch('/api/v1/eximport/', {
				method: 'POST',
				body: formdata
			});
		} else {
			alert('Wrong file type');
			is_loading = false;
			return;
		}

		if (res.status === 200) {
			window.location.href = '/dashboard';
		} else {
			alert('Import failed');
		}

		is_loading = false;
	};

	onMount(() => {
		const url_from_path = page.url.searchParams.get('url');
		url_input = url_from_path ?? '';
	});
</script>

<svelte:head>
	<title>ClassQuiz - Import</title>
</svelte:head>

<div class="flex items-center justify-center p-6">
	<div class="w-full max-w-5xl">

		<h1 class="text-3xl font-semibold text-center mb-8">
			{$t('words.import')}
		</h1>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">

			<!-- KAHOOT IMPORT -->
			<div class="card p-6 flex flex-col gap-4">
				<h2 class="text-xl font-semibold text-center">
					{$t('import_page.a_kahoot_quiz')}
				</h2>

				<div class="flex flex-col gap-2">
					<input
						bind:value={url_input}
						type="url"
						class="input"
						placeholder="https://create.kahoot.it/..."
					/>

					<p class="text-sm text-slate-400">
						{$t('import_page.url_should_look_like_this')}
					</p>
				</div>

				<button
					class="btn btn-primary mt-auto"
					disabled={!url_valid || is_loading}
					onclick={submit}
				>
					{is_loading ? '...' : $t('words.submit')}
				</button>
			</div>

			<!-- FILE IMPORT -->
			<div class="card p-6 flex flex-col gap-4">
				<h2 class="text-xl font-semibold text-center">
					{$t('import_page.classquiz_quiz')}
				</h2>

				<input
					type="file"
					accept=".cqa,.xlsx"
					bind:files={file_input}
					class="input"
				/>

				<p class="text-sm text-slate-400">
					{$t('import_page.side_import_kahoot')}
				</p>

				<button
					class="btn btn-primary mt-auto"
					disabled={!file_input?.length || is_loading}
					onclick={file_submit}
				>
					{is_loading ? '...' : $t('words.submit')}
				</button>
			</div>

		</div>
	</div>
</div>
