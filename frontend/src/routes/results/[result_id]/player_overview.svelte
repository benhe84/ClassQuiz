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
		custom_field: {
			[key: string]: string;
		};
		answers: { [key: string]: any }[];
	}

	let { scores, custom_field, answers }: Props = $props();

	let usernames = $derived(
		Object.keys(scores).sort((a, b) => {
			const scoreA = parseFloat(scores[a]) || 0;
			const scoreB = parseFloat(scores[b]) || 0;
			return scoreB - scoreA;
		})
	);

	const correctCounts: Record<string, number> = {};
	answers.forEach((questionAnswers) => {
		questionAnswers.forEach((answer) => {
			const user = answer.username;
			if (!correctCounts[user]) {
				correctCounts[user] = 0;
			}
			if (answer.right) {
				correctCounts[user] += 1;
			}
		});
	});

	const has_custom_field = Object.keys(custom_field).length !== 0;
</script>

<div class="w-full">
	<div class="overflow-hidden rounded-xl border border-base">
		<table class="w-full text-left">
			<thead>
				<tr class="border-b border-base bg-surface-2">
					<th class="p-3 text-xs font-semibold uppercase tracking-wider text-muted">
						{$t('result_page.player_name')}
					</th>
					<th class="p-3 text-xs font-semibold uppercase tracking-wider text-muted">
						{$t('result_page.player_correct_questions')}
					</th>
					<th class="p-3 text-xs font-semibold uppercase tracking-wider text-muted">
						{$t('result_page.player_score')}
					</th>
					{#if has_custom_field}
						<th class="p-3 text-xs font-semibold uppercase tracking-wider text-muted">
							{$t('result_page.custom_field')}
						</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each usernames as uname, i}
					<tr class="border-b border-base transition hover:bg-surface-2 last:border-b-0">
						<td class="p-3 font-medium text-base">{uname}</td>
						<td class="p-3 text-sm text-secondary">{correctCounts[uname] ?? 0}</td>
						<td class="p-3 text-sm font-bold text-primary">{scores[uname]}</td>
						{#if has_custom_field}
							<td class="p-3 text-sm text-secondary">{custom_field[uname] ?? ''}</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>