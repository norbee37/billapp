<template>
  <div class="pb-12">
    <UContainer class="py-8">
      <div class="space-y-8">
        <!-- Page Header -->
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <h1 class="text-4xl font-bold text-blue-900 tracking-tight" style="font-family: 'Poppins', sans-serif;">Scan Receipt</h1>
            <p class="text-gray-600 mt-1" style="font-family: 'Inter', sans-serif;">Upload a receipt to extract items</p>
          </div>

          <!-- Provider Selector -->
          <div class="flex-shrink-0">
            <div class="flex items-center gap-2 mb-2">
              <UIcon name="i-heroicons-sparkles" class="text-gray-500 text-sm" />
              <span class="text-sm text-gray-600 font-medium" style="font-family: 'Inter', sans-serif;">Parser:</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in providerOptions"
                :key="option.value"
                @click="selectedProvider = option.value"
                :disabled="option.disabled"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5',
                  selectedProvider === option.value 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : option.disabled
                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
                style="font-family: 'Inter', sans-serif;"
              >
                <UIcon :name="option.icon" class="text-xs" />
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Upload and Results Container (centered) -->
        <div class="max-w-3xl mx-auto space-y-8">
          <!-- Upload Card -->
          <div class="bg-white rounded-3xl shadow-lg border-2 border-gray-200 overflow-hidden">
          <div class="p-8">
            <div 
              class="border-3 border-dashed rounded-2xl p-12 cursor-pointer transition-all"
              :class="{ 
                'border-blue-500 bg-blue-50 scale-[1.02]': isDragging,
                'border-blue-300 bg-blue-50 cursor-not-allowed': uploading,
                'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30': !uploading && !isDragging
              }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              @click="triggerFileInput"
            >
              <!-- Upload Icon -->
              <div class="mb-6 flex justify-center">
                <div v-if="uploading" class="relative inline-block">
                  <div class="absolute inset-0 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" style="width: 60px; height: 60px; margin: -10px;"></div>
                  <UIcon name="i-heroicons-document-text" class="text-4xl text-blue-600" />
                </div>
                <div v-else class="relative inline-block">
                  <UIcon name="i-heroicons-camera" class="text-5xl text-blue-600" />
                  <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-lg"></div>
                </div>
              </div>

              <!-- Upload Text -->
              <div class="text-center">
                <h3 class="text-2xl font-bold text-blue-900 mb-2" style="font-family: 'Poppins', sans-serif;">
                  {{ uploading ? 'Processing your receipt...' : isDragging ? 'Drop it here!' : 'Upload Receipt' }}
                </h3>
                <p class="text-gray-600 mb-4" style="font-family: 'Inter', sans-serif;">
                  {{ uploading ? 'Extracting items from your receipt' : 'Click to browse or drag and drop' }}
                </p>
                <div class="flex items-center justify-center gap-2 mt-4">
                  <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold" style="font-family: 'Inter', sans-serif;">JPG</span>
                  <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold" style="font-family: 'Inter', sans-serif;">PNG</span>
                  <span class="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-semibold" style="font-family: 'Inter', sans-serif;">PDF</span>
                </div>
              </div>

              <input 
                ref="fileInput"
                type="file" 
                accept="image/*,application/pdf"
                class="hidden"
                @change="handleFileSelect"
              />
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="flex items-start gap-4 p-6 bg-red-50 border-t-2 border-red-100">
            <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 flex-shrink-0">
              <UIcon name="i-heroicons-exclamation-circle" class="text-2xl" />
            </div>
            <div class="flex-1">
              <h4 class="text-lg font-bold text-red-900 mb-1" style="font-family: 'Poppins', sans-serif;">Upload Failed</h4>
              <p class="text-red-700" style="font-family: 'Inter', sans-serif;">{{ error }}</p>
            </div>
          </div>
        </div>

        <!-- Parsed Items Section -->
        <div v-if="parsedItems.length > 0" class="bg-white rounded-3xl shadow-lg border-2 border-gray-200 p-8 space-y-6">
          <!-- Section Header -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-gray-100">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <UIcon name="i-heroicons-check-circle" class="text-xl" />
              </div>
              <div>
                <h2 class="text-2xl font-bold text-blue-900" style="font-family: 'Poppins', sans-serif;">Items Found</h2>
                <p class="text-gray-600 text-sm mt-0.5" style="font-family: 'Inter', sans-serif;">{{ parsedItems.length }} items extracted from receipt</p>
              </div>
            </div>
            <UButton 
              @click="addItemsToStock"
              :loading="addingToStock"
              :disabled="addingToStock"
              size="lg"
              class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-yellow-400"
              style="font-family: 'Poppins', sans-serif; font-weight: 600;"
              icon="i-heroicons-check"
            >
              Add to Stock
            </UButton>
          </div>

          <!-- Items List -->
          <div class="space-y-3">
            <div
              v-for="(item, index) in parsedItems" 
              :key="index"
              class="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border-2 border-blue-100 hover:shadow-md transition-all group"
            >
              <div class="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0" style="font-family: 'Poppins', sans-serif;">
                {{ index + 1 }}
              </div>
              <div class="flex-1" style="font-family: 'Inter', sans-serif;">
                <h4 class="font-bold text-gray-900 mb-1" style="font-family: 'Poppins', sans-serif;">{{ getItemName(item) }}</h4>
                <div class="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                  <span class="flex items-center gap-1">
                    <UIcon name="i-heroicons-cube" class="text-sm" />
                    {{ item.quantity }} {{ item.unit || 'pcs' }}
                  </span>
                  <span v-if="item.price" class="flex items-center gap-1">
                    <UIcon name="i-heroicons-banknotes" class="text-sm" />
                    €{{ item.price.toFixed(2) }}
                  </span>
                  <span v-if="item.category" :class="getCategoryBadgeClass(item.category)" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold">
                    <UIcon name="i-heroicons-tag" class="text-xs" />
                    {{ item.category }}
                  </span>
                </div>
              </div>
              <UButton 
                icon="i-heroicons-x-mark"
                variant="ghost"
                color="red"
                size="sm"
                class="opacity-100 transition-opacity"
                @click="removeItem(index)"
              />
            </div>
          </div>
        </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { ParsedItem } from '~/types'

const { addToStock } = useStock()
const { language } = useLanguage()

// Toast helper
const showToast = (toast: { title: string; description?: string; color: string; icon?: string }) => {
  if (process.client && (window as any).__toastInstance) {
    (window as any).__toastInstance.addToast(toast)
  }
}

// Get item name based on selected language
const getItemName = (item: ParsedItem) => {
  if (language.value === 'de') return item.nameDe
  if (language.value === 'hu') return item.nameHu
  return item.nameEn
}

// Provider selection
const selectedProvider = ref('dummy')
const providerOptions = [
  { 
    value: 'dummy', 
    label: 'Mock Data', 
    icon: 'i-heroicons-beaker',
    disabled: false
  },
  { 
    value: 'gemini', 
    label: 'Gemini AI', 
    icon: 'i-heroicons-sparkles',
    disabled: false
  },
  { 
    value: 'chatgpt', 
    label: 'ChatGPT (Soon)', 
    icon: 'i-heroicons-chat-bubble-left-right',
    disabled: true
  }
]

const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)
const uploading = ref(false)
const addingToStock = ref(false)
const error = ref<string | null>(null)
const parsedItems = ref<ParsedItem[]>([])

// Get category badge color class
const getCategoryBadgeClass = (category: string) => {
  const colorMap: Record<string, string> = {
    'Vegetables': 'bg-green-100 text-green-700',
    'Fruits': 'bg-orange-100 text-orange-700',
    'Meat': 'bg-red-100 text-red-700',
    'Fish & Seafood': 'bg-cyan-100 text-cyan-700',
    'Dairy': 'bg-blue-100 text-blue-700',
    'Bakery': 'bg-amber-100 text-amber-700',
    'Beverages': 'bg-purple-100 text-purple-700',
    'Pantry': 'bg-yellow-100 text-yellow-700',
    'Snacks': 'bg-pink-100 text-pink-700',
    'Frozen': 'bg-sky-100 text-sky-700',
    'Other': 'bg-gray-100 text-gray-700'
  }
  return colorMap[category] || 'bg-gray-100 text-gray-700'
}

const triggerFileInput = () => {
  if (!uploading.value) {
    fileInput.value?.click()
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    uploadFile(file)
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    uploadFile(file)
  }
}

const uploadFile = async (file: File) => {
  error.value = null
  uploading.value = true
  parsedItems.value = []

  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await $fetch<{ items: ParsedItem[] }>('/api/receipts/parse', {
      method: 'POST',
      body: formData,
      query: {
        provider: selectedProvider.value
      }
    })

    parsedItems.value = response.items
    
    if (parsedItems.value.length === 0) {
      showToast({
        title: 'No items found',
        description: 'Could not extract items from the receipt',
        color: 'yellow'
      })
    } else {
      showToast({
        title: 'Receipt scanned!',
        description: `Found ${parsedItems.value.length} items`,
        color: 'green'
      })
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to process receipt'
    showToast({
      title: 'Error',
      description: error.value,
      color: 'red'
    })
  } finally {
    uploading.value = false
  }
}

const removeItem = (index: number) => {
  parsedItems.value.splice(index, 1)
  showToast({
    title: 'Item removed',
    color: 'gray'
  })
}

const addItemsToStock = async () => {
  addingToStock.value = true
  try {
    await addToStock(parsedItems.value)
    showToast({
      title: 'Success!',
      description: `Added ${parsedItems.value.length} items to stock`,
      color: 'green'
    })
    await navigateTo('/')
  } catch (err: any) {
    showToast({
      title: 'Error',
      description: 'Failed to add items to stock',
      color: 'red'
    })
  } finally {
    addingToStock.value = false
  }
}
</script>
