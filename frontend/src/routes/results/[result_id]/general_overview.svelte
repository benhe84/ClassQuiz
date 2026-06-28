<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->
<script lang="ts">
	import { getLocalization } from '$lib/i18n';

	const { t } = getLocalization();

	interface Props {
		scores: {
			[key: string]: string;
		};
		title: string;
		timestamp: string;
	}

	let { scores, title, timestamp }: Props = $props();

	const usernames = Object.keys(scores);

	const numeric_scores = $derived(
		usernames.map((username) => ({
			username,
			score: parseInt(scores[username])
		}))
	);

	const sorted_scores = $derived(
		[...numeric_scores].sort((a, b) => b.score - a.score)
	);

	const average_score = $derived.by(() => {
		if (numeric_scores.length === 0) return 0;
		const total = numeric_scores.reduce((sum, s) => sum + s.score, 0);
		return Math.round(total / numeric_scores.length);
	});

	const highest_score = $derived(
		numeric_scores.length > 0 ? sorted_scores[0].score : 0
	);

	const lowest_score = $derived(
		numeric_scores.length > 0 ? sorted_scores[sorted_scores.length - 1].score : 0
	);

	const max_score = $derived(highest_score || 1);
</script>

<div class="w-full">
	<!-- Stat cards -->
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
		<div class="rounded-xl bg-surface-2 p-4 text-center">
			<p class="text-xs font-semibold uppercase tracking-wider text-muted">
				{$t('results_page.general_overview.players')}
			</p>
			<p class="mt-2 text-3xl font-bold text-base">{usernames.length}</p>
		</div>

		<div class="rounded-xl bg-surface-2 p-4 text-center">
			<p class="text-xs font-semibold uppercase tracking-wider text-muted">
				{$t('results_page.general_overview.average_score')}
			</p>
			<p class="mt-2 text-3xl font-bold text-primary">{average_score}</p>
		</div>

		<div class="rounded-xl bg-surface-2 p-4 text-center">
			<p class="text-xs font-semibold uppercase tracking-wider text-muted">
				{$t('results_page.general_overview.highest_score')}
			</p>
			<p class="mt-2 text-3xl font-bold text-success">{highest_score}</p>
		</div>

		<div class="rounded-xl bg-surface-2 p-4 text-center">
			<p class="text-xs font-semibold uppercase tracking-wider text-muted">
				{$t('results_page.general_overview.lowest_score')}
			</p>
			<p class="mt-2 text-3xl font-bold text-base">{lowest_score}</p>
		</div>
	</div>

	<!-- Score distribution -->
	{#if sorted_scores.length > 0}
		<div class="mt-6">
			<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
				{$t('results_page.general_overview.all_players')}
			</p>

			<div class="space-y-3">
				{#each sorted_scores as { username, score }, i}
					<div class="flex items-center gap-3">
						<span class="w-6 text-sm font-bold text-muted">
							{i + 1}.
						</span>
						<span class="w-32 flex-shrink-0 truncate text-sm font-medium text-base">
							{username}
						</span>
						<div class="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
							<div
								class="h-full rounded-full bg-primary"
								style="width: {(score / max_score) * 100}%"
							></div>
						</div>
						<span class="w-12 flex-shrink-0 text-right text-sm font-bold text-base">
							{score}
						</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>