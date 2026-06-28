<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import type { OrderQuizAnswer, Question } from '$lib/quiz_types';
	import { QuizQuestionType } from '$lib/quiz_types';
	import { fly } from 'svelte/transition';
	import { getLocalization } from '$lib/i18n';
	import Spinner from '$lib/Spinner.svelte';
	import { flip } from 'svelte/animate';
	import BrownButton from '$lib/components/buttons/brown.svelte';
	import MediaComponent from '$lib/editor/MediaComponent.svelte';

	interface Props {
		question: Question;
	}

	let { question = $bindable() }: Props = $props();

	const { t } = getLocalization();

	let selected_answer = $state<number | string | undefined>(undefined);
	let timer_res = $state(question.time);
	let show_results = $state(false);

	let text_input = $state<string>('');
	let check_choice_selected = $state<boolean[]>([false, false, false, false]);

	let slider_value = $state<number[]>([0]);
	let slider_values = $state<number[]>([
		question.answers?.min_correct ?? 0,
		question.answers?.max_correct ?? 0
	]);

	let order_corrected = $state(false);

	const startTimer = (time: string) => {
		let seconds = Number(time);

		const interval = setInterval(() => {
			if (timer_res === '0') {
				clearInterval(interval);
				return;
			}
			seconds -= 1;
			timer_res = String(seconds);
		}, 1000);
	};

	startTimer(question.time);

	if (question.type === QuizQuestionType.RANGE) {
		slider_value[0] =
			(question.answers.max - question.answers.min) / 2 + question.answers.min;
	}

	function swapArrayElements<T>(arr: T[], a: number, b: number): T[] {
		const copy = [...arr];
		[copy[a], copy[b]] = [copy[b], copy[a]];
		return copy;
	}

	function shuffleArray<T>(a: T[]): T[] {
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	let original_order: OrderQuizAnswer[] = [];

	if (question.type === QuizQuestionType.ORDER) {
		for (let i = 0; i < question.answers.length; i++) {
			question.answers[i] = {
				answer: question.answers[i].answer,
				id: i
			} as OrderQuizAnswer;
		}

		original_order = [...question.answers];
		shuffleArray(question.answers);
	}

	const select_complex_answer = () => {
		question.answers = original_order;
		order_corrected = true;
		timer_res = '0';
	};

	const select_check = () => {
		timer_res = '0';
	};
</script>

<div
	class="w-full px-6 lg:px-20 h-[80vh] absolute bg-base text-base"
	in:fly|global={{ x: 100 }}
	out:fly|global={{ x: -100 }}
>
	<h1 class="text-3xl text-center">
		{@html question.question}
	</h1>

	{#if question.image !== null}
		<div>
			<MediaComponent
				src={question.image}
				css_classes="max-h-[40vh] object-cover mx-auto mb-8 w-auto"
			/>
		</div>
	{/if}

	<p class="text-center text-muted">{timer_res}</p>

	<!-- ABCD -->
	{#if question.type === QuizQuestionType.ABCD}
		{#if show_results}
			<div>
				{#each question.answers as answer, i}
					<button
						disabled
						class="answer-btn"
						class:bg-green-500={question.answers[i].right}
						class:bg-red-500={!question.answers[i].right}
					>
						{answer.answer}
					</button>
				{/each}
			</div>
		{:else}
			<div>
				{#each question.answers as answer, i}
					<button
						type="button"
						disabled={selected_answer !== undefined || timer_res === '0'}
						class="answer-btn bg-amber-300 text-black"
						onclick={() => {
							selected_answer = i;
							timer_res = '0';
						}}
					>
						{answer.answer}
					</button>
				{/each}

				{#if timer_res === '0'}
					<button
						type="button"
						class="btn btn-primary"
						onclick={() => (show_results = true)}
					>
						{$t('admin_page.get_results')}
					</button>
				{/if}
			</div>
		{/if}

	<!-- RANGE -->
	{:else if question.type === QuizQuestionType.RANGE}
		{#if timer_res === '0'}
			{#await import('svelte-range-slider-pips')}
				<Spinner />
			{:then c}
				<div class="bg-surface border border-base rounded-xl p-3 grayscale">
					<c.default
						bind:values={slider_values}
						bind:min={question.answers.min}
						bind:max={question.answers.max}
						pips
						float
						all="label"
					/>
				</div>
			{/await}
		{:else}
			{#await import('svelte-range-slider-pips')}
				<Spinner />
			{:then c}
				<div class="bg-surface border border-base rounded-xl p-3">
					<c.default
						bind:values={slider_value}
						bind:min={question.answers.min}
						bind:max={question.answers.max}
						pips
						float
						all="label"
					/>
				</div>

				<div class="flex justify-center mt-2">
					<button
						type="button"
						class="btn btn-primary"
						disabled={selected_answer !== undefined}
						onclick={() => {
							selected_answer = slider_value[0];
							timer_res = '0';
						}}
					>
						{$t('words.submit')}
					</button>
				</div>
			{/await}
		{/if}

	<!-- VOTING -->
	{:else if question.type === QuizQuestionType.VOTING}
		{#each question.answers as answer, i}
			<button
				type="button"
				disabled={selected_answer !== undefined || timer_res === '0'}
				class="answer-btn bg-secondary text-base"
				onclick={() => {
					selected_answer = i;
					timer_res = '0';
				}}
			>
				{answer.answer}
			</button>
		{/each}

	<!-- TEXT -->
	{:else if question.type === QuizQuestionType.TEXT}
		{#if timer_res === '0'}
			{#each question.answers as answer}
				<div class="card text-base">
					{answer.answer}
				</div>
			{/each}
		{:else}
			<div class="flex justify-center mt-2">
				<input
					type="text"
					bind:value={text_input}
					class="input"
				/>
			</div>

			<div class="flex justify-center">
				<button
					type="button"
					class="btn btn-primary"
					disabled={!text_input}
					onclick={() => {
						selected_answer = text_input;
						timer_res = '0';
					}}
				>
					{$t('words.submit')}
				</button>
			</div>
		{/if}

	<!-- ORDER -->
	{:else if question.type === QuizQuestionType.ORDER}
		<div class="flex flex-col gap-3 px-4 py-6">
			{#each question.answers as answer, i (answer.id)}
				<div class="card">
					<button
						type="button"
						class="btn btn-secondary"
						disabled={i === 0 || order_corrected}
						onclick={() => {
							question.answers = swapArrayElements(question.answers, i, i - 1);
						}}
					>
						↑
					</button>

					<p class="text-center text-base my-2">
						{answer.answer}
					</p>

					<button
						type="button"
						class="btn btn-secondary"
						disabled={i === question.answers.length - 1 || order_corrected}
						onclick={() => {
							question.answers = swapArrayElements(question.answers, i, i + 1);
						}}
					>
						↓
					</button>
				</div>
			{/each}

			<button
				class="btn btn-primary"
				type="button"
				disabled={timer_res === '0'}
				onclick={select_complex_answer}
			>
				{$t('words.submit')}
			</button>
		</div>

	<!-- CHECK -->
	{:else if question.type === QuizQuestionType.CHECK}
		<div>
			{#each question.answers as answer, i}
				<button
					type="button"
					class="answer-btn bg-amber-300 text-black opacity-50"
					class:opacity-100={check_choice_selected[i]}
					onclick={() => {
						check_choice_selected[i] = !check_choice_selected[i];
					}}
				>
					{answer.answer}
				</button>
			{/each}

			<button class="btn btn-secondary" onclick={select_check}>
				{$t('words.submit')}
			</button>

			{#if timer_res === '0'}
				<button class="btn btn-primary">
					{$t('admin_page.get_results')}
				</button>
			{/if}
		</div>
	{/if}
</div>