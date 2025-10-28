import type { StockItem } from '~/types'

// In-memory storage (replace with database in production)
// This needs to be exported so [id].ts can access it
export const stockItems: StockItem[] = []

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    // Return all stock items
    return stockItems
  }

  if (method === 'POST') {
    // Add new items to stock - create separate entries for each
    const { items } = await readBody(event)
    
    const newItems: StockItem[] = []
    
    for (const item of items) {
      // Always create new item (don't merge)
      const newItem: StockItem = {
        id: crypto.randomUUID(),
        nameEn: item.nameEn,
        nameDe: item.nameDe,
        nameHu: item.nameHu,
        quantity: item.quantity || 1,
        unit: item.unit,
        price: item.price,
        category: item.category,
        wasteCategory: item.wasteCategory,
        addedAt: new Date(),
        expiresAt: item.expiresAt
      }
      stockItems.push(newItem)
      newItems.push(newItem)
    }

    return newItems
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
