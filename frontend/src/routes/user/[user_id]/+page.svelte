<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->
<script lang="ts">
	import type { PageData } from './$types';
	import { getLocalization } from '$lib/i18n';
	import { onMount } from 'svelte';
	import { signedIn } from '$lib/stores';
	import StartGamePopup from '$lib/dashboard/start_game.svelte';

	const { t } = getLocalization();
	let start_game = $state(null);

	onMount(() => {
		document.body.addEventListener('keydown', (key) => {
			if (key.code === 'Escape') start_game = null;
		});
	});

	interface Props { data: PageData; }
	let { data }: Props = $props();
</script>

<svelte:head>
	<title>ClassQuiz - {data.user.username ? `@${data.user.username}` : 'Nicht gefunden'}</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-4 py-8">
	{#if data.user.username === undefined}
		<div class="card flex flex-col items-center justify-center py-20 gap-4">
			<svg class="w-16 h-16" style="color:var(--text-secondary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
			</svg>
			<p class="text-xl font-semibold">{$t('public_user_page.user_not_found')}</p>
		</div>
	{:else}
		<div class="flex flex-col md:flex-row gap-8">

			<!-- Profil-Sidebar -->
			<div class="flex flex-col items-center gap-3 md:w-48 shrink-0">
				<img src="/api/v1/users/avatar/{data.user.id}" alt="Avatar" class="w-24 h-24 rounded-2xl object-cover shadow-lg"/>
				<h1 class="text-xl font-bold">@{data.user.username}</h1>
				<p class="text-xs text-center" style="color:var(--text-secondary);">
					{$t('public_user_page.joined_on', { date: new Date(data.user.created_at).toLocaleDateString() })}
				</p>
				<div class="w-full rounded-lg px-3 py-2 text-center text-sm" style="background-color:var(--surface); border:1px solid var(--border);">
					<p class="font-semibold">{data.quizzes.length}</p>
					<p class="text-xs" style="color:var(--text-secondary);">Quiz</p>
				</div>
			</div>

			<!-- Quiz-Liste -->
			<div class="flex-1 flex flex-col gap-4">
				{#if data.quizzes.length === 0}
					<div class="card flex flex-col items-center justify-center py-16 gap-3">
						<svg class="w-12 h-12" style="color:var(--text-secondary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
						</svg>
						<p class="text-sm" style="color:var(--text-secondary);">{$t('public_user_page.no_original_quizzes')}</p>
					</div>
				{:else}
					{#each data.quizzes as quiz}
						<div class="card flex flex-col md:flex-row gap-4 hover:shadow-lg transition">
							{#if quiz.cover_image}
								<div class="w-full md:w-32 h-24 rounded-xl overflow-hidden shrink-0">
									<img src="/api/v1/storage/download/{quiz.cover_image}" alt="Cover" class="w-full h-full object-cover" loading="lazy"/>
								</div>
							{/if}
							<div class="flex-1 flex flex-col justify-between gap-3">
								<div>
									<h3 class="font-semibold text-base">{@html quiz.title}</h3>
									{#if quiz.description}
										<p class="text-sm mt-1" style="color:var(--text-secondary);">{@html quiz.description}</p>
									{/if}
								</div>
								<div class="flex gap-2 flex-wrap">
									<a href="/view/{quiz.id}" class="btn text-xs" style="background-color:var(--bg); color:var(--text-primary); border:1px solid var(--border);">
										{$t('words.view')}
									</a>
									{#if $signedIn}
										<button onclick={() => { start_game = quiz.id; }} class="btn btn-primary text-xs">
											{$t('words.start')}
										</button>
										<a href="/api/v1/eximport/{quiz.id}" aria-label="Herunterladen" class="btn text-xs" style="background-color:var(--bg); color:var(--text-primary); border:1px solid var(--border);">
											<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
										</a>
									{:else}
										<button disabled class="btn text-xs opacity-40" style="background-color:var(--bg); color:var(--text-primary); border:1px solid var(--border);" title="Anmeldung erforderlich">
											{$t('words.start')}
										</button>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	{/if}
</div>

{#if start_game !== null}
	<StartGamePopup bind:quiz_id={start_game} />
{/if}
