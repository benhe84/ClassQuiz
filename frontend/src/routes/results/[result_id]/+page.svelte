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
</script>

<div class="min-h-screen w-full p-6">
	<div class="max-w-6xl mx-auto">

		<!-- TAB BAR -->
		<div class="flex bg-slate-900/40 rounded-lg overflow-hidden mb-6">
			<button
				class="flex-1 py-3 transition"
				class:bg-indigo-600={selected_tab === SelectedTab.Overview}
				class:text-white={selected_tab === SelectedTab.Overview}
				class:text-slate-300={selected_tab !== SelectedTab.Overview}
				onclick={() => (selected_tab = SelectedTab.Overview)}
			>
				{$t('words.overview')}
			</button>

			<button
				class="flex-1 py-3 transition border-x border-slate-700"
				class:bg-indigo-600={selected_tab === SelectedTab.Players}
				class:text-white={selected_tab === SelectedTab.Players}
				class:text-slate-300={selected_tab !== SelectedTab.Players}
				onclick={() => (selected_tab = SelectedTab.Players)}
			>
				{$t('words.player', { count: 2 })}
			</button>

			<button
				class="flex-1 py-3 transition"
				class:bg-indigo-600={selected_tab === SelectedTab.Questions}
				class:text-white={selected_tab === SelectedTab.Questions}
				class:text-slate-300={selected_tab !== SelectedTab.Questions}
				onclick={() => (selected_tab = SelectedTab.Questions)}
			>
				{$t('words.question', { count: 2 })}
			</button>
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
