<script setup lang="ts">
import { computed } from 'vue'
import type { SearchRecord } from '@smartskip/shared'
import { formatAddress } from '@smartskip/shared'
import { timeAgo } from '@/utils/format'

const props = defineProps<{ record: SearchRecord }>()

const relatives = computed(() =>
  props.record.relatives
    .map((relative) => `${relative.fullName} (${relative.relation})`)
    .join(', '),
)
</script>

<template>
  <article class="record">
    <header class="record__header">
      <h4 class="record__name">
        {{ record.fullName }}
        <span v-if="record.age" class="record__age">{{ record.age }}</span>
      </h4>
      <span class="record__id">{{ record.id }}</span>
    </header>

    <p v-if="record.address" class="record__address">
      {{ formatAddress(record.address) }}
      <span v-if="record.distanceFromLastKnownKm !== undefined" class="record__distance">
        · {{ Math.round(record.distanceFromLastKnownKm) }} km from last known
      </span>
    </p>
    <p v-else class="record__address record__address--missing">No address reported</p>

    <ul v-if="record.phones.length" class="record__phones">
      <li v-for="phone in record.phones" :key="phone.number">
        <span class="record__number">{{ phone.number }}</span>
        <span class="record__line">{{ phone.lineType }}</span>
        <span
          class="dot"
          :class="{
            'dot--ok': phone.active === true,
            'dot--dead': phone.active === false,
            'dot--unknown': phone.active === null,
          }"
        >
          {{ phone.active === true ? 'active' : phone.active === false ? 'disconnected' : 'unchecked' }}
        </span>
      </li>
    </ul>

    <p v-if="relatives" class="record__relatives">{{ relatives }}</p>

    <footer class="record__footer">Reported {{ timeAgo(record.reportedAt) }}</footer>
  </article>
</template>
