<script>
  export let quiz;
  export let selectedQuestion;
  export let onUpdate;
</script>

<div class="space-y-4">

  {#each quiz.questions as q}
    <div
      class="card cursor-pointer"
      on:click={() => onUpdate.selectQuestion(q)}
    >
      <div class="font-bold">{q.title}</div>
      <div class="text-sm opacity-70">{q.description}</div>
    </div>
  {/each}

</div>
