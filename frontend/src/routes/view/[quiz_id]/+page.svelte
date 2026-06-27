<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import DownloadQuiz from '$lib/components/DownloadQuiz.svelte';
	import { getLocalization } from '$lib/i18n';
	import CollapsSection from '$lib/collapsible.svelte';
	import { createTippy } from 'svelte-tippy';
	import ImportedOrNot from '$lib/view_quiz/imported_or_not.svelte';
	import { QuizQuestionType } from '$lib/quiz_types.js';
	import StartGamePopup from '$lib/dashboard/start_game.svelte';
	import { onMount } from 'svelte';
	import Spinner from '$lib/Spinner.svelte';
	import MediaComponent from '$lib/editor/MediaComponent.svelte';
	import RatingComponent from '$lib/view_quiz/RatingComponent.svelte';
	import { page } from '$app/state';
	import ModComponent from './ModComponent.svelte';
	import { get_foreground_color } from '$lib/helpers.ts';

	const default_colors = ['#6366F1', '#EC4899', '#F59E0B', '#10B981'];

	const tippy = createTippy({
		arrow: true,
		animation: 'perspective-subtle',
		placement: 'right'
	});

	let start_game = $state(null);
	let download_id: string | null = $state(null);
	const urlparams = page.url.searchParams;
	const mod_view = Boolean(urlparams.get('mod'));
	const auto_expand = Boolean(urlparams.get('autoExpand'));
	const auto_return = Boolean(urlparams.get('autoReturn'));

	const close_start_game_if_esc_is_pressed = (key: KeyboardEvent) => {
		if (key.code === 'Escape') start_game = null;
	};
	onMount(() => {
		document.body.addEventListener('keydown', close_start_game_if_esc_is_pressed);
	});

	const { t } = getLocalization();
	let { data } = $props();
	let { quiz, logged_in }: { quiz: QuizData; logged_in: boolean } = $state(data);

	interface Question {
		time: string;
		question: string;
		image?: string;
		answers: Answer[];
	}
	interface Answer {
		right: boolean;
		answer: string;
	}
	interface QuizData {
		id: string;
		public: boolean;
		title: string;
		description: string;
		created_at: string;
		updated_at: string;
		user_id: string;
		imported_from_kahoot?: boolean;
		questions: Question[];
		kahoot_id?: string;
		mod_rating?: number;
	}
</script>

<svelte:head>
	<title>ClassQuiz - {quiz.title}</title>
</svelte:head>

<div class="min-h-screen bg-[#0F172A] px-4 py-10">
	<div class="mx-auto max-w-3xl">

		<!-- Header-Karte -->
		<div class="mb-8 rounded-3xl border border-white/10 bg-[#1E293B] p-8 shadow-2xl">
			{#if quiz.cover_image}
				<div class="mb-6 flex justify-center">
					<img
						class="max-h-48 w-auto rounded-2xl border border-white/10 object-contain shadow-xl"
						src="/api/v1/storage/download/{quiz.cover_image}"
						alt="Quiz-Titelbild"
					/>
				</div>
			{/if}

			<h1 class="mb-2 text-center text-3xl font-bold text-[#F8FAFC]">{@html quiz.title}</h1>

			{#if quiz.description}
				<p class="mb-3 text-center text-[#94A3B8]">{@html quiz.description}</p>
			{/if}

			<p class="mb-4 text-center text-sm text-[#475569]">
				{$t('view_quiz_page.made_by')}
				<a href="/user/{quiz.user_id.id}" class="text-[#6366F1] underline hover:text-[#818CF8]">
					@{quiz.user_id.username}
				</a>
			</p>

			<div class="mb-4 flex justify-center">
				<ImportedOrNot imported={quiz.imported_from_kahoot} />
			</div>

			<div class="flex justify-center gap-3 flex-wrap mb-4">
				<RatingComponent bind:quiz />
				{#if mod_view}
					<ModComponent autoReturn={auto_return} quiz_id={quiz.id} />
				{/if}
			</div>

			<!-- Aktions-Buttons -->
			<div class="flex flex-wrap justify-center gap-3">
			{#if quiz.imported_from_kahoot && quiz.kahoot_id}
				<a href="https://create.kahoot.it/details/{quiz.kahoot_id}"
					target="_blank"
					class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-[#F8FAFC] transition hover:bg-white/10"
				>
					{$t('view_quiz_page.view_on_kahoot')}
				</a>
			{/if}
				<!-- Spiel starten -->
				{#if logged_in}
					<button
						onclick={() => { start_game = quiz.id; }}
						class="flex items-center gap-2 rounded-xl bg-[#6366F1] px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-[#5558E3]"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						Spiel starten
					</button>
				{:else}
					<div use:tippy={{ content: 'Du musst eingeloggt sein, um ein Spiel zu starten' }}>
						<button disabled class="flex items-center gap-2 rounded-xl bg-[#6366F1] px-4 py-2 text-sm font-semibold text-white opacity-40 cursor-not-allowed">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
								<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							Spiel starten
						</button>
					</div>
				{/if}

				<!-- Üben -->
				
				<a href="/practice?quiz_id={quiz.id}"
					class="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-[#F8FAFC] transition hover:bg-white/10"
				>
					{$t('words.practice')}
				</a>

				<!-- Download -->
				{#if logged_in}
					<button
						onclick={() => (download_id = quiz.id)}
						class="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-[#F8FAFC] transition hover:bg-white/10"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
						</svg>
						{$t('words.download')}
					</button>
				{:else}
					<div use:tippy={{ content: 'Du musst eingeloggt sein, um herunterzuladen' }}>
						<button disabled class="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-[#F8FAFC] opacity-40 cursor-not-allowed">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
							</svg>
							{$t('words.download')}
						</button>
					</div>
				{/if}
			</div>

			<div class="mt-4 flex justify-center">
				
				<a href="mailto:report@mawoka.eu?subject=Report quiz {quiz.id}"
					class="text-xs text-[#475569] underline hover:text-[#94A3B8]"
				>
					{$t('words.report')}
				</a>
			</div>
		</div>

		<!-- Fragen -->
		<div class="flex flex-col gap-3">
			{#each quiz.questions as question, index_question}
				<div class="rounded-2xl border border-white/10 bg-[#1E293B] overflow-hidden shadow-lg">
					<CollapsSection headerText={question.question} expanded={auto_expand}>
						<div class="px-4 pb-4">
							<h3 class="mb-3 text-center text-xl font-semibold text-[#F8FAFC]">
								{index_question + 1}: {@html question.question}
							</h3>

							{#if question.image}
								<div class="mb-4 flex justify-center">
									<MediaComponent css_classes="mx-auto max-h-48 rounded-xl object-contain" src={question.image} muted={true} />
								</div>
							{/if}

							<!-- Zeit-Badge -->
							<div class="mb-4 flex justify-center">
								<div class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
									<svg class="h-4 w-4 text-[#6366F1]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span class="text-sm font-medium text-[#94A3B8]">{question.time}s</span>
								</div>
							</div>

							<!-- ABCD / CHECK -->
							{#if question.type === QuizQuestionType.ABCD || question.type === undefined || question.type === QuizQuestionType.CHECK}
								<div class="grid grid-cols-2 gap-3">
									{#each question.answers as answer, index_answer}
										<div
											class="rounded-xl px-4 py-3 shadow-md border-2 transition"
											style="background-color: {answer.color ?? default_colors[index_answer % 4]}; color: {get_foreground_color(answer.color ?? default_colors[index_answer % 4])}; border-color: {answer.right && question.type !== QuizQuestionType.VOTING ? 'rgba(255,255,255,0.4)' : 'transparent'}"
										>
											<p class="text-center font-medium">{answer.answer}</p>
											{#if answer.right && question.type !== QuizQuestionType.VOTING}
												<p class="text-center text-xs mt-1 opacity-80">✓ Richtig</p>
											{/if}
										</div>
									{/each}
								</div>

							<!-- RANGE -->
							{:else if question.type === QuizQuestionType.RANGE}
								<div class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-[#94A3B8]">
									Richtige Zahlen: {question.answers.min_correct} – {question.answers.max_correct}
									(Bereich: {question.answers.min} – {question.answers.max})
								</div>

							<!-- ORDER -->
							{:else if question.type === QuizQuestionType.ORDER}
								<ul class="flex flex-col gap-2">
									{#each question.answers as answer, i}
										<li class="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
											<span class="text-sm font-bold text-[#475569]">{i + 1}.</span>
											<span class="text-[#F8FAFC]">{answer.answer}</span>
										</li>
									{/each}
								</ul>

							<!-- VOTING / TEXT -->
							{:else if question.type === QuizQuestionType.VOTING || question.type === QuizQuestionType.TEXT}
								<div class="grid grid-cols-2 gap-3">
									{#each question.answers as answer, index_answer}
										<div class="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
											<p class="text-center text-[#F8FAFC]">{answer.answer}</p>
										</div>
									{/each}
								</div>

							<!-- SLIDE -->
							{:else if question.type === QuizQuestionType.SLIDE}
								{#await import('$lib/play/admin/slide.svelte')}
									<Spinner my_20={false} />
								{:then c}
									<div class="max-h-[90%] max-w-[90%] mx-auto">
										<c.default question={quiz.questions[index_question]} />
									</div>
								{/await}
							{/if}
						</div>
					</CollapsSection>
				</div>
			{/each}
		</div>
	</div>
</div>

{#if start_game !== null}
	<StartGamePopup bind:quiz_id={start_game} />
{/if}

<DownloadQuiz bind:quiz_id={download_id} />
SVELTE_EOF