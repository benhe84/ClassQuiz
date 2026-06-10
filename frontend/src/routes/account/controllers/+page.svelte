<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->
<script lang="ts">
	import type { PageData } from './$types';
	import { getLocalization } from '$lib/i18n';
	const { t } = getLocalization();
	interface Props { data: PageData; }
	let { data }: Props = $props();
	const controllers = data.controllers;
</script>

<svelte:head>
	<title>ClassQuiz - Controller</title>
</svelte:head>

<div class="max-w-4xl mx-auto w-full px-4 py-8">
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-xl font-bold">ClassQuiz-Controller</h1>
		<a href="/account/controllers/add" class="btn btn-primary text-sm">
			+ {$t('controllers.add_new_controller')}
		</a>
	</div>

	{#if controllers.length === 0}
		<div class="card flex flex-col items-center justify-center py-16 gap-4">
			<svg class="w-12 h-12" style="color:var(--text-secondary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"/>
			</svg>
			<p class="text-sm" style="color:var(--text-secondary);">Noch keine Controller vorhanden.</p>
			<a href="/account/controllers/add" class="btn btn-primary text-sm">
				{$t('controllers.add_new_controller')}
			</a>
		</div>
	{:else}
		<div class="card p-0 overflow-hidden">
			<table class="w-full">
				<thead>
					<tr style="background-color:var(--bg); border-bottom:1px solid var(--border);">
						<th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style="color:var(--text-secondary);">{$t('words.name')}</th>
						<th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style="color:var(--text-secondary);">{$t('controllers.player_name')}</th>
						<th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style="color:var(--text-secondary);">{$t('controllers.first_seen')}</th>
						<th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style="color:var(--text-secondary);">{$t('controllers.last_seen')}</th>
						<th class="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style="color:var(--text-secondary);">{$t('words.version')}</th>
					</tr>
				</thead>
				<tbody>
					{#each controllers as controller, i}
						<tr style="border-bottom:1px solid var(--border); background-color:{i % 2 === 0 ? 'var(--surface)' : 'var(--bg)'};">
							<td class="px-4 py-3">
								<a href="/account/controllers/{controller.id}" class="text-sm font-semibold hover:underline" style="color:var(--primary);">
									{controller.name}
								</a>
							</td>
							<td class="px-4 py-3 text-sm" style="color:var(--text-secondary);">{controller.player_name}</td>
							<td class="px-4 py-3 text-sm hidden md:table-cell" style="color:var(--text-secondary);">
								{controller.first_seen ? new Date(controller.first_seen).toLocaleString() : $t('words.never')}
							</td>
							<td class="px-4 py-3 text-sm hidden md:table-cell" style="color:var(--text-secondary);">
								{controller.last_seen ? new Date(controller.last_seen).toLocaleString() : $t('words.never')}
							</td>
							<td class="px-4 py-3 text-sm" style="color:var(--text-secondary);">
								{controller.os_version ?? $t('words.unknown')}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
