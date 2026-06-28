<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	interface Props {
		scores: Record<string, number>;
		question_results: Array<{
			username: string;
			answer: string;
			right: boolean;
			time_taken: number;
			score: number;
		}>;
		username: string;
	}

	let { scores = $bindable(), question_results, username }: Props = $props();

	function sortObjectByValue(obj: Record<string, number>) {
		return Object.fromEntries(
			Object.entries(obj).sort((a, b) => b[1] - a[1])
		);
	}

	// initialisieren ohne Mutation im Top-Level Flow
	let base_scores = $derived(() => {
		const copy: Record<string, number> = { ...scores };

		if (Object.keys(copy).length === 0) {
			for (const r of question_results) {
				copy[r.username] = 0;
			}
		}

		return copy;
	});

	let round_scores = $derived(() => {
		const map: Record<string, number> = {};
		for (const r of question_results) {
			map[r.username] = (map[r.username] ?? 0) + r.score;
		}
		return map;
	});

	let total_scores = $derived(() => {
		const merged: Record<string, number> = { ...base_scores };

		for (const [u, s] of Object.entries(round_scores)) {
			merged[u] = (merged[u] ?? 0) + (s ?? 0);
		}

		return merged;
	});

	let sorted_scores = $derived(() => sortObjectByValue(total_scores));

	let my_rank = $derived(() => {
		const keys = Object.keys(sorted_scores);
		const idx = keys.findIndex((u) => u === username);
		return idx >= 0 ? idx + 1 : -1;
	});

	let points_this_round = $derived(() => round_scores[username] ?? 0);
	let total_points = $derived(() => total_scores[username] ?? 0);

	let is_correct = $derived(() =>
		question_results.find((r) => r.username === username)?.right ?? false
	);
</script>

<div class="flex min-h-screen w-full flex-col items-center justify-center bg-base px-4">
	<div class="w-full max-w-sm space-y-4">

		<!-- Result status -->
		<div class="flex justify-center">
			{#if is_correct}
				<div class="flex items-center gap-2 rounded-full bg-success/20 px-5 py-2 text-success">
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
					</svg>
					<span class="font-semibold">Richtig!</span>
				</div>
			{:else}
				<div class="flex items-center gap-2 rounded-full bg-danger/20 px-5 py-2 text-danger">
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
					</svg>
					<span class="font-semibold">Falsch</span>
				</div>
			{/if}
		</div>

		<!-- Round score -->
		<div class="card text-center">
			<p class="mb-1 text-sm font-medium text-muted">Punkte diese Runde</p>
			<p class="text-5xl font-bold text-primary">+{points_this_round}</p>
		</div>

		<!-- totals -->
		<div class="grid grid-cols-2 gap-3">
			<div class="card text-center">
				<p class="text-xs font-medium text-muted">Gesamt</p>
				<p class="mt-1 text-2xl font-bold text-base">{total_points}</p>
			</div>

			<div class="card text-center">
				<p class="text-xs font-medium text-muted">Rang</p>
				<p class="mt-1 text-2xl font-bold text-base">
					{#if my_rank > 0}#{my_rank}{:else}-{/if}
				</p>
			</div>
		</div>

		<!-- leaderboard -->
		{#if Object.keys(sorted_scores).length > 1}
			<div class="card">
				<p class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
					Bestenliste
				</p>

				<div class="space-y-2">
					{#each Object.entries(sorted_scores).slice(0, 3) as [name, score], i}
						<div
							class="flex items-center justify-between rounded-xl px-3 py-2 transition"
							class:bg-primary/10={name === username}
							class:bg-surface={name !== username}
						>
							<div class="flex items-center gap-3">
								<span class="text-sm font-bold text-muted">
									{#if i === 0}🥇{:else if i === 1}🥈{:else}🥉{/if}
								</span>

								<span
									class="text-sm font-medium"
									class:text-primary={name === username}
									class:text-base={name !== username}
								>
									{name}{name === username ? ' (du)' : ''}
								</span>
							</div>

							<span class="text-sm font-bold text-base">{score}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

	</div>
</div>