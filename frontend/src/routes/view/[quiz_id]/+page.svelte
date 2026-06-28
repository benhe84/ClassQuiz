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
	let { quiz, logged_in }: { quiz: any; logged_in: boolean } = $state(data);

	const question_type_icon: Record<string, string> = {
		[QuizQuestionType.ABCD]: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
		[QuizQuestionType.CHECK]: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
		[QuizQuestionType.RANGE]: 'M3 12h18M3 6h18M3 18h18',
		[QuizQuestionType.ORDER]: 'M4 6h16M4 10h16M4 14h16M4 18h16',
		[QuizQuestionType.VOTING]: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2h2m10-4l-5-5-5 5m5-5v12',
		[QuizQuestionType.TEXT]: 'M4 6h16M4 12h16M4 18h7',
		[QuizQuestionType.SLIDE]: 'M3 3h18v18H3V3zm4 4h10v10H7V7z'
	};

	const question_type_color: Record<string, string> = {
		[QuizQuestionType.ABCD]: 'var(--answer-a)',
		[QuizQuestionType.CHECK]: 'var(--answer-b)',
		[QuizQuestionType.RANGE]: 'var(--answer-c)',
		[QuizQuestionType.ORDER]: 'var(--answer-d)',
		[QuizQuestionType.VOTING]: 'var(--secondary)',
		[QuizQuestionType.TEXT]: 'var(--text-muted)',
		[QuizQuestionType.SLIDE]: 'var(--primary)'
	};
</script>

<svelte:head>
	<title>ClassQuiz - {quiz.title}</title>
</svelte:head>

<div class="min-h-screen bg-base px-4 py-10">
	<div class="mx-auto max-w-4xl">

		<!-- HEADER -->
		<div class="mb-8 rounded-3xl border border-base bg-surface p-8 shadow-2xl">

			{#if quiz.cover_image}
				<div class="mb-6 flex justify-center">
					<img
						class="max-h-48 w-auto rounded-2xl border border-base object-contain shadow-xl"
						src="/api/v1/storage/download/{quiz.cover_image}"
						alt="Quiz cover"
					/>
				</div>
			{/if}

			<div class="flex items-center justify-center gap-2 mb-2">
				<h1 class="text-center text-3xl font-bold text-base">
					{@html quiz.title}
				</h1>
				<ImportedOrNot imported={quiz.imported_from_kahoot} />
			</div>

			{#if quiz.description}
				<p class="mb-3 text-center text-muted">
					{@html quiz.description}
				</p>
			{/if}

			<p class="mb-6 text-center text-sm text-muted">
				{$t('view_quiz_page.made_by')}
				<a class="text-primary hover:text-primary-hover underline" href="/user/{quiz.user_id.id}">
					@{quiz.user_id.username}
				</a>
			</p>

			{#if mod_view}
				<div class="mb-4 flex justify-center">
					<ModComponent autoReturn={auto_return} quiz_id={quiz.id} />
				</div>
			{/if}

			<!-- ACTIONS + RATING -->
			<div class="flex flex-wrap items-center justify-center gap-3">

				{#if quiz.imported_from_kahoot && quiz.kahoot_id}
					
					<a	href="https://create.kahoot.it/details/{quiz.kahoot_id}"
						target="_blank"
						class="rounded-xl border border-base bg-surface-2 px-4 py-2 text-sm font-medium text-base hover:bg-surface transition"
					>
						{$t('view_quiz_page.view_on_kahoot')}
					</a>
				{/if}

				{#if logged_in}
					<button
						onclick={() => (start_game = quiz.id)}
						class="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg hover:bg-primary-hover transition"
					>
						Spiel starten
					</button>
				{:else}
					<div use:tippy={{ content: 'Login erforderlich' }}>
						<button disabled class="opacity-40 flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">
							Spiel starten
						</button>
					</div>
				{/if}

				
					href="/practice?quiz_id={quiz.id}"
					class="rounded-xl border border-base bg-surface-2 px-4 py-2 text-sm font-medium text-base hover:bg-surface transition"
				>
					{$t('words.practice')}
				</a>

				{#if logged_in}
					<button
						onclick={() => (download_id = quiz.id)}
						class="rounded-xl border border-base bg-surface-2 px-4 py-2 text-sm font-medium text-base hover:bg-surface transition"
					>
						{$t('words.download')}
					</button>
				{:else}
					<div use:tippy={{ content: 'Login erforderlich' }}>
						<button disabled class="opacity-40 rounded-xl border border-base bg-surface-2 px-4 py-2 text-sm font-medium text-base">
							{$t('words.download')}
						</button>
					</div>
				{/if}

				<div class="h-8 w-px bg-base"></div>

				<RatingComponent bind:quiz />
			</div>

			<div class="mt-4 text-center">
				<a class="text-xs text-muted underline hover:text-base" href="mailto:report@mawoka.eu?subject=Report quiz {quiz.id}">
					{$t('words.report')}
				</a>
			</div>
		</div>

		<!-- QUESTIONS -->
		<div class="flex flex-col gap-2">

			{#each quiz.questions as question, index_question}
				<div class="rounded-xl border border-base bg-surface overflow-hidden">

					<CollapsSection expanded={auto_expand}>
						{#snippet header()}
							<div class="flex items-center gap-3 flex-1">
								<span
									class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
									style="background-color: {question_type_color[question.type] ?? 'var(--primary)'};"
								>
									{index_question + 1}
								</span>
								<svg
									class="h-4 w-4 flex-shrink-0"
									style="color: {question_type_color[question.type] ?? 'var(--primary)'};"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d={question_type_icon[question.type] ?? 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'}
									/>
								</svg>
								<span class="text-left font-medium text-base">{@html question.question}</span>
							</div>
						{/snippet}

						<div class="px-5 pb-5">

							{#if question.image}
								<div class="mb-4 flex justify-center">
									<MediaComponent
										css_classes="mx-auto max-h-48 rounded-xl object-contain"
										src={question.image}
										muted={true}
									/>
								</div>
							{/if}

							<div class="mb-4 flex justify-center">
								<div class="flex items-center gap-2 rounded-full border border-base bg-surface-2 px-3 py-1">
									<span class="text-sm text-muted">{question.time}s</span>
								</div>
							</div>

							<!-- ABCD / CHECK -->
							{#if question.type === QuizQuestionType.ABCD || question.type === QuizQuestionType.CHECK}
								<div class="grid grid-cols-2 gap-3">

									{#each question.answers as answer, index_answer}
										<div
											class="rounded-xl px-4 py-3 shadow-md border-2 transition"
											style="
												background-color: {answer.color ?? default_colors[index_answer % 4]};
												color: {get_foreground_color(answer.color ?? default_colors[index_answer % 4])};
											"
										>
											<p class="text-center font-medium">{answer.answer}</p>

											{#if answer.right}
												<p class="text-center text-xs mt-1 opacity-80">✓</p>
											{/if}
										</div>
									{/each}

								</div>

							{:else if question.type === QuizQuestionType.RANGE}
								<div class="rounded-xl border border-base bg-surface-2 px-4 py-3 text-center text-sm text-muted">
									{question.answers.min_correct} – {question.answers.max_correct}
									({question.answers.min} – {question.answers.max})
								</div>

							{:else if question.type === QuizQuestionType.ORDER}
								<ul class="flex flex-col gap-2">
									{#each question.answers as answer, i}
										<li class="flex items-center gap-3 rounded-xl border border-base bg-surface-2 px-4 py-2">
											<span class="text-sm text-muted">{i + 1}.</span>
											<span class="text-base">{answer.answer}</span>
										</li>
									{/each}
								</ul>

							{:else if question.type === QuizQuestionType.VOTING || question.type === QuizQuestionType.TEXT}
								<div class="grid grid-cols-2 gap-3">
									{#each question.answers as answer}
										<div class="rounded-xl border border-base bg-surface-2 px-4 py-3">
											<p class="text-center text-base">{answer.answer}</p>
										</div>
									{/each}
								</div>

							{:else if question.type === QuizQuestionType.SLIDE}
								{#await import('$lib/play/admin/slide.svelte')}
									<Spinner />
								{:then c}
									<div class="mx-auto max-w-[90%]">
										<c.default question={question} />
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