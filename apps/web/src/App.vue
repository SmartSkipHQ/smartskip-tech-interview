<script setup lang="ts">
import { onMounted } from 'vue'
import PlanForm from '@/components/PlanForm.vue'
import PlanList from '@/components/PlanList.vue'
import { usePlans } from '@/composables/usePlans'

const { plans, loading, error, refresh } = usePlans()

onMounted(refresh)
</script>

<template>
  <div class="app">
    <header class="app__header">
      <h1>Is it a good day for that?</h1>
      <p class="app__subtitle">
        Your plans, the weather where they happen, and whether to go ahead.
      </p>
    </header>

    <main class="app__grid">
      <PlanList :plans="plans" :loading="loading" :error="error" />
      <PlanForm />
    </main>
  </div>
</template>
