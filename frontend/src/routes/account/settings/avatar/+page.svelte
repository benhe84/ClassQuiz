<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->
<script lang="ts">
	import BrownButton from '$lib/components/buttons/brown.svelte';
	import { fade, fly } from 'svelte/transition';
	import { bounceOut } from 'svelte/easing';
	import Spinner from '$lib/Spinner.svelte';
	import { getLocalization } from '$lib/i18n';

	const { t } = getLocalization();

	const item_count = {
		skin_color: 7,
		top_type: 35,
		hair_color: 10,
		facial_hair_type: 6,
		facial_hair_color: 10,
		mouth_type: 12,
		eyebrow_type: 13,
		accessories_type: 7,
		hat_color: 15,
		clothe_type: 9,
		clothe_color: 15,
		clothe_graphic_type: 11
	};

	const translation_map = {
		skin_color: $t('avatar_settings.skin_color'),
		top_type: $t('avatar_settings.top_type'),
		hair_color: $t('avatar_settings.hair_color'),
		facial_hair_type: $t('avatar_settings.facial_hair_type'),
		facial_hair_color: $t('avatar_settings.facial_hair_color'),
		mouth_type: $t('avatar_settings.mouth_type'),
		eyebrow_type: $t('avatar_settings.eyebrow_type'),
		accessories_type: $t('avatar_settings.accessories_type'),
		hat_color: $t('avatar_settings.hat_color'),
		clothe_type: $t('avatar_settings.clothe_type'),
		clothe_color: $t('avatar_settings.clothe_color'),
		clothe_graphic_type: $t('avatar_settings.clothe_graphic_type')
	};

	let data = $state({
		skin_color: 0,
		top_type: 0,
		hair_color: 0,
		facial_hair_type: 0,
		facial_hair_color: 0,
		mouth_type: 0,
		eyebrow_type: 0,
		accessories_type: 0,
		hat_color: 0,
		clothe_type: 0,
		clothe_color: 0,
		clothe_graphic_type: 0
	});

	const data_keys = Object.keys(data);
	let index = $state(0);
	let save_finished: undefined | boolean = $state(undefined);
	let finished = $state(false);

	const get_image_url = (input_data) => {
		return `/api/v1/avatar/custom?${new URLSearchParams(input_data).toString()}`;
	};

	let image_url = $derived(get_image_url(data));

	const save_avatar = async () => {
		save_finished = false;
		const res = await fetch(`/api/v1/avatar/save?${new URLSearchParams(data).toString()}`, {
			method: 'POST'
		});
		if (res.ok) {
			save_finished = true;
		}
	};

	const finish = () => {
		save_finished = undefined;
		finished = true;
	};
</script>

<div class="flex h-screen w-full flex-col bg-base">
	<div class="grid h-full grid-cols-1 overflow-hidden lg:grid-cols-3">
		<!-- Preview -->
		<div class="flex items-center justify-center border-b border-base bg-surface-2 p-8 lg:border-b-0 lg:border-r">
			<div class="card">
				<img src={image_url} alt="Avatar preview" class="h-64 w-64" />
			</div>
		</div>

		<!-- Picker -->
		<div class="col-span-2 flex flex-col overflow-hidden">
			<!-- Top nav -->
			<div class="flex items-center gap-4 border-b border-base p-4">
				<button
					type="button"
					class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-base transition hover:bg-surface-2"
					class:opacity-40={index < 1}
					disabled={index < 1}
					onclick={() => (index = index - 1)}
					aria-label={$t('words.back')}
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
					</svg>
				</button>

				<div class="flex-1 text-center">
					<h2 class="text-lg font-bold text-base">
						{translation_map[data_keys[index]]}
					</h2>
					<p class="text-xs text-muted">{index + 1} / {data_keys.length}</p>
				</div>

				<BrownButton
					disabled={index < data_keys.length - 1}
					onclick={finish}
				>
					{$t('words.finish')}
				</BrownButton>
			</div>

			<!-- Progress bar -->
			<div class="h-1 w-full bg-surface-2">
				<div
					class="h-full bg-primary transition-all"
					style="width: {((index + 1) / data_keys.length) * 100}%"
				></div>
			</div>

			<!-- Options grid -->
			<div class="flex-1 overflow-y-auto p-4">
				<div class="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
					{#each Array.from(Array(item_count[data_keys[index]]).keys()) as key}
						<button
							type="button"
							class="option-tile"
							onclick={() => {
								data[data_keys[index]] = key;
								if (index < data_keys.length - 1) {
									index++;
								} else {
									finish();
								}
							}}
						>
							<img
								src={get_image_url({ ...data, [data_keys[index]]: key })}
								in:fade|global={{ duration: 100 }}
								alt="Option {key + 1}"
							/>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>

{#if finished}
	<div
		class="fixed left-0 top-0 z-30 flex h-full w-full flex-col justify-center bg-black/90"
		out:fade|global={{ duration: 200 }}
		in:fade|global={{ duration: 300 }}
	>
		<h1 class="m-auto text-4xl font-bold text-white" in:fade|global={{ delay: 3500 }}>
			{$t('avatar_settings.thats_you')}
		</h1>
		<img
			class="z-20 m-auto h-1/2 w-1/2"
			src={get_image_url(data)}
			alt="Final avatar"
			in:fly|global={{ delay: 500, duration: 4000, y: -500, easing: bounceOut }}
		/>
		<div class="m-auto grid grid-cols-2 gap-4" in:fade|global={{ delay: 3500 }}>
			<BrownButton
				onclick={() => {
					index = 0;
					finished = false;
				}}
			>
				{$t('avatar_settings.start_over')}
			</BrownButton>
			<BrownButton onclick={save_avatar} flex={true} disabled={save_finished === true}>
				{#if save_finished === undefined}
					{$t('words.save')}
				{:else if save_finished === true}
					<svg
						class="h-6 w-6"
						aria-hidden="true"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				{:else if save_finished === false}
					<Spinner my_20={false} />
				{/if}
			</BrownButton>
			<BrownButton href="/account/settings">{$t('avatar_settings.go_back')}</BrownButton>
			<BrownButton
				onclick={() => {
					finished = false;
				}}
			>
				{$t('words.close')}
			</BrownButton>
		</div>
	</div>
{/if}

<style>
	.option-tile {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.75rem;
		border: 1px solid var(--border);
		background-color: var(--surface);
		padding: 0.5rem;
		transition: all 0.15s;
		cursor: pointer;
	}
	.option-tile:hover {
		border-color: var(--primary);
		background-color: color-mix(in srgb, var(--primary) 8%, transparent);
		transform: translateY(-1px);
	}
	.option-tile img {
		width: 100%;
		height: auto;
		border-radius: 0.5rem;
	}
</style>