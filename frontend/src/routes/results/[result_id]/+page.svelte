<script lang="ts">
	import type { PageData } from './$types';
	import PlayerOverview from './player_overview.svelte';
	import QuestionOverview from './question_overview.svelte';
	import GeneralOverview from './general_overview.svelte';
	import { fade } from 'svelte/transition';
	import { getLocalization } from '$lib/i18n';

	const { t } = getLocalization();

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	enum SelectedTab {
		Overview,
		Players,
		Questions
	}

	let selected_tab: SelectedTab = $state(SelectedTab.Overview);

	const tabs = [
		{ key: SelectedTab.Overview, label: $t('words.overview') },
		{ key: SelectedTab.Players, label: $t('words.player', { count: 2 }) },
		{ key: SelectedTab.Questions, label: $t('words.question', { count: 2 }) }
	];
</script>

<div class="min-h-screen w-full bg-base p-6">
	<div class="mx-auto max-w-6xl">
		<!-- HEADER -->
		<div class="mb-6">
			<h1 class="text-2xl font-bold text-base">{data.results.title}</h1>
			<p class="mt-1 text-sm text-muted">
				{new Date(data.results.timestamp).toLocaleString()}
			</p>
		</div>

		<!-- TAB BAR -->
		<div class="mb-6 inline-flex gap-1 rounded-xl bg-surface-2 p-1">
			{#each tabs as tab}
				<button
					type="button"
					class="rounded-lg px-5 py-2 text-sm font-semibold transition"
					class:tab-active={selected_tab === tab.key}
					class:tab-inactive={selected_tab !== tab.key}
					onclick={() => (selected_tab = tab.key)}
				>
					{tab.label}
				</button>
			{/each}
		</div>

		<!-- CONTENT -->
		{#if selected_tab === SelectedTab.Overview}
			<div in:fade|global={{ duration: 150 }}>
				<GeneralOverview
					scores={data.results.player_scores}
					title={data.results.title}
					timestamp={data.results.timestamp}
				/>
			</div>
		{:else if selected_tab === SelectedTab.Questions}
			<div in:fade|global={{ duration: 150 }}>
				<QuestionOverview
					questions={data.results.questions}
					answers={data.results.answers}
				/>
			</div>
		{:else if selected_tab === SelectedTab.Players}
			<div in:fade|global={{ duration: 150 }}>
				<PlayerOverview
					custom_field={data.results.custom_field_data}
					scores={data.results.player_scores}
					answers={data.results.answers}
				/>
			</div>
		{/if}
	</div>
</div>

<style>
	.tab-active {
		background-color: var(--surface);
		color: var(--primary);
		box-shadow: 0 1px 3px var(--shadow);
	}
	.tab-inactive {
		background-color: transparent;
		color: var(--text-secondary);
	}
	.tab-inactive:hover {
		color: var(--text-primary);
	}
</style>