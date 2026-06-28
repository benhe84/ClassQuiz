<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)

SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	interface Props {
		headerText: any;
		expanded?: boolean;
		children?: import('svelte').Snippet;
	}

	let { headerText, expanded = $bindable(false), children }: Props = $props();
</script>

<div class="overflow-hidden rounded-xl border border-base">

	<button
		type="button"
		aria-expanded={expanded}
		onclick={() => (expanded = !expanded)}
		class="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-surface-2"
	>

		<span class="flex-1 font-medium text-base">
			{@html headerText}
		</span>

		<svg
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			viewBox="0 0 24 24"
			class="h-4 w-4 flex-shrink-0 text-muted transition-transform"
			class:rotate-180={expanded}
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M19 9l-7 7-7-7"
			/>
		</svg>

	</button>

	{#if expanded}
		<div class="border-t border-base bg-surface">
			{@render children?.()}
		</div>
	{/if}

</div>