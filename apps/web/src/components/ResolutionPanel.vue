<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Resolution } from '@smartskip/shared'
import { formatAddress } from '@smartskip/shared'
import { api } from '@/api/client'

const props = defineProps<{ subjectId: string }>()

const resolution = ref<Resolution | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

async function load(): Promise<void> {
  loading.value = true
  error.value = null

  try {
    resolution.value = await api.getResolution(props.subjectId)
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Failed to resolve'
  } finally {
    loading.value = false
  }
}

/** Green above 75, amber above 50, red below. */
function confidenceClass(confidence: number): string {
  if (confidence >= 75) return 'score--high'
  if (confidence >= 50) return 'score--mid'
  return 'score--low'
}

watch(() => props.subjectId, load, { immediate: true })
</script>

<template>
  <section class="panel">
    <header class="panel__header">
      <h2>Who we think this is</h2>
      <button class="button" :disabled="loading" @click="load">Re-run</button>
    </header>

    <p v-if="loading" class="panel__state">Resolving…</p>
    <p v-else-if="error" class="panel__state panel__state--error">{{ error }}</p>

    <template v-else-if="resolution">
      <p v-if="!resolution.identities.length" class="panel__state">
        No records to work with, so there is nothing to resolve.
      </p>

      <article
        v-for="identity in resolution.identities"
        :key="identity.recordIds.join('-')"
        class="identity"
      >
        <header class="identity__header">
          <h3 class="identity__label">{{ identity.label }}</h3>
          <span class="score" :class="confidenceClass(identity.confidence)">
            {{ identity.confidence }}%
          </span>
        </header>

        <dl class="identity__facts">
          <div>
            <dt>Address</dt>
            <dd>
              {{ identity.bestAddress ? formatAddress(identity.bestAddress) : 'Unknown' }}
            </dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{{ identity.bestPhone ?? 'Unknown' }}</dd>
          </div>
          <div>
            <dt>Built from</dt>
            <dd>{{ identity.recordIds.join(', ') }}</dd>
          </div>
        </dl>

        <ul v-if="identity.flags.length" class="flags">
          <li
            v-for="flag in identity.flags"
            :key="flag.code"
            class="flag"
            :class="`flag--${flag.severity}`"
          >
            {{ flag.message }}
          </li>
        </ul>

        <p class="identity__rationale">{{ identity.rationale }}</p>
      </article>

      <p class="identity__source">
        Resolved by the <strong>{{ resolution.source }}</strong> provider, which groups
        records by surname and little else. It does not read the vendor errors and it
        cannot tell two people with the same name apart.
      </p>
    </template>
  </section>
</template>
