<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->
<script lang="ts">
	import type { Question } from '$lib/quiz_types';
	import { fly } from 'svelte/transition';
	import QuestionTab from './question_tab_dropdown.svelte';
	import { QuizQuestionType } from '$lib/quiz_types';
	import { getLocalization } from '$lib/i18n';

	const { t } = getLocalization();

	interface Props {
		questions: Question[];
		answers: {
			username: string;
			answer: string;
			right: boolean;
			tike_taken: number;
			score: number;
		}[][];
	}

	let { questions, answers }: Props = $props();

	const get_average_score = (q_index: number): number => {
		const q_answers = answers[q_index];
		let summed_up_scores = 0;
		for (const answer of q_answers) {
			summed_up_scores = summed_up_scores + answer.score;
		}
		return Math.round(summed_up_scores / q_answers.length);
	};

	const get_number_of_correct_answers = (q_index: number): number => {
		const q_answers = answers[q_index];
		let correct_answer = 0;
		for (const answer of q_answers) {
			if (answer.right) {
				correct_answer++;
			}
		}
		return correct_answer;
	};

	const toggle_dropdown = (q_index: number) => {
		question_open = question_open === q_index ? false : q_index;
	};

	let question_open: number | boolean = $state(false);
</script>

<div class="flex w-full flex-col gap-3">
	{#each questions as question, i}
		<div class="overflow-hidden rounded-xl border border-base">
			<button
				type="button"
				class="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-surface-2"
				onclick={() => toggle_dropdown(i)}
			>
				<span class="flex-1 font-medium text-base">{@html question.question}</span>

				{#if question.type !== QuizQuestionType.VOTING}
					{@const correct_answers = get_number_of_correct_answers(i)}
					<span class="flex-shrink-0 text-sm text-secondary">
						{$t('result_page.average_score', {
							average_score: get_average_score(i)
						})}
					</span>
					<span class="flex-shrink-0 text-sm font-semibold text-success">
						{$t('result_page.correct_answer', { count: correct_answers })}
					</span>
				{/if}

				<svg
					class="h-4 w-4 flex-shrink-0 text-muted transition-transform"
					class:rotate-180={question_open === i}
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{#if question_open === i}
				<div class="border-t border-base p-4" in:fly={{ y: -10, duration: 150 }}>
					<QuestionTab {question} answers={answers[i]} />
				</div>
			{/if}
		</div>
	{/each}
</div>