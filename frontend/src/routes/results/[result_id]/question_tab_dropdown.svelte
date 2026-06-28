<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->
<script lang="ts">
	import { QuizQuestionType } from '$lib/quiz_types';
	import { getLocalization } from '$lib/i18n';
	import type { Question } from '$lib/quiz_types';

	const { t } = getLocalization();

	interface Answer {
		username: string;
		answer: string;
		right: boolean;
		time_taken: number;
		score: number;
	}

	interface Props {
		question: Question;
		answers: Answer[];
	}

	let { question, answers }: Props = $props();

	const get_answer_count_for_answer = (answer: string): number => {
		let count = 0;
		let answer_id = 0;
		if (question.type === QuizQuestionType.CHECK) {
			for (let i = 0; i < question.answers.length; i++) {
				if (answer === question.answers[i].answer) {
					answer_id = i;
					break;
				}
			}
		}
		for (let i = 0; i < answers.length; i++) {
			const a = answers[i];
			if (question.type === QuizQuestionType.CHECK) {
				if (a.answer.includes(String(answer_id))) {
					count++;
				}
			} else if (a.answer === answer) {
				count++;
			}
		}
		return count;
	};
</script>

<div class="flex flex-col gap-6">
	<!-- Answer distribution -->
	{#if question.type !== QuizQuestionType.ORDER && question.type !== QuizQuestionType.RANGE}
		<div class="flex flex-col gap-3">
			{#each question.answers as answer}
				{@const count = get_answer_count_for_answer(answer.answer)}
				{@const percent = answers.length > 0 ? (count / answers.length) * 100 : 0}
				<div class="flex items-center gap-3">
					<span class="w-32 flex-shrink-0 truncate text-sm font-medium text-base">
						{answer.answer}
					</span>
					<div class="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
						<div
							class="h-full rounded-full bg-success"
							style="width: {percent}%"
						></div>
					</div>
					<span class="w-8 flex-shrink-0 text-right text-sm font-bold text-base">
						{count}
					</span>
					{#if question.type !== QuizQuestionType.VOTING && question.type !== QuizQuestionType.TEXT}
						<span class="w-5 flex-shrink-0 text-center">
							{#if answer.right}✅{:else}❌{/if}
						</span>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<!-- Per-player answers -->
	<div class="overflow-hidden rounded-xl border border-base">
		<table class="w-full text-left">
			<thead>
				<tr class="border-b border-base bg-surface-2">
					<th class="p-3 text-xs font-semibold uppercase tracking-wider text-muted">
						{$t('result_page.player_name')}
					</th>
					{#if question.type !== QuizQuestionType.VOTING}
						<th class="p-3 text-xs font-semibold uppercase tracking-wider text-muted">
							{$t('words.score')}
						</th>
					{/if}
					<th class="p-3 text-xs font-semibold uppercase tracking-wider text-muted">
						{$t('result_page.time_taken')}
					</th>
					<th class="p-3 text-xs font-semibold uppercase tracking-wider text-muted">
						{$t('words.answer')}
					</th>
					{#if question.type !== QuizQuestionType.VOTING}
						<th class="p-3 text-xs font-semibold uppercase tracking-wider text-muted">
							{$t('words.correct')}?
						</th>
					{/if}
				</tr>
			</thead>
			<tbody>
				{#each answers as answer}
					<tr class="border-b border-base transition hover:bg-surface-2 last:border-b-0">
						<td class="p-3 font-medium text-base">{answer.username}</td>
						{#if question.type !== QuizQuestionType.VOTING}
							<td class="p-3 text-sm font-bold text-primary">{answer.score}</td>
						{/if}
						<td class="p-3 text-sm text-secondary">
							{(answer.time_taken / 1000).toFixed(3)}s
						</td>
						<td class="p-3 text-sm text-secondary">{answer.answer}</td>
						{#if question.type !== QuizQuestionType.VOTING}
							<td class="p-3 text-center">
								{#if answer.right}✅{:else}❌{/if}
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>