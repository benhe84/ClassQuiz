<!--
SPDX-FileCopyrightText: 2023 Marlon W (Mawoka)
SPDX-License-Identifier: MPL-2.0
-->

<script lang="ts">
	import { socket } from '$lib/socket';
	import { getLocalization } from '$lib/i18n';
	import { navbarVisible } from '$lib/stores.svelte.ts';
	import { footerVisible } from '$lib/stores.svelte';
	import SomeAdminScreen from '$lib/admin.svelte';
	import GameNotStarted from '$lib/play/admin/game_not_started.svelte';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import FinalResults from '$lib/play/admin/final_results.svelte';
	import { page } from '$app/state';
	import { SocketGameControls } from '$lib/play/admin/socket_game_controls.ts';
	import type { IGameState } from '$lib/play/admin/game_state.ts';
	import { QuizQuestionType, type QuizData } from '$lib/quiz_types';
	import type { Player, PlayerAnswer } from '$lib/admin';
	import { tinykeys } from '$lib/tinykeys';

	footerVisible.visible = false;
	navbarVisible.visible = false;

	const { t } = getLocalization();

	interface Props {
		data: any;
	}

	class GameState implements IGameState {
		public game_id: string;
		public players: Player[];
		public player_scores: Record<string, number>;
		public selected_question: number;
		public timer_res: string;
		public question_results: any;
		public answer_count: number;
		public shown_question_now: number;
		public final_results: Array<null> | Array<Array<PlayerAnswer>>;
		public game_started: boolean;
		public quiz_data: QuizData;
		public control_visible: boolean;

		constructor(game_id: string) {
			this.game_id = game_id;
			this.players = $state([]);
			this.player_scores = $state({});
			this.selected_question = $state(-1);
			this.timer_res = $state(undefined);
			this.quiz_data = $state(null);
			this.control_visible = $state(true);
			this.shown_question_now = $state(-1);
			this.final_results = $state([null]);
			this.game_started = $state(false);
			this.question_results = $state(null);
			this.answer_count = $state(0);
		}

		is_game_ready_to_start() {
			return !this.game_started && this.players.length > 0;
		}
		is_game_starting() {
			return this.game_started && this.selected_question === -1;
		}
		is_active_question_last_question() {
			return this.selected_question + 1 === this.quiz_data.questions.length;
		}
		is_question_results_visible() {
			return this.timer_res === '0' && this.question_results !== null;
		}
		is_active_question_slide() {
			return (
				this.quiz_data?.questions?.[this.selected_question]?.type === QuizQuestionType.SLIDE
			);
		}
		is_question_ended() {
			return (
				this.timer_res === '0' &&
				this.question_results === null &&
				this.selected_question !== -1
			);
		}
		is_question_still_ongoing() {
			return this.timer_res !== '0' && this.selected_question !== -1;
		}
	}

	let { data }: Props = $props();
	let game_mode = $state();
	let { auto_connect, game_token } = $state(data);
	let show_final_results = $derived(
		game_state.game_started &&
			game_state.selected_question === game_state.quiz_data?.questions?.length
	);
	const game_pin = data.game_pin;

	let errorMessage = $state('');
	let success = $state(false);
	let export_token = $state<string | undefined>(undefined);
	let results_saved = $state(false);

	let warnToLeave = true;

	const socket_game_controls = new SocketGameControls(socket);
	let game_state = $state(new GameState(game_token));

	const connect = async () => {
		socket.emit('register_as_admin', { game_pin, game_id: game_token });

		const res = await fetch(`/api/v1/quiz/play/check_captcha/${game_pin}`);
		const json = await res.json();
		game_mode = json.game_mode;
	};

	onMount(() => {
		if (auto_connect) connect();
		tinykeys(window, { Enter: next_action, Space: next_action });
	});

	socket.on('registered_as_admin', (data) => {
		game_state.quiz_data = JSON.parse(data['game']);
		success = true;
	});

	socket.on('player_joined', (p) => {
		game_state.players = [...game_state.players, p];
	});

	socket.on('start_game', () => {
		game_state.game_started = true;
	});

	socket.on('control_visibility', (data) => {
		game_state.control_visible = data.visible;
	});

	socket.on('export_token', (token) => {
		warnToLeave = false;
		export_token = token;
		setTimeout(() => (warnToLeave = true), 200);
	});

	socket.on('results_saved_successfully', () => {
		results_saved = true;
	});

	const confirmUnload = (event: BeforeUnloadEvent) => {
		if (!warnToLeave) return;
		event.preventDefault();
		event.returnValue = '';
	};

	const request_answer_export = () => {
		socket.emit('get_export_token');
	};

	const save_quiz = () => {
		socket.emit('save_quiz');
	};

	const next_action = () => {
		if (
			game_state.is_active_question_last_question() &&
			(game_state.is_question_results_visible() || game_state.is_active_question_slide())
		) {
			socket_game_controls.get_final_results();
		} else if (
			game_state.is_game_starting() ||
			game_state.is_question_results_visible() ||
			game_state.is_active_question_slide()
		) {
			socket_game_controls.set_question_number(game_state.selected_question + 1);
		} else if (game_state.is_question_still_ongoing()) {
			socket_game_controls.show_solutions();
			game_state.timer_res = '0';
		} else if (game_state.is_question_ended()) {
			socket_game_controls.get_question_results(game_token, game_state.shown_question_now);
		}
	};
</script>

<svelte:window onbeforeunload={confirmUnload} />

<div class="min-h-screen min-w-full">
	{#if show_final_results}
		{#if game_state.control_visible}
			<div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
				{#if export_token === undefined}
					<button on:click={request_answer_export}> Export anfordern </button>
				{:else}
					<a
						href="/api/v1/quiz/export_data/{export_token}?ts={Date.now()}&game_pin={game_pin}"
						target="_blank"
					>
						Download Export
					</a>
				{/if}

				<button on:click={save_quiz} disabled={results_saved}>
					{results_saved ? 'Gespeichert' : 'Speichern'}
				</button>
			</div>
		{/if}

		<FinalResults bind:data={game_state.player_scores} {show_final_results} />
	{/if}

	{#if !success}
		{#if errorMessage}
			<div class="flex min-h-screen items-center justify-center">
				{errorMessage}
			</div>
		{/if}
	{:else if !game_state.game_started}
		<GameNotStarted
			{game_pin}
			bind:game_state
			{socket_game_controls}
			cqc_code={page.url.searchParams.get('cqc_code')}
		/>
	{:else}
		<SomeAdminScreen {game_token} bind:game_state />
	{/if}
</div>
