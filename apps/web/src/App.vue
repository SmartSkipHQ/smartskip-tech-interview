<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { formatAddress } from '@smartskip/shared'
import ResolutionPanel from '@/components/ResolutionPanel.vue'
import SourcePanel from '@/components/SourcePanel.vue'
import SubjectForm from '@/components/SubjectForm.vue'
import SubjectList from '@/components/SubjectList.vue'
import { useSubjects } from '@/composables/useSubjects'

const { subjects, loading, error, refresh } = useSubjects()

const selectedId = ref<string | null>(null)

const selected = computed(
  () => subjects.value.find((subject) => subject.id === selectedId.value) ?? null,
)

onMounted(async () => {
  await refresh()

  // Open on the case actually being worked, not the newest empty one.
  const active = subjects.value.find((subject) => subject.status === 'searching')
  selectedId.value = active?.id ?? subjects.value[0]?.id ?? null
})
</script>

<template>
  <div class="app">
    <header class="app__header">
      <div>
        <h1>SmartSkip Trace</h1>
        <p class="app__subtitle">
          Find the person behind a phone number, across sources that disagree.
        </p>
      </div>

      <div v-if="selected" class="subject-summary">
        <span class="subject-summary__name">{{ selected.fullName }}</span>
        <span class="subject-summary__meta">
          {{ selected.knownPhone ?? 'no number on file' }}
          <template v-if="selected.lastKnownAddress">
            · last known at {{ formatAddress(selected.lastKnownAddress) }}
          </template>
        </span>
      </div>
    </header>

    <main class="app__grid">
      <div class="app__column">
        <SubjectList
          :subjects="subjects"
          :selected-id="selectedId"
          :loading="loading"
          :error="error"
          @select="selectedId = $event"
        />
        <SubjectForm />
      </div>

      <div class="app__column">
        <SourcePanel v-if="selectedId" :subject-id="selectedId" />
      </div>

      <div class="app__column">
        <ResolutionPanel v-if="selectedId" :subject-id="selectedId" />
      </div>
    </main>
  </div>
</template>
