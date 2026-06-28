<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import { navbarVisible } from '$lib/stores.svelte.ts';
	import { getLocalization } from '$lib/i18n';
	import WebPOpenGraph from '$lib/assets/landing/opengraph-home.webp';
	import JpgOpenGraph from '$lib/assets/landing/opengraph-home.jpg';
	import { fade } from 'svelte/transition';

	import FindScreenshot from '$lib/assets/landing_new/find.webp';
	import ImportScreenshot from '$lib/assets/landing_new/import.webp';
	import EditScreenshot from '$lib/assets/landing_new/edit.webp';
	import SelectScreenshot from '$lib/assets/landing_new/select.webp';
	import ResultScreenshot from '$lib/assets/landing_new/result.webp';
	import WinnersScreenshot from '$lib/assets/landing_new/winners.webp';
	import { onMount } from 'svelte';

	const { t } = getLocalization();
	navbarVisible.visible = true;

	let newsletterModalOpen: boolean = $state();
	onMount(() => {
		const ls = localStorage.getItem('newsletter');
		newsletterModalOpen = ls === null;
	});

	enum SelectedCreateThing { Create, Find, Import }
	enum SelectedPlayThing { Select, Results, Winners }

	let selected_section = $state(-1);
	let selected_create_thing = $state(SelectedCreateThing.Create);
	let selected_play_thing = $state(SelectedPlayThing.Select);
	let selected_classquiz_reason = $state(0);

	const classquiz_reasons = [
		{ headline: $t('index_page.no_player_limit'), content: $t('index_page.no_player_limit_content') },
		{ headline: $t('index_page.no_tracking'), content: $t('index_page.no_tracking_content') },
		{ headline: $t('index_page.self_hostable'), content: $t('index_page.self_hostable_content') },
		{ headline: $t('index_page.german_server'), content: $t('index_page.german_server_content') },
		{ headline: $t('index_page.user_friendly'), content: $t('index_page.user_friendly_content') },
		{ headline: $t('index_page.completely_free'), content: $t('index_page.completely_free_content') },
		{ headline: $t('index_page.quiz_results_downloadable'), content: $t('index_page.quiz_results_downloadable_content') },
		{ headline: $t('index_page.multilingual'), content: $t('index_page.multilingual_content') },
		{ headline: $t('index_page.dark_mode'), content: $t('index_page.dark_mode_content') },
		{ headline: $t('index_page.download_quizzes'), content: $t('index_page.download_quizzes_content') },
		{ headline: $t('index_page.community_driven'), content: $t('index_page.community_driven_content') }
	];

	const create_options = [
		{
			key: SelectedCreateThing.Create,
			icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
			label: $t('words.create'),
			desc: $t('index_page.create_a_quiz_from_scratch')
		},
		{
			key: SelectedCreateThing.Find,
			icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
			label: $t('words.find'),
			desc: $t('index_page.find_or_explore')
		}
	];

	const play_options = [
		{
			key: SelectedPlayThing.Select,
			icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122',
			label: $t('index_page.select_answer'),
			desc: $t('index_page.choose_answer_wisely')
		},
		{
			key: SelectedPlayThing.Results,
			icon: 'M4 6h16M4 10h16M4 14h16M4 18h16',
			label: $t('index_page.view_results'),
			desc: $t('index_page.check_if_chosen_wisely')
		},
		{
			key: SelectedPlayThing.Winners,
			icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
			label: $t('index_page.list_winners'),
			desc: $t('index_page.get_ranking_and_winners')
		}
	];
</script>

<svelte:head>
	<title>ClassQuiz - {$t('index_page.meta.title')}</title>
	<meta name="description" content={$t('index_page.meta.description')} />
	<meta property="og:url" content="https://classquiz.de/" />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="ClassQuiz - {$t('index_page.meta.title')}" />
	<meta property="og:description" content="ClassQuiz is a quiz-application like KAHOOT!, but open-source." />
	<meta property="og:image" content={JpgOpenGraph} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta property="twitter:domain" content="classquiz.de" />
	<meta property="twitter:url" content="https://classquiz.de/" />
	<meta name="twitter:title" content="ClassQuiz - {$t('index_page.meta.title')}" />
	<meta name="twitter:description" content="ClassQuiz is a quiz-application like KAHOOT!, but open-source." />
	<meta name="twitter:image" content={WebPOpenGraph} />
</svelte:head>

<div class="min-h-screen">

	<!-- Hero -->
	<section class="flex flex-col items-center justify-center px-4 py-24 text-center">
		<div class="hero-badge">
			<span class="hero-badge-dot"></span>
			Open Source · Kostenlos · Ohne Tracking
		</div>
		<h1 class="mt-6 text-6xl font-bold sm:text-8xl marck-script"style="color:var(--text-primary);">ClassQuiz</h1>
		<p class="mt-4 max-w-xl text-lg" style="color:var(--text-secondary);">{$t('index_page.slogan')}</p>
		<div class="mt-8 flex gap-4">
			<a href="/account/login" class="btn btn-primary px-6 py-3 text-base rounded-xl">
				Jetzt starten
			</a>
			<a href="/explore" class="btn-outline px-6 py-3 text-base rounded-xl">
				Quiz erkunden
			</a>
		</div>
	</section>

	<!-- Accordion -->
	<section class="px-4 pb-24 lg:px-12">
		<div class="mx-auto max-w-3xl flex flex-col gap-3">

			<!-- 1. Ein Quiz holen -->
			<div class="card" style="padding:0; overflow:hidden;">
				<button
					type="button"
					onclick={() => { selected_section = selected_section === 0 ? -1 : 0; }}
					class="accordion-header"
					aria-expanded={selected_section === 0}
				>
					<div class="flex items-center gap-3">
						<span class="accordion-number">1</span>
						<span class="font-semibold text-lg">{$t('index_page.get_a_quiz')}</span>
					</div>
					<svg class="accordion-chevron" class:accordion-chevron-open={selected_section === 0} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
					</svg>
				</button>
				{#if selected_section === 0}
					<div class="accordion-body" transition:fade|global={{ duration: 150 }}>
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<div class="accordion-screenshot">
								{#if selected_create_thing === SelectedCreateThing.Create}
									<img class="feature-img" src={EditScreenshot} in:fade|global alt="Quiz erstellen" />
								{:else if selected_create_thing === SelectedCreateThing.Find}
									<img class="feature-img" src={FindScreenshot} in:fade|global alt="Quiz finden" />
								{:else}
									<img class="feature-img" src={ImportScreenshot} in:fade|global alt="Quiz importieren" />
								{/if}
							</div>
							<div class="flex flex-col gap-3">
								{#each create_options as opt}
									<button
										type="button"
										onclick={() => { selected_create_thing = opt.key; }}
										class="feature-option"
										class:feature-option-active={selected_create_thing === opt.key}
									>
										<div class="feature-option-icon">
											<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" d={opt.icon} />
											</svg>
										</div>
										<div>
											<p class="font-semibold">{opt.label}</p>
											<p class="mt-0.5 text-sm" style="color:var(--text-secondary);">{opt.desc}</p>
										</div>
									</button>
								{/each}
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- 2. Das Quiz spielen -->
			<div class="card" style="padding:0; overflow:hidden;">
				<button
					type="button"
					onclick={() => { selected_section = selected_section === 1 ? -1 : 1; }}
					class="accordion-header"
					aria-expanded={selected_section === 1}
				>
					<div class="flex items-center gap-3">
						<span class="accordion-number">2</span>
						<span class="font-semibold text-lg">{$t('index_page.play_quiz')}</span>
					</div>
					<svg class="accordion-chevron" class:accordion-chevron-open={selected_section === 1} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
					</svg>
				</button>
				{#if selected_section === 1}
					<div class="accordion-body" transition:fade|global={{ duration: 150 }}>
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<div class="accordion-screenshot">
								{#if selected_play_thing === SelectedPlayThing.Select}
									<img class="feature-img" src={SelectScreenshot} in:fade|global alt="Antwort auswählen" />
								{:else if selected_play_thing === SelectedPlayThing.Results}
									<img class="feature-img" src={ResultScreenshot} in:fade|global alt="Ergebnisse" />
								{:else}
									<img class="feature-img" src={WinnersScreenshot} in:fade|global alt="Gewinner" />
								{/if}
							</div>
							<div class="flex flex-col gap-3">
								{#each play_options as opt}
									<button
										type="button"
										onclick={() => { selected_play_thing = opt.key; }}
										class="feature-option"
										class:feature-option-active={selected_play_thing === opt.key}
									>
										<div class="feature-option-icon">
											<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
												<path stroke-linecap="round" stroke-linejoin="round" d={opt.icon} />
											</svg>
										</div>
										<div>
											<p class="font-semibold">{opt.label}</p>
											<p class="mt-0.5 text-sm" style="color:var(--text-secondary);">{opt.desc}</p>
										</div>
									</button>
								{/each}
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- 3. Warum ClassQuiz -->
			<div class="card" style="padding:0; overflow:hidden;">
				<button
					type="button"
					onclick={() => { selected_section = selected_section === 2 ? -1 : 2; }}
					class="accordion-header"
					aria-expanded={selected_section === 2}
				>
					<div class="flex items-center gap-3">
						<span class="accordion-number">3</span>
						<span class="font-semibold text-lg">{$t('index_page.why_classquiz')}</span>
					</div>
					<svg class="accordion-chevron" class:accordion-chevron-open={selected_section === 2} fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
					</svg>
				</button>
				{#if selected_section === 2}
					<div class="accordion-body" transition:fade|global={{ duration: 150 }}>
						<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
							<div class="flex items-start p-4 rounded-xl" style="background-color:var(--bg);">
								<p class="text-base leading-relaxed" style="color:var(--text-secondary);">
									{classquiz_reasons[selected_classquiz_reason].content}
								</p>
							</div>
							<div class="flex flex-col gap-2 why-classquiz overflow-y-auto max-h-64">
								{#each classquiz_reasons as reason, index}
									<button
										type="button"
										onclick={() => { selected_classquiz_reason = index; }}
										class="feature-option"
										class:feature-option-active={selected_classquiz_reason === index}
									>
										<p class="font-medium text-sm">{reason.headline}</p>
									</button>
								{/each}
							</div>
						</div>
					</div>
				{/if}
			</div>

		</div>
	</section>
</div>

<style>
	.hero-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		border-radius: 9999px;
		border: 1px solid color-mix(in srgb, var(--primary) 30%, transparent);
		background-color: color-mix(in srgb, var(--primary) 10%, transparent);
		padding: 0.375rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--primary);
	}
	.hero-badge-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 9999px;
		background-color: var(--primary);
		animation: pulse 2s infinite;
	}
	.btn-outline {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		border: 1px solid var(--border);
		background-color: transparent;
		color: var(--text-primary);
		transition: all 0.15s;
		cursor: pointer;
		text-decoration: none;
	}
	.btn-outline:hover {
		background-color: color-mix(in srgb, var(--text-primary) 8%, transparent);
	}
	.accordion-header {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.25rem 1.5rem;
		text-align: left;
		background: none;
		border: none;
		color: var(--text-primary);
		cursor: pointer;
		transition: background-color 0.15s;
	}
	.accordion-header:hover {
		background-color: color-mix(in srgb, var(--primary) 6%, transparent);
	}
	.accordion-number {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 9999px;
		background-color: color-mix(in srgb, var(--primary) 15%, transparent);
		color: var(--primary);
		font-weight: 700;
		font-size: 0.875rem;
		flex-shrink: 0;
	}
	.accordion-chevron {
		width: 1.25rem;
		height: 1.25rem;
		color: var(--text-secondary);
		transition: transform 0.2s;
		flex-shrink: 0;
	}
	.accordion-chevron-open {
		transform: rotate(180deg);
		color: var(--primary);
	}
	.accordion-body {
		padding: 1.25rem 1.5rem 1.5rem;
		border-top: 1px solid var(--border);
	}
	.accordion-screenshot {
		border-radius: 0.75rem;
		overflow: hidden;
		background-color: var(--bg);
		padding: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.feature-img {
		border-radius: 0.5rem;
		width: 100%;
		box-shadow: 0 4px 16px var(--shadow);
	}
	.feature-option {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		border-radius: 0.75rem;
		padding: 0.875rem 1rem;
		text-align: left;
		transition: all 0.15s;
		border: 1px solid transparent;
		background-color: color-mix(in srgb, var(--text-primary) 3%, transparent);
		color: var(--text-primary);
		cursor: pointer;
		width: 100%;
	}
	.feature-option:hover {
		background-color: color-mix(in srgb, var(--primary) 8%, transparent);
	}
	.feature-option-active {
		background-color: color-mix(in srgb, var(--primary) 12%, transparent) !important;
		border-color: color-mix(in srgb, var(--primary) 35%, transparent) !important;
	}
	.feature-option-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 0.5rem;
		background-color: color-mix(in srgb, var(--primary) 15%, transparent);
		color: var(--primary);
		flex-shrink: 0;
	}
	.why-classquiz::-webkit-scrollbar { width: 0.4rem; }
	.why-classquiz::-webkit-scrollbar-track { background: transparent; }
	.why-classquiz::-webkit-scrollbar-thumb {
		background-color: var(--border);
		border-radius: 9999px;
	}
	.why-classquiz::-webkit-scrollbar-thumb:hover {
		background-color: var(--text-secondary);
	}
</style>