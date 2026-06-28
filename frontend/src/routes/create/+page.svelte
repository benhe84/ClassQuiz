<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import Editor from '$lib/editor.svelte';
	import { getLocalization } from '$lib/i18n';
	import { navbarVisible } from '$lib/stores.svelte.ts';
	import type { Question } from '$lib/quiz_types';
	import { page } from '$app/state';
	navbarVisible.visible = false;
	const { t } = getLocalization();
	interface Data {
		public: boolean;
		title: string;
		description: string;
		questions: Question[];
	}
	let responseData = { open: false };
	let data: Data = $state();
	let quiz_id = $state(null);
	onMount(() => {
		const from_localstorage = localStorage.getItem('create_game');
		if (from_localstorage === null) {
			let title = page.url.searchParams.get('title');
			title ??= '';
			data = { description: '', public: false, title, questions: [] };
		} else {
			data = JSON.parse(from_localstorage);
		}
	});
</script>

<svelte:head>
	<title>ClassQuiz - Create</title>
</svelte:head>

{#if data !== undefined}
	<Editor bind:data bind:quiz_id />
{/if}

<!-- Erfolgs-Modal -->
<div
	class="fixed inset-0 z-10 overflow-y-auto"
	aria-labelledby="modal-title"
	role="dialog"
	aria-modal="true"
	class:hidden={!responseData.open}
>
	<div class="flex min-h-screen items-center justify-center p-4">
		<div class="fixed inset-0 bg-black/60 transition-opacity" aria-hidden="true"></div>
		<div class="relative z-10 w-full max-w-md rounded-2xl border border-white/10 shadow-2xl" style="background-color:var(--surface);">
			<div class="p-6">
				<div class="flex items-start gap-4">
					<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style="background-color:color-mix(in srgb, var(--success) 15%, transparent);">
						<svg class="h-5 w-5" style="color:var(--success);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<div>
						<h3 class="text-lg font-semibold" style="color:var(--text-primary);" id="modal-title">
							{$t('create_page.success.title')}
						</h3>
						<p class="mt-1 text-sm" style="color:var(--text-secondary);">
							{$t('create_page.success.body')}
						</p>
					</div>
				</div>
			</div>
			<div class="flex justify-end border-t px-6 py-4" style="border-color:var(--border);">
				<button
					type="button"
					onclick={() => { window.location.href = '/dashboard'; }}
					class="btn btn-primary"
				>
					{$t('words.close')}
				</button>
			</div>
		</div>
	</div>
</div>