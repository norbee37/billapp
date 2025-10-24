import type { ParsedItem } from '~/types'

// Category mappings
const categoryKeywords: Record<string, string[]> = {
  'Vegetables': ['tomato', 'potato', 'carrot', 'lettuce', 'cucumber', 'onion', 'pepper', 'broccoli', 'spinach', 'cabbage', 'celery', 'zucchini', 'eggplant', 'cauliflower', 'mushroom', 'garlic', 'ginger'],
  'Fruits': ['apple', 'banana', 'orange', 'grape', 'strawberry', 'blueberry', 'mango', 'pineapple', 'watermelon', 'peach', 'pear', 'cherry', 'lemon', 'lime', 'kiwi', 'avocado', 'plum'],
  'Meat': ['chicken', 'beef', 'pork', 'turkey', 'lamb', 'duck', 'bacon', 'sausage', 'ham', 'steak', 'mince', 'ground beef'],
  'Fish & Seafood': ['salmon', 'tuna', 'cod', 'shrimp', 'prawn', 'crab', 'lobster', 'fish', 'seafood', 'tilapia', 'mackerel'],
  'Dairy': ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'ice cream', 'sour cream', 'cottage cheese', 'mozzarella', 'cheddar', 'parmesan'],
  'Bakery': ['bread', 'baguette', 'roll', 'croissant', 'bagel', 'muffin', 'donut', 'cake', 'pastry', 'bun'],
  'Beverages': ['juice', 'soda', 'water', 'coffee', 'tea', 'beer', 'wine', 'cola', 'lemonade', 'milk shake'],
  'Pantry': ['pasta', 'rice', 'flour', 'sugar', 'salt', 'oil', 'vinegar', 'sauce', 'cereal', 'oats', 'beans', 'lentils', 'quinoa'],
  'Snacks': ['chips', 'crackers', 'cookies', 'chocolate', 'candy', 'popcorn', 'nuts', 'pretzels', 'granola'],
  'Frozen': ['frozen', 'ice'],
  'Other': []
}

function categorizeProduct(name: string): string {
  const lowerName = name.toLowerCase()
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (category === 'Other') continue
    
    for (const keyword of keywords) {
      if (lowerName.includes(keyword)) {
        return category
      }
    }
  }
  
  return 'Other'
}

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)
  
  if (!form || form.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No file uploaded'
    })
  }

  const file = form[0]
  
  if (!file.data) {
    throw createError({
      statusCode: 400,
      message: 'Invalid file data'
    })
  }

  // Get file type
  const fileType = file.type || file.filename?.split('.').pop()?.toLowerCase()

  // Mock OCR/parsing logic
  // In production, integrate with OCR services like:
  // - Google Cloud Vision API
  // - AWS Textract
  // - Azure Computer Vision
  // - Tesseract.js
  
  const mockItems: ParsedItem[] = generateMockItems()

  return {
    items: mockItems,
    message: 'Receipt parsed successfully (mock data)'
  }
})

// Generate mock parsed items for demonstration
function generateMockItems(): ParsedItem[] {
  const sampleProducts = [
    { name: 'Organic Apples', quantity: 1.5, unit: 'kg', price: 4.99 },
    { name: 'Whole Milk', quantity: 2, unit: 'L', price: 3.49 },
    { name: 'Bread', quantity: 1, unit: 'loaf', price: 2.99 },
    { name: 'Eggs', quantity: 12, unit: 'pcs', price: 4.99 },
    { name: 'Chicken Breast', quantity: 0.8, unit: 'kg', price: 9.99 },
    { name: 'Tomatoes', quantity: 0.5, unit: 'kg', price: 2.49 },
    { name: 'Orange Juice', quantity: 1, unit: 'L', price: 3.99 },
    { name: 'Butter', quantity: 250, unit: 'g', price: 3.49 },
    { name: 'Pasta', quantity: 500, unit: 'g', price: 1.99 },
    { name: 'Cheese', quantity: 200, unit: 'g', price: 4.49 }
  ]

  // Return 3-6 random items with categories
  const numItems = Math.floor(Math.random() * 4) + 3
  const shuffled = sampleProducts.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, numItems).map(item => ({
    ...item,
    category: categorizeProduct(item.name)
  }))
}
