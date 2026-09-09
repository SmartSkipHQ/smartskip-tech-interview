<script setup lang="ts">
import { computed } from 'vue'
import type { Job } from '@smartskip/shared'

const props = defineProps<{ job: Job }>()

const time = computed(() =>
  new Date(props.job.scheduledFor).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  }),
)
</script>

<template>
  <article class="job-card">
    <header class="job-card__header">
      <span class="job-card__time">{{ time }}</span>
      <span class="badge" :class="`badge--${job.status}`">
        {{ job.status.replace('_', ' ') }}
      </span>
    </header>

    <h3 class="job-card__title">{{ job.customerName }}</h3>
    <p class="job-card__address">{{ job.address }}</p>

    <footer class="job-card__meta">
      <span>{{ job.reference }}</span>
      <span>{{ job.type }}</span>
      <span>{{ job.skipSize }} yd</span>
    </footer>

    <p v-if="job.notes" class="job-card__notes">{{ job.notes }}</p>
  </article>
</template>
