<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BriefingPanel from '@/components/BriefingPanel.vue'
import JobForm from '@/components/JobForm.vue'
import JobList from '@/components/JobList.vue'
import { useJobs } from '@/composables/useJobs'

const { jobs, loading, error, refresh } = useJobs()

const date = ref(new Date().toISOString().slice(0, 10))

const jobsForDate = computed(() =>
  jobs.value.filter((job) => job.scheduledFor.startsWith(date.value)),
)

onMounted(refresh)
</script>

<template>
  <div class="app">
    <header class="app__header">
      <div>
        <h1>SmartSkip Dispatch</h1>
        <p class="app__subtitle">Skip deliveries and collections for one depot.</p>
      </div>

      <label class="app__date">
        <span>Day</span>
        <input v-model="date" type="date" />
      </label>
    </header>

    <main class="app__grid">
      <div class="app__column">
        <JobList :jobs="jobsForDate" :loading="loading" :error="error" />
      </div>

      <div class="app__column">
        <BriefingPanel :date="date" />
        <JobForm />
      </div>
    </main>
  </div>
</template>
