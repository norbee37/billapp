<template>
  <div>
    <!-- Overlay -->
    <Transition name="fade">
      <div 
        v-if="isOpen"
        class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        @click.self="onClose"
      >
        <!-- Modal Card -->
        <div 
          class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden transform transition-all"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b-2 border-gray-100 bg-gradient-to-r from-yellow-50 to-white">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-squares-2x2" class="text-white text-2xl" />
              </div>
              <div>
                <h3 class="text-2xl font-bold text-blue-900" style="font-family: 'Poppins', sans-serif;">
                  {{ itemName }}
                </h3>
                <div class="flex items-center gap-3 mt-1">
                  <p class="text-sm text-gray-600" style="font-family: 'Inter', sans-serif;">
                    {{ entries.length }} {{ entries.length === 1 ? 'entry' : 'entries' }}
                  </p>
                  <span class="text-gray-400">•</span>
                  <p class="text-sm font-semibold text-gray-700" style="font-family: 'Inter', sans-serif;">
                    {{ totalQuantity }} {{ entries[0]?.unit || 'pcs' }}
                  </p>
                  <span class="text-gray-400" v-if="totalValue > 0">•</span>
                  <p v-if="totalValue > 0" class="text-sm font-semibold text-green-600" style="font-family: 'Inter', sans-serif;">
                    €{{ totalValue.toFixed(2) }}
                  </p>
                </div>
              </div>
            </div>
            <button
              @click="onClose"
              class="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-500 hover:text-gray-700"
            >
              <UIcon name="i-heroicons-x-mark" class="text-2xl" />
            </button>
          </div>
          
          <!-- Scrollable Content -->
          <div class="overflow-y-auto p-6 space-y-4" style="max-height: calc(80vh - 100px);">
            <div
              v-for="(entry, index) in entries"
              :key="entry.id"
              class="bg-gradient-to-r from-blue-50 to-white rounded-2xl p-5 border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              <!-- Entry Number and Delete -->
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm" style="font-family: 'Poppins', sans-serif;">
                    {{ index + 1 }}
                  </div>
                  <h4 class="font-bold text-gray-900 text-lg" style="font-family: 'Poppins', sans-serif;">
                    Entry #{{ index + 1 }}
                  </h4>
                </div>
                <button
                  @click="$emit('delete', entry.id)"
                  class="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-medium text-sm transition-colors flex items-center gap-2"
                  style="font-family: 'Inter', sans-serif;"
                >
                  <UIcon name="i-heroicons-trash" class="text-base" />
                  Delete
                </button>
              </div>

              <!-- Divider -->
              <div class="border-t-2 border-blue-100 mb-4"></div>

              <!-- Details -->
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UIcon name="i-heroicons-cube" class="text-blue-600 text-lg" />
                  </div>
                  <div style="font-family: 'Inter', sans-serif;">
                    <p class="text-xs text-gray-500 font-medium">Quantity</p>
                    <p class="text-base font-bold text-gray-900">{{ entry.quantity }} {{ entry.unit || 'pcs' }}</p>
                  </div>
                </div>

                <div v-if="entry.price" class="flex items-center gap-3">
                  <div class="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UIcon name="i-heroicons-banknotes" class="text-green-600 text-lg" />
                  </div>
                  <div style="font-family: 'Inter', sans-serif;">
                    <p class="text-xs text-gray-500 font-medium">Price</p>
                    <p class="text-base font-bold text-gray-900">€{{ entry.price.toFixed(2) }}</p>
                  </div>
                </div>

                <div v-if="entry.category" class="flex items-center gap-3">
                  <div class="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UIcon name="i-heroicons-tag" class="text-purple-600 text-lg" />
                  </div>
                  <div style="font-family: 'Inter', sans-serif;">
                    <p class="text-xs text-gray-500 font-medium">Category</p>
                    <p class="text-base font-bold text-gray-900">{{ entry.category }}</p>
                  </div>
                </div>

                <div v-if="entry.wasteCategory" class="flex items-center gap-3">
                  <div class="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UIcon name="i-heroicons-trash" class="text-gray-600 text-lg" />
                  </div>
                  <div style="font-family: 'Inter', sans-serif;">
                    <p class="text-xs text-gray-500 font-medium">Waste Category</p>
                    <p class="text-base font-bold text-gray-900">{{ entry.wasteCategory }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UIcon name="i-heroicons-calendar" class="text-gray-600 text-lg" />
                  </div>
                  <div style="font-family: 'Inter', sans-serif;">
                    <p class="text-xs text-gray-500 font-medium">Added</p>
                    <p class="text-base font-bold text-gray-900">{{ formatDate(entry.addedAt) }}</p>
                  </div>
                </div>

                <div v-if="entry.expiresAt" class="flex items-center gap-3">
                  <div class="w-9 h-9 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UIcon name="i-heroicons-clock" class="text-yellow-600 text-lg" />
                  </div>
                  <div style="font-family: 'Inter', sans-serif;">
                    <p class="text-xs text-gray-500 font-medium">Expires</p>
                    <p class="text-base font-bold text-gray-900">{{ formatDate(entry.expiresAt) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { StockItem } from '~/types'

const props = defineProps<{
  isOpen: boolean
  itemName: string
  entries: StockItem[]
}>()

const emit = defineEmits<{
  close: []
  delete: [id: string]
}>()

const onClose = () => {
  emit('close')
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

// Calculate totals
const totalQuantity = computed(() => {
  return props.entries.reduce((sum, entry) => sum + entry.quantity, 0)
})

const totalValue = computed(() => {
  return props.entries.reduce((sum, entry) => sum + (entry.price || 0), 0)
})

// Close on escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) {
      onClose()
    }
  }
  window.addEventListener('keydown', handleEscape)
  onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
