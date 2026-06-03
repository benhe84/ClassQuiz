<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->
<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/navbar.svelte';
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

{#if navbarVisible.visible}
	<Navbar />
	<div class="pt-14"></div>
{/if}
<div style="flex:1; display:flex; flex-direction:column;">
	{@render children?.()}
</div>
<CommandPalette />

<style>
	:global(html), :global(body) {
		min-height: 100vh;
		background-color: #0F172A;
		color: #F8FAFC;
	}
	:global(body) {
		display: flex;
		flex-direction: column;
	}
</style>
