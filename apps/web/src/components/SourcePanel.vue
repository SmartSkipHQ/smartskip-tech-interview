<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { SourceResult } from '@smartskip/shared'
import { SOURCE_LABELS } from '@smartskip/shared'
import { api } from '@/api/client'
import RecordCard from './RecordCard.vue'

const props = defineProps<{ subjectId: string }>()

const sources = ref<SourceResult[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

const total = computed(() =>
  sources.value.reduce((count, source) => count + source.records.length, 0),
)

async function load(): Promise<void> {
  loading.value = true
  error.value = null

  try {
    sources.value = await api.getRecords(props.subjectId)
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Failed to query vendors'
  } finally {
    loading.value = false
  }
}

watch(() => props.subjectId, load, { immediate: true })
</script>

<template>
  <section class="panel">
    <header class="panel__header">
      <h2>What the vendors say</h2>
      <span class="panel__count">{{ total }}</span>
    </header>

    <p v-if="loading" class="panel__state">Querying sources…</p>
    <p v-else-if="error" class="panel__state panel__state--error">{{ error }}</p>

    <template v-else>
      <div v-for="source in sources" :key="source.source" class="source">
        <header class="source__header">
          <span class="source__name">{{ SOURCE_LABELS[source.source] }}</span>
          <span class="source__timing">{{ source.elapsedMs }} ms</span>
        </header>

        <p v-if="source.error" class="source__error">{{ source.error }}</p>
        <p v-else-if="!source.records.length" class="source__empty">No hits.</p>

        <div v-else class="source__records">
          <RecordCard v-for="record in source.records" :key="record.id" :record="record" />
        </div>
      </div>
    </template>
  </section>
</template>
