import { writable, derived } from 'svelte/store';

export type Question = {
	id: string;
	text: string;
	answers: string[];
	correct?: number;
};

export type Quiz = {
	id?: string;
	title: string;
	questions: Question[];
};

type EditorState = {
	editId: string | null;
	quiz: Quiz;
	selectedQuestionId: string | null;
	loading: boolean;
};

const initialState: EditorState = {
	editId: null,
	quiz: {
		title: '',
		questions: []
	},
	selectedQuestionId: null,
	loading: false
};

function createEditorStore() {
	const { subscribe, set, update } = writable<EditorState>(initialState);

	return {
		subscribe,

		// Session initialisieren
		init: (editId: string, quiz: Quiz) =>
			update((s) => ({
				...s,
				editId,
				quiz,
				loading: false
			})),

		// Quiz updaten
		setQuiz: (quiz: Quiz) =>
			update((s) => ({ ...s, quiz })),

		// Question selection
		selectQuestion: (id: string) =>
			update((s) => ({ ...s, selectedQuestionId: id })),

		// Question edit
		updateQuestion: (id: string, patch: Partial<Question>) =>
			update((s) => {
				const questions = s.quiz.questions.map((q) =>
					q.id === id ? { ...q, ...patch } : q
				);

				return {
					...s,
					quiz: { ...s.quiz, questions }
				};
			}),

		// Reset
		reset: () => set(initialState)
	};
}

export const editorStore = createEditorStore();

// Derived state (optional)
export const selectedQuestion = derived(editorStore, ($s) =>
	$s.quiz.questions.find((q) => q.id === $s.selectedQuestionId)
);
