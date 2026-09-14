<script setup lang="ts">
import type { SearchSubject } from '@smartskip/shared'

defineProps<{
  subjects: SearchSubject[]
  selectedId: string | null
  loading: boolean
  error: string | null
}>()

defineEmits<{ select: [id: string] }>()
</script>

<template>
  <section class="panel">
    <header class="panel__header">
      <h2>Cases</h2>
      <span class="panel__count">{{ subjects.length }}</span>
    </header>

    <p v-if="loading" class="panel__state">Loading…</p>
    <p v-else-if="error" class="panel__state panel__state--error">{{ error }}</p>
    <p v-else-if="!subjects.length" class="panel__state">No open cases.</p>

    <ul v-else class="case-list">
      <li v-for="subject in subjects" :key="subject.id">
        <button
          class="case"
          :class="{ 'case--active': subject.id === selectedId }"
          type="button"
          @click="$emit('select', subject.id)"
        >
          <span class="case__top">
            <span class="case__name">{{ subject.fullName }}</span>
            <span class="badge" :class="`badge--${subject.status}`">
              {{ subject.status }}
            </span>
          </span>
          <span class="case__meta">
            {{ subject.reference }}
            <template v-if="subject.lastKnownAddress">
              · {{ subject.lastKnownAddress.city }}, {{ subject.lastKnownAddress.state }}
            </template>
          </span>
        </button>
      </li>
    </ul>
  </section>
</template>
