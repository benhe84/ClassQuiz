<script lang="ts">
	import type { PageData } from './$types';
	import PlayerOverview from './player_overview.svelte';
	import QuestionOverview from './question_overview.svelte';
	import GeneralOverview from './general_overview.svelte';
	import { getLocalization } from '$lib/i18n';

	const { t } = getLocalization();

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
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

		<div class="flex flex-col gap-6">
			<!-- ÜBERSICHT -->
			<section class="card">
				<h2 class="mb-4 text-lg font-bold text-base">{$t('words.overview')}</h2>
				<GeneralOverview
					scores={data.results.player_scores}
					title={data.results.title}
					timestamp={data.results.timestamp}
				/>
			</section>

			<!-- SPIELENDE PERSONEN -->
			<section class="card">
				<h2 class="mb-4 text-lg font-bold text-base">
					{$t('words.player', { count: 2 })}
				</h2>
				<PlayerOverview
					custom_field={data.results.custom_field_data}
					scores={data.results.player_scores}
					answers={data.results.answers}
				/>
			</section>

			<!-- FRAGEN -->
			<section class="card">
				<h2 class="mb-4 text-lg font-bold text-base">
					{$t('words.question', { count: 2 })}
				</h2>
				<QuestionOverview
					questions={data.results.questions}
					answers={data.results.answers}
				/>
			</section>
		</div>
	</div>
</div>