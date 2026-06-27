<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->
<script lang="ts">
	import DownloadQuiz from '$lib/components/DownloadQuiz.svelte';
	import type { QuizData } from '$lib/quiz_types';
	import { getLocalization } from '$lib/i18n';
	import { signedIn } from '$lib/stores';
	import { navbarVisible } from '$lib/stores.svelte';
	import CommandpaletteNotice from '$lib/components/popover/commandpalettenotice.svelte';
	import Fuse from 'fuse.js';
	import type { PageData } from './$types';
	import StartGamePopup from '$lib/dashboard/start_game.svelte';
	import Analytics from './Analytics.svelte';
	import MediaComponent from '$lib/editor/MediaComponent.svelte';
	import { onMount } from 'svelte';

	interface Props {
		data: PageData;
	}
	let { data }: Props = $props();
	let search_term = $state('');
	let start_game = $state(null);
	let download_id: string | null = $state(null);
	signedIn.set(true);
	navbarVisible.visible = true;
	const { t } = getLocalization();
	let items_to_show = $state([]);
	let all_items: Array<any> = $state();
	let fuse;

	const getData = async () => {
		const items: any[] = [];
		for (const q of data.quizzes) items.push({ ...q, type: 'quiz' });
		for (const q of data.quiztivities) items.push({ ...q, type: 'quiztivity' });
		const f = new Fuse(items, { keys: ['title', 'description'], findAllMatches: true });
		return { items, fuse: f };
	};

	const search = () => {
		if (search_term === '') {
			items_to_show = all_items;
			return;
		}
		items_to_show = fuse.search(search_term).map((r) => r.item);
	};

	onMount(async () => {
		const { items, fuse: f } = await getData();
		all_items = items;
		items_to_show = items;
		fuse = f;
	});

	const deleteQuiz = async (to_delete: string, type: 'quiz' | 'quiztivity') => {
		if (!confirm('Do you really want to delete this quiz?')) return;
		if (type === 'quiz') {
			await fetch(`/api/v1/quiz/delete/${to_delete}`, { method: 'DELETE' });
		} else {
			await fetch(`/api/v1/quiztivity/${to_delete}`, { method: 'DELETE' });
		}
		window.location.reload();
	};

	let analytics_quiz_selected: undefined | QuizData = $state(undefined);
</script>

<svelte:head>
	<title>ClassQuiz - Dashboard</title>
</svelte:head>

<Analytics bind:quiz={analytics_quiz_selected} />
<CommandpaletteNotice />

<div class="flex flex-col flex-1 max-w-7xl w-full mx-auto px-4 py-8">
	<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
		<a
			href="/create"
			class="flex flex-col items-center gap-2 p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow transition"
		>
			<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 4v16m8-8H4"
				/></svg
			>
			<span class="text-sm font-semibold">{$t('dashboard.create_quiz')}</span>
		</a>
		<a
			href="/import"
			class="flex flex-col items-center gap-2 p-4 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl shadow transition"
		>
			<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
				/></svg
			>
			<span class="text-sm font-semibold">{$t('words.import')}</span>
		</a>
		<a
			href="/results"
			class="flex flex-col items-center gap-2 p-4 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl shadow transition"
		>
			<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
				/></svg
			>
			<span class="text-sm font-semibold">{$t('words.results')}</span>
		</a>
		<a
			href="/account/settings"
			class="flex flex-col items-center gap-2 p-4 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl shadow transition"
		>
			<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
				/><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
				/></svg
			>
			<span class="text-sm font-semibold">{$t('words.settings')}</span>
		</a>
	</div>

	{#if !all_items}
		<div class="flex justify-center py-20">
			<svg class="h-10 w-10 animate-spin text-indigo-600" viewBox="3 3 18 18">
				<path
					class="fill-indigo-200"
					d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
				/>
				<path
					class="fill-indigo-600"
					d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
				/>
			</svg>
		</div>
	{:else if all_items.length === 0}
		<div class="flex flex-col items-center justify-center py-20 text-gray-400">
			<svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.5"
					d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
				/></svg
			>
			<p class="text-lg font-medium">{$t('overview_page.no_quizzes')}</p>
			<a
				href="/create"
				class="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
				>Erstes Quiz erstellen</a
			>
		</div>
	{:else}
		<div class="mb-6 flex gap-2">
			<div class="relative flex-1 max-w-md">
				<svg
					class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4
                    text-gray-400 dark:text-gray-500"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>

				<input
					bind:value={search_term}
					oninput={search}
					placeholder={$t('dashboard.search_for_own_quizzes')}
					class="w-full pl-9 pr-4 py-2 rounded-xl border shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
				/>
			</div>
			{#if search_term}
				<button
					onclick={() => {
						search_term = '';
						items_to_show = all_items;
					}}
					class="px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 shadow-sm transition"
				>
					<svg
						class="w-4 h-4 text-gray-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/></svg
					>
				</button>
			{/if}
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
			{#each items_to_show as quiz}
				<div
					class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col hover:shadow-md transition"
				>
					<div
						class="h-28 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800 relative"
					>
						{#if quiz.cover_image}
							<MediaComponent
								src={quiz.cover_image}
								css_classes="w-full h-full object-cover absolute inset-0"
							/>
						{/if}
						<span
							class="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-2 py-0.5 rounded-full"
						>
							{quiz.type === 'quiz' ? 'Quiz' : 'Quiztivity'}
						</span>
					</div>
					<div class="p-4 flex-1 flex flex-col">
						<h3 class="font-semibold text-gray-900 dark:text-white text-base truncate">
							{@html quiz.title}
						</h3>
						{#if quiz.description}
							<p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
								{@html quiz.description}
							</p>
						{/if}
						<div class="flex gap-2 mt-4 flex-wrap">
							{#if quiz.type === 'quiz'}
								<button
									onclick={() => {
										start_game = quiz.id;
									}}
									class="flex-1 flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition"
								>
									<svg
										class="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
										/><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/></svg
									>
									Starten
								</button>
							{:else}
								<a
									href="/quiztivity/play?id={quiz.id}"
									class="flex-1 flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition"
								>
									<svg
										class="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
										/><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/></svg
									>
									Starten
								</a>
							{/if}
							<a
								href={quiz.type === 'quiz'
									? `/edit?quiz_id=${quiz.id}`
									: `/quiztivity/edit?id=${quiz.id}`}
								class="flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg transition"
								title="Bearbeiten"
							>
								<svg
									class="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
									/></svg
								>
							</a>
							<button
								onclick={() => (analytics_quiz_selected = quiz)}
								class="flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg transition"
								title="Statistiken"
							>
								<svg
									class="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
									/></svg
								>
							</button>
							{#if quiz.type === 'quiz'}
								<button
									onclick={() => (download_id = quiz.id)}
									class="flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-lg transition"
									title="Herunterladen"
								>
									<svg
										class="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
										/></svg
									>
								</button>
							{/if}
							<button
								onclick={() => deleteQuiz(quiz.id, quiz.type)}
								class="flex items-center justify-center bg-red-50 hover:bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg transition"
								title="Löschen"
							>
								<svg
									class="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/></svg
								>
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

{#if download_id}
	<DownloadQuiz bind:quiz_id={download_id} />
{/if}
{#if start_game !== null}
	<StartGamePopup bind:quiz_id={start_game} />
{/if}
