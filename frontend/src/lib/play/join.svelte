<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import { socket } from '$lib/socket';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import * as Sentry from '@sentry/browser';
	import { getLocalization } from '$lib/i18n';
	import Cookies from 'js-cookie';

	const { t } = getLocalization();

	interface Props {
		game_pin: string;
		game_mode: any;
		username: any;
	}

	let {
		game_pin = $bindable(),
		game_mode = $bindable(),
		username = $bindable()
	}: Props = $props();

	let custom_field = $state();
	let custom_field_value = $state();
	let captcha_enabled = $state();
	let hcaptchaSitekey = import.meta.env.VITE_HCAPTCHA;

	let hcaptcha = {
		execute: async (_a, _b) => ({ response: '' }),
		render: (_a, _b) => {}
	};
	let hcaptchaWidgetID;

	onMount(() => {
		if (browser) {
			prefetch_username();
			hcaptcha = window.hcaptcha;
			if (hcaptcha.render) {
				hcaptchaWidgetID = hcaptcha.render('hcaptcha', {
					sitekey: hcaptchaSitekey,
					size: 'invisible',
					theme: 'dark'
				});
			}
		}
	});

	onDestroy(() => {
		if (browser) {
			hcaptcha = {
				execute: async () => ({ response: '' }),
				render: () => {}
			};
		}
	});

	const prefetch_username = async () => {
		const res = await fetch('/api/v1/users/me');
		if (res.status !== 200) return;
		const json = await res.json();
		username = json.username;
	};

	const set_game_pin = async () => {
		let process_var;
		try {
			process_var = process;
		} catch {
			process_var = { env: { API_URL: undefined } };
		}
		const res = await fetch(
			`${process_var.env.API_URL ?? ''}/api/v1/quiz/play/check_captcha/${game_pin}`
		);
		const json = await res.json();
		game_mode = json.game_mode;
		if (res.status === 200) {
			captcha_enabled = json.enabled;
			custom_field = json.custom_field;
		}
		if (res.status === 404) {
			if (browser) alert('Spiel nicht gefunden');
			game_pin = '';
			return;
		}
		if (res.status !== 200) {
			alert('Unbekannter Fehler');
			return;
		}
	};

	$effect(() => {
		if (game_pin.length > 5) set_game_pin();
	});

	const setUsername = async (e: Event) => {
		e.preventDefault();
		if (username.length <= 3) return;
		let captcha_resp: string;
		if (Cookies.get('kicked')) {
			console.log("%cYou're Banned!", 'font-size:6rem');
			return;
		}
		if (captcha_enabled) {
			if (hcaptchaSitekey) {
				try {
					const { response } = await hcaptcha.execute(hcaptchaWidgetID, { async: true });
					captcha_resp = response;
					socket.emit('join_game', {
						username,
						game_pin,
						captcha: captcha_resp,
						custom_field: custom_field ? custom_field_value : undefined
					});
				} catch (e) {
					if (import.meta.env.VITE_SENTRY !== null) Sentry.captureException(e);
					alert('Captcha fehlgeschlagen!');
					window.location.reload();
				}
			} else if (import.meta.env.VITE_RECAPTCHA) {
				grecaptcha.ready(() => {
					grecaptcha
						.execute(import.meta.env.VITE_RECAPTCHA, { action: 'submit' })
						.then((token) => {
							socket.emit('join_game', {
								username,
								game_pin,
								captcha: token,
								custom_field: custom_field ? custom_field_value : undefined
							});
						});
				});
			}
		} else {
			socket.emit('join_game', {
				username,
				game_pin,
				captcha: undefined,
				custom_field: custom_field ? custom_field_value : undefined
			});
		}
	};

	socket.on('game_not_found', () => {
		game_pin = '';
		if (browser) alert('Spiel nicht gefunden');
	});

	$effect(() => {
		const cleaned = game_pin.replace(/\D/g, '');
		if (game_pin.replace(/\D/g, '') === game_pin) return;
		game_pin = cleaned;
	});
</script>

<svelte:head>
	{#if captcha_enabled && hcaptchaSitekey}
		<script src="https://js.hcaptcha.com/1/api.js" async defer></script>
	{/if}
	{#if import.meta.env.VITE_RECAPTCHA && captcha_enabled}
		<script
			src="https://www.google.com/recaptcha/api.js?render={import.meta.env.VITE_RECAPTCHA}"
		></script>
	{/if}
</svelte:head>

{#if game_pin === '' || game_pin.length < 6}
	<!-- PIN-Eingabe -->
	<div class="flex min-h-screen w-full items-center justify-center bg-[#0F172A] px-4">
		<div class="w-full max-w-sm">
			<div class="mb-8 text-center">
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6366F1]/20">
					<svg class="h-8 w-8 text-[#6366F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
					</svg>
				</div>
				<h1 class="text-2xl font-bold text-[#F8FAFC]">{$t('words.game_pin')}</h1>
				<p class="mt-1 text-sm text-[#94A3B8]">Gib den 6-stelligen PIN ein</p>
			</div>

			<div class="rounded-2xl border border-white/10 bg-[#1E293B] p-6 shadow-xl">
				<input
					class="w-full rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] text-[#F8FAFC] placeholder-[#475569] outline-none transition focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/30"
					bind:value={game_pin}
					maxlength="6"
					inputmode="numeric"
					placeholder="······"
				/>
				<p class="mt-3 text-center text-xs text-[#475569]">
					{game_pin.length}/6 Ziffern
				</p>
			</div>
		</div>
	</div>
{:else}
	<!-- Benutzername-Eingabe -->
	<div class="flex min-h-screen w-full items-center justify-center bg-[#0F172A] px-4">
		<div class="w-full max-w-sm">
			<div class="mb-8 text-center">
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6366F1]/20">
					<svg class="h-8 w-8 text-[#6366F1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
					</svg>
				</div>
				<h1 class="text-2xl font-bold text-[#F8FAFC]">{$t('words.username')}</h1>
				<p class="mt-1 text-sm text-[#94A3B8]">Wie soll dein Name im Spiel sein?</p>
			</div>

			<div class="rounded-2xl border border-white/10 bg-[#1E293B] p-6 shadow-xl">
				<form onsubmit={setUsername} class="flex flex-col gap-4">
					<div>
						<input
							class="w-full rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-center text-lg font-semibold text-[#F8FAFC] placeholder-[#475569] outline-none transition focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/30 disabled:opacity-50"
							bind:value={username}
							maxlength="17"
							placeholder="Dein Name…"
						/>
						<p class="mt-1 text-right text-xs text-[#475569]">{username?.length ?? 0}/17</p>
					</div>

					{#if custom_field}
						<div>
							<label for="custom-field-input" class="mb-1 block text-sm font-medium text-[#94A3B8]">{custom_field}</label>
							<input
								class="w-full rounded-xl border border-white/10 bg-[#0F172A] px-4 py-3 text-[#F8FAFC] placeholder-[#475569] outline-none transition focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/30"
								id="custom-field-input"
				bind:value={custom_field_value}
								placeholder="Antwort eingeben…"
							/>
						</div>
					{/if}

					<button
						type="submit"
						disabled={username?.length <= 3}
						onclick={setUsername}
						class="mt-2 w-full rounded-xl bg-[#6366F1] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-[#5558E3] disabled:cursor-not-allowed disabled:opacity-40"
					>
						{$t('words.submit')}
					</button>
				</form>
			</div>

			<p class="mt-4 text-center text-xs text-[#475569]">
				PIN: <span class="font-mono font-bold text-[#6366F1]">{game_pin}</span>
			</p>
		</div>
	</div>
{/if}

<div
	id="hcaptcha"
	class="h-captcha"
	data-sitekey={hcaptchaSitekey}
	data-size="invisible"
	data-theme="dark"
></div>
