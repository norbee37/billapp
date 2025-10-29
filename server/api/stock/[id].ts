import type { StockItem } from '~/types'
import { stockItems } from './index'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const method = event.method

  const itemIndex = stockItems.findIndex(item => item.id === id)

  if (itemIndex === -1) {
    throw createError({
      statusCode: 404,
      message: 'Item not found'
    })
  }

  if (method === 'PATCH') {
    // Update stock item
    const updates = await readBody(event)
    stockItems[itemIndex] = {
      ...stockItems[itemIndex],
      ...updates,
      id: stockItems[itemIndex].id, // Ensure ID doesn't change
      purchaseDate: stockItems[itemIndex].purchaseDate, // Preserve original purchase date
      createdAt: stockItems[itemIndex].createdAt // Preserve creation date
    }
    return stockItems[itemIndex]
  }

  if (method === 'DELETE') {
    // Delete stock item
    const deletedItem = stockItems.splice(itemIndex, 1)[0]
    return { success: true, deleted: deletedItem }
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
