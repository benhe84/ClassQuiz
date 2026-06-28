<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import BrownButton from '$lib/components/buttons/brown.svelte';
	import GrayButton from '$lib/components/buttons/gray.svelte';

	interface Props {
		autoReturn?: boolean;
		quiz_id: string;
	}

	let { autoReturn = false, quiz_id }: Props = $props();

	let mod_rating = $state<number | null | undefined>(undefined);

	const submit = async () => {
		const res = await fetch(`/api/v1/moderation/rating/set/${quiz_id}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ rating: mod_rating })
		});

		if (!res.ok) {
			alert('Setting rating failed');
			return;
		}

		if (autoReturn) {
			window.history.back();
		}
	};
</script>

<div class="card border-2 border-base bg-surface flex flex-col w-fit gap-2 p-2">
		<div class:opacity-50={mod_rating !== null}>
		<BrownButton onclick={() => (mod_rating = null)}>Not Checked</BrownButton>
	</div>

	<div class:opacity-50={mod_rating !== 0}>
		<BrownButton onclick={() => (mod_rating = 0)}>Ok</BrownButton>
	</div>

	<div class:opacity-50={mod_rating !== 1}>
		<BrownButton onclick={() => (mod_rating = 1)}>Attention</BrownButton>
	</div>

	<div class:opacity-50={mod_rating !== 2}>
		<BrownButton onclick={() => (mod_rating = 2)}>NSFW</BrownButton>
	</div>

	<div class:opacity-50={mod_rating !== 3}>
		<BrownButton onclick={() => (mod_rating = 3)}>Plausibility Checked</BrownButton>
	</div>

	<div class:opacity-50={mod_rating !== 4}>
		<BrownButton onclick={() => (mod_rating = 4)}>Fact Checked</BrownButton>
	</div>

	<div class:opacity-50={mod_rating !== 5}>
		<BrownButton onclick={() => (mod_rating = 5)}>Exceptional</BrownButton>
	</div>

	<GrayButton onclick={submit} disabled={mod_rating === undefined}>
		Submit
	</GrayButton>
</div>