<script lang="ts">
	import { onMount } from 'svelte';
	import { editorStore } from './editorStore';

	import EditorSidebar from './EditorSidebar.svelte';
	import EditorCanvas from './EditorCanvas.svelte';
	import EditorInspector from './EditorInspector.svelte';

	export let edit_id: string | null = null;

	onMount(async () => {
		if (!edit_id) return;

		const res = await fetch(`/api/v1/editor/init?edit_id=${edit_id}`);
		const json = await res.json();

		editorStore.init(edit_id, json.quiz);
	});
</script>

<div class="editor-layout">
	<EditorSidebar />
	<EditorCanvas />
	<EditorInspector />
</div>

<style>
.editor-layout {
	display: grid;
	grid-template-columns: 260px 1fr 320px;
	height: 100vh;
}
</style>
