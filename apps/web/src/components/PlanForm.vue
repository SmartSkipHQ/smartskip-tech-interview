<script setup lang="ts">
/**
 * TODO(candidate): this is where plans get added and edited.
 *
 * `api.createPlan` and `api.updatePlan` in `src/api/client.ts` are stubs, and
 * so are the matching routes in the API. Wire the whole path through.
 *
 * Worth deciding as you go:
 *   - what does the user see while the request is in flight, and if it fails?
 *   - how does the list know something changed?
 *   - a free-text city is easy to type and easy to get wrong; whose problem is
 *     that, the form's or the weather service's?
 */
</script>

<template>
  <section class="panel panel--placeholder">
    <header class="panel__header">
      <h2>Add a plan</h2>
    </header>

    <p class="panel__state">
      Not built yet. See the TODO in
      <code>src/components/PlanForm.vue</code>.
    </p>
  </section>
</template>
