<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->
<script lang="ts">
	import type { QuizData } from '$lib/quiz_types';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { getLocalization } from '$lib/i18n';
	const { t } = getLocalization();

	export let quiz: QuizData | undefined = undefined;

	const on_parent_click = (e: Event) => {
		if (e.target === e.currentTarget) quiz = undefined;
	};

	onMount(() => {
		document.body.addEventListener('keydown', (key) => {
			if (key.code === 'Escape') quiz = undefined;
		});
	});
</script>

{#if quiz}
	<div
		class="fixed inset-0 flex items-center justify-center z-50"
		style="background-color:rgba(0,0,0,0.7);"
		onclick={on_parent_click}
		transition:fade={{ duration: 150 }}
	>
		<div class="rounded-2xl shadow-2xl p-6 w-full max-w-lg flex flex-col gap-6" style="background-color:var(--surface); color:var(--text-primary);">

			<!-- Header -->
			<div class="flex items-center justify-between">
				<h1 class="text-xl font-bold" style="color:var(--primary);">{$t('words.analytics')}</h1>
				<button onclick={() => { quiz = undefined; }} class="p-1.5 rounded-lg transition hover:bg-white/10" style="color:var(--text-secondary);">
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
				</button>
			</div>

			<!-- Bewertung -->
			<div class="rounded-xl p-4" style="background-color:var(--bg);">
				<p class="label mb-3">{$t('words.rating')}</p>
				<div class="grid grid-cols-2 gap-3">
					<div class="rounded-lg p-3 text-center" style="background-color:var(--surface); border:1px solid var(--border);">
						<p class="text-2xl font-bold" style="color:var(--success);">👍 {quiz.likes}</p>
						<p class="text-xs mt-1" style="color:var(--text-secondary);">{$t('words.like_plural')}</p>
					</div>
					<div class="rounded-lg p-3 text-center" style="background-color:var(--surface); border:1px solid var(--border);">
						<p class="text-2xl font-bold" style="color:var(--danger);">👎 {quiz.dislikes}</p>
						<p class="text-xs mt-1" style="color:var(--text-secondary);">{$t('words.dislike_plural')}</p>
					</div>
				</div>
			</div>

			<!-- Aufrufe & Spielstarts -->
			<div class="rounded-xl p-4" style="background-color:var(--bg);">
				<p class="label mb-3">{$t('dashboard.views_n_plays')}</p>
				<div class="grid grid-cols-2 gap-3">
					<div class="rounded-lg p-3 text-center" style="background-color:var(--surface); border:1px solid var(--border);">
						<p class="text-2xl font-bold" style="color:var(--primary);">{quiz.views}</p>
						<p class="text-xs mt-1" style="color:var(--text-secondary);">{$t('words.view_plural')}</p>
					</div>
					<div class="rounded-lg p-3 text-center" style="background-color:var(--surface); border:1px solid var(--border);">
						<p class="text-2xl font-bold" style="color:var(--secondary);">{quiz.plays}</p>
						<p class="text-xs mt-1" style="color:var(--text-secondary);">{$t('words.play_plural')}</p>
					</div>
				</div>
			</div>

			<!-- Info -->
			<div class="rounded-xl p-4 text-sm" style="background-color:var(--bg); color:var(--text-secondary);">
				<p class="label mb-2">{$t('words.info')}</p>
				<p>{$t('dashboard.info_analytics')}</p>
			</div>
		</div>
	</div>
{/if}
