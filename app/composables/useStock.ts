import type { StockItem } from '~/types'

export const useStock = () => {
  const stock = useState<StockItem[]>('stock', () => [])
  const loading = useState<boolean>('stockLoading', () => false)

  const fetchStock = async () => {
    loading.value = true
    try {
      const data = await $fetch<StockItem[]>('/api/stock')
      stock.value = data
    } catch (error) {
      console.error('Error fetching stock:', error)
    } finally {
      loading.value = false
    }
  }

  const addToStock = async (items: Omit<StockItem, 'id' | 'addedAt'>[]) => {
    try {
      const newItems = await $fetch<StockItem[]>('/api/stock', {
        method: 'POST',
        body: { items }
      })
      stock.value = [...stock.value, ...newItems]
      return newItems
    } catch (error) {
      console.error('Error adding to stock:', error)
      throw error
    }
  }

  const updateStockItem = async (id: string, updates: Partial<StockItem>) => {
    try {
      const updated = await $fetch<StockItem>(`/api/stock/${id}`, {
        method: 'PATCH',
        body: updates
      })
      const index = stock.value.findIndex(item => item.id === id)
      if (index !== -1) {
        stock.value[index] = updated
      }
      return updated
    } catch (error) {
      console.error('Error updating stock item:', error)
      throw error
    }
  }

  const deleteStockItem = async (id: string) => {
    try {
      await $fetch(`/api/stock/${id}`, {
        method: 'DELETE'
      })
      stock.value = stock.value.filter(item => item.id !== id)
    } catch (error) {
      console.error('Error deleting stock item:', error)
      throw error
    }
  }

  // Helper to get display name based on language
  const getItemName = (item: StockItem, lang: 'en' | 'de' | 'hu' = 'en') => {
    if (lang === 'de') return item.nameDe
    if (lang === 'hu') return item.nameHu
    return item.nameEn
  }

  return {
    stock,
    loading,
    fetchStock,
    addToStock,
    updateStockItem,
    deleteStockItem,
    getItemName
  }
}
