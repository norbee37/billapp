<template>
  <div class="space-y-2">
    <!-- For single items or showing earliest expiring in group -->
    <div v-if="!showBreakdown" class="flex items-center gap-3">
      <div class="flex-1">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs font-semibold" :class="statusColor" style="font-family: 'Inter', sans-serif;">
            {{ statusText }}
          </span>
          <span class="text-xs font-bold" :class="statusColor">
            {{ daysText }}
          </span>
        </div>
        <!-- Progress bar -->
        <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            class="h-full transition-all duration-300 rounded-full"
            :class="barColor"
            :style="{ width: `${percentage}%` }"
          ></div>
        </div>
      </div>
      <div class="flex-shrink-0">
        <UIcon :name="statusIcon" class="text-xl" :class="statusColor" />
      </div>
    </div>

    <!-- For grouped items - show breakdown -->
    <div v-if="showBreakdown && breakdown" class="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <!-- Earliest expiring item (most urgent) -->
      <div class="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
        <UIcon name="i-heroicons-exclamation-triangle" class="text-lg text-orange-600" />
        <span class="text-xs font-semibold text-gray-700" style="font-family: 'Inter', sans-serif;">
          Earliest expires:
        </span>
        <span class="text-xs font-bold ml-auto" :class="statusColor">
          {{ daysText }}
        </span>
      </div>
      
      <!-- Breakdown of all items -->
      <div class="flex flex-wrap gap-2 mt-2">
        <div v-if="breakdown.fresh > 0" class="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-md text-xs font-bold">
          <UIcon name="i-heroicons-check-circle" class="text-xs" />
          {{ breakdown.fresh }} fresh
        </div>
        <div v-if="breakdown.useSoon > 0" class="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-md text-xs font-bold">
          <UIcon name="i-heroicons-clock" class="text-xs" />
          {{ breakdown.useSoon }} use soon
        </div>
        <div v-if="breakdown.expiring > 0" class="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-md text-xs font-bold">
          <UIcon name="i-heroicons-exclamation-triangle" class="text-xs" />
          {{ breakdown.expiring }} expiring
        </div>
        <div v-if="breakdown.expired > 0" class="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-md text-xs font-bold">
          <UIcon name="i-heroicons-x-circle" class="text-xs" />
          {{ breakdown.expired }} expired
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  expiresAt: Date | undefined
  showBreakdown?: boolean
  breakdown?: {
    fresh: number
    useSoon: number
    expiring: number
    expired: number
  }
}>()

// Force re-calculation every minute for live updates
const currentTime = ref(new Date())
let intervalId: NodeJS.Timeout | null = null

onMounted(() => {
  // Update current time every minute
  intervalId = setInterval(() => {
    currentTime.value = new Date()
  }, 60000) // 60 seconds
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

// Calculate days until expiration (reactive to currentTime)
const daysUntilExpiration = computed(() => {
  if (!props.expiresAt) return null
  const now = currentTime.value
  const expiry = new Date(props.expiresAt)
  const diffTime = expiry.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

// Determine freshness status
const status = computed(() => {
  const days = daysUntilExpiration.value
  if (days === null) return 'unknown'
  if (days < 0) return 'expired'
  if (days === 0) return 'today'
  if (days === 1) return 'tomorrow'
  if (days <= 3) return 'expiring'
  if (days <= 7) return 'useSoon'
  return 'fresh'
})

const statusText = computed(() => {
  switch (status.value) {
    case 'expired': return 'EXPIRED'
    case 'today': return 'EXPIRES TODAY!'
    case 'tomorrow': return 'EXPIRES TOMORROW'
    case 'expiring': return 'EXPIRING SOON'
    case 'useSoon': return 'USE SOON'
    case 'fresh': return 'FRESH'
    default: return 'NO EXPIRATION'
  }
})

const daysText = computed(() => {
  const days = daysUntilExpiration.value
  if (days === null) return ''
  if (days < 0) return `${Math.abs(days)}d ago`
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return `${days} days`
})

const statusColor = computed(() => {
  switch (status.value) {
    case 'expired': return 'text-gray-600'
    case 'today':
    case 'tomorrow':
    case 'expiring': return 'text-red-600'
    case 'useSoon': return 'text-orange-600'
    case 'fresh': return 'text-green-600'
    default: return 'text-gray-600'
  }
})

const barColor = computed(() => {
  switch (status.value) {
    case 'expired': return 'bg-gray-400'
    case 'today':
    case 'tomorrow':
    case 'expiring': return 'bg-red-500'
    case 'useSoon': return 'bg-orange-500'
    case 'fresh': return 'bg-green-500'
    default: return 'bg-gray-300'
  }
})

const statusIcon = computed(() => {
  switch (status.value) {
    case 'expired': return 'i-heroicons-x-circle'
    case 'today':
    case 'tomorrow':
    case 'expiring': return 'i-heroicons-exclamation-triangle'
    case 'useSoon': return 'i-heroicons-clock'
    case 'fresh': return 'i-heroicons-check-circle'
    default: return 'i-heroicons-question-mark-circle'
  }
})

// Calculate percentage for progress bar (inverse - more days = fuller bar)
const percentage = computed(() => {
  const days = daysUntilExpiration.value
  if (days === null || days < 0) return 0
  // Assume max 14 days for full bar
  const maxDays = 14
  return Math.min(100, (days / maxDays) * 100)
})
</script>
