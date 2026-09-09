<script setup lang="ts">
import type { Job } from '@smartskip/shared'
import JobCard from './JobCard.vue'

defineProps<{
  jobs: Job[]
  loading: boolean
  error: string | null
}>()
</script>

<template>
  <section class="panel">
    <header class="panel__header">
      <h2>Jobs</h2>
      <span class="panel__count">{{ jobs.length }}</span>
    </header>

    <p v-if="loading" class="panel__state">Loading…</p>
    <p v-else-if="error" class="panel__state panel__state--error">{{ error }}</p>
    <p v-else-if="!jobs.length" class="panel__state">Nothing booked.</p>

    <div v-else class="job-list">
      <JobCard v-for="job in jobs" :key="job.id" :job="job" />
    </div>
  </section>
</template>
