<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { getLocalization } from '$lib/i18n';

	const { t } = getLocalization();

	interface Props {
		quiz_id?: string | null;
	}

	let { quiz_id = $bindable(null) }: Props = $props();

	const close = () => {
		quiz_id = null;
	};

	const onKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') close();
	};

	onMount(() => {
		window.addEventListener('keydown', onKeydown);
		return () => window.removeEventListener('keydown', onKeydown);
	});
</script>

{#if quiz_id}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
		onclick={close}
		transition:fade={{ duration: 100 }}
	>
		<div
			class="card w-[92%] max-w-lg p-6"
			onclick={e => e.stopPropagation()}
		>
			<h1 class="text-2xl font-semibold text-center mb-6">
				{$t('downloader.select_download_type')}
			</h1>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<a class="btn btn-primary justify-center" href={`/api/v1/eximport/${quiz_id}`}>
					{$t('downloader.own_format')}
				</a>

				<a class="btn btn-primary justify-center" href={`/api/v1/eximport/excel/${quiz_id}`}>
					{$t('downloader.excel_format')}
				</a>
			</div>

			<p class="mt-4 text-sm text-center text-slate-400">
				{$t('downloader.help')}
			</p>
		</div>
	</div>
{/if}
