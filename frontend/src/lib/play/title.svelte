<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	interface Props {
		title: string;
		description: string;
		cover_image: string | undefined;
	}

	let { title, description, cover_image }: Props = $props();
</script>

<div class="flex min-h-screen w-full flex-col items-center justify-center bg-base px-4 py-12">

	<!-- Pulsierende Warteanzeige -->
	<div class="mb-8 flex items-center gap-2">
		<span class="relative flex h-3 w-3">
			<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
			<span class="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
		</span>

		<p class="text-sm font-medium text-primary">
			Warte auf den Start…
		</p>
	</div>

	<!-- Hauptkarte -->
	<div class="w-full max-w-2xl rounded-3xl border border-base bg-surface p-10 text-center shadow-xl">

		{#if cover_image}
			<div class="mb-8 flex justify-center">
				<div class="h-40 w-auto overflow-hidden rounded-2xl border border-base shadow-lg">
					<img
						class="h-full w-auto object-contain"
						src="/api/v1/storage/download/{cover_image}"
						alt="Quiz-Titelbild"
					/>
				</div>
			</div>
		{/if}

		<h1 class="mb-4 text-4xl font-bold leading-tight text-base lg:text-5xl">
			{@html title}
		</h1>

		{#if description}
			<p class="text-lg leading-relaxed text-muted">
				{@html description}
			</p>
		{/if}
	</div>

	<!-- Animierte Dots -->
	<div class="mt-10 flex gap-2">
		{#each [0, 1, 2] as i}
			<div
				class="h-2 w-2 rounded-full bg-primary"
				style="animation: bounce 1.2s ease-in-out {i * 0.2}s infinite"
			></div>
		{/each}
	</div>
</div>

<style>
	@keyframes bounce {
		0%, 100% { transform: translateY(0); opacity: 0.4; }
		50% { transform: translateY(-8px); opacity: 1; }
	}
</style>