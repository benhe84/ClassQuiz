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

		<div class="rounded-xl p-6" style="background-color:#1E293B;">
			<label class="block text-xs font-semibold uppercase tracking-widest mb-3" style="color:#CBD5E1;">
				{$t('words.title')}
			</label>
			{#await import('$lib/inline-editor.svelte')}
				<Spinner my_20={false} />
			{:then c}
				<div style="background-color:white; color:black; border-radius:0.5rem; padding:0.25rem;"><c.default bind:text={data.title} /></div>
			{/await}
		</div>

		<div class="rounded-xl p-6" style="background-color:#1E293B;">
			<label class="block text-xs font-semibold uppercase tracking-widest mb-3" style="color:#CBD5E1;">
				Beschreibung
			</label>
			<textarea
				placeholder="Beschreibung eingeben..."
				bind:value={data.description}
				class="w-full p-3 rounded-lg resize-none outline-none text-sm"
				style="background-color:#0F172A; color:#F8FAFC; border:1px solid #6366F133; min-height:80px;"
			></textarea>
		</div>

		<div class="rounded-xl p-6" style="background-color:#1E293B;">
			<label class="block text-xs font-semibold uppercase tracking-widest mb-3" style="color:#CBD5E1;">
				Cover-Bild
			</label>
			{#if data.cover_image}
				<div class="flex flex-col items-center gap-3">
					<img src="/api/v1/storage/download/{data.cover_image}" alt="Cover" class="max-h-48 rounded-lg object-contain"/>
					<button type="button" onclick={() => { data.cover_image = null; }} class="text-sm px-4 py-1.5 rounded-lg" style="background-color:#EF4444; color:#F8FAFC;">Bild entfernen</button>
				</div>
			{:else}
				{#await import('$lib/editor/uploader.svelte')}
					<Spinner my_20={false} />
				{:then c}
					<c.default bind:modalOpen={uppyOpen} {data} video_upload={false} />
				{/await}
			{/if}
		</div>

		<div class="rounded-xl p-6" style="background-color:#1E293B;">
			<label class="block text-xs font-semibold uppercase tracking-widest mb-4" style="color:#CBD5E1;">
				Sichtbarkeit
			</label>
			<div class="flex gap-3">
				<button type="button" onclick={() => { data.public = true; }} class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition" style="background-color:{data.public ? '#6366F1' : '#0F172A'}; color:{data.public ? '#F8FAFC' : '#CBD5E1'}; border:1px solid {data.public ? '#6366F1' : '#6366F133'};">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
					{$t('words.public')}
				</button>
				<button type="button" onclick={() => { data.public = false; }} class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition" style="background-color:{!data.public ? '#6366F1' : '#0F172A'}; color:{!data.public ? '#F8FAFC' : '#CBD5E1'}; border:1px solid {!data.public ? '#6366F1' : '#6366F133'};">
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
					{$t('words.private')}
				</button>
			</div>
		</div>

		<div class="rounded-xl p-6" style="background-color:#1E293B;">
			<label class="block text-xs font-semibold uppercase tracking-widest mb-4" style="color:#CBD5E1;">
				Hintergrundfarbe
			</label>
			<div class="flex items-center gap-4">
				<label class="flex items-center gap-2 cursor-pointer">
					<div class="relative w-12 h-6 rounded-full transition" style="background-color:{custom_bg_color ? '#6366F1' : '#0F172A'}; border:1px solid #6366F133;">
						<input type="checkbox" bind:checked={custom_bg_color} class="sr-only"/>
						<div class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform" style="left:{custom_bg_color ? '1.375rem' : '0.125rem'};"></div>
					</div>
					<span class="text-sm" style="color:#CBD5E1;">Eigene Farbe</span>
				</label>
				{#if custom_bg_color}
					<input type="color" bind:value={data.background_color} class="w-10 h-10 rounded-lg cursor-pointer border-0 p-0.5" style="background-color:#0F172A;"/>
					<span class="text-sm font-mono" style="color:#CBD5E1;">{data.background_color}</span>
				{/if}
			</div>
		</div>

		<div class="rounded-xl p-6" style="background-color:#1E293B;">
			<label class="block text-xs font-semibold uppercase tracking-widest mb-4" style="color:#CBD5E1;">
				{$t('editor.bg_image')}
			</label>
			{#if data.background_image}
				<button type="button" onclick={() => { data.background_image = undefined; }} class="text-sm px-4 py-1.5 rounded-lg" style="background-color:#EF4444; color:#F8FAFC;">Hintergrundbild entfernen</button>
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
