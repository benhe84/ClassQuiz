<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->
<script lang="ts">
	import type { PageData } from './$types';
	import { getLocalization } from '$lib/i18n';

	const { t } = getLocalization();

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<div class="min-h-screen w-full bg-base px-4 py-12">
	<div class="mx-auto w-full max-w-xl">
		<h1 class="mb-6 text-3xl font-bold text-base">{$t('results_page.title')}</h1>

		{#if data.results.length === 0}
			<div class="card text-center">
				<p class="text-lg text-muted">{$t('results_page.no_results_so_far')}</p>
			</div>
		{:else}
			<div class="card overflow-hidden p-0">
				<table class="w-full text-left">
					<thead>
						<tr class="border-b border-base">
							<th class="p-4 text-xs font-semibold uppercase tracking-wider text-muted">
								{$t('results_page.quiz_title')}
							</th>
							<th class="p-4 text-xs font-semibold uppercase tracking-wider text-muted">
								{$t('results_page.date_played')}
							</th>
							<th class="p-4 text-xs font-semibold uppercase tracking-wider text-muted">
								{$t('results_page.player_count')}
							</th>
							<th class="p-4 text-xs font-semibold uppercase tracking-wider text-muted">
								{$t('words.note')}
							</th>
						</tr>
					</thead>
					<tbody>
						{#each data.results as result}
							<tr class="border-b border-base transition hover:bg-surface-2">
								<td class="p-4">
									
									<a	href="/results/{result.id}"
										class="font-medium text-primary underline-offset-2 hover:underline"
									>
										{@html result.title}
									</a>
								</td>
								<td class="p-4 text-sm text-secondary">
									{new Date(result.timestamp).toLocaleString()}
								</td>
								<td class="p-4 text-sm text-secondary">
									{Object.keys(result.player_scores).length}
								</td>
								<td class="p-4 text-sm text-secondary">
									{#if result.note}
										{result.note}
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>