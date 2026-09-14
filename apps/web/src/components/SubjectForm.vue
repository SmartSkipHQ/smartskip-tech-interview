<script setup lang="ts">
/**
 * TODO(candidate): this is where cases get opened and edited.
 *
 * `api.createSubject` and `api.updateSubject` in `src/api/client.ts` are stubs,
 * and so are the matching routes in the API. Wire the whole path through.
 *
 * Worth deciding as you go:
 *   - which fields are genuinely required to open a case? a name and nothing
 *     else is a real scenario here
 *   - what does the user see while the request is in flight, and if it fails?
 *   - how does the list know something changed?
 */
</script>

<template>
  <section class="panel panel--placeholder">
    <header class="panel__header">
      <h2>New case</h2>
    </header>

    <p class="panel__state">
      Not built yet. See the TODO in
      <code>src/components/SubjectForm.vue</code>.
    </p>
  </section>
</template>
