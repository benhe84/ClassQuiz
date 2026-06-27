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
	let final_not_shown = $derived(JSON.stringify(game_state.final_results) === JSON.stringify([null]));
</script>

<div
	class="fixed top-0 w-full z-20 flex items-center justify-between px-4 h-12 border-b border-white/10"
	style="background-color: {bg_color ? bg_color : '#1E293B'}"
>
	<!-- Fortschritt -->
	<div class="flex items-center gap-2">
		<span class="text-sm font-bold text-[#F8FAFC]">
			{idx === -1 ? 0 : idx + 1}/{q.length}
		</span>
		<div class="hidden sm:flex gap-1">
			{#each q as _, i}
				<div
					class="h-1.5 w-6 rounded-full transition"
					style="background-color: {i <= idx ? '#6366F1' : 'rgba(255,255,255,0.15)'}"
				></div>
			{/each}
		</div>
	</div>

	<!-- Aktions-Button -->
	<div>
		{#if is_last && ((time_up && has_results) || is_slide)}
			{#if final_not_shown}
				<button
					onclick={() => socket_game_controls.get_final_results()}
					class="rounded-xl bg-[#6366F1] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#5558E3]"
				>
					{$t('admin_page.get_final_results')}
				</button>
			{/if}
		{:else if time_up || idx === -1}
			{#if ((idx + 1 !== q.length && has_results) || idx === -1)}
				<button
					onclick={() => socket_game_controls.set_question_number(idx + 1)}
					class="rounded-xl bg-[#6366F1] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#5558E3]"
				>
					{$t('admin_page.next_question', { question: idx + 2 })}
				</button>
			{/if}
			{#if !has_results && idx !== -1}
				{#if is_slide}
					<button
						onclick={() => socket_game_controls.set_question_number(idx + 1)}
						class="rounded-xl bg-[#6366F1] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#5558E3]"
					>
						{$t('admin_page.next_question', { question: idx + 2 })}
					</button>
				{:else if q[idx]?.hide_results === true}
					<button
						onclick={() => {
							socket_game_controls.get_question_results(game_token, game_state.shown_question_now);
							setTimeout(() => socket_game_controls.set_question_number(idx + 1), 200);
						}}
						class="rounded-xl bg-[#6366F1] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#5558E3]"
					>
						{$t('admin_page.next_question', { question: idx + 2 })}
					</button>
				{:else}
					<button
						onclick={() => socket_game_controls.get_question_results(game_token, game_state.shown_question_now)}
						class="rounded-xl bg-[#6366F1] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#5558E3]"
					>
						{$t('admin_page.show_results')}
					</button>
				{/if}
			{/if}
		{:else if idx !== -1}
			{#if is_slide}
				<button
					onclick={() => socket_game_controls.set_question_number(idx + 1)}
					class="rounded-xl bg-[#6366F1] px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-[#5558E3]"
				>
					{$t('admin_page.next_question', { question: idx + 2 })}
				</button>
			{:else}
				<button
					onclick={show_solutions}
					class="rounded-xl bg-red-500/80 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-red-500"
				>
					{$t('admin_page.stop_time_and_solutions')}
				</button>
			{/if}
		{/if}
	</div>
</div>
