<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import { getLocalization } from '$lib/i18n';
	import { fly } from 'svelte/transition';
	import confetti from 'canvas-confetti';

	const { t } = getLocalization();

	interface Props {
		data: any;
		username?: any;
		show_final_results: boolean;
	}

	let { data = $bindable(), username, show_final_results }: Props = $props();

	let player_names = $derived(
		Object.keys(data).sort((a, b) => {
			const scoreA = parseFloat(data[a]) || 0;
			const scoreB = parseFloat(data[b]) || 0;
			return scoreB - scoreA;
		})
	);

	let player_count_or_five = $derived(
		player_names.length >= 5 ? 5 : player_names.length
	);

	let canvas: HTMLCanvasElement = $state();

	const medals = ['🥇', '🥈', '🥉'];

	const rank_colors = ['text-warning', 'text-base', 'text-warning'];
	const rank_sizes = ['text-5xl', 'text-4xl', 'text-3xl', 'text-2xl', 'text-xl'];

	onMount(() => {
		setTimeout(() => {
			confetti.create(canvas, { resize: true, useWorker: true });
			confetti({ particleCount: 200, spread: 160 });
		}, player_count_or_five * 1200 - 800);
	});
</script>

{#if show_final_results}
	<canvas bind:this={canvas} class="pointer-events-none fixed inset-0 h-full w-full"></canvas>

	<div class="flex min-h-screen w-full flex-col items-center justify-center bg-base px-4 py-12">

		<!-- Header -->
		<div class="mb-10 text-center">
			<h1 class="text-4xl font-bold text-base">Endergebnis</h1>
			<p class="mt-2 text-sm text-muted">Die besten Teilnehmenden</p>
		</div>

		<!-- Leaderboard -->
		<div class="w-full max-w-lg space-y-3">
			{#each player_names as player, i}
				{#if i <= player_count_or_five - 1}
					<div
						in:fly|global={{
							y: -60,
							delay: player_count_or_five * 1200 - (i + 1) * 1000,
							duration: 400
						}}
						class="card flex items-center justify-between"
					>
						<div class="flex items-center gap-4">
							<span class="text-2xl">
								{#if i < 3}
									{medals[i]}
								{:else}
									<span class="text-lg font-bold text-muted">#{i + 1}</span>
								{/if}
							</span>

							<span
								class="font-semibold"
								class:text-base={i >= 3}
								class:text-primary={i < 3}
								class:text-lg={i >= 3}
							>
								{player}
							</span>
						</div>

						<span class="font-mono text-lg font-bold text-primary">
							{data[player]}
						</span>
					</div>
				{/if}
			{/each}
		</div>

		<!-- User panel -->
		{#if data[username]}
			<div class="fixed bottom-6 left-0 flex w-full justify-center px-4">
				<div class="card">
					<p class="text-center text-sm font-medium text-muted">
						{$t('play_page.your_score', { score: data[username] })}
					</p>

					{#each player_names as player, i}
						{#if player === username}
							<p class="text-center text-lg font-bold text-base">
								{$t('play_page.your_place', { place: i + 1 })}
							</p>
						{/if}
					{/each}
				</div>
			</div>
		{/if}

	</div>
{/if}