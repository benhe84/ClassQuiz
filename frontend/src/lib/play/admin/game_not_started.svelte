<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import ControllerCodeDisplay from '$lib/components/controller/code.svelte';
	import { getLocalization } from '$lib/i18n';
	import { fade } from 'svelte/transition';
	import { SocketGameControls } from '$lib/play/admin/socket_game_controls.ts';
	import type { GameState } from '$lib/play/admin/game_state';

	interface Props {
		game_pin: string;
		game_state: GameState;
		socket_game_controls: SocketGameControls;
		cqc_code: string;
	}

	let {
		game_pin,
		game_state = $bindable(),
		socket_game_controls,
		cqc_code = $bindable()
	}: Props = $props();

	let fullscreen_open = $state(false);
	const { t } = getLocalization();

	if (cqc_code === 'null') cqc_code = null;

	let player_count = $derived(game_state.players.length);
</script>

<div class="min-h-screen w-full bg-base text-base">

	<!-- Header -->
	<div class="border-b border-base bg-surface px-6 py-4">
		<div class="mx-auto flex max-w-6xl items-center justify-between">

			<div class="flex items-center gap-3">
				<div class="h-2 w-2 animate-pulse rounded-full bg-success"></div>
				<span class="text-sm font-medium text-muted">
					Warte auf Teilnehmende…
				</span>
			</div>

			<div class="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2">
				<span class="text-sm text-muted">{$t('words.pin')}:</span>
				<span class="select-all font-mono text-xl font-bold tracking-widest text-primary">
					{game_pin}
				</span>
			</div>

		</div>
	</div>

	<div class="mx-auto max-w-6xl px-6 py-10">
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">

			<!-- QR -->
			<div class="card flex flex-col items-center gap-4">
				<p class="text-sm font-semibold uppercase tracking-wider text-muted">
					QR-Code scannen
				</p>

				<button
					onclick={() => (fullscreen_open = true)}
					class="group relative overflow-hidden rounded-2xl bg-white p-3 shadow-lg transition hover:scale-105"
					aria-label="QR-Code vergrößern"
				>
					<img
						alt="QR-Code zum Beitreten"
						src="/api/v1/utils/qr/{game_pin}"
						class="h-40 w-40 object-contain"
					/>

					<div class="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/0 transition group-hover:bg-black/20">
						<svg class="h-8 w-8 text-white opacity-0 transition group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
						</svg>
					</div>
				</button>

				<p class="text-center text-sm text-muted">
					{$t('play_page.join_description', {
						url:
							window.location.host === 'classquiz.de'
								? 'cquiz.de'
								: `${window.location.host}/play`,
						pin: game_pin
					})}
				</p>
			</div>

			<!-- Players + Start -->
			<div class="card flex flex-col items-center justify-center gap-6">
				<div class="text-center">
					<p class="text-7xl font-bold text-base">{player_count}</p>
					<p class="mt-2 text-sm font-medium text-muted">
						{#if player_count === 1}
							{$t('play_page.players_waiting', { count: player_count })}
						{:else}
							{$t('play_page.players_waiting_plural', { count: player_count })}
						{/if}
					</p>
				</div>

				<button
					disabled={player_count < 1}
					onclick={() => socket_game_controls.start_game()}
					class="btn btn-primary w-full"
				>
					{$t('admin_page.start_game')}
				</button>
			</div>

			<!-- Controller Code / Players -->
			<div class="card">
				{#if cqc_code}
					<p class="mb-3 text-sm font-semibold uppercase tracking-wider text-muted">
						Controller-Code
					</p>

					<p class="mb-3 text-sm text-muted">
						{$t('play_page.join_by_entering_code')}
					</p>

					<ControllerCodeDisplay code={cqc_code} />

				{:else}
					<p class="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
						Teilnehmende
					</p>

					{#if game_state.players.length > 0}
						<div class="flex flex-wrap gap-2">
							{#each game_state.players as player}
								<button
									onclick={() =>
										socket_game_controls.kick_player(player.username, game_state.players)}
									class="rounded-lg border border-base bg-surface px-3 py-1.5 text-sm font-medium text-base transition hover:border-danger hover:bg-danger/10 hover:text-danger"
									title="Kick {player.username}"
								>
									{player.username}
								</button>
							{/each}
						</div>
					{:else}
						<div class="flex h-32 items-center justify-center">
							<p class="text-sm text-muted">
								Noch niemand beigetreten…
							</p>
						</div>
					{/if}
				{/if}
			</div>

		</div>
	</div>
</div>

<!-- QR fullscreen -->
{#if fullscreen_open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
		transition:fade|global={{ duration: 80 }}
		onclick={() => (fullscreen_open = false)}
		tabindex="0"
		role="button"
		onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (fullscreen_open = false)}
	>
		<div class="rounded-3xl bg-white p-6 shadow-2xl">
			<img
				alt="QR-Code zum Beitreten"
				src="/api/v1/utils/qr/{game_pin}"
				class="h-72 w-72 object-contain"
			/>
		</div>
	</div>
{/if}