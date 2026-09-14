<script setup lang="ts">
import type { Plan } from '@smartskip/shared'
import PlanCard from './PlanCard.vue'

defineProps<{
  plans: Plan[]
  loading: boolean
  error: string | null
}>()
</script>

<template>
  <section class="panel">
    <header class="panel__header">
      <h2>Your plans</h2>
      <span class="panel__count">{{ plans.length }}</span>
    </header>

    <p v-if="loading" class="panel__state">Loading…</p>
    <p v-else-if="error" class="panel__state panel__state--error">{{ error }}</p>
    <p v-else-if="!plans.length" class="panel__state">Nothing planned.</p>

    <div v-else class="plan-list">
      <PlanCard v-for="plan in plans" :key="plan.id" :plan="plan" />
    </div>
  </section>
</template>
