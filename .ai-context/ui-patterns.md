# UI Patterns & Design System

## Design Philosophy

### Visual Style
- **Playful & Friendly** - Bright colors, rounded corners, fun gradients
- **Modern & Clean** - Generous whitespace, clear hierarchy
- **Touch-friendly** - Large tap targets, accessible interactions
- **Responsive** - Mobile-first, works on all screen sizes

### Color Palette

#### Primary Colors
```css
/* Blues (Primary) */
--blue-50: #eff6ff
--blue-100: #dbeafe
--blue-600: #2563eb  /* Primary buttons, headings */
--blue-700: #1d4ed8
--blue-900: #1e3a8a  /* Dark text */

/* Yellow (Accent) */
--yellow-400: #facc15  /* Icons, highlights */
--yellow-50: #fefce8   /* Backgrounds */
```

#### Category Colors
```css
--green:  Vegetables
--orange: Fruits
--red:    Meat
--cyan:   Fish & Seafood
--blue:   Dairy
--amber:  Bakery, Paper waste
--purple: Beverages, Mixed waste
--yellow: Pantry
--pink:   Snacks
--slate:  Metal waste
```

#### Semantic Colors
```css
--green:  Success, Organic waste
--red:    Error, Delete, Plastic waste
--gray:   Secondary, Disabled
```

## Typography

### Fonts
```typescript
// Loaded via @nuxt/fonts
primary: 'Poppins'  // Headings, buttons, bold text
body: 'Inter'       // Body text, descriptions, labels
```

### Text Styles
```css
/* Headings */
h1: text-4xl font-bold tracking-tight  /* Page titles */
h2: text-3xl font-bold                 /* Section headers */
h3: text-2xl font-bold                 /* Card titles */
h4: text-xl font-bold                  /* Subsections */

/* Body */
body: text-base text-gray-600
label: text-sm font-medium
caption: text-xs text-gray-500

/* All headings use Poppins, body text uses Inter */
style="font-family: 'Poppins', sans-serif"  /* Headings */
style="font-family: 'Inter', sans-serif"    /* Body */
```

## Component Patterns

### Buttons

#### Primary Button
```vue
<UButton 
  size="xl"
  class="bg-gradient-to-r from-blue-600 to-blue-700 
         hover:from-blue-700 hover:to-blue-800 
         shadow-lg hover:shadow-xl 
         transform hover:scale-105 transition-all"
>
  Button Text
</UButton>
```

#### Secondary Button
```vue
<UButton 
  variant="outline"
  color="gray"
  size="lg"
>
  Button Text
</UButton>
```

#### Icon Button
```vue
<UButton 
  icon="i-heroicons-trash"
  variant="ghost" 
  color="red"
  size="md"
/>
```

### Cards

#### Standard Card
```vue
<div class="bg-white rounded-2xl p-6 
            shadow-md border-2 border-gray-200 
            hover:shadow-xl hover:border-blue-300 
            transition-all">
  <!-- Content -->
</div>
```

#### Product Card (with group hover)
```vue
<div class="bg-white rounded-2xl p-6 
            shadow-md border-2 border-gray-200 
            hover:shadow-xl hover:border-blue-300 
            transition-all cursor-pointer group">
  <!-- Show delete button on hover -->
  <button class="opacity-0 group-hover:opacity-100">
    Delete
  </button>
</div>
```

### Badges

#### Category Badge
```vue
<div :class="getCategoryBadgeClass(category)" 
     class="inline-flex items-center gap-1 
            px-2 py-0.5 rounded-md text-xs font-semibold">
  <UIcon name="i-heroicons-tag" class="text-xs" />
  <span>{{ category }}</span>
</div>
```

#### Waste Category Badge
```vue
<div :class="getWasteCategoryBadgeClass(waste)" 
     class="inline-flex items-center gap-1 
            px-2 py-0.5 rounded-md text-xs font-bold 
            shadow-sm border">
  <UIcon :name="getWasteCategoryIcon(waste)" class="text-xs" />
  <span>{{ waste }}</span>
</div>
```

**Waste Badge Colors**:
```typescript
{
  'Plastic': 'bg-red-100 text-red-700 border-red-200',
  'Glass': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'Paper': 'bg-amber-100 text-amber-700 border-amber-200',
  'Metal': 'bg-slate-100 text-slate-700 border-slate-200',
  'Organic': 'bg-green-100 text-green-700 border-green-200',
  'Mixed': 'bg-purple-100 text-purple-700 border-purple-200'
}
```

### Waste Category Section
```vue
<!-- Visual grouping for multiple waste types -->
<div class="w-full mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
  <div class="flex items-center gap-1.5 flex-wrap">
    <span class="text-[10px] text-gray-500 font-medium uppercase tracking-wide">
      Waste:
    </span>
    <div v-for="waste in wasteCategories" 
         :class="getWasteCategoryBadgeClass(waste)"
         class="inline-flex items-center gap-1 px-2 py-0.5 
                rounded-md text-xs font-bold shadow-sm">
      <UIcon :name="getWasteCategoryIcon(waste)" />
      <span>{{ waste }}</span>
    </div>
  </div>
</div>
```

### Icons with Background

```vue
<!-- Circular icon container -->
<div class="w-12 h-12 bg-yellow-400 rounded-xl 
            flex items-center justify-center">
  <UIcon name="i-heroicons-camera" class="text-white text-2xl" />
</div>

<!-- Small square icon -->
<div class="w-9 h-9 bg-blue-100 rounded-lg 
            flex items-center justify-center flex-shrink-0">
  <UIcon name="i-heroicons-cube" class="text-blue-600 text-lg" />
</div>
```

### Modals

#### Overlay Structure
```vue
<Transition name="fade">
  <div v-if="isOpen"
       class="fixed inset-0 bg-black/60 z-50 
              flex items-center justify-center p-4 
              backdrop-blur-sm"
       @click.self="onClose">
    <div class="bg-white rounded-3xl shadow-2xl 
                max-w-2xl w-full max-h-[80vh] 
                overflow-hidden">
      <!-- Modal content -->
    </div>
  </div>
</Transition>
```

#### Modal Transitions
```css
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
```

### Loading States

#### Spinner
```vue
<div class="relative">
  <div class="w-20 h-20 border-4 border-blue-100 
              border-t-blue-600 rounded-full animate-spin">
  </div>
  <UIcon name="i-heroicons-cube" 
         class="absolute top-1/2 left-1/2 
                transform -translate-x-1/2 -translate-y-1/2 
                text-2xl text-blue-600" />
</div>
```

#### Progress Message
```vue
<p class="mt-4 text-gray-600 font-medium">
  Loading your stock...
</p>
```

### Empty States

```vue
<div class="bg-white rounded-3xl shadow-lg 
            border-2 border-gray-200 p-12">
  <div class="text-center max-w-md mx-auto">
    <div class="relative inline-block mb-8">
      <div class="w-24 h-24 bg-blue-100 rounded-2xl 
                  flex items-center justify-center">
        <UIcon name="i-heroicons-inbox" class="text-6xl text-blue-600" />
      </div>
      <div class="absolute -bottom-2 -right-2 
                  w-12 h-12 bg-yellow-400 rounded-full 
                  flex items-center justify-center shadow-lg">
        <UIcon name="i-heroicons-plus" class="text-2xl text-white" />
      </div>
    </div>
    <h2 class="text-3xl font-bold text-blue-900 mb-3">
      Your stock is empty
    </h2>
    <p class="text-lg text-gray-600 mb-8">
      Start scanning receipts...
    </p>
    <UButton size="xl">Scan Receipt</UButton>
  </div>
</div>
```

### Toast Notifications

```typescript
// Global toast instance
window.__toastInstance.addToast({
  title: 'Success!',
  description: 'Item added to stock',
  color: 'green',
  icon: 'i-heroicons-check-circle'
})

// Error toast
{
  title: 'Error',
  description: 'Failed to save',
  color: 'red',
  icon: 'i-heroicons-exclamation-circle'
}
```

## Layout Patterns

### Page Container
```vue
<div class="pb-12">
  <UContainer class="py-8">
    <div class="space-y-8">
      <!-- Page content -->
    </div>
  </UContainer>
</div>
```

### Header Section
```vue
<div class="flex flex-col lg:flex-row 
            lg:items-start lg:justify-between gap-6">
  <div>
    <h1 class="text-4xl font-bold text-blue-900 tracking-tight">
      Page Title
    </h1>
    <p class="text-gray-600 mt-1">Description</p>
  </div>
  <div class="flex-shrink-0">
    <!-- Actions/filters -->
  </div>
</div>
```

### Grid Layout
```vue
<!-- Responsive grid -->
<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  <!-- Items -->
</div>

<!-- Stats grid -->
<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
  <!-- Stat cards -->
</div>
```

## Interactive Patterns

### Hover Effects
```css
/* Card hover */
hover:shadow-xl hover:border-blue-300 transition-all

/* Button hover */
hover:bg-blue-700 transform hover:scale-105 transition-all

/* Icon hover */
hover:bg-gray-100 transition-colors

/* Opacity reveal */
opacity-0 group-hover:opacity-100 transition-all
```

### Click/Tap Feedback
- Buttons scale slightly: `hover:scale-105`
- Color shifts: `hover:from-blue-700`
- Shadow increases: `hover:shadow-xl`

### Focus States
- Use default browser focus rings (accessibility)
- Consider custom ring: `focus:ring-2 focus:ring-blue-500`

## Responsive Breakpoints

```css
sm:  640px   /* Small tablets */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Large screens */
```

### Common Responsive Patterns
```vue
<!-- Mobile: column, Desktop: row -->
<div class="flex flex-col lg:flex-row">

<!-- Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

<!-- Hide on mobile -->
<div class="hidden md:block">

<!-- Full width on mobile -->
<div class="w-full lg:w-auto">
```

## Accessibility

### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Use `<button>` for clickable actions
- Use `<nav>` for navigation
- Use `aria-label` for icon-only buttons

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Close modals on Escape key
- Tab order should be logical

### Screen Readers
- Provide alt text for images
- Use aria-label for icon-only elements
- Announce dynamic content changes

## Common Icons

```typescript
// UI Elements
'i-heroicons-squares-2x2'      // Grid/entries
'i-heroicons-x-mark'           // Close
'i-heroicons-chevron-right'    // Navigation
'i-heroicons-funnel'           // Filter

// Actions
'i-heroicons-camera'           // Scan
'i-heroicons-plus'             // Add
'i-heroicons-trash'            // Delete
'i-heroicons-pencil'           // Edit

// Status
'i-heroicons-check-circle'     // Success
'i-heroicons-exclamation-circle' // Error
'i-heroicons-clock'            // Time/date
'i-heroicons-calendar'         // Date

// Content
'i-heroicons-cube'             // Items/quantity
'i-heroicons-shopping-bag'     // Shopping
'i-heroicons-banknotes'        // Price/money
'i-heroicons-tag'              // Category

// Waste categories
'i-heroicons-beaker'           // Plastic
'i-heroicons-square-3-stack-3d' // Glass
'i-heroicons-document'         // Paper
'i-heroicons-cube'             // Metal
'i-heroicons-sparkles'         // Organic
'i-heroicons-rectangle-stack'  // Mixed
```

## Animation Classes

```css
/* Transitions */
.transition-all          /* All properties */
.transition-colors       /* Only colors */
.transition-shadow       /* Only shadows */

/* Duration */
.duration-300           /* 300ms */

/* Hover transforms */
.transform .hover:scale-105
.transform .hover:translate-y-[-2px]

/* Loading */
.animate-spin           /* Spinner rotation */
.animate-pulse          /* Subtle pulse */
```
