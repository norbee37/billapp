import type { ParsedItem } from '~/types'

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

  // Return 3-6 random items
  const numItems = Math.floor(Math.random() * 4) + 3
  const shuffled = sampleProducts.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, numItems)
}
