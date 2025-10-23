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
    // Add new items to stock
    const { items } = await readBody(event)
    
    const newItems: StockItem[] = items.map((item: any) => ({
      id: crypto.randomUUID(),
      name: item.name,
      quantity: item.quantity || 1,
      unit: item.unit,
      price: item.price,
      category: item.category,
      addedAt: new Date(),
      expiresAt: item.expiresAt
    }))

    stockItems.push(...newItems)
    return newItems
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
