export interface StockItem {
  id: string
  name: string
  quantity: number
  unit?: string
  price?: number
  category?: string
  addedAt: Date
  expiresAt?: Date
}

export interface Receipt {
  id: string
  storeName?: string
  date: Date
  items: ParsedItem[]
  total?: number
  uploadedAt: Date
}

export interface ParsedItem {
  name: string
  quantity: number
  unit?: string
  price?: number
}
