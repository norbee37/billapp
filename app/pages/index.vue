<template>
  <div class="pb-12">
    <UContainer class="py-8">
      <div class="space-y-8">
        <!-- Page Header -->
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <h1 class="text-4xl font-bold text-blue-900 tracking-tight" style="font-family: 'Poppins', sans-serif;">My Stock</h1>
            <p class="text-gray-600 mt-1" style="font-family: 'Inter', sans-serif;">Manage your grocery inventory</p>
          </div>
          
          <!-- Category Filter (inline with header on larger screens) -->
          <div v-if="!loading && stock.length > 0" class="flex-shrink-0">
            <div class="flex items-center gap-2 mb-2">
              <UIcon name="i-heroicons-funnel" class="text-gray-500 text-sm" />
              <span class="text-sm text-gray-600 font-medium" style="font-family: 'Inter', sans-serif;">Filter:</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                @click="selectedCategory = null"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  selectedCategory === null 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
                style="font-family: 'Inter', sans-serif;"
              >
                All ({{ groupedStock.length }})
              </button>
              <button
                v-for="category in availableCategories"
                :key="category"
                @click="selectedCategory = category"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  selectedCategory === category 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
                style="font-family: 'Inter', sans-serif;"
              >
                {{ category }} ({{ getCategoryCount(category) }})
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-20">
          <div class="relative">
            <div class="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
            <UIcon name="i-heroicons-cube" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-blue-600" />
          </div>
          <p class="mt-4 text-gray-600 font-medium">Loading your stock...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="stock.length === 0" class="bg-white rounded-3xl shadow-lg border-2 border-gray-200 p-12">
          <div class="text-center max-w-md mx-auto">
            <div class="relative inline-block mb-8">
              <div class="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center">
                <UIcon name="i-heroicons-inbox" class="text-6xl text-blue-600" />
              </div>
              <div class="absolute -bottom-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <UIcon name="i-heroicons-plus" class="text-2xl text-white" />
              </div>
            </div>
            <h2 class="text-3xl font-bold text-blue-900 mb-3" style="font-family: 'Poppins', sans-serif;">
              Your stock is empty
            </h2>
            <p class="text-lg text-gray-600 mb-8" style="font-family: 'Inter', sans-serif;">
              Start scanning receipts to build your inventory and track your groceries!
            </p>
            <UButton 
              size="xl"
              icon="i-heroicons-camera"
              class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-yellow-400"
              style="font-family: 'Poppins', sans-serif; font-weight: 600;"
              @click="navigateTo('/scan')"
            >
              Scan Your First Receipt
            </UButton>
          </div>
        </div>

        <!-- Stock Grid -->
        <div v-else>
          <!-- Stats Overview -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-cube" class="text-blue-600 text-2xl" />
              </div>
              <div>
                <p class="text-sm text-gray-600 font-medium" style="font-family: 'Inter', sans-serif;">Unique Items</p>
                <p class="text-2xl font-bold text-gray-900" style="font-family: 'Poppins', sans-serif;">{{ filteredStock.length }}</p>
              </div>
            </div>
            
            <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div class="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-shopping-bag" class="text-yellow-600 text-2xl" />
              </div>
              <div>
                <p class="text-sm text-gray-600 font-medium" style="font-family: 'Inter', sans-serif;">Total Quantity</p>
                <p class="text-lg font-bold text-gray-900" style="font-family: 'Poppins', sans-serif;">{{ totalQuantityByUnit || 'None' }}</p>
              </div>
            </div>
            
            <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-banknotes" class="text-green-600 text-2xl" />
              </div>
              <div>
                <p class="text-sm text-gray-600 font-medium" style="font-family: 'Inter', sans-serif;">Total Value</p>
                <p class="text-2xl font-bold text-gray-900" style="font-family: 'Poppins', sans-serif;">€{{ totalValue.toFixed(2) }}</p>
              </div>
            </div>
          </div>

          <!-- Items Grid -->
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="item in filteredStock" 
              :key="`${item.nameEn}_${item.unit}`"
              class="bg-white rounded-2xl p-6 shadow-md border-2 border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1 flex items-center gap-2 flex-wrap">
                  <h3 class="font-bold text-xl text-blue-900" style="font-family: 'Poppins', sans-serif;">
                    {{ item.displayName }}
                  </h3>
                  <button
                    v-if="item.ids && item.ids.length > 1"
                    @click.stop="showEntries(item)"
                    class="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-md text-xs font-semibold hover:bg-yellow-200 hover:shadow-md transition-all cursor-pointer"
                    style="font-family: 'Inter', sans-serif;"
                  >
                    <UIcon name="i-heroicons-squares-2x2" class="text-xs" />
                    <span>{{ item.ids.length }}</span>
                    <UIcon name="i-heroicons-chevron-right" class="text-[10px]" />
                  </button>
                  <div v-if="item.category" :class="getCategoryBadgeClass(item.category)" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold" style="font-family: 'Inter', sans-serif;">
                    <UIcon name="i-heroicons-tag" class="text-xs" />
                    <span>{{ item.category }}</span>
                  </div>
                  <div v-if="item.wasteCategory" :class="getWasteCategoryBadgeClass(item.wasteCategory)" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold" style="font-family: 'Inter', sans-serif;">
                    <UIcon name="i-heroicons-trash" class="text-xs" />
                    <span>{{ item.wasteCategory }}</span>
                  </div>
                </div>
                <UButton 
                  icon="i-heroicons-trash"
                  variant="ghost" 
                  color="red"
                  size="md"
                  class="opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
                  @click="handleDelete(item)"
                />
              </div>
              
              <!-- Divider -->
              <div class="border-t-2 border-gray-100 my-4"></div>
              
              <div class="space-y-3" style="font-family: 'Inter', sans-serif;">
                <div class="flex items-center gap-3 text-base">
                  <div class="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UIcon name="i-heroicons-cube" class="text-blue-600 text-lg" />
                  </div>
                  <span class="text-gray-700 font-semibold">Quantity:</span>
                  <span class="text-blue-900 font-bold ml-auto text-lg">{{ item.totalQuantity }} {{ item.unit || 'pcs' }}</span>
                </div>
                
                <div v-if="item.price" class="flex items-center gap-3 text-base">
                  <div class="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UIcon name="i-heroicons-banknotes" class="text-green-600 text-lg" />
                  </div>
                  <span class="text-gray-700 font-semibold">Price:</span>
                  <span class="text-green-700 font-bold ml-auto text-lg">€{{ item.price.toFixed(2) }}</span>
                </div>
                
                <div v-if="item.expiresAt" class="flex items-center gap-3 text-base">
                  <div class="w-9 h-9 bg-yellow-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UIcon name="i-heroicons-calendar" class="text-yellow-600 text-lg" />
                  </div>
                  <span class="text-gray-700 font-semibold">Expires:</span>
                  <span class="text-gray-900 font-bold ml-auto">{{ formatDate(item.expiresAt) }}</span>
                </div>

                <div class="flex items-center gap-3 text-sm pt-2 border-t border-gray-100">
                  <div class="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UIcon name="i-heroicons-clock" class="text-gray-500" />
                  </div>
                  <span class="text-gray-600 font-medium">Added:</span>
                  <span class="text-gray-500 font-semibold ml-auto">{{ formatDate(item.addedAt) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
    
    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :is-open="isDeleteModalOpen"
      :title="'Delete Item'"
      :message="`Are you sure you want to delete all <strong>${deleteItem?.displayName}</strong> (${deleteItem?.ids.length} ${deleteItem?.ids.length === 1 ? 'entry' : 'entries'})?`"
      @cancel="isDeleteModalOpen = false; deleteItem = null"
      @confirm="confirmDelete"
    />
    
    <!-- Entries Modal -->
    <EntriesModal
      :is-open="isEntriesModalOpen"
      :item-name="selectedItem?.displayName || ''"
      :entries="entriesModalData"
      @close="isEntriesModalOpen = false; selectedItem = null"
      @delete="handleDeleteSingleEntry"
    />
  </div>
</template>

<script setup lang="ts">
import type { StockItem } from '~/types'

const { stock, loading, fetchStock, deleteStockItem, getItemName } = useStock()
const { language } = useLanguage()

// Delete confirmation state
const deleteItem = ref<(StockItem & { ids: string[], totalQuantity: number }) | null>(null)
const isDeleteModalOpen = ref(false)

// Entries modal state
const selectedItem = ref<(StockItem & { ids: string[], totalQuantity: number }) | null>(null)
const isEntriesModalOpen = ref(false)
const entriesModalData = ref<StockItem[]>([])

// Category filter state
const selectedCategory = ref<string | null>(null)

// Toast helper
const showToast = (toast: { title: string; description?: string; color: string; icon?: string }) => {
  if (process.client && (window as any).__toastInstance) {
    (window as any).__toastInstance.addToast(toast)
  }
}

onMounted(() => {
  fetchStock()
})

// Group items by English name (ID) and unit, sum quantities
const groupedStock = computed(() => {
  const grouped = new Map<string, StockItem & { ids: string[], totalQuantity: number, displayName: string }>()
  
  stock.value.forEach(item => {
    const key = `${item.nameEn.toLowerCase()}_${item.unit || 'pcs'}`
    if (grouped.has(key)) {
      const existing = grouped.get(key)!
      // Create a new object instead of mutating
      grouped.set(key, {
        ...existing,
        totalQuantity: existing.totalQuantity + item.quantity,
        ids: [...existing.ids, item.id],
        price: item.price || existing.price,
        category: item.category || existing.category,
        wasteCategory: item.wasteCategory || existing.wasteCategory
      })
    } else {
      grouped.set(key, {
        ...item,
        ids: [item.id],
        totalQuantity: item.quantity,
        displayName: getItemName(item, language.value)
      })
    }
  })
  
  return Array.from(grouped.values())
})

// Get available categories from stock
const availableCategories = computed(() => {
  const categories = new Set<string>()
  stock.value.forEach(item => {
    if (item.category) {
      categories.add(item.category)
    }
  })
  return Array.from(categories).sort()
})

// Filter stock by selected category
const filteredStock = computed(() => {
  if (selectedCategory.value === null) {
    return groupedStock.value
  }
  return groupedStock.value.filter(item => item.category === selectedCategory.value)
})

// Get count of items in a category
const getCategoryCount = (category: string) => {
  return groupedStock.value.filter(item => item.category === category).length
}

const totalValue = computed(() => {
  const items = selectedCategory.value === null 
    ? stock.value 
    : stock.value.filter(item => item.category === selectedCategory.value)
  
  const sum = items.reduce((total, item) => {
    return total + (item.price || 0)
  }, 0)
  return Math.round(sum * 100) / 100
})

// Calculate total quantities grouped by unit
const totalQuantityByUnit = computed(() => {
  const items = selectedCategory.value === null 
    ? stock.value 
    : stock.value.filter(item => item.category === selectedCategory.value)
  
  const unitTotals = new Map<string, number>()
  
  items.forEach(item => {
    let unit = item.unit || 'pcs'
    let quantity = item.quantity
    
    // Convert grams to kilograms
    if (unit.toLowerCase() === 'g' || unit.toLowerCase() === 'gram' || unit.toLowerCase() === 'grams') {
      unit = 'kg'
      quantity = quantity / 1000
    } else if (unit.toLowerCase() === 'kg' || unit.toLowerCase() === 'kilogram' || unit.toLowerCase() === 'kilograms') {
      unit = 'kg'
    }
    
    unitTotals.set(unit, (unitTotals.get(unit) || 0) + quantity)
  })
  
  // Format as string with rounded values for kg
  return Array.from(unitTotals.entries())
    .map(([unit, qty]) => {
      if (unit === 'kg') {
        return `${Math.round(qty * 100) / 100} ${unit}`
      }
      return `${qty} ${unit}`
    })
    .join(', ')
})

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

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

// Get waste category badge color class - earthy/muted tones
const getWasteCategoryBadgeClass = (wasteCategory: string) => {
  const colorMap: Record<string, string> = {
    'Plastic': 'bg-rose-50 text-rose-700',
    'Glass': 'bg-teal-50 text-teal-700',
    'Paper': 'bg-stone-100 text-stone-700',
    'Metal': 'bg-zinc-100 text-zinc-700',
    'Organic': 'bg-emerald-50 text-emerald-700',
    'Mixed': 'bg-indigo-50 text-indigo-700'
  }
  return colorMap[wasteCategory] || 'bg-gray-50 text-gray-700'
}

const handleDelete = (item: StockItem & { ids: string[], totalQuantity: number }) => {
  deleteItem.value = item
  isDeleteModalOpen.value = true
}

const showEntries = (item: StockItem & { ids: string[], totalQuantity: number }) => {
  selectedItem.value = item
  // Get all individual entries for this item
  entriesModalData.value = stock.value.filter(s => item.ids.includes(s.id))
  isEntriesModalOpen.value = true
}

const handleDeleteSingleEntry = async (entryId: string) => {
  try {
    await deleteStockItem(entryId)
    
    // Update entries modal data
    entriesModalData.value = entriesModalData.value.filter(e => e.id !== entryId)
    
    // Close modal if no entries left
    if (entriesModalData.value.length === 0) {
      isEntriesModalOpen.value = false
      selectedItem.value = null
    }
    
    showToast({
      title: 'Entry deleted',
      description: 'Item removed successfully',
      color: 'green',
      icon: 'i-heroicons-check-circle'
    })
  } catch (error) {
    showToast({
      title: 'Delete failed',
      description: 'Could not delete item. Please try again.',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle'
    })
  }
}

const confirmDelete = async () => {
  if (!deleteItem.value) return
  
  const count = deleteItem.value.ids.length
  const itemName = deleteItem.value.name
  
  try {
    for (const id of deleteItem.value.ids) {
      await deleteStockItem(id)
    }
    showToast({
      title: 'Deleted successfully',
      description: `Removed ${count} ${count === 1 ? 'entry' : 'entries'} of ${itemName}`,
      color: 'green',
      icon: 'i-heroicons-check-circle'
    })
  } catch (error) {
    showToast({
      title: 'Delete failed',
      description: 'Could not delete items. Please try again.',
      color: 'red',
      icon: 'i-heroicons-exclamation-circle'
    })
  }
  
  isDeleteModalOpen.value = false
  deleteItem.value = null
}


</script>

