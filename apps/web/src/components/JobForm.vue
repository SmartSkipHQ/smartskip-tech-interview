<script setup lang="ts">
/**
 * TODO(candidate): this is where jobs get created and edited.
 *
 * `api.createJob` and `api.updateJob` in `src/api/client.ts` are stubs, and so
 * are the matching routes in the API. Wire the whole path through.
 *
 * Worth deciding as you go:
 *   - an address is easier to type than a lat/lon pair; where does the
 *     conversion happen? (Open-Meteo has a free geocoding endpoint)
 *   - what does the user see while the request is in flight, and if it fails?
 *   - how does the list know something changed?
 */
</script>

<template>
  <section class="panel panel--placeholder">
    <header class="panel__header">
      <h2>New job</h2>
    </header>

    <p class="panel__state">
      Not built yet. See the TODO in
      <code>src/components/JobForm.vue</code>.
    </p>
  </section>
</template>
