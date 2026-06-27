<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	function sortObjectbyValue(obj) {
		const ret = {};
		Object.keys(obj)
			.sort((a, b) => obj[b] - obj[a])
			.forEach((s) => (ret[s] = obj[s]));
		return ret;
	}

	interface Props {
		scores: any;
		question_results: Array<{
			username: string;
			answer: string;
			right: boolean;
			time_taken: number;
			score: number;
		}>;
		username: any;
	}

	let { scores = $bindable(), question_results, username }: Props = $props();
	let score_by_username = $state({});

	if (JSON.stringify(scores) === '{}') {
		for (const i of question_results) {
			scores[i.username] = 0;
		}
	}
	for (const i of question_results) {
		score_by_username[i.username] = i.score;
	}
	for (const u of Object.keys(score_by_username)) {
		scores[u] = (score_by_username[u] ?? 0) + (scores[u] ?? 0);
	}
	scores = scores;

	let sorted_scores = $derived(sortObjectbyValue(scores));
	let my_rank = $derived(Object.keys(sorted_scores).findIndex((u) => u === username) + 1);
	let points_this_round = $derived(score_by_username[username] ?? 0);
	let total_points = $derived(sorted_scores[username] ?? 0);
	let is_correct = $derived(question_results.find((r) => r.username === username)?.right ?? false);
</script>

<div class="flex min-h-screen w-full flex-col items-center justify-center bg-[#0F172A] px-4">
	<div class="w-full max-w-sm space-y-4">

		<div class="flex justify-center">
			{#if is_correct}
				<div class="flex items-center gap-2 rounded-full bg-emerald-500/20 px-5 py-2 text-emerald-400">
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
					</svg>
					<span class="font-semibold">Richtig!</span>
				</div>
			{:else}
				<div class="flex items-center gap-2 rounded-full bg-red-500/20 px-5 py-2 text-red-400">
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
					</svg>
					<span class="font-semibold">Falsch</span>
				</div>
			{/if}
		</div>

		<div class="rounded-2xl border border-white/10 bg-[#1E293B] p-6 text-center shadow-xl">
			<p class="mb-1 text-sm font-medium text-[#94A3B8]">Punkte diese Runde</p>
			<p class="text-5xl font-bold text-[#6366F1]">+{points_this_round}</p>
		</div>

		<div class="grid grid-cols-2 gap-3">
			<div class="rounded-2xl border border-white/10 bg-[#1E293B] p-4 text-center">
				<p class="text-xs font-medium text-[#475569]">Gesamt</p>
				<p class="mt-1 text-2xl font-bold text-[#F8FAFC]">{total_points}</p>
			</div>
			<div class="rounded-2xl border border-white/10 bg-[#1E293B] p-4 text-center">
				<p class="text-xs font-medium text-[#475569]">Rang</p>
				<p class="mt-1 text-2xl font-bold text-[#F8FAFC]">
					{#if my_rank > 0}#{my_rank}{:else}-{/if}
				</p>
			</div>
		</div>

		{#if Object.keys(sorted_scores).length > 1}
			<div class="rounded-2xl border border-white/10 bg-[#1E293B] p-4">
				<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-[#475569]">Bestenliste</p>
				<div class="space-y-2">
					{#each Object.entries(sorted_scores).slice(0, 3) as [name, score], i}
						<div
							class="flex items-center justify-between rounded-xl px-3 py-2 transition {name === username ? 'bg-[#6366F1]/20' : 'bg-white/5'}"
						>
							<div class="flex items-center gap-3">
								<span class="text-sm font-bold text-[#475569]">
									{#if i === 0}🥇{:else if i === 1}🥈{:else}🥉{/if}
								</span>
								<span class="text-sm font-medium {name === username ? 'text-[#6366F1]' : 'text-[#F8FAFC]'}">
									{name}{name === username ? ' (du)' : ''}
								</span>
							</div>
							<span class="text-sm font-bold text-[#F8FAFC]">{score}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

	</div>
</div>
