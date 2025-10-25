export interface StockItem {
  id: string
  nameEn: string  // English name (used as ID/grouping key)
  nameDe: string  // German translation
  nameHu: string  // Hungarian translation
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
  nameEn: string  // English name
  nameDe: string  // German translation
  nameHu: string  // Hungarian translation
  quantity: number
  unit?: string
  price?: number
  category?: string
}
