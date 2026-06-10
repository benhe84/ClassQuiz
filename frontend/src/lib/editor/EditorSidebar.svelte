<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->
<script lang="ts">
	import type { EditorData, Question } from '../quiz_types';
	import { QuizQuestionType } from '$lib/quiz_types';
	import { reach } from 'yup';
	import { ABCDQuestionSchema, dataSchema } from '../yupSchemas';
	import { createTippy } from 'svelte-tippy';
	import { getLocalization } from '$lib/i18n';
	import AddNewQuestionPopup from '$lib/editor/AddNewQuestionPopup.svelte';
	import { fade } from 'svelte/transition';
	const { t } = getLocalization();

	interface Props {
		data: EditorData;
		selected_question?: any;
	}
	let { data = $bindable(), selected_question = $bindable(-1) }: Props = $props();
	let reorder_mode = $state(false);
	const tippy = createTippy({ arrow: true, animation: 'perspective-subtle', placement: 'right' });
	let arr_of_cards = $state(Array(data.questions.length));
	let propertyCard = $state();
	let add_new_question_popup_open = $state(false);

	const empy_slide: Question = {
		type: QuizQuestionType.SLIDE,
		time: '120',
		question: 'Slide',
		image: undefined,
		answers: ''
	};

	const swapArrayElements = (arr, a: number, b: number) => {
		let _arr = [...arr];
		let temp = _arr[a];
		_arr[a] = _arr[b];
		_arr[b] = temp;
		return _arr;
	};

	const setSelectedQuestion = (index: number): void => {
		if (reorder_mode) return;
		selected_question = index;
		if (index === -1) {
			propertyCard?.scrollIntoView({ behavior: 'smooth' });
		} else {
			arr_of_cards[index]?.scrollIntoView({ behavior: 'smooth' });
		}
	};
</script>

<div class="h-full flex flex-col" style="background-color:#1E293B;">
	<!-- Reorder Toggle -->
	<div class="p-3 border-b" style="border-color:#6366F133;">
		<button
			type="button"
			onclick={() => (reorder_mode = !reorder_mode)}
			class="w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition"
			style="background-color:{reorder_mode ? '#6366F1' : '#0F172A'}; color:#F8FAFC; border:1px solid #6366F133;"
		>
			{reorder_mode ? $t('editor.disable_reorder') : $t('editor.enable_reorder')}
		</button>
	</div>

	<!-- Scrollbare Kartenliste -->
	<div class="flex-1 overflow-y-auto p-3 flex flex-col gap-2">

		<!-- Quiz-Einstellungskarte -->
		<div
			bind:this={propertyCard}
			onclick={() => setSelectedQuestion(-1)}
			class="rounded-xl p-3 cursor-pointer transition border"
			style="background-color:{selected_question === -1 ? '#6366F1' : '#0F172A'}; border-color:{selected_question === -1 ? '#818CF8' : '#6366F133'};"
		>
			<p class="text-xs font-semibold uppercase tracking-widest mb-2" style="color:{selected_question === -1 ? '#E0E7FF' : '#CBD5E1'};">
				Quiz-Einstellungen
			</p>
			<div
				class="rounded-lg p-1.5 text-sm truncate"
				style="background-color:rgba(0,0,0,0.2); color:#F8FAFC;"
				class:border-red-500={!reach(dataSchema, 'title').isValidSync(data.title)}
			>
				{#if data.title}
					{@html data.title}
				{:else}
					<span class="italic" style="color:#94A3B8;">{$t('editor.no_title')}</span>
				{/if}
			</div>
			<div class="flex items-center gap-1 mt-2">
				{#if data.public}
					<span class="text-xs px-2 py-0.5 rounded-full" style="background-color:#14B8A620; color:#14B8A6;">Öffentlich</span>
				{:else}
					<span class="text-xs px-2 py-0.5 rounded-full" style="background-color:#6366F120; color:#818CF8;">Privat</span>
				{/if}
			</div>
		</div>

		<!-- Fragekarten -->
		{#each data.questions as question, index}
			<div
				bind:this={arr_of_cards[index]}
				onclick={() => setSelectedQuestion(index)}
				class="rounded-xl p-3 cursor-pointer transition border relative"
				style="background-color:{index === selected_question ? '#6366F1' : '#0F172A'}; border-color:{index === selected_question ? '#818CF8' : '#6366F133'};"
			>
				<!-- Löschen-Button -->
				<button
					type="button"
					onclick={() => {
						if (confirm('Frage wirklich löschen?')) {
							selected_question = -1;
							data.questions.splice(index, 1);
							data.questions = data.questions;
						}
					}}
					class="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center"
					style="background-color:#EF4444;"
				>
					<svg class="w-3 h-3" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
				</button>

				<!-- Umsortieren -->
				{#if reorder_mode}
					<div class="absolute inset-0 rounded-xl grid grid-cols-2 z-10" transition:fade|global={{ duration: 90 }} style="background-color:rgba(0,0,0,0.6);">
						<button
							type="button"
							aria-label="Nach oben"
							class="flex items-center justify-center rounded-l-xl transition hover:bg-white/10"
							class:opacity-30={index === 0}
							class:pointer-events-none={index === 0}
							onclick={() => (data.questions = swapArrayElements(data.questions, index, index - 1))}
						>
							<svg class="w-8 h-8" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="m4.5 15.75 7.5-7.5 7.5 7.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
						</button>
						<button
							type="button"
							aria-label="Nach unten"
							class="flex items-center justify-center rounded-r-xl transition hover:bg-white/10"
							class:opacity-30={index + 1 === data.questions.length}
							class:pointer-events-none={index + 1 === data.questions.length}
							onclick={() => (data.questions = swapArrayElements(data.questions, index, index + 1))}
						>
							<svg class="w-8 h-8" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="m19.5 8.25-7.5 7.5-7.5-7.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
						</button>
					</div>
				{/if}

				<!-- Fragenummer + Typ -->
				<div class="flex items-center justify-between mb-1">
					<span class="text-xs font-semibold" style="color:{index === selected_question ? '#E0E7FF' : '#CBD5E1'};">
						Frage {index + 1}
					</span>
					<span class="text-xs px-1.5 py-0.5 rounded" style="background-color:rgba(0,0,0,0.3); color:{index === selected_question ? '#E0E7FF' : '#94A3B8'};">
						{question.type}
					</span>
				</div>

				<!-- Fragetitel -->
				<div class="rounded-lg p-1.5 text-sm truncate" style="background-color:rgba(0,0,0,0.2); color:#F8FAFC;">
					{#if question.question === ''}
						<span class="italic" style="color:#94A3B8;">{$t('editor.no_title')}</span>
					{:else}
						{@html question.question}
					{/if}
				</div>

				<!-- Antworten-Vorschau -->
				{#if (question.type === QuizQuestionType.ABCD || question.type === QuizQuestionType.CHECK) && Array.isArray(question.answers)}
					<div class="grid grid-cols-2 gap-1 mt-2">
						{#each question.answers as answer}
							<span
								class="truncate rounded text-xs p-1 text-center"
								style="background-color:{answer.right ? '#22C55E30' : '#EF444430'}; color:{answer.right ? '#22C55E' : '#EF4444'};"
							>{answer.answer || '...'}</span>
						{/each}
					</div>
				{/if}
			</div>
		{/each}

		<!-- Neue Frage / Folie hinzufügen -->
		<div class="rounded-xl border grid grid-cols-2 overflow-hidden" style="border-color:#6366F133;">
			<button
				type="button"
				onclick={() => (add_new_question_popup_open = true)}
				class="flex flex-col items-center justify-center gap-1 py-4 transition"
				style="background-color:#0F172A; color:#CBD5E1; border-right:1px solid #6366F133;"
				onmouseenter={(e) => e.currentTarget.style.backgroundColor = '#6366F120'}
				onmouseleave={(e) => e.currentTarget.style.backgroundColor = '#0F172A'}
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
				<span class="text-xs font-semibold">{$t('words.question')}</span>
			</button>
			<button
				type="button"
				onclick={() => { data.questions = [...data.questions, { ...empy_slide }]; }}
				class="flex flex-col items-center justify-center gap-1 py-4 transition"
				style="background-color:#0F172A; color:#CBD5E1;"
				onmouseenter={(e) => e.currentTarget.style.backgroundColor = '#6366F120'}
				onmouseleave={(e) => e.currentTarget.style.backgroundColor = '#0F172A'}
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
				<span class="text-xs font-semibold">{$t('words.slide')}</span>
			</button>
		</div>
	</div>
</div>

{#if add_new_question_popup_open}
	<AddNewQuestionPopup
		bind:questions={data.questions}
		bind:open={add_new_question_popup_open}
		bind:selected_question
	/>
{/if}
