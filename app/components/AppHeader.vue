<template>
  <header class="bg-white shadow-md border-b border-blue-100 sticky top-0 z-50">
    <UContainer>
      <div class="flex items-center justify-between h-20">
        <!-- Logo and Brand -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <div class="relative">
            <!-- Receipt Icon Background -->
            <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <!-- Yellow accent dot -->
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>
          </div>
          
          <div class="flex flex-col">
            <span class="text-2xl font-bold text-blue-900 tracking-tight" style="font-family: 'Poppins', sans-serif;">
              bill<span class="text-yellow-400">a</span>pp
            </span>
            <span class="text-xs text-blue-600 font-medium -mt-1" style="font-family: 'Inter', sans-serif;">
              Smart Receipt Manager
            </span>
          </div>
        </NuxtLink>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center gap-6">
          <NuxtLink 
            to="/" 
            class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
            :class="{ 'text-blue-700 bg-blue-50': $route.path === '/' }"
            style="font-family: 'Inter', sans-serif;"
          >
            <UIcon name="i-heroicons-cube" class="text-lg" />
            <span>Stock</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/scan" 
            class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
            :class="{ 'text-blue-700 bg-blue-50': $route.path === '/scan' }"
            style="font-family: 'Inter', sans-serif;"
          >
            <UIcon name="i-heroicons-camera" class="text-lg" />
            <span>Scan</span>
          </NuxtLink>
        </nav>

        <!-- Action Button -->
        <div class="flex items-center gap-3">
          <!-- Language Selector -->
          <div class="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              v-for="lang in languageOptions"
              :key="lang.value"
              @click="setLanguage(lang.value as 'en' | 'de' | 'hu')"
              :class="[
                'px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5',
                language === lang.value
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              ]"
              :title="lang.label"
              style="font-family: 'Inter', sans-serif;"
            >
              <span class="text-base">{{ lang.flag }}</span>
              <span class="hidden sm:inline">{{ lang.value.toUpperCase() }}</span>
            </button>
          </div>

          <UButton 
            v-if="$route.path === '/'"
            icon="i-heroicons-plus-circle"
            size="lg"
            color="primary"
            class="hidden sm:flex bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-yellow-400"
            style="font-family: 'Poppins', sans-serif; font-weight: 600;"
            @click="navigateTo('/scan')"
          >
            Scan Receipt
          </UButton>
          
          <UButton 
            v-if="$route.path === '/'"
            icon="i-heroicons-plus"
            size="lg"
            color="primary"
            class="sm:hidden"
            @click="navigateTo('/scan')"
          />
          
          <!-- Mobile Menu Button -->
          <UButton
            icon="i-heroicons-bars-3"
            color="gray"
            variant="ghost"
            size="lg"
            class="md:hidden"
            @click="mobileMenuOpen = !mobileMenuOpen"
          />
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-blue-100">
        <nav class="flex flex-col gap-2">
          <NuxtLink 
            to="/" 
            class="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
            :class="{ 'text-blue-700 bg-blue-100': $route.path === '/' }"
            style="font-family: 'Inter', sans-serif;"
            @click="mobileMenuOpen = false"
          >
            <UIcon name="i-heroicons-cube" class="text-xl" />
            <span>My Stock</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/scan" 
            class="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
            :class="{ 'text-blue-700 bg-blue-100': $route.path === '/scan' }"
            style="font-family: 'Inter', sans-serif;"
            @click="mobileMenuOpen = false"
          >
            <UIcon name="i-heroicons-camera" class="text-xl" />
            <span>Scan Receipt</span>
          </NuxtLink>
        </nav>
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const mobileMenuOpen = ref(false)
const { language, setLanguage, languageOptions } = useLanguage()

// Close mobile menu when route changes
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})
</script>
