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

<div>
	<h3 class="bg-transparent m-0">
		<button
			aria-expanded={expanded}
			onclick={() => (expanded = !expanded)}
			class="bg-white dark:bg-gray-700 flex justify-between w-full border-none m-0 p-2 rounded-t-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition"
			class:rounded-b-lg={!expanded}
		>
			<span>{@html headerText}</span>
		</button>
	</h3>

	<div class:hidden={!expanded}>
		{@render children?.()}
	</div>
</div>

<style>
	button[aria-expanded='true'] {
		border-bottom: 1px solid var(--gray-light, #eee);
	}
</style>