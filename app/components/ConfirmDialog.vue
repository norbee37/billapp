<template>
  <div>
    <!-- Overlay -->
    <Transition name="fade">
      <div 
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        @click.self="onCancel"
      >
        <!-- Modal Card -->
        <div 
          class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all"
          @click.stop
        >
          <!-- Header -->
          <div class="flex items-center gap-4 p-6 border-b border-gray-100">
            <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <UIcon name="i-heroicons-exclamation-triangle" class="text-red-600 text-2xl" />
            </div>
            <h3 class="text-xl font-bold text-gray-900" style="font-family: 'Poppins', sans-serif;">
              {{ title }}
            </h3>
          </div>
          
          <!-- Body -->
          <div class="p-6" style="font-family: 'Inter', sans-serif;">
            <p class="text-gray-700 text-base" v-html="message"></p>
            <p class="text-gray-600 text-sm mt-2">This action cannot be undone.</p>
          </div>
          
          <!-- Footer -->
          <div class="flex justify-end gap-3 p-6 bg-gray-50 border-t border-gray-100">
            <button
              @click="onCancel"
              class="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition-all font-medium"
              style="font-family: 'Inter', sans-serif;"
            >
              Cancel
            </button>
            <button
              @click="onConfirm"
              class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all font-semibold flex items-center gap-2"
              style="font-family: 'Poppins', sans-serif;"
            >
              <UIcon name="i-heroicons-trash" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
  title: string
  message: string
}>()

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()

const onCancel = () => {
  emit('cancel')
}

const onConfirm = () => {
  emit('confirm')
}

// Close on escape key
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) {
      onCancel()
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
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
