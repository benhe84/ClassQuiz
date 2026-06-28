<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->
<script lang="ts">
	import { run } from 'svelte/legacy';
	import type { EditorData } from '$lib/quiz_types';
	import { QuizQuestionType } from '$lib/quiz_types';
	import RangeEditor from '$lib/editor/RangeSelectorEditorPart.svelte';
	import { reach } from 'yup';
	import { dataSchema } from '$lib/yupSchemas';
	import Spinner from '../Spinner.svelte';
	import { createTippy } from 'svelte-tippy';
	import { getLocalization } from '$lib/i18n';
	import MediaComponent from '$lib/editor/MediaComponent.svelte';
	import { fade } from 'svelte/transition';
	import BrownButton from '$lib/components/buttons/brown.svelte';

	const { t } = getLocalization();
	const tippy = createTippy({ arrow: true, animation: 'perspective-subtle', placement: 'top' });

	interface Props {
		data: EditorData;
		selected_question: number;
		edit_id: string;
	}
	let { data = $bindable(), selected_question = $bindable(), edit_id = $bindable() }: Props = $props();

	let advanced_options_open = $state(false);
	let uppyOpen = $state(false);
	let unique = $state({});

	const correctTimeInput = (_) => {
		let time = data.questions[selected_question].time;
		if (time === null || time === undefined) { data.questions[selected_question].time = ''; time = ''; }
		if (data.questions[selected_question].time > 3) {
			data.questions[selected_question].time = data.questions[selected_question].time.toString().slice(0, 3);
		}
	};
	const set_unique = () => { unique = {}; };
	run(() => { correctTimeInput(data.questions[selected_question].time); });
	run(() => { selected_question; set_unique(); });

	let image_url = $state('');
	const update_image_url = () => { image_url = data.questions[selected_question].image; };
	run(() => { update_image_url(); selected_question; data.questions; });

	const type_to_name = {
		RANGE: $t('words.range'),
		ABCD: $t('words.multiple_choice'),
		VOTING: $t('words.voting'),
		TEXT: $t('words.text'),
		ORDER: $t('words.order'),
		CHECK: $t('words.check_choice')
	};
</script>

<div class="w-full max-h-full pb-10 px-10 h-full">
	<div class="editor-card">

		<!-- Titelleiste -->
		<div class="editor-card-bar">
			<span class="dot dot-red"></span>
			<span class="dot dot-yellow"></span>
			<span class="dot dot-green"></span>
			<button
				class="ml-auto settings-btn"
				type="button"
				use:tippy={{ content: $t('editor.advanced_settings') }}
				onclick={() => (advanced_options_open = true)}
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
					<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
			</button>
		</div>

		{#if data.questions[selected_question].type === QuizQuestionType.SLIDE}
			{#await import('./slide.svelte')}
				<Spinner my_20={false} />
			{:then c}
				<c.default bind:data={data.questions[selected_question]} />
			{/await}
		{:else}
			{@const type = data.questions[selected_question].type}
			<div class="flex flex-col">

				<!-- Frage -->
				<div class="flex justify-center pt-8 w-full px-6">
					{#key unique}
						{#await import('$lib/inline-editor.svelte')}
							<Spinner my_20={false} />
						{:then c}
							<div
								class="editor-input-wrap w-full"
								class:border-warning={!reach(dataSchema, 'questions[].question').isValidSync(data.questions[selected_question].question)}
							>
								<c.default bind:text={data.questions[selected_question].question} />
							</div>
						{/await}
					{/key}
				</div>

				<!-- Bild -->
				{#if data.questions[selected_question].image}
					<div class="flex justify-center pt-8 w-full h-72">
						<div class="h-72 relative">
							<button
								class="rounded-full absolute -top-2 -right-2 opacity-70 hover:opacity-100 transition"
								type="button"
								onclick={() => { data.questions[selected_question].image = null; }}
							>
								<svg class="w-6 h-6 bg-red-500 rounded-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</button>
							<MediaComponent bind:src={image_url} />
						</div>
					</div>
				{:else}
					{#await import('$lib/editor/uploader.svelte')}
						<Spinner my_20={false} />
					{:then c}
						<c.default bind:modalOpen={uppyOpen} bind:edit_id bind:data bind:selected_question video_upload={true} />
					{/await}
				{/if}

				<!-- Zeit -->
				<div class="flex justify-center pt-8 w-full">
					<div class="time-input-wrap">
						<svg class="w-5 h-5" style="color:var(--primary);" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<input
							type="number"
							max="999"
							min="1"
							class="time-input"
							bind:value={data.questions[selected_question].time}
						/>
						<span style="color:var(--text-secondary);">s</span>
					</div>
				</div>

				<!-- Fragetyp-Badge -->
				<div class="flex justify-center py-4">
					<span class="type-badge">
						{type_to_name[String(data.questions[selected_question].type)]}
					</span>
				</div>

				<!-- Antwort-Editor -->
				<div class="flex justify-center w-full px-4 pb-6">
					{#if type === QuizQuestionType.ABCD || type === QuizQuestionType.CHECK}
						{#await import('$lib/editor/ABCDEditorPart.svelte')}
							<Spinner my_20={false} />
						{:then c}
							<c.default bind:data bind:selected_question check_choice={type === QuizQuestionType.CHECK} />
						{/await}
					{:else if type === QuizQuestionType.RANGE}
						<RangeEditor bind:selected_question bind:data />
					{:else if type === QuizQuestionType.VOTING}
						{#await import('$lib/editor/VotingEditorPart.svelte')}
							<Spinner my_20={false} />
						{:then c}
							<c.default bind:data bind:selected_question />
						{/await}
					{:else if type === QuizQuestionType.TEXT}
						{#await import('$lib/editor/TextEditorPart.svelte')}
							<Spinner my_20={false} />
						{:then c}
							<c.default bind:data bind:selected_question />
						{/await}
					{:else if type === QuizQuestionType.ORDER}
						{#await import('$lib/editor/OrderEditorPart.svelte')}
							<Spinner my_20={false} />
						{:then c}
							<c.default bind:data bind:selected_question />
						{/await}
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>

{#if advanced_options_open}
	<div class="fixed inset-0 z-50 flex bg-black/60" transition:fade|global={{ duration: 150 }}>
		<div class="m-auto w-80 rounded-2xl border p-6 flex flex-col gap-4" style="background-color:var(--surface); border-color:var(--border);">
			<h1 class="text-xl font-bold text-center" style="color:var(--text-primary);">{$t('editor.advanced_settings')}</h1>
			<label class="flex items-center justify-between gap-4 text-sm" style="color:var(--text-secondary);">
				<span>{$t('editor.hide_question_results')}</span>
				<input type="checkbox" bind:checked={data.questions[selected_question]['hide_results']} class="w-4 h-4 accent-[var(--primary)]" />
			</label>
			<div class="mt-auto w-full">
				<BrownButton onclick={() => (advanced_options_open = false)}>{$t('words.close')}</BrownButton>
			</div>
		</div>
	</div>
{/if}

<style>
	.editor-card {
		border-radius: 1rem;
		border: 1px solid var(--border);
		background-color: var(--surface);
		width: 100%;
		height: 100%;
		box-shadow: 0 4px 24px var(--shadow);
	}
	.editor-card-bar {
		height: 3rem;
		border-radius: 1rem 1rem 0 0;
		border-bottom: 1px solid var(--border);
		background-color: var(--bg);
		display: flex;
		align-items: center;
		padding: 0 1rem;
		gap: 0.5rem;
	}
	.dot {
		display: inline-block;
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 9999px;
		opacity: 0.6;
		transition: opacity 0.15s;
	}
	.dot:hover { opacity: 1; }
	.dot-red { background-color: #EF4444; }
	.dot-yellow { background-color: #F59E0B; }
	.dot-green { background-color: #22C55E; }
	.settings-btn {
		color: var(--text-secondary);
		transition: color 0.15s;
	}
	.settings-btn:hover { color: var(--primary); }
	.editor-input-wrap {
		border-radius: 0.75rem;
		border: 1px solid var(--border);
		background-color: var(--bg);
		color: var(--text-primary);
		padding: 0.5rem 0.75rem;
	}
	.border-warning {
		border-color: var(--warning) !important;
	}
	.time-input-wrap {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		border-radius: 0.75rem;
		border: 1px solid var(--border);
		background-color: var(--bg);
		padding: 0.5rem 1rem;
	}
	.time-input {
		width: 4rem;
		background: transparent;
		border: none;
		outline: none;
		font-size: 1.125rem;
		font-weight: 700;
		text-align: center;
		color: var(--text-primary);
	}
	.type-badge {
		border-radius: 9999px;
		border: 1px solid var(--border);
		background-color: var(--bg);
		color: var(--text-secondary);
		padding: 0.25rem 0.75rem;
		font-size: 0.75rem;
		font-weight: 600;
	}
</style>