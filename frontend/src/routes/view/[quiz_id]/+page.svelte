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

<!-- HEADER CARD -->
<div class="max-w-5xl mx-auto p-4">

	<div class="rounded-2xl border border-base bg-surface p-6 shadow-lg mb-6">

		<h1 class="text-3xl text-center font-bold">{@html quiz.title}</h1>

		<p class="text-center text-muted mt-2">{@html quiz.description}</p>

		<p class="text-center mt-2 text-sm">
			{$t('view_quiz_page.made_by')}
			<a href="/user/{quiz.user_id.id}" class="underline">
				@{quiz.user_id.username}
			</a>
		</p>

		<div class="flex justify-center gap-2 mt-4">
			<RatingComponent bind:quiz />
			{#if mod_view}
				<ModComponent quiz_id={quiz.id} />
			{/if}
		</div>

		<div class="flex justify-center gap-2 mt-4 flex-wrap">

			{#if logged_in}
				<GrayButton onclick={() => (start_game = quiz.id)}>
					▶ Start
				</GrayButton>

				<GrayButton onclick={() => (download_id = quiz.id)}>
					⬇ Download
				</GrayButton>
			{:else}
				<div use:tippy={{ content: 'Login erforderlich' }}>
					<GrayButton disabled={true}>▶ Start</GrayButton>
				</div>
			{/if}

			<GrayButton href="/practice?quiz_id={quiz.id}">
				Practice
			</GrayButton>

			{#if quiz.imported_from_kahoot && quiz.kahoot_id}
				<GrayButton href="https://create.kahoot.it/details/{quiz.kahoot_id}">
					Kahoot
				</GrayButton>
			{/if}

		</div>

		<div class="text-center mt-3 text-xs underline">
			<a href="mailto:report@mawoka.eu?subject=Report quiz {quiz.id}">
				Report
			</a>
		</div>

	</div>

	<!-- QUESTIONS (KAHOOT STYLE LIST) -->
	<section class="card">
		<h2 class="mb-4 text-lg font-bold text-base">Fragen</h2>

		<div class="flex flex-col gap-3">

			{#each quiz.questions as question, i}

				<div class="overflow-hidden rounded-xl border border-base">

					<button
						type="button"
						class="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-surface-2"
						onclick={() => open_question = open_question === i ? null : i}
					>

						<span class="flex-1 font-medium">
							<span class="text-muted mr-2">{i + 1}.</span>
							{@html question.question}
						</span>

						<span class="text-sm text-secondary">
							{question.time}s
						</span>

						<span class="text-sm font-semibold text-success">
							{question.type}
						</span>

						<svg
							class="h-4 w-4 text-muted transition-transform"
							style="transform: rotate({open_question === i ? 180 : 0}deg)"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
						</svg>

					</button>

					{#if open_question === i}
						<div class="bg-surface-2 p-4">

							{#if question.image}
								<div class="flex justify-center mb-3">
									<MediaComponent src={question.image} muted={true} />
								</div>
							{/if}

							<!-- ABCD -->
							{#if question.type === QuizQuestionType.ABCD || question.type === QuizQuestionType.CHECK}
								<div class="grid grid-cols-2 gap-3">
									{#each question.answers as a, idx}
										<div
											class="rounded-lg p-3 text-center"
											style="
												background-color: {a.color ?? default_colors[idx % 4]};
												color: {get_foreground_color(a.color ?? default_colors[idx % 4])};
											"
										>
											{a.answer}
											{#if a.right}
												<div class="text-xs mt-1">✓</div>
											{/if}
										</div>
									{/each}
								</div>
							{:else if question.type === QuizQuestionType.RANGE}
								<p class="text-center">
									{question.answers.min_correct} – {question.answers.max_correct}
								</p>
							{:else if question.type === QuizQuestionType.ORDER}
								<ul class="flex flex-col gap-2">
									{#each question.answers as a}
										<li class="rounded-lg bg-surface p-2 text-center">
											{a.answer}
										</li>
									{/each}
								</ul>
							{:else}
								<div class="text-center text-sm text-muted">
									Preview nicht relevant für diesen Typ
								</div>
							{/if}

						</div>
					{/if}

				</div>

			{/each}

		</div>
	</section>

</div>

{#if start_game !== null}
	<StartGamePopup bind:quiz_id={start_game} />
{/if}

<DownloadQuiz bind:quiz_id={download_id} />