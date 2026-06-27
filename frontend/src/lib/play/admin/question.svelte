<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import { QuizQuestionType } from '$lib/quiz_types';
	import type { QuizData } from '$lib/quiz_types';
	import { get_foreground_color } from '$lib/helpers.js';
	import CircularTimer from '$lib/play/circular_progress.svelte';
	import { kahoot_icons } from '$lib/play/kahoot_mode_assets/kahoot_icons.js';
	import MediaComponent from '$lib/editor/MediaComponent.svelte';
	import { getLocalization } from '$lib/i18n';

	interface Props {
		quiz_data: QuizData;
		selected_question: number;
		timer_res: string;
		answer_count: number;
		default_colors: string[];
	}

	let { quiz_data, selected_question, timer_res = $bindable(), answer_count, default_colors }: Props = $props();

	const { t } = getLocalization();

	// Moderne Farben & Unicode-Symbole
	default_colors = ['#6366F1', '#EC4899', '#F59E0B', '#10B981'];

	let circular_progress = $derived.by(() => {
		try {
			return 1 - ((100 / parseInt(quiz_data.questions[selected_question].time)) * parseInt(timer_res)) / 100;
		} catch {
			return 0;
		}
	});

	const get_color = (answer: any, i: number): string =>
		answer.color ?? default_colors[i % 4];
</script>

<div class="flex flex-col w-full px-6 pt-4 pb-2">
	<!-- Frage -->
	<h1 class="text-4xl font-bold text-center text-[#F8FAFC] leading-tight mb-4">
		{@html quiz_data.questions[selected_question].question}
	</h1>

	<!-- Timer + Antwortcount -->
	<div class="grid grid-cols-3 items-center mb-4">
		<div></div>
		<div class="flex justify-center">
			<CircularTimer text={timer_res} progress={circular_progress} color="#6366F1" />
		</div>
		<div class="flex justify-end">
			<div class="rounded-xl border border-white/10 bg-[#1E293B] px-4 py-2 text-center">
				<p class="text-2xl font-bold text-[#F8FAFC]">{answer_count}</p>
				<p class="text-xs text-[#475569]">{$t('admin_page.answers_submitted', { answer_count: '' }).replace(answer_count, '').trim()}</p>
			</div>
		</div>
	</div>
</div>

<!-- Bild -->
{#if quiz_data.questions[selected_question].image !== null}
	<div class="flex w-full justify-center mb-4">
		<MediaComponent
			src={quiz_data.questions[selected_question].image}
			muted={false}
			css_classes="max-h-[20vh] object-contain rounded-xl"
		/>
	</div>
{/if}

<!-- Antworten ABCD / VOTING / CHECK -->
{#if quiz_data.questions[selected_question].type === QuizQuestionType.ABCD || quiz_data.questions[selected_question].type === QuizQuestionType.VOTING || quiz_data.questions[selected_question].type === QuizQuestionType.CHECK}
	<div class="grid grid-cols-2 gap-3 w-full px-6 pb-6">
		{#each quiz_data.questions[selected_question].answers as answer, i}
			{@const color = get_color(answer, i)}
			{@const fg = get_foreground_color(color)}
			<div
				class="rounded-2xl flex items-center gap-3 px-4 py-4 shadow-lg border-2 border-black/10 transition"
				style="background-color: {color}; color: {fg}; opacity: {!answer.right && timer_res === '0' && quiz_data.questions[selected_question].type === QuizQuestionType.ABCD ? '0.35' : '1'}"
			>
				<img class="w-10 inline-block pl-2" alt="icon" src={kahoot_icons[i]} />
				<span class="text-xl font-semibold flex-1 text-center" style="color:{fg}">
					{answer.answer}
				</span>
				{#if answer.right && timer_res === '0' && quiz_data.questions[selected_question].type === QuizQuestionType.ABCD}
					<span class="text-2xl shrink-0">✓</span>
				{/if}
			</div>
		{/each}
	</div>

<!-- TEXT-Frage -->
{:else if quiz_data.questions[selected_question].type === QuizQuestionType.TEXT}
	{#if timer_res === '0'}
		<div class="grid grid-cols-2 gap-3 w-full px-6 pb-6">
			{#each quiz_data.questions[selected_question].answers as answer}
				<div class="rounded-2xl flex items-center justify-center px-4 py-4 bg-[#6366F1] shadow-lg">
					<span class="text-xl font-semibold text-white text-center">{answer.answer}</span>
				</div>
			{/each}
		</div>
	{:else}
		<div class="flex justify-center pb-6">
			<div class="rounded-2xl border border-white/10 bg-[#1E293B] px-6 py-4">
				<p class="text-xl text-[#94A3B8]">{$t('admin_page.enter_answer_into_field')}</p>
			</div>
		</div>
	{/if}
{/if}
