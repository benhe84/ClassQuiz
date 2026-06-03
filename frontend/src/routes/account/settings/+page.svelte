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
	import Footer from '$lib/footer.svelte';
	const { t } = getLocalization();

	interface UserAccount {
		id: string;
		email: string;
		username: string;
		verified: boolean;
		created_at: string;
	}

	let changePasswordData = $state({ oldPassword: '', newPassword: '', newPasswordConfirm: '' });
	let locationData;
	let this_session = $state();

	let passwordChangeDataValid = $derived(
		changePasswordData.newPassword === changePasswordData.newPasswordConfirm &&
		changePasswordData.newPassword.length >= 8 &&
		changePasswordData.oldPassword !== changePasswordData.newPassword &&
		changePasswordData.oldPassword !== ''
	);

	const changePassword = async (e: Event) => {
		e.preventDefault();
		if (!passwordChangeDataValid) return;
		const res = await fetch('/api/v1/users/password/update', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ old_password: changePasswordData.oldPassword, new_password: changePasswordData.newPassword })
		});
		if (res.status === 200) {
			alert('Passwort geändert');
			window.location.assign('/account/login');
		} else {
			alert('Passwortänderung fehlgeschlagen');
		}
	};

	const getUser = async (): Promise<UserAccount> => {
		const response = await fetch('/api/v1/users/me', { method: 'GET', headers: { 'Content-Type': 'application/json' } });
		if (response.status === 200) return await response.json();
		window.location.assign('/account/login');
	};

	onMount(() => { api_keys = get_api_keys(); });

	const get_api_keys = async () => {
		const res = await fetch('/api/v1/users/api_keys');
		return await res.json();
	};

	let api_keys = $state();

	const add_api_key = async () => {
		await fetch('/api/v1/users/api_keys', { method: 'POST' });
		api_keys = get_api_keys();
	};

	const formatDate = (date: string): string => DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED);

	const delete_api_key = async (key: string) => {
		if (confirm('API-Schlüssel wirklich löschen?')) {
			await fetch(`/api/v1/users/api_keys?api_key=${key}`, { method: 'DELETE' });
			api_keys = get_api_keys();
		}
	};

	const getSessions = async () => {
		const res = await fetch('/api/v1/users/sessions/list');
		if (res.status === 200) {
			const res2 = await fetch('/api/v1/users/session');
			if (res2.status === 200) this_session = await res2.json();
			return await res.json();
		}
		window.location.assign('/account/login?returnTo=/account/settings');
	};

	const getFormattedUserAgent = (userAgent: string): string => {
		const parser = new UAParser(userAgent);
		const result = parser.getResult();
		return `${result.browser.name} ${result.browser.version} (${result.os.name})`;
	};

	const deleteSession = async (session_id: string) => {
		const res = await fetch(`/api/v1/users/sessions/${session_id}`, { method: 'DELETE' });
		if (res.status === 200) window.location.reload();
	};
</script>

<svelte:head>
	<title>ClassQuiz - Einstellungen</title>
</svelte:head>

<div class="flex flex-col flex-1" style="background-color:#0F172A; color:#F8FAFC;">
	{#await getUser()}
		<Spinner />
	{:then user}
		<div class="max-w-4xl mx-auto w-full px-4 py-8 flex flex-col gap-6">

			<!-- Profil -->
			<div class="rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start" style="background-color:#1E293B;">
				<div class="flex flex-col items-center gap-3">
					<img class="rounded-xl w-28 h-28 object-cover" src="/api/v1/users/avatar" alt="Avatar von {user.username}"/>
					<a href="/account/settings/avatar" class="text-xs px-3 py-1.5 rounded-lg transition font-semibold" style="background-color:#6366F1; color:#F8FAFC;">
						{$t('settings_page.change_avatar')}
					</a>
				</div>
				<div class="flex-1">
					<h1 class="text-2xl font-bold mb-1">{user.username}</h1>
					<p class="text-sm mb-4" style="color:#CBD5E1;">{user.email}</p>
					<div class="flex flex-wrap gap-2">
						<a href="/account/settings/security" class="text-sm px-4 py-2 rounded-lg font-semibold transition" style="background-color:#0F172A; color:#F8FAFC; border:1px solid #6366F133;">
							{$t('settings_page.security_settings')}
						</a>
						<a href="/account/controllers" class="text-sm px-4 py-2 rounded-lg font-semibold transition" style="background-color:#0F172A; color:#F8FAFC; border:1px solid #6366F133;">
							ClassQuiz-Controller
						</a>
						<a href="/user/{user.id}" class="text-sm px-4 py-2 rounded-lg font-semibold transition" style="background-color:#0F172A; color:#F8FAFC; border:1px solid #6366F133;">
							Öffentliches Profil
						</a>
					</div>
				</div>
			</div>

			<!-- Passwort ändern -->
			<div class="rounded-2xl p-6" style="background-color:#1E293B;">
				<h2 class="text-base font-semibold mb-4" style="color:#CBD5E1;">Passwort ändern</h2>
				<form onsubmit={changePassword} class="flex flex-col md:flex-row gap-3 items-end flex-wrap">
					<div class="flex flex-col gap-1">
						<label class="text-xs" style="color:#94A3B8;">{$t('settings_page.old_password')}</label>
						<input type="password" bind:value={changePasswordData.oldPassword} class="rounded-lg px-3 py-2 text-sm outline-none" style="background-color:#0F172A; color:#F8FAFC; border:1px solid #6366F133;"/>
					</div>
					<div class="flex flex-col gap-1">
						<label class="text-xs" style="color:#94A3B8;">{$t('settings_page.new_password')}</label>
						<input type="password" bind:value={changePasswordData.newPassword} class="rounded-lg px-3 py-2 text-sm outline-none" style="background-color:#0F172A; color:#F8FAFC; border:1px solid #6366F133;"/>
					</div>
					<div class="flex flex-col gap-1">
						<label class="text-xs" style="color:#94A3B8;">{$t('settings_page.repeat_password')}</label>
						<input type="password" bind:value={changePasswordData.newPasswordConfirm} class="rounded-lg px-3 py-2 text-sm outline-none" style="background-color:#0F172A; color:#F8FAFC; border:1px solid #6366F133;"/>
					</div>
					<button type="submit" disabled={!passwordChangeDataValid} class="px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50" style="background-color:#6366F1; color:#F8FAFC;">
						{$t('settings_page.change_password_submit')}
					</button>
				</form>
			</div>

			<!-- API-Schlüssel -->
			<div class="rounded-2xl p-6" style="background-color:#1E293B;">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-base font-semibold" style="color:#CBD5E1;">{$t('settings_page.add_api_key')}</h2>
					<button onclick={add_api_key} class="text-sm px-3 py-1.5 rounded-lg font-semibold transition" style="background-color:#6366F1; color:#F8FAFC;">
						+ Hinzufügen
					</button>
				</div>
				{#await api_keys}
					<Spinner />
				{:then keys}
					{#if keys && keys.length > 0}
						<div class="flex flex-col gap-2">
							{#each keys as key}
								<div class="flex items-center justify-between rounded-lg px-3 py-2" style="background-color:#0F172A; border:1px solid #6366F133;">
									<code class="text-xs" style="color:#CBD5E1;">{key.key}</code>
									<button onclick={() => delete_api_key(key.key)} class="text-xs px-2 py-1 rounded-lg" style="background-color:#EF444420; color:#EF4444;">
										{$t('words.delete')}
									</button>
								</div>
							{/each}
						</div>
					{:else}
						<p class="text-sm" style="color:#94A3B8;">Keine API-Schlüssel vorhanden.</p>
					{/if}
				{/await}
			</div>

			<!-- Sitzungen -->
			{#await getSessions()}
				<Spinner />
			{:then sessions}
				<div class="rounded-2xl p-6" style="background-color:#1E293B;">
					<h2 class="text-base font-semibold mb-4" style="color:#CBD5E1;">Aktive Sitzungen</h2>
					<div class="flex flex-col gap-2">
						{#each sessions as session}
							<div class="flex flex-col md:flex-row md:items-center justify-between rounded-lg px-4 py-3 gap-2" style="background-color:#0F172A; border:1px solid {session.id === this_session?.id ? '#22C55E33' : '#6366F133'};">
								<div class="flex flex-col gap-0.5">
									<p class="text-sm font-medium" style="color:#F8FAFC;">{getFormattedUserAgent(session.user_agent)}</p>
									<p class="text-xs" style="color:#94A3B8;">
										Erstellt: {formatDate(session.created_at)} · Zuletzt: {formatDate(session.last_seen)}
									</p>
								</div>
								<div class="flex items-center gap-3">
									{#if session.id === this_session?.id}
										<span class="text-xs px-2 py-0.5 rounded-full" style="background-color:#22C55E20; color:#22C55E;">Aktuelle Sitzung</span>
									{/if}
									<button onclick={() => deleteSession(session.id)} class="text-xs px-3 py-1 rounded-lg transition" style="background-color:#EF444420; color:#EF4444;">
										{$t('words.delete')}
									</button>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/await}
		</div>
	{/await}
	<Footer />
</div>
