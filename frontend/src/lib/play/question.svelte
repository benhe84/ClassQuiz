<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import type { Question } from '$lib/quiz_types';
	import { QuizQuestionType } from '$lib/quiz_types';
	import { socket } from '$lib/socket';
	import Spinner from '../Spinner.svelte';
	import { getLocalization } from '$lib/i18n';
	import { kahoot_icons } from './kahoot_mode_assets/kahoot_icons';
	import CircularTimer from '$lib/play/circular_progress.svelte';
	import { flip } from 'svelte/animate';
	import { get_foreground_color } from '../helpers';
	import MediaComponent from '$lib/editor/MediaComponent.svelte';

	const { t } = getLocalization();

	interface Props {
		question: Question;
		game_mode: any;
		question_index: string | number;
		solution: any;
	}

	let {
		question = $bindable(),
		game_mode = $bindable(),
		question_index,
		solution
	}: Props = $props();

	if (question.type === undefined) {
		question.type = QuizQuestionType.ABCD;
	} else {
		question.type = QuizQuestionType[question.type];
	}

	let timer_res = $state(question.time);
	let selected_answer: string = $state();

	const timer = (time: string) => {
		let seconds = Number(time);
		let timer_interval = setInterval(() => {
			if (timer_res === '0') {
				clearInterval(timer_interval);
				return;
			} else {
				seconds--;
			}
			timer_res = seconds.toString();
		}, 1000);
	};

	socket.on('everyone_answered', (_) => {
		timer_res = '0';
	});

	timer(question.time);

	$effect(() => {
		if (solution !== undefined) timer_res = '0';
	});

	const selectAnswer = (answer: string) => {
		selected_answer = answer;
		socket.emit('submit_answer', { question_index, answer });
	};

	const select_complex_answer = (data) => {
		selected_answer = 'a';
		const new_array = data.map((d) => ({ answer: d.answer }));
		socket.emit('submit_answer', {
			question_index,
			answer: 'a',
			complex_answer: new_array
		});
	};

	let text_input = $state('');
	let slider_value = $state([0]);

	if (question.type === QuizQuestionType.RANGE) {
		slider_value[0] = (question.answers.max - question.answers.min) / 2 + question.answers.min;
	}

	const set_answer_if_not_set_range = (time) => {
		if (question.type !== QuizQuestionType.RANGE) return;
		if (selected_answer === undefined && time === '0') {
			selected_answer = `${slider_value[0]}`;
			selectAnswer(selected_answer);
		}
	};

	if (question.type === QuizQuestionType.ORDER) {
		for (let i = 0; i < question.answers.length; i++) {
			question.answers[i] = { ...question.answers[i], id: i };
		}
	}

	const swapArrayElements = (arr, a: number, b: number) => {
		let _arr = [...arr];
		let temp = _arr[a];
		_arr[a] = _arr[b];
		_arr[b] = temp;
		return _arr;
	};

	$effect(() => { set_answer_if_not_set_range(timer_res); });

	let circular_progress = $derived.by(() => {
		try {
			return 1 - ((100 / question.time) * parseInt(timer_res)) / 100;
		} catch {
			return 0;
		}
	});

	const get_div_height = (): string => {
		if (game_mode === 'normal') {
			return question.image ? '66.666667' : '83.333333';
		}
		return '100';
	};

	const default_colors = ['#6366F1', '#EC4899', '#F59E0B', '#10B981'];

	let timer_pct = $derived(
		(100 / parseInt(question.time)) * parseInt(timer_res)
	);
</script>

<div class="h-screen w-screen bg-[#0F172A] flex flex-col overflow-hidden">

	{#if game_mode === 'normal'}
		<div
			class="flex flex-col justify-center px-4 pt-4"
			style="height: {question.image ? '33.333333' : '20'}%"
		>
			<h1 class="text-center text-lg font-bold text-[#F8FAFC] lg:text-2xl leading-snug">
				{@html question.question}
			</h1>
			{#if question.image !== null && game_mode !== 'kahoot'}
				<div class="flex justify-center mt-2 max-h-full">
					<MediaComponent
						src={question.image}
						css_classes="object-contain mx-auto max-h-32 rounded-xl"
					/>
				</div>
			{/if}
		</div>
	{/if}

	{#if timer_res !== '0'}
		{#if question.type === QuizQuestionType.ABCD || question.type === QuizQuestionType.VOTING}
			<div class="relative flex-1" style="height: {get_div_height()}%">
				<div class="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2">
					<CircularTimer text={timer_res} progress={circular_progress} color="#6366F1" />
				</div>
				<div class="grid h-full grid-cols-2 grid-rows-2 gap-3 p-4">
					{#each question.answers as answer, i}
						<button
							class="flex items-center justify-center rounded-2xl border-2 border-black/20 p-4 font-semibold shadow-lg transition-all duration-150 hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
							style="background-color: {answer.color ?? default_colors[i % 4]}; color: {get_foreground_color(answer.color ?? default_colors[i % 4])}"
							disabled={selected_answer !== undefined}
							onclick={() => selectAnswer(answer.answer)}
						>
							{#if game_mode === 'kahoot'}
								<img class="h-2/3 inline-block" alt="Icon" src={kahoot_icons[i]} />
							{:else}
								<p class="text-center text-sm lg:text-base">{answer.answer}</p>
							{/if}
						</button>
					{/each}
				</div>
			</div>

		{:else if question.type === QuizQuestionType.RANGE}
			<div class="h-2 w-full bg-white/10">
				<div class="h-full bg-[#6366F1] transition-all duration-1000" style="width: {timer_pct}%"></div>
			</div>
			<div class="flex flex-1 flex-col items-center justify-center gap-6 px-6">
				{#await import('svelte-range-slider-pips')}
					<Spinner />
				{:then c}
					<div class="w-full" class:pointer-events-none={selected_answer !== undefined}>
						<c.default
							bind:values={slider_value}
							bind:min={question.answers.min}
							bind:max={question.answers.max}
							id="pips-slider"
							pips
							float
							all="label"
						/>
					</div>
					<button
						onclick={() => selectAnswer(slider_value[0])}
						disabled={selected_answer !== undefined}
						class="w-1/2 rounded-xl bg-[#6366F1] py-3 font-semibold text-white transition hover:bg-[#5558E3] disabled:opacity-40"
					>
						{$t('words.submit')}
					</button>
				{/await}
			</div>

		{:else if question.type === QuizQuestionType.TEXT}
			<div class="h-2 w-full bg-white/10">
				<div class="h-full bg-[#6366F1] transition-all duration-1000" style="width: {timer_pct}%"></div>
			</div>
			<div class="flex flex-1 flex-col items-center justify-center gap-4 px-6">
				<p class="text-sm font-medium text-[#94A3B8]">Deine Antwort eingeben</p>
				<input
					type="text"
					bind:value={text_input}
					disabled={selected_answer !== undefined}
					placeholder="Antwort..."
					class="w-full rounded-xl border border-white/10 bg-[#1E293B] px-4 py-3 text-center text-[#F8FAFC] placeholder-[#475569] outline-none transition focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/30 disabled:opacity-50"
				/>
				<button
					type="button"
					disabled={!text_input || text_input.length === 0}
					onclick={() => selectAnswer(text_input)}
					class="w-1/3 rounded-xl bg-[#6366F1] py-3 font-semibold text-white transition hover:bg-[#5558E3] disabled:opacity-40"
				>
					{$t('words.submit')}
				</button>
			</div>

		{:else if question.type === QuizQuestionType.ORDER}
			<div class="h-2 w-full bg-white/10">
				<div class="h-full bg-[#6366F1] transition-all duration-1000" style="width: {timer_pct}%"></div>
			</div>
			<div class="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-6">
				{#each question.answers as answer, i (answer.id)}
					<div
						class="w-full rounded-2xl border border-black/20 shadow-md"
						animate:flip={{ duration: 100 }}
						style="background-color: {answer.color ?? '#6366F1'}"
					>
						<button
							onclick={() => { question.answers = swapArrayElements(question.answers, i, i - 1); }}
							class="flex w-full justify-center rounded-t-2xl bg-black/20 py-2 transition hover:bg-black/30 disabled:opacity-40"
							type="button"
							aria-label="Nach oben"
							disabled={i === 0 || Boolean(selected_answer)}
						>
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
							</svg>
						</button>
						<p class="w-full py-3 text-center text-xl font-semibold text-white">{answer.answer}</p>
						<button
							onclick={() => { question.answers = swapArrayElements(question.answers, i, i + 1); }}
							class="flex w-full justify-center rounded-b-2xl bg-black/20 py-2 transition hover:bg-black/30 disabled:opacity-40"
							type="button"
							aria-label="Nach unten"
							disabled={i === question.answers.length - 1 || Boolean(selected_answer)}
						>
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</button>
					</div>
				{/each}
				<button
					type="button"
					disabled={Boolean(selected_answer)}
					onclick={() => select_complex_answer(question.answers)}
					class="mt-2 w-full rounded-xl bg-[#6366F1] py-3 font-semibold text-white transition hover:bg-[#5558E3] disabled:opacity-40"
				>
					{$t('words.submit')}
				</button>
			</div>

		{:else if question.type === QuizQuestionType.CHECK}
			{#await import('./questions/check.svelte')}
				<Spinner />
			{:then c}
				<c.default
					{question}
					bind:selected_answer
					{game_mode}
					{timer_res}
					{circular_progress}
				/>
				<div class="flex justify-center pb-4">
					<button
						type="button"
						disabled={selected_answer === undefined}
						onclick={() => selectAnswer(selected_answer)}
						class="w-1/2 rounded-xl bg-[#6366F1] py-3 font-semibold text-white transition hover:bg-[#5558E3] disabled:opacity-40"
					>
						{$t('words.submit')}
					</button>
				</div>
			{/await}
		{/if}
	{/if}
</div>
