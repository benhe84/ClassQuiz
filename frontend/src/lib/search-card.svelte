<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->
<script lang="ts">
	import { getLocalization } from '$lib/i18n';
	const { t } = getLocalization();
	import ImportedOrNot from '$lib/view_quiz/imported_or_not.svelte';
	let { quiz } = $props();
</script>

<a href="/view/{quiz.id}" class="block group">
	<div class="card flex flex-col gap-3 h-full hover:shadow-lg transition group-hover:border-indigo-500/50" style="border:1px solid var(--border);">
		<div class="flex items-start justify-between gap-2">
			<h2 class="font-semibold text-base truncate flex-1">{@html quiz.title}</h2>
			<span class="shrink-0"><ImportedOrNot imported={quiz.imported_from_kahoot} /></span>
		</div>
		{#if quiz.description}
			<p class="text-sm line-clamp-2" style="color:var(--text-secondary);">{@html quiz.description}</p>
		{/if}
		<div class="mt-auto pt-2 flex items-center gap-2" style="border-top:1px solid var(--border);">
			<svg class="w-3.5 h-3.5 shrink-0" style="color:var(--text-secondary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
			</svg>
			<span class="text-xs" style="color:var(--text-secondary);">
				{quiz.imported_from_kahoot ? $t('explore_page.imported_by') : $t('explore_page.made_by')}
				<span class="font-medium" style="color:var(--text-primary);">{@html quiz.user}</span>
			</span>
		</div>
	</div>
</a>
