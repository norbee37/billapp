<template>
  <div class="pb-12">
    <UContainer class="py-8">
      <div class="space-y-8">
        <!-- Page Header -->
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <h1 class="text-4xl font-bold text-blue-900 tracking-tight" style="font-family: 'Poppins', sans-serif;">Recipe Generator</h1>
            <p class="text-gray-600 mt-1" style="font-family: 'Inter', sans-serif;">Get personalized recipes based on your stock</p>
          </div>

          <!-- AI Provider Selector -->
          <div class="flex-shrink-0">
            <div class="flex items-center gap-2 mb-2">
              <UIcon name="i-heroicons-sparkles" class="text-gray-500 text-sm" />
              <span class="text-sm text-gray-600 font-medium" style="font-family: 'Inter', sans-serif;">AI:</span>
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

        <!-- Recipe Generator Card -->
        <div class="bg-white rounded-3xl shadow-lg border-2 border-gray-200 p-8">
          <!-- Available Ingredients -->
          <div class="mb-6">
            <h3 class="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2" style="font-family: 'Poppins', sans-serif;">
              <UIcon name="i-heroicons-cube" class="text-xl" />
              Available Ingredients ({{ stock.length }} items)
            </h3>
            <div v-if="stock.length > 0" class="flex flex-wrap gap-2">
              <button
                v-for="item in stock" 
                :key="item.id"
                @click="toggleIngredient(item.id)"
                :class="[
                  'px-3 py-1 rounded-lg text-sm font-medium transition-all',
                  excludedIngredients.has(item.id)
                    ? 'bg-gray-300 text-gray-500 line-through'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                ]"
                style="font-family: 'Inter', sans-serif;"
              >
                {{ getItemName(item, language) }}
              </button>
            </div>
            <p v-else class="text-gray-500 text-sm" style="font-family: 'Inter', sans-serif;">
              No items in stock. Add some items first!
            </p>
            <p v-if="stock.length > 0" class="text-xs text-gray-500 mt-2" style="font-family: 'Inter', sans-serif;">
              Click on ingredients to exclude/include them
            </p>
          </div>

          <!-- Recipe Type Selector -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2" style="font-family: 'Inter', sans-serif;">
              Recipe Type
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="type in recipeTypes"
                :key="type.value"
                @click="selectedRecipeType = type.value"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                  selectedRecipeType === type.value
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
                style="font-family: 'Inter', sans-serif;"
              >
                {{ type.label }}
              </button>
            </div>
          </div>

          <!-- Hint Input -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2" style="font-family: 'Inter', sans-serif;">
              Additional Hints (Optional)
            </label>
            <textarea
              v-model="recipeHint"
              placeholder="E.g., 'make it spicy', 'vegetarian', 'quick meal', 'Italian style'..."
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
              style="font-family: 'Inter', sans-serif;"
              rows="3"
            ></textarea>
          </div>

          <!-- Generate Button -->
          <div class="flex justify-center">
            <UButton
              @click="generateRecipe"
              :loading="generating"
              :disabled="generating || availableIngredients.length === 0"
              size="xl"
              class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-yellow-400 px-12"
              style="font-family: 'Poppins', sans-serif; font-weight: 600;"
              icon="i-heroicons-sparkles"
            >
              {{ generating ? 'Generating Recipes...' : 'Generate 3 Recipes' }}
            </UButton>
          </div>
        </div>

        <!-- Generated Recipes Grid -->
        <div v-if="generatedRecipes.length > 0" class="space-y-6">
          <!-- Collapsed cards in grid -->
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="(recipe, index) in generatedRecipes"
              :key="`collapsed-${index}`"
              v-show="expandedRecipe !== index"
              class="bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all"
            >
              <!-- Recipe Card Header -->
              <div 
                @click="expandedRecipe = index"
                class="p-6 text-white rounded-t-2xl cursor-pointer"
                :class="getHeaderColorClass(index)"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h2 class="text-xl font-bold mb-2" style="font-family: 'Poppins', sans-serif;">
                      {{ recipe.title }}
                    </h2>
                    <div class="flex items-center gap-4 text-sm" :class="getHeaderTextClass(index)">
                      <span class="flex items-center gap-1">
                        <UIcon name="i-heroicons-clock" />
                        {{ recipe.prepTime }} min
                      </span>
                      <span class="flex items-center gap-1">
                        <UIcon name="i-heroicons-users" />
                        {{ recipe.servings }} servings
                      </span>
                    </div>
                  </div>
                  <UIcon 
                    name="i-heroicons-chevron-down"
                    class="text-2xl flex-shrink-0 ml-2"
                  />
                </div>
              </div>

              <!-- Collapsed View: Ingredient Count -->
              <div class="p-6 cursor-pointer" @click="expandedRecipe = index">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-600" style="font-family: 'Inter', sans-serif;">
                    {{ recipe.ingredients.filter(i => i.available).length }} / {{ recipe.ingredients.length }} ingredients available
                  </span>
                  <span class="text-blue-600 font-semibold" style="font-family: 'Inter', sans-serif;">
                    Click to expand →
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Expanded Recipe Card (full width) -->
          <div
            v-if="expandedRecipe !== null"
            class="bg-white rounded-2xl shadow-lg border-2 border-gray-200"
          >
            <!-- Recipe Card Header -->
            <div 
              @click="expandedRecipe = null"
              class="p-6 text-white rounded-t-2xl cursor-pointer"
              :class="getHeaderColorClass(expandedRecipe)"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h2 class="text-xl font-bold mb-2" style="font-family: 'Poppins', sans-serif;">
                    {{ generatedRecipes[expandedRecipe].title }}
                  </h2>
                  <div class="flex items-center gap-4 text-sm" :class="getHeaderTextClass(expandedRecipe)">
                    <span class="flex items-center gap-1">
                      <UIcon name="i-heroicons-clock" />
                      {{ generatedRecipes[expandedRecipe].prepTime }} min
                    </span>
                    <span class="flex items-center gap-1">
                      <UIcon name="i-heroicons-users" />
                      {{ generatedRecipes[expandedRecipe].servings }} servings
                    </span>
                  </div>
                </div>
                <UIcon 
                  name="i-heroicons-chevron-up"
                  class="text-2xl flex-shrink-0 ml-2"
                />
              </div>
            </div>

            <!-- Expanded View: Full Recipe -->
            <div class="p-8 space-y-6">
              <!-- Ingredients -->
              <div>
                <h3 class="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2" style="font-family: 'Poppins', sans-serif;">
                  <UIcon name="i-heroicons-shopping-bag" class="text-lg" />
                  Ingredients
                </h3>
                <div class="grid md:grid-cols-2 gap-2">
                  <div
                    v-for="(ingredient, idx) in generatedRecipes[expandedRecipe].ingredients"
                    :key="idx"
                    class="flex items-center gap-3 p-3 rounded-lg"
                    :class="ingredient.available ? 'bg-green-50' : 'bg-red-50'"
                  >
                    <UIcon 
                      :name="ingredient.available ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                      :class="ingredient.available ? 'text-green-600' : 'text-red-600'"
                      class="text-lg flex-shrink-0"
                    />
                    <span 
                      class="font-medium text-sm"
                      :class="ingredient.available ? 'text-green-900' : 'text-red-900'"
                      style="font-family: 'Inter', sans-serif;"
                    >
                      {{ ingredient.text }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Instructions -->
              <div>
                <h3 class="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2" style="font-family: 'Poppins', sans-serif;">
                  <UIcon name="i-heroicons-clipboard-document-list" class="text-lg" />
                  Instructions
                </h3>
                <ol class="space-y-3">
                  <li
                    v-for="(step, idx) in generatedRecipes[expandedRecipe].instructions"
                    :key="idx"
                    class="flex gap-4"
                  >
                    <span class="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm" style="font-family: 'Poppins', sans-serif;">
                      {{ idx + 1 }}
                    </span>
                    <p class="flex-1 text-gray-700 pt-1" style="font-family: 'Inter', sans-serif;">
                      {{ step }}
                    </p>
                  </li>
                </ol>
              </div>

              <!-- Tips -->
              <div v-if="generatedRecipes[expandedRecipe].tips && generatedRecipes[expandedRecipe].tips.length > 0" class="bg-yellow-50 rounded-xl p-4">
                <h4 class="font-bold text-yellow-900 mb-2 flex items-center gap-2" style="font-family: 'Poppins', sans-serif;">
                  <UIcon name="i-heroicons-light-bulb" />
                  Tips
                </h4>
                <ul class="space-y-1">
                  <li
                    v-for="(tip, idx) in generatedRecipes[expandedRecipe].tips"
                    :key="idx"
                    class="text-sm text-yellow-800"
                    style="font-family: 'Inter', sans-serif;"
                  >
                    • {{ tip }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import type { StockItem } from '~/types'

const { stock, loading, fetchStock, getItemName } = useStock()
const { language } = useLanguage()

// AI Provider selection
const selectedProvider = ref('gemini')
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

// Recipe type options
const recipeTypes = [
  { value: 'anything', label: 'Anything' },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'soup', label: 'Soup' },
  { value: 'salad', label: 'Salad' }
]

const selectedRecipeType = ref('anything')
const recipeHint = ref('')
const generating = ref(false)
const excludedIngredients = ref(new Set<string>())
const expandedRecipe = ref<number | null>(null)

interface GeneratedRecipe {
  title: string
  prepTime: number
  servings: number
  ingredients: Array<{ text: string, available: boolean }>
  instructions: string[]
  tips?: string[]
}

const generatedRecipes = ref<GeneratedRecipe[]>([])

// Get available (non-excluded) ingredients
const availableIngredients = computed(() => {
  return stock.value.filter(item => !excludedIngredients.value.has(item.id))
})

// Toggle ingredient inclusion/exclusion
const toggleIngredient = (id: string) => {
  if (excludedIngredients.value.has(id)) {
    excludedIngredients.value.delete(id)
  } else {
    excludedIngredients.value.add(id)
  }
}

// Get header color based on index (yellow, blue, green pattern)
const getHeaderColorClass = (index: number) => {
  const colors = [
    'bg-gradient-to-r from-yellow-500 to-yellow-600',
    'bg-gradient-to-r from-blue-600 to-blue-700',
    'bg-gradient-to-r from-yellow-500 to-yellow-600'
  ]
  return colors[index % 3]
}

// Get header text color based on index
const getHeaderTextClass = (index: number) => {
  const colors = [
    'text-yellow-100',
    'text-blue-100',
    'text-yellow-100'
  ]
  return colors[index % 3]
}

// Toast helper
const showToast = (toast: { title: string; description?: string; color: string }) => {
  if (process.client && (window as any).__toastInstance) {
    (window as any).__toastInstance.addToast(toast)
  }
}

const generateRecipe = async () => {
  if (availableIngredients.value.length === 0) {
    showToast({
      title: 'No ingredients',
      description: 'Add some items to your stock first or unexclude ingredients',
      color: 'yellow'
    })
    return
  }

  generating.value = true
  generatedRecipes.value = []
  expandedRecipe.value = null

  try {
    // Generate 3 recipes in parallel with different variations
    const promises = [0, 1, 2].map((variation) => 
      $fetch<GeneratedRecipe>('/api/recipes/generate', {
        method: 'POST',
        body: {
          ingredients: availableIngredients.value.map(item => ({
            nameEn: item.nameEn,
            nameDe: item.nameDe,
            nameHu: item.nameHu,
            quantity: item.quantity,
            unit: item.unit
          })),
          recipeType: selectedRecipeType.value,
          hint: recipeHint.value,
          provider: selectedProvider.value,
          language: language.value,
          variation
        }
      })
    )

    const recipes = await Promise.all(promises)
    generatedRecipes.value = recipes

    showToast({
      title: '3 Recipes generated!',
      description: 'Click on any recipe to see details',
      color: 'green'
    })
  } catch (error: any) {
    console.error('Recipe generation error:', error)
    showToast({
      title: 'Error',
      description: error.message || 'Failed to generate recipes',
      color: 'red'
    })
  } finally {
    generating.value = false
  }
}

onMounted(() => {
  fetchStock()
})
</script>
