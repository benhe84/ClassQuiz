<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->
<script lang="ts">
	import type { EditorData } from '$lib/quiz_types';
	import { getLocalization } from '$lib/i18n';
	import Spinner from '$lib/Spinner.svelte';
	import { createTippy } from 'svelte-tippy';
	const { t } = getLocalization();

	let uppyOpen = $state(false);
	let bg_uppy_open = $state(false);

	interface Props {
		edit_id: string;
		data: EditorData;
	}
	let { edit_id = $bindable(), data = $bindable() }: Props = $props();
	let custom_bg_color = $state(Boolean(data.background_color));
	const tippy = createTippy({ arrow: true, animation: 'perspective-subtle' });

	$effect(() => {
		data.background_color = custom_bg_color ? data.background_color : undefined;
	});
</script>

<div class="w-full h-full px-4 md:px-12 py-8 overflow-y-auto">
	<div class="max-w-2xl mx-auto flex flex-col gap-6">

		<!-- Titel -->
		<div class="card">
			<label class="label">{$t('words.title')}</label>
			{#await import('$lib/inline-editor.svelte')}
				<Spinner my_20={false} />
			{:then c}
				<div class="editor-input-wrap">
					<c.default bind:text={data.title} />
				</div>
			{/await}
		</div>

		<!-- Beschreibung -->
		<div class="card">
			<label class="label" for="desc-input">Beschreibung</label>
			<textarea
				id="desc-input"
				placeholder="Beschreibung eingeben..."
				bind:value={data.description}
				class="input w-full resize-none p-3 text-sm"
				style="min-height:80px;"
			></textarea>
		</div>

		<!-- Cover-Bild -->
		<div class="card">
			<label class="label">Cover-Bild</label>
			{#if data.cover_image}
				<div class="flex flex-col items-center gap-3">
					<img src="/api/v1/storage/download/{data.cover_image}" alt="Cover" class="max-h-48 rounded-xl object-contain" />
					<button type="button" onclick={() => { data.cover_image = null; }} class="btn btn-danger">
						Bild entfernen
					</button>
				</div>
			{:else}
				{#await import('$lib/editor/uploader.svelte')}
					<Spinner my_20={false} />
				{:then c}
					<c.default bind:modalOpen={uppyOpen} {data} video_upload={false} />
				{/await}
			{/if}
		</div>

		<!-- Sichtbarkeit -->
		<div class="card">
			<label class="label">Sichtbarkeit</label>
			<div class="flex gap-3">
				<button
					type="button"
					onclick={() => { data.public = true; }}
					class="visibility-btn"
					class:visibility-btn-active={data.public}
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					{$t('words.public')}
				</button>
				<button
					type="button"
					onclick={() => { data.public = false; }}
					class="visibility-btn"
					class:visibility-btn-active={!data.public}
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
					</svg>
					{$t('words.private')}
				</button>
			</div>
		</div>

		<!-- Hintergrundfarbe -->
		<div class="card">
			<label class="label">Hintergrundfarbe</label>
			<div class="flex items-center gap-4">
				<label class="toggle-wrap">
					<div class="toggle" class:toggle-on={custom_bg_color}>
						<input type="checkbox" bind:checked={custom_bg_color} class="sr-only" />
						<div class="toggle-knob" class:toggle-knob-on={custom_bg_color}></div>
					</div>
					<span class="text-sm" style="color:var(--text-secondary);">Eigene Farbe</span>
				</label>
				{#if custom_bg_color}
					<input type="color" bind:value={data.background_color} class="color-picker" />
					<span class="text-sm font-mono" style="color:var(--text-secondary);">{data.background_color}</span>
				{/if}
			</div>
		</div>

		<!-- Hintergrundbild -->
		<div class="card">
			<label class="label">{$t('editor.bg_image')}</label>
			{#if data.background_image}
				<button
					type="button"
					onclick={() => { data.background_image = undefined; }}
					class="btn btn-danger"
				>
					Hintergrundbild entfernen
				</button>
			{:else}
				{#await import('$lib/editor/uploader.svelte')}
					<Spinner my_20={false} />
				{:then c}
					<c.default bind:modalOpen={bg_uppy_open} {data} selected_question={-1} video_upload={false} />
				{/await}
			{/if}
		</div>
	</div>
</div>

<style>
	.editor-input-wrap {
		border-radius: 0.75rem;
		border: 1px solid var(--border);
		background-color: var(--bg);
		color: var(--text-primary);
		padding: 0.5rem 0.75rem;
	}
	.visibility-btn {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.625rem;
		border-radius: 0.75rem;
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.15s;
		border: 1px solid var(--border);
		background-color: var(--bg);
		color: var(--text-secondary);
		cursor: pointer;
	}
	.visibility-btn-active {
		background-color: var(--primary);
		border-color: var(--primary);
		color: #F8FAFC;
	}
	.toggle-wrap {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
	}
	.toggle {
		position: relative;
		width: 3rem;
		height: 1.5rem;
		border-radius: 9999px;
		background-color: var(--border);
		border: 1px solid var(--border);
		transition: background-color 0.2s;
	}
	.toggle-on {
		background-color: var(--primary);
		border-color: var(--primary);
	}
	.toggle-knob {
		position: absolute;
		top: 0.125rem;
		left: 0.125rem;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 9999px;
		background-color: white;
		box-shadow: 0 1px 3px rgba(0,0,0,0.3);
		transition: transform 0.2s;
	}
	.toggle-knob-on {
		transform: translateX(1.5rem);
	}
	.color-picker {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 0.5rem;
		border: 1px solid var(--border);
		background-color: var(--bg);
		padding: 0.125rem;
		cursor: pointer;
	}
</style>