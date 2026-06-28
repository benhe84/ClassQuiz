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

	const tippy = createTippy({
		arrow: true,
		animation: 'perspective-subtle',
		placement: 'top'
	});

	interface Props {
		data: EditorData;
		selected_question: number;
		edit_id: string;
	}

	let {
		data = $bindable(),
		selected_question = $bindable(),
		edit_id = $bindable()
	}: Props = $props();

	let advanced_options_open = $state(false);
	let uppyOpen = $state(false);
	let unique = $state({});

	const correctTimeInput = (_) => {
		let time = data.questions[selected_question].time;
		if (time === null || time === undefined) {
			data.questions[selected_question].time = '';
			time = '';
		}
		if (data.questions[selected_question].time > 3) {
			data.questions[selected_question].time = data.questions[selected_question].time
				.toString()
				.slice(0, 3);
		}
	};

	const set_unique = () => { unique = {}; };

	run(() => { correctTimeInput(data.questions[selected_question].time); });
	run(() => { selected_question; set_unique(); });

	let image_url = $state('');
	const update_image_url = () => {
		image_url = data.questions[selected_question].image;
	};
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
	<div class="rounded-2xl w-full h-full shadow-2xl border border-white/10" style="background-color:#1E293B;">

		<!-- Titelleiste -->
		<div class="h-12 rounded-t-2xl flex items-center px-4 gap-3 border-b border-white/10" style="background-color:#0F172A;">
			<span class="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 transition cursor-pointer"></span>
			<span class="w-3 h-3 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition cursor-pointer"></span>
			<span class="w-3 h-3 rounded-full bg-green-500/70 hover:bg-green-500 transition cursor-pointer"></span>
			<button
				class="ml-auto text-[#475569] hover:text-[#6366F1] transition"
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

				<!-- Frage-Eingabe -->
				<div class="flex justify-center pt-8 w-full px-6">
					{#key unique}
						{#await import('$lib/inline-editor.svelte')}
							<Spinner my_20={false} />
						{:then c}
							<div
								class="w-full rounded-xl border border-white/10 px-3 py-2"
								style="background-color:#0F172A; color:#F8FAFC;"
								class:border-yellow-500={!reach(dataSchema, 'questions[].question').isValidSync(data.questions[selected_question].question)}
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
					<div class="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2" style="background-color:#0F172A;">
						<svg class="w-5 h-5 text-[#6366F1]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<input
							type="number"
							max="999"
							min="1"
							class="w-16 bg-transparent text-lg outline-none text-center font-bold"
							style="color:#F8FAFC;"
							bind:value={data.questions[selected_question].time}
						/>
						<span style="color:#94A3B8;">s</span>
					</div>
				</div>

				<!-- Fragetyp -->
				<div class="flex justify-center py-4">
					<span class="rounded-full px-3 py-1 text-xs font-semibold border border-white/10" style="color:#94A3B8; background-color:#0F172A;">
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
	<div
		class="fixed top-0 left-0 w-full h-full bg-black/60 flex"
		transition:fade|global={{ duration: 150 }}
	>
		<div class="w-1/4 h-1/3 m-auto rounded-2xl border border-white/10 flex flex-col p-4 gap-4" style="background-color:#1E293B;">
			<h1 class="text-xl font-bold text-center" style="color:#F8FAFC;">{$t('editor.advanced_settings')}</h1>
			<label class="flex justify-between items-center gap-4 text-sm" style="color:#94A3B8;">
				<span>{$t('editor.hide_question_results')}</span>
				<input
					type="checkbox"
					bind:checked={data.questions[selected_question]['hide_results']}
					class="w-4 h-4 accent-[#6366F1]"
				/>
			</label>
			<div class="mt-auto w-full">
				<BrownButton onclick={() => (advanced_options_open = false)}>{$t('words.close')}</BrownButton>
			</div>
		</div>
	</div>
{/if}