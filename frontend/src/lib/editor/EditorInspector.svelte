<script>
  export let quiz;
  export let selectedQuestion;
</script>

<div class="p-4 space-y-4">

  <div class="card">
    <div class="label">Quiz Titel</div>
    <input class="input" bind:value={quiz.title} />
  </div>

  {#if selectedQuestion}
    <div class="card">
      <div class="label">Frage</div>
      <input class="input" bind:value={selectedQuestion.title} />
      <textarea class="input mt-2" bind:value={selectedQuestion.description}></textarea>
    </div>
  {/if}

</div>
