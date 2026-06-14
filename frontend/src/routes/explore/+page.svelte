<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->
<script lang="ts">
	import { navbarVisible } from '$lib/stores.svelte.ts';
	navbarVisible.visible = true;
	import SearchCard from '$lib/search-card.svelte';
	import type { PageData } from './$types';
	interface Props { data: PageData; }
	let { data }: Props = $props();
	const quizzes = data.results;
</script>

<svelte:head>
	<title>ClassQuiz - Erkunden</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
	<h1 class="text-2xl font-bold mb-6">Quiz erkunden</h1>
	{#if quizzes.hits.length === 0}
		<div class="card flex flex-col items-center justify-center py-16 gap-3">
			<p class="text-sm" style="color:var(--text-secondary);">Noch keine öffentlichen Quiz vorhanden.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each quizzes.hits as quiz}
				<SearchCard {quiz} />
			{/each}
		</div>
	{/if}
</div>
