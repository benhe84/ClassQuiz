<script lang="ts">
	import DownloadQuiz from '$lib/components/DownloadQuiz.svelte';
	import { getLocalization } from '$lib/i18n';
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
	import { fade } from 'svelte/transition';

	const default_colors = ['#6366F1', '#EC4899', '#F59E0B', '#10B981'];

	const tippy = createTippy({
		arrow: true,
		animation: 'perspective-subtle',
		placement: 'top'
	});

	let start_game = $state(null);
	let download_id: string | null = $state(null);
	let open_question: number | null = $state(null);

	const urlparams = page.url.searchParams;
	const mod_view = Boolean(urlparams.get('mod'));
	const auto_expand = Boolean(urlparams.get('autoExpand'));

	onMount(() => {
		document.body.addEventListener('keydown', (e) => {
			if (e.code === 'Escape') open_question = null;
		});
		if (auto_expand && quiz.questions.length > 0) open_question = 0;
	});

	const { t } = getLocalization();
	let { data } = $props();
	let { quiz, logged_in } = $state(data);

	const type_labels: Record<string, string> = {
		ABCD: 'Multiple Choice',
		CHECK: 'Multiple Select',
		VOTING: 'Abstimmung',
		TEXT: 'Freitext',
		RANGE: 'Bereich',
		ORDER: 'Reihenfolge',
		SLIDE: 'Folie'
	};
</script>

<svelte:head>
	<title>ClassQuiz - {quiz.title}</title>
</svelte:head>

<div class="view-page">
	<div class="view-inner">

		<!-- Header -->
		<div class="card view-header">
			{#if quiz.cover_image}
				<div class="flex justify-center mb-5">
					<img
						src="/api/v1/storage/download/{quiz.cover_image}"
						alt="Cover"
						class="max-h-48 w-auto rounded-2xl border object-contain shadow-lg"
						style="border-color:var(--border);"
					/>
				</div>
			{/if}

			<h1 class="view-title">{@html quiz.title}</h1>

			{#if quiz.description}
				<p class="view-desc">{@html quiz.description}</p>
			{/if}

			<p class="view-author">
				{$t('view_quiz_page.made_by')}
				<a href="/user/{quiz.user_id.id}" class="view-author-link">
					@{quiz.user_id.username}
				</a>
			</p>

			<div class="flex justify-center mt-3">
				<ImportedOrNot imported={quiz.imported_from_kahoot} />
			</div>

			<div class="flex justify-center gap-3 flex-wrap mt-4">
				<RatingComponent bind:quiz />
				{#if mod_view}
					<ModComponent quiz_id={quiz.id} />
				{/if}
			</div>

			<!-- Aktionen -->
			<div class="view-actions">
				<!-- Spiel starten -->
				{#if logged_in}
					<button
						onclick={() => (start_game = quiz.id)}
						class="view-btn view-btn-primary"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						{$t('words.start') ?? 'Starten'}
					</button>
				{:else}
					<div use:tippy={{ content: 'Anmeldung erforderlich' }}>
						<button disabled class="view-btn view-btn-primary" style="opacity:0.4;cursor:not-allowed;">
							<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
								<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							Starten
						</button>
					</div>
				{/if}

				<!-- Üben -->
				<a href="/practice?quiz_id={quiz.id}" class="view-btn view-btn-secondary">
					<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
					</svg>
					{$t('words.practice')}
				</a>

				<!-- Download -->
				{#if logged_in}
					<button onclick={() => (download_id = quiz.id)} class="view-btn view-btn-secondary">
						<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
						</svg>
						{$t('words.download')}
					</button>
				{/if}

				<!-- Kahoot -->
				{#if quiz.imported_from_kahoot && quiz.kahoot_id}
					
						href="https://create.kahoot.it/details/{quiz.kahoot_id}"
						target="_blank"
						class="view-btn view-btn-secondary"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
						</svg>
						{$t('view_quiz_page.view_on_kahoot')}
					</a>
				{/if}
			</div>

			<div class="flex justify-center mt-4">
				
					href="mailto:report@mawoka.eu?subject=Report quiz {quiz.id}"
					class="text-xs underline"
					style="color:var(--text-secondary);"
				>
					{$t('words.report')}
				</a>
			</div>
		</div>

		<!-- Fragen -->
		<div class="card">
			<div class="flex items-center justify-between mb-5">
				<h2 class="text-lg font-bold" style="color:var(--text-primary);">Fragen</h2>
				<span class="questions-count">{quiz.questions.length}</span>
			</div>

			<div class="flex flex-col gap-2">
				{#each quiz.questions as question, i}
					<div class="question-item">

						<!-- Frage-Header -->
						<button
							type="button"
							class="question-header"
							onclick={() => open_question = open_question === i ? null : i}
						>
							<span class="question-number">{i + 1}</span>

							<span class="question-text">
								{@html question.question}
							</span>

							<div class="question-meta">
								<span class="meta-badge">
									<svg class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									{question.time}s
								</span>
								<span class="meta-badge">
									{type_labels[String(question.type)] ?? question.type}
								</span>
							</div>

							<svg
								class="question-chevron"
								style="transform:rotate({open_question === i ? 180 : 0}deg)"
								fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
							</svg>
						</button>

						<!-- Antworten -->
						{#if open_question === i}
							<div class="question-body" transition:fade={{ duration: 120 }}>

								{#if question.image}
									<div class="flex justify-center mb-4">
										<MediaComponent
											src={question.image}
											muted={true}
											css_classes="max-h-48 rounded-xl object-contain"
										/>
									</div>
								{/if}

								{#if question.type === QuizQuestionType.ABCD || question.type === QuizQuestionType.CHECK || question.type === undefined}
									<div class="grid grid-cols-2 gap-2">
										{#each question.answers as a, idx}
											<div
												class="answer-tile"
												style="background-color:{a.color ?? default_colors[idx % 4]}; color:{get_foreground_color(a.color ?? default_colors[idx % 4])};"
											>
												<span>{a.answer}</span>
												{#if a.right && question.type !== QuizQuestionType.VOTING}
													<span class="answer-correct">✓</span>
												{/if}
											</div>
										{/each}
									</div>

								{:else if question.type === QuizQuestionType.RANGE}
									<div class="range-info">
										<p>Richtig: <strong>{question.answers.min_correct} – {question.answers.max_correct}</strong></p>
										<p style="color:var(--text-secondary);">Bereich: {question.answers.min} – {question.answers.max}</p>
									</div>

								{:else if question.type === QuizQuestionType.ORDER}
									<ul class="flex flex-col gap-2">
										{#each question.answers as a, idx}
											<li class="order-item">
												<span class="order-number">{idx + 1}</span>
												<span>{a.answer}</span>
											</li>
										{/each}
									</ul>

								{:else if question.type === QuizQuestionType.VOTING || question.type === QuizQuestionType.TEXT}
									<div class="grid grid-cols-2 gap-2">
										{#each question.answers as a, idx}
											<div class="answer-tile-neutral">{a.answer}</div>
										{/each}
									</div>

								{:else if question.type === QuizQuestionType.SLIDE}
									{#await import('$lib/play/admin/slide.svelte')}
										<Spinner my_20={false} />
									{:then c}
										<div class="max-h-64 overflow-hidden rounded-xl">
											<c.default question={quiz.questions[i]} />
										</div>
									{/await}
								{/if}

							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

{#if start_game !== null}
	<StartGamePopup bind:quiz_id={start_game} />
{/if}
<DownloadQuiz bind:quiz_id={download_id} />

<style>
	.view-page {
		min-height: 100vh;
		background-color: var(--bg);
		padding: 2rem 1rem;
	}
	.view-inner {
		max-width: 48rem;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.view-header {
		text-align: center;
	}
	.view-title {
		font-size: 1.875rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 0.5rem;
	}
	.view-desc {
		color: var(--text-secondary);
		margin-bottom: 0.5rem;
	}
	.view-author {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin-top: 0.5rem;
	}
	.view-author-link {
		color: var(--primary);
		text-decoration: underline;
	}
	.view-author-link:hover { color: var(--primary-hover); }
	.view-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		justify-content: center;
		margin-top: 1.25rem;
	}
	.view-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1.25rem;
		border-radius: 0.75rem;
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.15s;
		cursor: pointer;
		border: none;
		text-decoration: none;
	}
	.view-btn-primary {
		background-color: var(--primary);
		color: #F8FAFC;
	}
	.view-btn-primary:hover { background-color: var(--primary-hover); }
	.view-btn-secondary {
		background-color: color-mix(in srgb, var(--text-primary) 6%, transparent);
		color: var(--text-primary);
		border: 1px solid var(--border);
	}
	.view-btn-secondary:hover {
		background-color: color-mix(in srgb, var(--text-primary) 12%, transparent);
	}
	.questions-count {
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.25rem 0.75rem;
		border-radius: 9999px;
		background-color: color-mix(in srgb, var(--primary) 15%, transparent);
		color: var(--primary);
	}
	.question-item {
		border-radius: 0.75rem;
		border: 1px solid var(--border);
		overflow: hidden;
		transition: box-shadow 0.15s;
	}
	.question-item:hover { box-shadow: 0 2px 8px var(--shadow); }
	.question-header {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		text-align: left;
		background: none;
		border: none;
		color: var(--text-primary);
		cursor: pointer;
		transition: background-color 0.15s;
	}
	.question-header:hover {
		background-color: color-mix(in srgb, var(--primary) 6%, transparent);
	}
	.question-number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 9999px;
		background-color: color-mix(in srgb, var(--primary) 15%, transparent);
		color: var(--primary);
		font-size: 0.75rem;
		font-weight: 700;
		flex-shrink: 0;
	}
	.question-text {
		flex: 1;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-primary);
	}
	.question-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-shrink: 0;
	}
	.meta-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.7rem;
		font-weight: 600;
		padding: 0.2rem 0.5rem;
		border-radius: 9999px;
		border: 1px solid var(--border);
		color: var(--text-secondary);
		background-color: color-mix(in srgb, var(--text-primary) 4%, transparent);
	}
	.question-chevron {
		width: 1rem;
		height: 1rem;
		color: var(--text-secondary);
		transition: transform 0.2s;
		flex-shrink: 0;
	}
	.question-body {
		padding: 1rem;
		border-top: 1px solid var(--border);
		background-color: color-mix(in srgb, var(--text-primary) 2%, transparent);
	}
	.answer-tile {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 0.75rem;
		padding: 0.75rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
	}
	.answer-correct {
		font-size: 0.75rem;
		opacity: 0.9;
	}
	.answer-tile-neutral {
		border-radius: 0.75rem;
		padding: 0.75rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		text-align: center;
		background-color: color-mix(in srgb, var(--text-primary) 8%, transparent);
		color: var(--text-primary);
		border: 1px solid var(--border);
	}
	.range-info {
		text-align: center;
		padding: 1rem;
		border-radius: 0.75rem;
		background-color: color-mix(in srgb, var(--primary) 8%, transparent);
		color: var(--text-primary);
		font-size: 0.875rem;
	}
	.order-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		border-radius: 0.75rem;
		padding: 0.625rem 0.875rem;
		background-color: color-mix(in srgb, var(--text-primary) 5%, transparent);
		border: 1px solid var(--border);
		font-size: 0.875rem;
		color: var(--text-primary);
	}
	.order-number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 9999px;
		background-color: color-mix(in srgb, var(--primary) 15%, transparent);
		color: var(--primary);
		font-size: 0.7rem;
		font-weight: 700;
		flex-shrink: 0;
	}
</style>