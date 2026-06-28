<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import { navbarVisible } from '$lib/stores.svelte.ts';
	import { getLocalization } from '$lib/i18n';
	import WebPOpenGraph from '$lib/assets/landing/opengraph-home.webp';
	import JpgOpenGraph from '$lib/assets/landing/opengraph-home.jpg';
	import Newsletter from '$lib/landing/newsletter.svelte';
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

	let selected_create_thing = $state(SelectedCreateThing.Create);
	let selected_play_thing = $state(SelectedPlayThing.Select);

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
	let selected_classquiz_reason = $state(0);

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

<div class="min-h-screen bg-[#0F172A] text-[#F8FAFC]">

	<!-- Hero -->
	<section class="flex flex-col items-center justify-center px-4 py-24 text-center">
		<div class="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-4 py-1.5 text-sm font-medium text-[#6366F1]">
			<span class="h-2 w-2 rounded-full bg-[#6366F1] animate-pulse"></span>
			Open Source · Kostenlos · Ohne Tracking
		</div>
		<h1 class="mt-6 text-6xl font-bold sm:text-8xl marck-script text-[#F8FAFC]">ClassQuiz</h1>
		<p class="mt-4 max-w-xl text-lg text-[#94A3B8]">{$t('index_page.slogan')}</p>
		<div class="mt-8 flex gap-4">
			<a href="/account/login" class="rounded-xl bg-[#6366F1] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-[#5558E3]">
				Jetzt starten
			</a>
			<a href="/explore" class="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-[#F8FAFC] transition hover:bg-white/10">
				Quiz erkunden
			</a>
		</div>
	</section>

	<!-- Wie funktioniert ClassQuiz: Erstellen -->
	<section class="px-4 pb-20 lg:px-12">
		<div class="mb-6 text-center">
			<h2 class="text-3xl font-bold text-[#F8FAFC]">{$t('index_page.how_does_classquiz_work')}</h2>
			<p class="mt-2 text-sm text-[#475569]">{$t('index_page.get_a_quiz')}</p>
		</div>

		<div class="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-[#1E293B] shadow-2xl overflow-hidden">
			<div class="grid grid-cols-1 lg:grid-cols-2">
				<!-- Screenshot -->
				<div class="p-4 flex items-center justify-center bg-[#0F172A]">
					{#if selected_create_thing === SelectedCreateThing.Create}
						<img class="rounded-xl shadow-xl w-full" src={EditScreenshot} in:fade|global alt="Quiz erstellen" />
					{:else if selected_create_thing === SelectedCreateThing.Find}
						<img class="rounded-xl shadow-xl w-full" src={FindScreenshot} in:fade|global alt="Quiz finden" />
					{:else}
						<img class="rounded-xl shadow-xl w-full" src={ImportScreenshot} in:fade|global alt="Quiz importieren" />
					{/if}
				</div>

				<!-- Optionen -->
				<div class="flex flex-col gap-3 p-6 border-t border-white/10 lg:border-t-0 lg:border-l">
					{#each create_options as opt}
						<button
							type="button"
							onclick={() => { selected_create_thing = opt.key; }}
							class="flex items-start gap-4 rounded-xl p-4 text-left transition"
							style="background-color:{selected_create_thing === opt.key ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)'}; border:1px solid {selected_create_thing === opt.key ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}"
						>
							<div class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#6366F1]/20">
								<svg class="h-5 w-5 text-[#6366F1]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" d={opt.icon} />
								</svg>
							</div>
							<div>
								<p class="font-semibold text-[#F8FAFC]">{opt.label}</p>
								<p class="mt-0.5 text-sm text-[#94A3B8]">{opt.desc}</p>
							</div>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Spielen -->
	<section class="px-4 pb-20 lg:px-12">
		<div class="mb-6 text-center">
			<h2 class="text-3xl font-bold text-[#F8FAFC]">{$t('index_page.play_quiz')}</h2>
		</div>

		<div class="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-[#1E293B] shadow-2xl overflow-hidden">
			<div class="grid grid-cols-1 lg:grid-cols-2">
				<div class="p-4 flex items-center justify-center bg-[#0F172A]">
					{#if selected_play_thing === SelectedPlayThing.Select}
						<img class="rounded-xl shadow-xl w-full" src={SelectScreenshot} in:fade|global alt="Antwort auswählen" />
					{:else if selected_play_thing === SelectedPlayThing.Results}
						<img class="rounded-xl shadow-xl w-full" src={ResultScreenshot} in:fade|global alt="Ergebnisse" />
					{:else}
						<img class="rounded-xl shadow-xl w-full" src={WinnersScreenshot} in:fade|global alt="Gewinner" />
					{/if}
				</div>

				<div class="flex flex-col gap-3 p-6 border-t border-white/10 lg:border-t-0 lg:border-l">
					{#each play_options as opt}
						<button
							type="button"
							onclick={() => { selected_play_thing = opt.key; }}
							class="flex items-start gap-4 rounded-xl p-4 text-left transition"
							style="background-color:{selected_play_thing === opt.key ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)'}; border:1px solid {selected_play_thing === opt.key ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.08)'}"
						>
							<div class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#6366F1]/20">
								<svg class="h-5 w-5 text-[#6366F1]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" d={opt.icon} />
								</svg>
							</div>
							<div>
								<p class="font-semibold text-[#F8FAFC]">{opt.label}</p>
								<p class="mt-0.5 text-sm text-[#94A3B8]">{opt.desc}</p>
							</div>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Warum ClassQuiz -->
	<section class="px-4 pb-24 lg:px-12">
		<div class="mb-6 text-center">
			<h2 class="text-3xl font-bold text-[#F8FAFC]">{$t('index_page.why_classquiz')}</h2>
		</div>

		<div class="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-[#1E293B] shadow-2xl overflow-hidden">
			<div class="grid grid-cols-1 lg:grid-cols-2">
				<!-- Inhalt -->
				<div class="flex items-center justify-center p-10">
					<p class="text-lg leading-relaxed text-[#94A3B8]">
						{classquiz_reasons[selected_classquiz_reason].content}
					</p>
				</div>

				<!-- Gründe -->
				<div class="flex flex-col gap-2 overflow-y-auto p-4 border-t border-white/10 lg:border-t-0 lg:border-l max-h-96 lg:max-h-none why-classquiz">
					{#each classquiz_reasons as reason, index}
						<button
							type="button"
							onclick={() => { selected_classquiz_reason = index; }}
							class="rounded-xl px-4 py-3 text-left text-sm font-medium transition"
							style="background-color:{selected_classquiz_reason === index ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)'}; color:{selected_classquiz_reason === index ? '#F8FAFC' : '#94A3B8'}; border:1px solid {selected_classquiz_reason === index ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.05)'}"
						>
							{reason.headline}
						</button>
					{/each}
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	.why-classquiz::-webkit-scrollbar { width: 0.4rem; }
	.why-classquiz::-webkit-scrollbar-track { background: transparent; }
	.why-classquiz::-webkit-scrollbar-thumb { background-color: #334155; border-radius: 9999px; }
	.why-classquiz::-webkit-scrollbar-thumb:hover { background-color: #475569; }
</style>