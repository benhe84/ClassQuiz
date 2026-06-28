<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)

SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	interface Props {
		disabled?: boolean;
		flex?: boolean;
		href?: undefined | string;
		target?: undefined | string;
		type?: 'button' | 'submit' | 'reset';
		children?: import('svelte').Snippet;
		onclick?: (event: MouseEvent) => void;
	}

	let {
		disabled = false,
		flex = false,
		href = undefined,
		target = '_self',
		type = 'button',
		children,
		onclick
	}: Props = $props();
</script>

{#if href}
	<a
		{href}
		{target}
		{disabled}
		class="btn-secondary w-full px-4 py-2 leading-5 rounded-sm text-center flex justify-center"
		class:cursor-not-allowed={disabled}
		class:pointer-events-none={disabled}
		onclick={onclick}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		{disabled}
		{type}
		class="btn-secondary w-full px-4 py-2 leading-5 rounded-sm text-center flex justify-center"
		onclick={onclick}
	>
		{@render children?.()}
	</button>
{/if}
