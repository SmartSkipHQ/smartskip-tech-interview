<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Plan, PlanAdvice } from '@smartskip/shared'
import { VERDICT_LABELS } from '@smartskip/shared'
import { api } from '@/api/client'
import { dayLabel } from '@/utils/format'

const props = defineProps<{ plan: Plan }>()

const result = ref<PlanAdvice | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

async function load(): Promise<void> {
  loading.value = true
  error.value = null

  try {
    result.value = await api.getAdvice(props.plan.id)
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Failed to load advice'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <article class="plan">
    <header class="plan__header">
      <div>
        <h3 class="plan__title">{{ plan.title }}</h3>
        <p class="plan__where">{{ dayLabel(plan.date) }} · {{ plan.city }}</p>
      </div>

      <span
        v-if="result"
        class="verdict"
        :class="`verdict--${result.advice.verdict}`"
      >
        {{ VERDICT_LABELS[result.advice.verdict] }}
      </span>
    </header>

    <p v-if="loading" class="plan__state">Checking the forecast…</p>
    <p v-else-if="error" class="plan__state plan__state--error">{{ error }}</p>

    <template v-else-if="result">
      <div class="weather">
        <span class="weather__summary">{{ result.forecast.summary }}</span>
        <span class="weather__stat">{{ Math.round(result.forecast.highC) }}° /
          {{ Math.round(result.forecast.lowC) }}°</span>
        <span class="weather__stat">{{ result.forecast.chanceOfRainPct }}% rain</span>
        <span class="weather__stat">{{ Math.round(result.forecast.windKph) }} km/h wind</span>
        <span v-if="result.forecast.source === 'sample'" class="chip" title="Not a real forecast">
          sample
        </span>
      </div>

      <p class="plan__advice">{{ result.advice.reason }}</p>

      <p v-if="result.advice.suggestedDate" class="plan__suggestion">
        Better on {{ dayLabel(result.advice.suggestedDate) }}.
      </p>

      <p v-if="plan.notes" class="plan__notes">{{ plan.notes }}</p>
    </template>
  </article>
</template>
