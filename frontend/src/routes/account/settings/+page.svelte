<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->
<script lang="ts">
	import { getLocalization } from '$lib/i18n';
	import { DateTime } from 'luxon';
	import { UAParser } from 'ua-parser-js';
	import Spinner from '$lib/Spinner.svelte';
	import { onMount } from 'svelte';
	const { t } = getLocalization();

	let user = $state(null);
	let sessions = $state([]);
	let this_session = $state(null);
	let api_keys = $state([]);
	let loading = $state(true);
	let changePasswordData = $state({ oldPassword: '', newPassword: '', newPasswordConfirm: '' });

	let passwordChangeDataValid = $derived(
		changePasswordData.newPassword === changePasswordData.newPasswordConfirm &&
		changePasswordData.newPassword.length >= 8 &&
		changePasswordData.oldPassword !== changePasswordData.newPassword &&
		changePasswordData.oldPassword !== ''
	);

	const formatDate = (date: string) => DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED);

	const getFormattedUserAgent = (userAgent: string) => {
		const r = new UAParser(userAgent).getResult();
		return `${r.browser.name} ${r.browser.version} (${r.os.name})`;
	};

	onMount(async () => {
		const [userRes, sessionsRes, sessionRes, keysRes] = await Promise.all([
			fetch('/api/v1/users/me'),
			fetch('/api/v1/users/sessions/list'),
			fetch('/api/v1/users/session'),
			fetch('/api/v1/users/api_keys')
		]);
		if (userRes.status !== 200) { window.location.assign('/account/login?returnTo=/account/settings'); return; }
		user = await userRes.json();
		if (sessionsRes.status === 200) sessions = await sessionsRes.json();
		if (sessionRes.status === 200) this_session = await sessionRes.json();
		if (keysRes.status === 200) api_keys = await keysRes.json();
		loading = false;
	});

	const changePassword = async (e: Event) => {
		e.preventDefault();
		if (!passwordChangeDataValid) return;
		const res = await fetch('/api/v1/users/password/update', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ old_password: changePasswordData.oldPassword, new_password: changePasswordData.newPassword })
		});
		if (res.status === 200) { alert('Passwort geändert'); window.location.assign('/account/login'); }
		else alert('Passwortänderung fehlgeschlagen');
	};

	const add_api_key = async () => {
		await fetch('/api/v1/users/api_keys', { method: 'POST' });
		const res = await fetch('/api/v1/users/api_keys');
		if (res.status === 200) api_keys = await res.json();
	};

	const delete_api_key = async (key: string) => {
		if (!confirm('API-Schlüssel wirklich löschen?')) return;
		await fetch(`/api/v1/users/api_keys?api_key=${key}`, { method: 'DELETE' });
		const res = await fetch('/api/v1/users/api_keys');
		if (res.status === 200) api_keys = await res.json();
	};

	const deleteSession = async (session_id: string) => {
		const res = await fetch(`/api/v1/users/sessions/${session_id}`, { method: 'DELETE' });
		if (res.status === 200) window.location.reload();
	};
</script>

<svelte:head>
	<title>ClassQuiz - Einstellungen</title>
</svelte:head>

{#if loading}
	<div class="flex justify-center py-20"><Spinner /></div>
{:else if user}
	<div class="max-w-4xl mx-auto w-full px-4 py-8 flex flex-col gap-6">

		<!-- Profil -->
		<div class="card flex flex-col md:flex-row gap-6 items-start">
			<div class="flex flex-col items-center gap-3">
				<img class="rounded-xl w-28 h-28 object-cover" src="/api/v1/users/avatar" alt="Avatar"/>
				<a href="/account/settings/avatar" class="btn btn-primary text-xs">
					{$t('settings_page.change_avatar')}
				</a>
			</div>
			<div class="flex-1">
				<h1 class="text-2xl font-bold mb-1">{user.username}</h1>
				<p class="text-sm mb-4" style="color:var(--text-secondary);">{user.email}</p>
				<div class="flex flex-wrap gap-2">
					<a href="/account/settings/security" class="btn" style="background-color:var(--surface); color:var(--text-primary); border:1px solid var(--border);">
						{$t('settings_page.security_settings')}
					</a>
					<a href="/account/controllers" class="btn" style="background-color:var(--surface); color:var(--text-primary); border:1px solid var(--border);">
						ClassQuiz-Controller
					</a>
					<a href="/user/{user.id}" class="btn" style="background-color:var(--surface); color:var(--text-primary); border:1px solid var(--border);">
						Öffentliches Profil
					</a>
				</div>
			</div>
		</div>

		<!-- Passwort ändern -->
		<div class="card">
			<h2 class="label mb-4">Passwort ändern</h2>
			<form onsubmit={changePassword} class="flex flex-col md:flex-row gap-3 items-end flex-wrap">
				<div class="flex flex-col gap-1">
					<label class="label">{$t('settings_page.old_password')}</label>
					<input type="password" bind:value={changePasswordData.oldPassword} class="input w-48"/>
				</div>
				<div class="flex flex-col gap-1">
					<label class="label">{$t('settings_page.new_password')}</label>
					<input type="password" bind:value={changePasswordData.newPassword} class="input w-48"/>
				</div>
				<div class="flex flex-col gap-1">
					<label class="label">{$t('settings_page.repeat_password')}</label>
					<input type="password" bind:value={changePasswordData.newPasswordConfirm} class="input w-48"/>
				</div>
				<button type="submit" disabled={!passwordChangeDataValid} class="btn btn-primary">
					{$t('settings_page.change_password_submit')}
				</button>
			</form>
		</div>

		<!-- API-Schlüssel -->
		<div class="card">
			<div class="flex items-center justify-between mb-4">
				<h2 class="label">API-Schlüssel</h2>
				<button onclick={add_api_key} class="btn btn-primary text-xs">+ Hinzufügen</button>
			</div>
			{#if api_keys.length > 0}
				<div class="flex flex-col gap-2">
					{#each api_keys as key}
						<div class="flex items-center justify-between rounded-lg px-3 py-2" style="background-color:var(--bg); border:1px solid var(--border);">
							<code class="text-xs" style="color:var(--text-secondary);">{key.key}</code>
							<button onclick={() => delete_api_key(key.key)} class="btn btn-danger text-xs">
								{$t('words.delete')}
							</button>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm" style="color:var(--text-secondary);">Keine API-Schlüssel vorhanden.</p>
			{/if}
		</div>

		<!-- Sitzungen -->
		<div class="card">
			<h2 class="label mb-4">Aktive Sitzungen</h2>
			<div class="flex flex-col gap-2">
				{#each sessions as session}
					<div class="flex flex-col md:flex-row md:items-center justify-between rounded-lg px-4 py-3 gap-2"
						style="background-color:var(--bg); border:1px solid {session.id === this_session?.id ? 'var(--success)' : 'var(--border)'};">
						<div class="flex flex-col gap-0.5">
							<p class="text-sm font-medium">{getFormattedUserAgent(session.user_agent)}</p>
							<p class="text-xs" style="color:var(--text-secondary);">
								Erstellt: {formatDate(session.created_at)} · Zuletzt: {formatDate(session.last_seen)}
							</p>
						</div>
						<div class="flex items-center gap-3">
							{#if session.id === this_session?.id}
								<span class="text-xs px-2 py-0.5 rounded-full" style="background-color:color-mix(in srgb, var(--success) 20%, transparent); color:var(--success);">
									Aktuelle Sitzung
								</span>
							{/if}
							<button onclick={() => deleteSession(session.id)} class="btn btn-danger text-xs">
								{$t('words.delete')}
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
