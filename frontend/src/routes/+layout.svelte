<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->
<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/navbar.svelte';
	import Footer from '$lib/footer.svelte';
	import { pathname } from '$lib/stores';
	import { navbarVisible } from '$lib/stores.svelte';
	import { initLocalizationContext } from '$lib/i18n';
	import { browser } from '$app/environment';
	import CommandPalette from '$lib/components/commandpalette.svelte';

	interface Props { children?: import('svelte').Snippet; }
	let { children }: Props = $props();

	const plausible_data_url = import.meta.env.VITE_PLAUSIBLE_DATA_URL;

	if (browser) {
		pathname.set(window.location.pathname);
		document.documentElement.classList.add('dark');
	}

	let start_language = 'de';
	if (browser) { start_language = localStorage.getItem('language') ?? 'de'; }
	initLocalizationContext(start_language);
</script>

<div class="layout">
	{#if navbarVisible.visible}
		<Navbar />
		<div style="height:3.5rem;"></div>
	{/if}

	<main>
		{@render children?.()}
	</main>

	<Footer />
</div>

<CommandPalette />

<style>
	:global(body) {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

:global(body > div) {
    flex: 1;
    display: flex;
    flex-direction: column;
}
</style>
