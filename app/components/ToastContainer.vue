<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-3 pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto bg-white rounded-xl shadow-2xl border-2 overflow-hidden min-w-[320px] max-w-md"
        :class="{
          'border-green-200': toast.color === 'green',
          'border-red-200': toast.color === 'red',
          'border-blue-200': toast.color === 'blue',
          'border-yellow-200': toast.color === 'yellow'
        }"
      >
        <div class="flex items-start gap-3 p-4">
          <div 
            class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            :class="{
              'bg-green-100': toast.color === 'green',
              'bg-red-100': toast.color === 'red',
              'bg-blue-100': toast.color === 'blue',
              'bg-yellow-100': toast.color === 'yellow'
            }"
          >
            <UIcon 
              :name="toast.icon || getDefaultIcon(toast.color)" 
              class="text-xl"
              :class="{
                'text-green-600': toast.color === 'green',
                'text-red-600': toast.color === 'red',
                'text-blue-600': toast.color === 'blue',
                'text-yellow-600': toast.color === 'yellow'
              }"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h4 
              class="font-bold text-gray-900 mb-0.5" 
              style="font-family: 'Poppins', sans-serif;"
            >
              {{ toast.title }}
            </h4>
            <p 
              v-if="toast.description"
              class="text-sm text-gray-600" 
              style="font-family: 'Inter', sans-serif;"
            >
              {{ toast.description }}
            </p>
          </div>
          <button
            @click="removeToast(toast.id)"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <UIcon name="i-heroicons-x-mark" class="text-lg" />
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
interface Toast {
  id: number
  title: string
  description?: string
  color?: 'green' | 'red' | 'blue' | 'yellow'
  icon?: string
  timeout?: number
}

const toasts = ref<Toast[]>([])
let nextId = 1

const getDefaultIcon = (color: string) => {
  switch (color) {
    case 'green': return 'i-heroicons-check-circle'
    case 'red': return 'i-heroicons-exclamation-circle'
    case 'blue': return 'i-heroicons-information-circle'
    case 'yellow': return 'i-heroicons-exclamation-triangle'
    default: return 'i-heroicons-information-circle'
  }
}

const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = nextId++
  toasts.value.push({ id, ...toast })
  
  const timeout = toast.timeout || 3000
  setTimeout(() => {
    removeToast(id)
  }, timeout)
}

const removeToast = (id: number) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Expose addToast to be used globally
defineExpose({ addToast })

// Make it available globally
if (process.client) {
  (window as any).__toastInstance = { addToast }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
