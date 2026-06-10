<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->
<script lang="ts">
	import Spinner from '$lib/Spinner.svelte';
	import { browser } from '$app/environment';
	import { startRegistration } from '@simplewebauthn/browser';
	import TotpSetup from './totp_setup.svelte';
	import BackupCodes from './backup_codes.svelte';
	import { getLocalization } from '$lib/i18n';
	const { t } = getLocalization();

	let user_data = $state();
	let security_keys = $state([]);
	let totp_activated = $state(false);
	let totp_data = $state();
	let backup_code = $state();
	let loading = $state(true);

	const get_data = async () => {
		const [r1, r2, r3] = await Promise.all([
			fetch('/api/v1/users/me'),
			fetch('/api/v1/users/webauthn/list'),
			fetch('/api/v1/users/2fa/totp')
		]);
		user_data = await r1.json();
		security_keys = await r2.json();
		totp_activated = (await r3.json()).activated;
		loading = false;
	};

	get_data();

	const require_password = () => prompt('Bitte Passwort eingeben');

	const save_password_required = async () => {
		if (!browser || user_data?.require_password === undefined) return;
		const pw = require_password();
		const res = await fetch('/api/v1/users/2fa/require_password', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ require_password: user_data.require_password, password: pw })
		});
		user_data.require_password = (await res.json()).require_password;
	};

	const add_security_key = async () => {
		const pw = require_password();
		if (!pw) return;
		const res1 = await fetch('/api/v1/users/webauthn/add_key_init', {
			method: 'POST',
			body: JSON.stringify({ password: pw }),
			headers: { 'Content-Type': 'application/json' }
		});
		if (res1.status === 401) { alert('Passwort wahrscheinlich falsch'); return; }
		if (!res1.ok) throw Error('Response not ok');
		const resp_data = await res1.json();
		try {
			resp_data.authenticatorSelection.authenticatorAttachment = 'cross-platform';
			const attResp = await startRegistration({ optionsJSON: resp_data });
			await fetch('/api/v1/users/webauthn/add_key', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(attResp)
			});
		} catch (e) { throw e; }
		await get_data();
	};

	const remove_security_key = async (key_id: number) => {
		const pw = require_password();
		if (!pw) return;
		const res = await fetch(`/api/v1/users/webauthn/key/${key_id}`, {
			method: 'DELETE',
			body: JSON.stringify({ password: pw }),
			headers: { 'Content-Type': 'application/json' }
		});
		if (res.status === 401) { alert('Passwort wahrscheinlich falsch'); return; }
		await get_data();
	};

	const disable_totp = async () => {
		const pw = require_password();
		if (!pw) return;
		const res = await fetch('/api/v1/users/2fa/totp', {
			method: 'DELETE',
			body: JSON.stringify({ password: pw }),
			headers: { 'Content-Type': 'application/json' }
		});
		if (res.status === 401) { alert('Passwort wahrscheinlich falsch'); return; }
		await get_data();
	};

	const enable_totp = async () => {
		const pw = require_password();
		if (!pw) return;
		const res = await fetch('/api/v1/users/2fa/totp', {
			method: 'POST',
			body: JSON.stringify({ password: pw }),
			headers: { 'Content-Type': 'application/json' }
		});
		if (res.status === 401) { alert('Passwort wahrscheinlich falsch'); return; }
		totp_data = await res.json();
		await get_data();
	};

	const get_backup_code = async () => {
		const pw = require_password();
		if (!pw) return;
		if (!confirm('Der alte Backup-Code wird dabei gelöscht. Fortfahren?')) return;
		const res = await fetch('/api/v1/users/2fa/backup_code', {
			method: 'POST',
			body: JSON.stringify({ password: pw }),
			headers: { 'Content-Type': 'application/json' }
		});
		if (res.status === 401) { alert('Passwort wahrscheinlich falsch'); return; }
		backup_code = (await res.json()).code;
	};
</script>

<svelte:head>
	<title>ClassQuiz - Sicherheitseinstellungen</title>
</svelte:head>

{#if loading}
	<div class="flex justify-center py-20"><Spinner /></div>
{:else}
	<div class="max-w-4xl mx-auto w-full px-4 py-8 flex flex-col gap-6">

		<!-- 2FA / Passwort erforderlich -->
		<div class="card">
			<h2 class="label mb-4">{$t('security_settings.activate_2fa')}</h2>
			<div class="flex items-center gap-4" class:opacity-50={!totp_activated} class:pointer-events-none={!totp_activated}>
				<button
					type="button"
					role="switch"
					aria-checked={user_data?.require_password}
					onclick={() => { user_data.require_password = !user_data.require_password; save_password_required(); }}
					class="relative w-11 h-6 rounded-full transition"
					style="background-color:{user_data?.require_password ? 'var(--primary)' : 'var(--border)'};"
				>
					<span class="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
						style="left:{user_data?.require_password ? '1.25rem' : '0.125rem'};"></span>
				</button>
				<span class="text-sm" style="color:var(--text-secondary);">
					{user_data?.require_password ? $t('security_settings.2fa_activated') : $t('security_settings.2fa_deactivated')}
				</span>
			</div>
		</div>

		<!-- TOTP -->
		<div class="card">
			<h2 class="label mb-4">{$t('security_settings.totp')}</h2>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<div class="w-2 h-2 rounded-full" style="background-color:{totp_activated ? 'var(--success)' : 'var(--text-secondary)'}"></div>
					<span class="text-sm" style="color:var(--text-secondary);">
						{totp_activated ? $t('security_settings.totp_available') : $t('security_settings.totp_unavailable')}
					</span>
				</div>
				{#if totp_activated}
					<button onclick={disable_totp} class="btn btn-danger text-sm">{$t('security_settings.disable_totp')}</button>
				{:else}
					<button onclick={enable_totp} class="btn btn-primary text-sm">{$t('security_settings.enable_totp')}</button>
				{/if}
			</div>
		</div>

		<!-- Backup-Code -->
		<div class="card">
			<h2 class="label mb-4">{$t('security_settings.backup_code')}</h2>
			<button onclick={get_backup_code} class="btn btn-primary text-sm">
				{$t('security_settings.get_backup_code')}
			</button>
		</div>

		<!-- WebAuthn / Sicherheitsschlüssel -->
		<div class="card">
			<h2 class="label mb-4">{$t('security_settings.webauthn')}</h2>
			<div class="flex items-center justify-between mb-4">
				<div class="flex items-center gap-2">
					<div class="w-2 h-2 rounded-full" style="background-color:{security_keys.length > 0 ? 'var(--success)' : 'var(--text-secondary)'}"></div>
					<span class="text-sm" style="color:var(--text-secondary);">
						{security_keys.length > 0 ? $t('security_settings.webauthn_available') : $t('security_settings.webauthn_unavailable')}
					</span>
				</div>
				<button onclick={add_security_key} class="btn btn-primary text-sm">
					{$t('security_settings.add_security_key')}
				</button>
			</div>
			{#if security_keys.length > 0}
				<div class="flex flex-col gap-2">
					{#each security_keys as key, i}
						<div class="flex items-center justify-between rounded-lg px-3 py-2" style="background-color:var(--bg); border:1px solid var(--border);">
							<span class="text-sm" style="color:var(--text-secondary);">Sicherheitsschlüssel {i + 1}</span>
							<button onclick={() => remove_security_key(key.id)} class="btn btn-danger text-xs">
								{$t('words.delete')}
							</button>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}

{#if totp_data}
	<TotpSetup bind:totp_data />
{/if}

{#if backup_code}
	<BackupCodes bind:backup_code />
{/if}
