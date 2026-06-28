<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->


<script lang="ts">
	import '@fontsource/marck-script/index.css';
	import { getLocalization } from '$lib/i18n';
	import { signedIn, pathname } from '$lib/stores';
	import { browser } from '$app/environment';
	import { beforeNavigate } from '$app/navigation';
	import { slide } from 'svelte/transition';

	const { t } = getLocalization();
	let menuIsClosed = $state(true);
	const toggleMenu = () => { menuIsClosed = !menuIsClosed; };
	beforeNavigate(() => { menuIsClosed = true; });

	let darkMode = $state(true);
	if (browser) { darkMode = localStorage.theme !== 'light'; }
	const switchDarkMode = () => {
		darkMode = !darkMode;
		localStorage.setItem('theme', darkMode ? 'dark' : 'light');
		document.documentElement.classList.toggle('dark', darkMode);
	};

	let searchQuery = $state('');
	const doSearch = (e: Event) => {
		e.preventDefault();
		if (searchQuery.trim().length >= 1) {
			window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
		}
	};
</script>

<nav class="w-screen px-4 lg:px-8 py-3 fixed top-0 z-30 shadow-lg" style="background-color:#1E293B; border-bottom: 1px solid #6366F133;">
	<!-- Desktop -->
	<div class="hidden lg:flex items-center justify-between gap-4">
		<div class="flex items-center gap-1 shrink-0">
			<a href="/" class="text-2xl font-bold marck-script tracking-tight mr-4" style="color:#6366F1;">ClassQuiz</a>
			<a href="/play"    class="nav-link">{$t('words.play')}</a>
			<a href="/explore" class="nav-link">{$t('words.explore')}</a>
			{#if $signedIn}
				<a href="/dashboard" class="nav-link">{$t('words.dashboard')}</a>
			{/if}
		</div>

		<!-- Suchfeld Desktop -->
		<form onsubmit={doSearch} class="flex-1 max-w-sm">
			<div class="relative">
				<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color:#6366F1;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
				</svg>
				<input
					bind:value={searchQuery}
					type="search"
					placeholder="{$t('words.search')}..."
					class="w-full pl-9 pr-4 py-1.5 rounded-lg text-sm outline-none"
					style="background-color:#0F172A; color:#F8FAFC; border:1px solid #6366F133;"
					onfocus={(e) => e.currentTarget.style.borderColor = '#6366F1'}
					onblur={(e) => e.currentTarget.style.borderColor = '#6366F133'}
				/>
			</div>
		</form>

		<div class="flex items-center gap-2 shrink-0">
			{#if $signedIn}
				<a href="/api/v1/users/logout" class="nav-link">{$t('words.logout')}</a>
			{:else}
				{#if !import.meta.env.VITE_REGISTRATION_DISABLED}
					<a href="/account/register" class="nav-link">{$t('words.register')}</a>
				{/if}
				<a href="/account/login?returnTo={$pathname}" class="btn-primary">{$t('words.login')}</a>
			{/if}
			<button onclick={switchDarkMode} aria-label="Toggle darkmode" class="nav-link p-1.5">
				{#if darkMode}
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
				{:else}
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile -->
	<div class="lg:hidden">
		<div class="flex items-center justify-between">
			<a href="/" class="text-xl font-bold marck-script" style="color:#6366F1;">ClassQuiz</a>
			<div class="flex items-center gap-2">
				<button onclick={switchDarkMode} aria-label="Toggle darkmode" class="nav-link p-1.5">
					{#if darkMode}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
					{:else}
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
					{/if}
				</button>
				<button onclick={toggleMenu} aria-label="Toggle menu" class="nav-link p-1.5">
					{#if menuIsClosed}
						<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
					{:else}
						<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
					{/if}
				</button>
			</div>
		</div>
		{#if !menuIsClosed}
			<div class="flex flex-col gap-2 mt-3 pb-1" transition:slide|global={{ duration: 300 }}>
				<form onsubmit={doSearch}>
					<div class="relative">
						<svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color:#6366F1;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
						</svg>
						<input
							bind:value={searchQuery}
							type="search"
							placeholder="{$t('words.search')}..."
							class="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
							style="background-color:#0F172A; color:#F8FAFC; border:1px solid #6366F133;"
						/>
					</div>
				</form>
				<a href="/play"    class="nav-link">{$t('words.play')}</a>
				<a href="/explore" class="nav-link">{$t('words.explore')}</a>
				{#if $signedIn}
					<a href="/dashboard" class="nav-link">{$t('words.dashboard')}</a>
					<hr style="border-color:#6366F133;" class="my-1"/>
					<a href="/api/v1/users/logout" class="nav-link">{$t('words.logout')}</a>
				{:else}
					<hr style="border-color:#6366F133;" class="my-1"/>
					{#if !import.meta.env.VITE_REGISTRATION_DISABLED}
						<a href="/account/register" class="nav-link">{$t('words.register')}</a>
					{/if}
					<a href="/account/login?returnTo={$pathname}" class="btn-primary text-center">{$t('words.login')}</a>
				{/if}
			</div>
		{/if}
	</div>
</nav>

<style>
	.nav-link {
		color: #CBD5E1;
		padding: 0.375rem 0.75rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		transition: all 0.15s;
		display: inline-flex;
		align-items: center;
	}
	.nav-link:hover {
		color: #F8FAFC;
		background-color: rgba(99, 102, 241, 0.15);
	}
	.btn-primary {
		background-color: #6366F1;
		color: #F8FAFC;
		padding: 0.375rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.15s;
		display: inline-flex;
		align-items: center;
	}
	.btn-primary:hover {
		background-color: #818CF8;
	}
</style>
