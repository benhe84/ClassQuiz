<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import { QuizQuestionType } from '$lib/quiz_types';
	import { getLocalization } from '$lib/i18n';
	import { SocketGameControls } from '$lib/play/admin/socket_game_controls.ts';
	import type { GameState } from '$lib/play/admin/game_state.ts';

	interface Props {
		bg_color: string;
		socket_game_controls: SocketGameControls;
		game_token: string;
		game_state: GameState;
	}

	let { bg_color, socket_game_controls, game_token, game_state = $bindable() }: Props = $props();
	const { t } = getLocalization();

	const show_solutions = () => {
		socket_game_controls.show_solutions();
		game_state.timer_res = '0';
	};

	let q = $derived(game_state.quiz_data.questions);
	let idx = $derived(game_state.selected_question);
	let is_last = $derived(idx + 1 === q.length);
	let is_slide = $derived(q[idx]?.type === QuizQuestionType.SLIDE);
	let time_up = $derived(game_state.timer_res === '0');
	let has_results = $derived(game_state.question_results !== null);
	let final_not_shown = $derived(
		JSON.stringify(game_state.final_results) === JSON.stringify([null])
	);
</script>

<div
	class="fixed top-0 z-20 flex h-12 w-full items-center justify-between border-b border-base px-4 bg-surface"
	style="background-color: {bg_color || 'var(--surface)'}"
>
	<!-- Fortschritt -->
	<div class="flex items-center gap-2">
		<span class="text-sm font-bold text-base">
			{idx === -1 ? 0 : idx + 1}/{q.length}
		</span>

		<div class="hidden gap-1 sm:flex">
			{#each q as _, i}
				<div
					class="h-1.5 w-6 rounded-full transition"
					class:bg-primary={i <= idx}
					class:bg-muted={i > idx}
				></div>
			{/each}
		</div>
	</div>

	<!-- Actions -->
	<div>
		{#if is_last && ((time_up && has_results) || is_slide)}
			{#if final_not_shown}
				<button
					onclick={() => socket_game_controls.get_final_results()}
					class="btn btn-primary"
				>
					{$t('admin_page.get_final_results')}
				</button>
			{/if}

		{:else if time_up || idx === -1}
			{#if ((idx + 1 !== q.length && has_results) || idx === -1)}
				<button
					onclick={() => socket_game_controls.set_question_number(idx + 1)}
					class="btn btn-primary"
				>
					{$t('admin_page.next_question', { question: idx + 2 })}
				</button>
			{/if}

			{#if !has_results && idx !== -1}
				{#if is_slide}
					<button
						onclick={() => socket_game_controls.set_question_number(idx + 1)}
						class="btn btn-primary"
					>
						{$t('admin_page.next_question', { question: idx + 2 })}
					</button>

				{:else if q[idx]?.hide_results === true}
					<button
						onclick={() => {
							socket_game_controls.get_question_results(game_token, game_state.shown_question_now);
							setTimeout(() => socket_game_controls.set_question_number(idx + 1), 200);
						}}
						class="btn btn-primary"
					>
						{$t('admin_page.next_question', { question: idx + 2 })}
					</button>

				{:else}
					<button
						onclick={() =>
							socket_game_controls.get_question_results(
								game_token,
								game_state.shown_question_now
							)}
						class="btn btn-primary"
					>
						{$t('admin_page.show_results')}
					</button>
				{/if}
			{/if}

		{:else if idx !== -1}
			{#if is_slide}
				<button
					onclick={() => socket_game_controls.set_question_number(idx + 1)}
					class="btn btn-primary"
				>
					{$t('admin_page.next_question', { question: idx + 2 })}
				</button>

			{:else}
				<button
					onclick={show_solutions}
					class="btn btn-danger"
				>
					{$t('admin_page.stop_time_and_solutions')}
				</button>
			{/if}
		{/if}
	</div>
</div>