<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->
<script lang="ts">
	import { captcha_enabled } from '$lib/config';
	import { fade } from 'svelte/transition';
	import Spinner from '$lib/Spinner.svelte';
	import { onMount } from 'svelte';
	import { createTippy } from 'svelte-tippy';
	import { getLocalization } from '$lib/i18n';
	const { t } = getLocalization();
	let { quiz_id = $bindable() } = $props();
	let captcha_selected = $state(false);
	let selected_game_mode = $state('kahoot');
	let loading = $state(false);
	let custom_field = $state('');
	let cqcs_enabled = $state(false);
	let randomized_answers = $state(false);
	const tippy = createTippy({ arrow: true, animation: 'perspective-subtle', placement: 'top-start', allowHTML: true });

	onMount(() => {
		const ls_data = localStorage.getItem('custom_field');
		custom_field = ls_data ? ls_data : '';
		document.body.addEventListener('keydown', (key) => {
			if (key.code === 'Escape') quiz_id = null;
		});
	});

	const start_game = async (id: string) => {
		loading = true;
		localStorage.setItem('custom_field', custom_field);
		const cqcs_parsed = cqcs_enabled ? 'True' : 'False';
		const rand_parsed = randomized_answers ? 'True' : 'False';
		const captcha_param = captcha_enabled && captcha_selected ? 'True' : 'False';
		const res = await fetch(
			`/api/v1/quiz/start/${id}?captcha_enabled=${captcha_param}&game_mode=${selected_game_mode}&custom_field=${custom_field}&cqcs_enabled=${cqcs_parsed}&randomize_answers=${rand_parsed}`,
			{ method: 'POST' }
		);
		if (res.status !== 200) {
			alert('Spiel konnte nicht gestartet werden.');
			window.location.assign('/account/login?returnTo=/dashboard');
		} else {
			const data = await res.json();
			window.location.assign(`/admin?token=${data.game_id}&pin=${data.game_pin}&connect=1&cqc_code=${data.cqc_code}`);
		}
	};

	const on_parent_click = (e: Event) => {
		if (e.target === e.currentTarget) quiz_id = null;
	};
</script>

<div
	class="fixed top-0 left-0 flex items-center justify-center w-screen h-screen z-50"
	style="background-color: rgba(0,0,0,0.7);"
	transition:fade|global={{ duration: 150 }}
	onclick={on_parent_click}
>
	<div class="rounded-2xl shadow-2xl p-6 w-full max-w-xl flex flex-col gap-5" style="background-color:#1E293B; color:#F8FAFC;">

		<!-- Header -->
		<div class="flex items-center justify-between">
			<h2 class="text-xl font-bold" style="color:#6366F1;">{$t('start_game.start_game')}</h2>
			<button onclick={() => { quiz_id = null; }} class="rounded-lg p-1.5 transition hover:bg-white/10" style="color:#CBD5E1;">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
			</button>
		</div>

		<!-- Spielmodus -->
		<div>
			<p class="text-xs font-semibold uppercase tracking-widest mb-3" style="color:#CBD5E1;">Spielmodus</p>
			<div class="grid grid-cols-2 gap-3">
				<button
					type="button"
					onclick={() => { selected_game_mode = 'kahoot'; }}
					class="rounded-xl p-4 text-left transition border"
					style="background-color:{selected_game_mode === 'kahoot' ? '#6366F1' : '#0F172A'}; border-color:{selected_game_mode === 'kahoot' ? '#6366F1' : '#6366F133'}; color:#F8FAFC;"
				>
					<p class="font-semibold mb-1">{$t('words.normal')}</p>
					<p class="text-xs" style="color:{selected_game_mode === 'kahoot' ? '#E0E7FF' : '#CBD5E1'};">{$t('start_game.normal_mode_description')}</p>
				</button>
				<button
					type="button"
					onclick={() => { selected_game_mode = 'normal'; }}
					class="rounded-xl p-4 text-left transition border"
					style="background-color:{selected_game_mode === 'normal' ? '#6366F1' : '#0F172A'}; border-color:{selected_game_mode === 'normal' ? '#6366F1' : '#6366F133'}; color:#F8FAFC;"
				>
					<p class="font-semibold mb-1">{$t('start_game.old_school_mode')}</p>
					<p class="text-xs" style="color:{selected_game_mode === 'normal' ? '#E0E7FF' : '#CBD5E1'};">{$t('start_game.old_school_mode_description')}</p>
				</button>
			</div>
		</div>

		<!-- Benutzerdefiniertes Feld -->
		<div>
			<label class="text-xs font-semibold uppercase tracking-widest block mb-2" style="color:#CBD5E1;">
				{$t('result_page.custom_field')}
			</label>
			<input
				bind:value={custom_field}
				class="w-full rounded-lg p-2.5 outline-none text-sm"
				style="background-color:#0F172A; color:#F8FAFC; border:1px solid #6366F133;"
				placeholder="Telefonnummer oder E-Mail"
			/>
		</div>

		<!-- Optionen -->
		<div class="flex flex-col gap-3">
			<p class="text-xs font-semibold uppercase tracking-widest" style="color:#CBD5E1;">Optionen</p>

			<!-- Antworten zufällig -->
			<label class="flex items-center gap-3 cursor-pointer">
				<div class="relative w-11 h-6 rounded-full transition" style="background-color:{randomized_answers ? '#6366F1' : '#0F172A'}; border:1px solid #6366F133;">
					<input type="checkbox" bind:checked={randomized_answers} class="sr-only"/>
					<div class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all" style="left:{randomized_answers ? '1.25rem' : '0.125rem'};"></div>
				</div>
				<span class="text-sm" style="color:#CBD5E1;">Antworten zufällig anordnen</span>
			</label>

			<!-- ClassQuizControllers -->
			<label class="flex items-center gap-3 cursor-pointer">
				<div class="relative w-11 h-6 rounded-full transition" style="background-color:{cqcs_enabled ? '#6366F1' : '#0F172A'}; border:1px solid #6366F133;">
					<input type="checkbox" bind:checked={cqcs_enabled} class="sr-only"/>
					<div class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all" style="left:{cqcs_enabled ? '1.25rem' : '0.125rem'};"></div>
				</div>
				<span class="text-sm" style="color:#CBD5E1;">
					<a href="/controller" target="_blank" use:tippy={{ content: 'Kleine Hardware-Geräte zum Spielen von ClassQuiz.' }} class="underline decoration-dashed cursor-help" style="color:#6366F1;">ClassQuiz-Controller</a>
					{cqcs_enabled ? 'aktiviert' : 'deaktiviert'}
				</span>
			</label>

			<!-- Captcha -->
			{#if captcha_enabled}
				<label class="flex items-center gap-3 cursor-pointer">
					<div class="relative w-11 h-6 rounded-full transition" style="background-color:{captcha_selected ? '#6366F1' : '#0F172A'}; border:1px solid #6366F133;">
						<input type="checkbox" bind:checked={captcha_selected} class="sr-only"/>
						<div class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all" style="left:{captcha_selected ? '1.25rem' : '0.125rem'};"></div>
					</div>
					<span class="text-sm" style="color:#CBD5E1;">Captcha {captcha_selected ? 'aktiviert' : 'deaktiviert'}</span>
				</label>
				{#if captcha_selected}
					<p class="text-xs rounded-lg p-3" style="background-color:#0F172A; color:#CBD5E1;" in:fade|global>{$t('start_game.captcha_message')}</p>
				{/if}
			{/if}
		</div>

		<!-- Starten-Button -->
		<button
			onclick={() => { start_game(quiz_id); }}
			class="w-full py-3 rounded-xl font-bold text-lg transition mt-2"
			style="background-color:#22C55E; color:#F8FAFC;"
		>
			{#if loading}
				<Spinner my_20={false} />
			{:else}
				{$t('start_game.start_game')}
			{/if}
		</button>
	</div>
</div>
