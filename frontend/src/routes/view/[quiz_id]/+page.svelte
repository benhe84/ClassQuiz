<script lang="ts">
	import DownloadQuiz from '$lib/components/DownloadQuiz.svelte';
	import { getLocalization } from '$lib/i18n';
	import { createTippy } from 'svelte-tippy';
	import ImportedOrNot from '$lib/view_quiz/imported_or_not.svelte';
	import { QuizQuestionType } from '$lib/quiz_types.js';
	import StartGamePopup from '$lib/dashboard/start_game.svelte';
	import { onMount } from 'svelte';
	import Spinner from '$lib/Spinner.svelte';
	import GrayButton from '$lib/components/buttons/gray.svelte';
	import MediaComponent from '$lib/editor/MediaComponent.svelte';
	import RatingComponent from '$lib/view_quiz/RatingComponent.svelte';
	import { page } from '$app/state';
	import ModComponent from './ModComponent.svelte';
	import { get_foreground_color } from '$lib/helpers.ts';

	const default_colors = ['#D6EDC9', '#B07156', '#7F7057', '#4E6E58'];

	const tippy = createTippy({
		arrow: true,
		animation: 'perspective-subtle',
		placement: 'right'
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
	});

	const { t } = getLocalization();

	let { data } = $props();
	let { quiz, logged_in } = $state(data);
</script>

<svelte:head>
	<title>ClassQuiz - View {quiz.title}</title>
</svelte:head>

<!-- HEADER GRID -->
<div class="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
	<!-- LEFT: QUIZ INFO (BREIT) -->
	<div class="lg:col-span-2 rounded-2xl border border-base bg-surface p-6 shadow-sm">
		<h1 class="text-3xl font-bold text-center">
			{@html quiz.title}
		</h1>

		<p class="text-center text-muted mt-2">
			{@html quiz.description}
		</p>

		<p class="text-center mt-2 text-sm text-muted">
			{$t('view_quiz_page.made_by')}
			<a class="underline" href="/user/{quiz.user_id.id}">
				@{quiz.user_id.username}
			</a>
		</p>

		{#if quiz.cover_image}
			<div class="flex justify-center mt-4">
				<img
					class="max-h-40 rounded-xl border border-base"
					src="/api/v1/storage/download/{quiz.cover_image}"
				/>
			</div>
		{/if}

		<div class="flex justify-center gap-2 mt-4">
			<ImportedOrNot imported={quiz.imported_from_kahoot} />
			<RatingComponent bind:quiz />
			{#if mod_view}
				<ModComponent quiz_id={quiz.id} />
			{/if}
		</div>
	</div>

	<!-- RIGHT: ACTIONS -->
	<div class="rounded-2xl border border-base bg-surface p-6 shadow-sm flex flex-col gap-3">
		<!-- START -->
		{#if logged_in}
			<GrayButton onclick={() => (start_game = quiz.id)}>
				<span class="flex items-center gap-2">
					▶ {$t('tooltips.start_game')}
				</span>
			</GrayButton>
		{:else}
			<div use:tippy={{ content: $t('tooltips.start_game_login') }}>
				<GrayButton disabled={true}>▶ Start</GrayButton>
			</div>
		{/if}

		<!-- PRACTICE -->
		<GrayButton href="/practice?quiz_id={quiz.id}">
			📘 {$t('words.practice')}
		</GrayButton>

		<!-- DOWNLOAD -->
		{#if logged_in}
			<GrayButton onclick={() => (download_id = quiz.id)}>
				⬇ {$t('tooltips.download')}
			</GrayButton>
		{:else}
			<div use:tippy={{ content: $t('tooltips.download_login') }}>
				<GrayButton disabled={true}>⬇ Download</GrayButton>
			</div>
		{/if}

		<!-- KAHOOT -->
		{#if quiz.imported_from_kahoot && quiz.kahoot_id}
			<GrayButton href="https://create.kahoot.it/details/{quiz.kahoot_id}">
				🔗 Kahoot
			</GrayButton>
		{/if}

		<!-- REPORT -->
		<a
			class="text-center text-sm underline mt-2"
			href="mailto:report@mawoka.eu?subject=Report quiz {quiz.id}"
		>
			⚠ {$t('tooltips.report')}
		</a>
	</div>
</div>
<!-- QUESTIONS (KAHOOT STYLE LIST) -->
<section class="max-w-6xl mx-auto p-4">
	<h2 class="text-lg font-bold mb-3">Fragen</h2>

	<div class="flex flex-col gap-3">
		{#each quiz.questions as question, i}
			<div class="overflow-hidden rounded-xl border border-base">
				<button
					class="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-surface-2 transition"
					onclick={() => (open_question = open_question === i ? null : i)}
				>
					<!-- INDEX -->
					<span class="flex items-center gap-2 font-medium flex-1">
						<span class="text-muted">{i + 1}.</span>

						<!-- FRAGETYP ICON -->
						<svg
							class="w-4 h-4 text-muted flex-shrink-0"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
						>
							<path
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								d={question.type === QuizQuestionType.ABCD
									? 'M9 12l2 2 4-4'
									: question.type === QuizQuestionType.RANGE
										? 'M3 12h18'
										: question.type === QuizQuestionType.ORDER
											? 'M4 6h16M4 12h16'
											: 'M3 3h18v18H3z'}
							/>
						</svg>

						<span class="truncate">
							{@html question.question}
						</span>
					</span>

					<!-- TIME -->
					<span class="flex items-center gap-1 text-sm text-secondary">
						<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
							<path
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						{question.time}s
					</span>

					<!-- ANSWER COUNT -->
					<span class="text-sm font-semibold text-success">
						{question.answers?.length ?? 0}
					</span>

					<!-- CHEVRON -->
					<svg
						class="w-4 h-4 text-muted transition-transform"
						style="transform: rotate({open_question === i ? 180 : 0}deg)"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
					>
						<path
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M19 9l-7 7-7-7"
						/>
					</svg>
				</button>

				{#if open_question === i}
					<div class="bg-surface-2 p-4">
						{#if question.image}
							<div class="flex justify-center mb-3">
								<MediaComponent src={question.image} muted={true} />
							</div>
						{/if}

						<!-- CONTENT (kept minimal) -->
						{#if question.type === QuizQuestionType.ABCD || question.type === QuizQuestionType.CHECK}
							<div class="grid grid-cols-2 gap-3">
								{#each question.answers as a, idx}
									<div
										class="rounded-lg p-3 text-center"
										style="background-color: {a.color ??
											default_colors[idx % 4]}"
									>
										{a.answer}
										{#if a.right}
											<div class="text-xs">✓</div>
										{/if}
									</div>
								{/each}
							</div>
						{:else}
							<div class="text-center text-sm text-muted">Details verfügbar</div>
						{/if}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>

{#if start_game !== null}
	<StartGamePopup bind:quiz_id={start_game} />
{/if}

<DownloadQuiz bind:quiz_id={download_id} />
