import { GoogleGenerativeAI } from '@google/generative-ai'
import type { ParsedItem } from '~/types'

// Category mappings (English only - LLM translates first)
const categoryKeywords: Record<string, string[]> = {
  'Vegetables': [
    'tomato', 'potato', 'carrot', 'lettuce', 'cucumber', 'onion', 'pepper', 'bell pepper', 'broccoli', 'spinach', 
    'cabbage', 'celery', 'zucchini', 'courgette', 'eggplant', 'aubergine', 'cauliflower', 'mushroom', 'garlic', 
    'ginger', 'radish', 'beetroot', 'beet', 'leek', 'vegetable', 'veggie', 'greens'
  ],
  'Fruits': [
    'apple', 'banana', 'orange', 'grape', 'strawberry', 'blueberry', 'raspberry', 'blackberry', 'mango', 
    'pineapple', 'watermelon', 'melon', 'peach', 'pear', 'cherry', 'lemon', 'lime', 'kiwi', 'avocado', 
    'plum', 'fruit', 'berry', 'citrus'
  ],
  'Meat': [
    'chicken', 'beef', 'pork', 'turkey', 'lamb', 'duck', 'bacon', 'sausage', 'ham', 'steak', 'mince', 
    'ground beef', 'meat', 'poultry', 'cutlet', 'schnitzel', 'salami', 'fillet', 'bratwurst'
  ],
  'Fish & Seafood': [
    'salmon', 'tuna', 'cod', 'shrimp', 'prawn', 'crab', 'lobster', 'fish', 'seafood', 'tilapia', 
    'mackerel', 'trout', 'haddock', 'herring', 'anchovy'
  ],
  'Dairy': [
    'milk', 'cheese', 'yogurt', 'yoghurt', 'butter', 'cream', 'ice cream', 'sour cream', 'cottage cheese', 
    'mozzarella', 'cheddar', 'parmesan', 'gouda', 'quark', 'kefir', 'whey', 'dairy', 'buttermilk'
  ],
  'Bakery': [
    'bread', 'baguette', 'roll', 'bun', 'croissant', 'bagel', 'muffin', 'donut', 'doughnut', 'cake', 
    'pastry', 'pretzel', 'toast', 'wholegrain', 'wholemeal', 'wheat', 'rye', 'ciabatta', 'flatbread'
  ],
  'Beverages': [
    'juice', 'soda', 'water', 'coffee', 'tea', 'beer', 'wine', 'cola', 'lemonade', 'shake', 'smoothie', 
    'drink', 'beverage', 'sparkling', 'mineral water', 'energy drink', 'soft drink'
  ],
  'Pantry': [
    'pasta', 'noodle', 'rice', 'flour', 'sugar', 'salt', 'oil', 'vinegar', 'sauce', 'cereal', 'oats', 
    'beans', 'lentils', 'quinoa', 'honey', 'jam', 'spread', 'canned', 'jar', 'spice', 'pepper', 
    'seasoning', 'condiment'
  ],
  'Snacks': [
    'chips', 'crisps', 'crackers', 'cookies', 'biscuit', 'chocolate', 'candy', 'sweet', 'popcorn', 
    'nuts', 'peanut', 'almond', 'cashew', 'pretzel', 'granola', 'bar', 'snack'
  ],
  'Frozen': [
    'frozen', 'freeze', 'frost'
  ],
  'Other': []
}

// Waste category mappings for packaging types
const wasteCategoryKeywords: Record<string, string[]> = {
  'Plastic': [
    'bottle', 'bag', 'wrap', 'tray', 'container', 'pack', 'packaging', 'film', 'plastic'
  ],
  'Glass': [
    'jar', 'glass', 'bottle glass'
  ],
  'Paper': [
    'cardboard', 'box', 'carton', 'paper', 'bag paper'
  ],
  'Metal': [
    'can', 'tin', 'aluminum', 'aluminium', 'foil', 'metal'
  ],
  'Organic': [
    'loose', 'fresh', 'unpackaged', 'bulk'
  ],
  'Mixed': [
    'tetra pak', 'tetrapak', 'composite', 'mixed material'
  ]
}

function categorizeProduct(name: string): string {
  const lowerName = name.toLowerCase()
  
  // Priority order: specific categories first, then general
  const priorityOrder = [
    'Frozen',
    'Meat', 
    'Fish & Seafood',
    'Dairy',
    'Bakery',
    'Fruits',
    'Vegetables',
    'Beverages',
    'Snacks',
    'Pantry'
  ]
  
  for (const category of priorityOrder) {
    const keywords = categoryKeywords[category]
    if (!keywords) continue
    
    for (const keyword of keywords) {
      if (lowerName.includes(keyword)) {
        return category
      }
    }
  }
  
  return 'Other'
}

function categorizeWaste(packagingInfo: string): string {
  const lowerInfo = packagingInfo.toLowerCase()
  
  // Priority order for waste categories
  const priorityOrder = ['Glass', 'Metal', 'Paper', 'Mixed', 'Plastic', 'Organic']
  
  for (const category of priorityOrder) {
    const keywords = wasteCategoryKeywords[category]
    if (!keywords) continue
    
    for (const keyword of keywords) {
      if (lowerInfo.includes(keyword)) {
        return category
      }
    }
  }
  
  return 'Plastic' // Default to plastic as most common packaging
}

const RECEIPT_PARSING_PROMPT = `You are a receipt parsing assistant. Analyze the receipt image and extract ALL items purchased.

SUPPORTED RECEIPT LANGUAGES: English, German, Hungarian
IMPORTANT: Return product names in ALL THREE LANGUAGES (English, German, Hungarian)

RULES:
1. Extract EVERY product line item from the receipt
2. Provide translations in ALL three languages for each product
3. Expand abbreviated names to full, clear names
4. Look for quantity indicators (weight in kg/g, volume in L/ml, or piece count)
5. Extract individual item prices (not subtotals or totals)
6. If quantity is unclear, assume 1 piece
7. Ignore non-product lines (payment info, store details, promotions)
8. **CRITICAL: Determine the PACKAGING TYPE for waste management**

PACKAGING DETECTION:
- Analyze the store name and product type to infer packaging
- Common packaging types:
  * Plastic: bottles, bags, wrapped items, trays, most dairy, meat, cheese
  * Glass: glass bottles, jars (pickles, jams)
  * Paper: cardboard boxes, paper bags, egg cartons
  * Metal: cans (tuna, beans, soda cans)
  * Organic: loose fresh produce (fruits, vegetables sold by weight without packaging)
  * Mixed: Tetra Pak (juice boxes, milk cartons), composite materials
- Examples:
  * "Milk 1L" → likely plastic bottle or mixed (Tetra Pak)
  * "Cheese sliced 200g" → plastic packaging
  * "Tomatoes 500g" → organic (loose) or plastic (if pre-packaged)
  * "Beer bottle" → glass bottle
  * "Tuna can" → metal can
  * "Orange juice carton" → mixed (Tetra Pak)

TRANSLATION EXAMPLES:
Receipt says "Milch" → Output: { nameEn: "Milk", nameDe: "Milch", nameHu: "Tej" }
Receipt says "Bread" → Output: { nameEn: "Bread", nameDe: "Brot", nameHu: "Kenyér" }
Receipt says "Sajt" → Output: { nameEn: "Cheese", nameDe: "Käse", nameHu: "Sajt" }
Receipt says "Paprika rot" → Output: { nameEn: "Red Bell Pepper", nameDe: "Rote Paprika", nameHu: "Piros Paprika" }

COMMON ABBREVIATIONS TO EXPAND:
- Bio/Org/Öko → Organic / Bio / Bio
- TK → Frozen / Tiefgekühlt / Fagyasztott
- Vollkorn → Wholegrain / Vollkorn / Teljes Kiőrlésű

OUTPUT FORMAT (JSON only, no markdown):
{
  "storeName": "Store name from receipt",
  "items": [
    {
      "nameEn": "Product name in English",
      "nameDe": "Produktname auf Deutsch",
      "nameHu": "Terméknév magyarul",
      "quantity": 1.5,
      "unit": "kg|g|L|ml|pcs",
      "price": 2.99,
      "packaging": "plastic|glass|paper|metal|organic|mixed"
    }
  ]
}

Return ONLY valid JSON, nothing else. Every item MUST have all three name fields (nameEn, nameDe, nameHu) and a packaging field.`

async function parseReceiptWithGemini(imageData: Buffer, mimeType: string): Promise<ParsedItem[]> {
  const apiKey = process.env.GEMINI_API_KEY
  
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not set, using mock data')
    return generateMockItems()
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    const imagePart = {
      inlineData: {
        data: imageData.toString('base64'),
        mimeType
      }
    }

    const result = await model.generateContent([RECEIPT_PARSING_PROMPT, imagePart])
    const response = await result.response
    const text = response.text()

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const parsed = JSON.parse(jsonMatch[0])
    
    const items: ParsedItem[] = parsed.items.map((item: any) => ({
      nameEn: item.nameEn || item.name || 'Unknown',
      nameDe: item.nameDe || item.name || 'Unbekannt',
      nameHu: item.nameHu || item.name || 'Ismeretlen',
      quantity: item.quantity || 1,
      unit: item.unit || 'pcs',
      price: item.price || 0,
      category: categorizeProduct(item.nameEn || item.name || ''),
      wasteCategory: item.packaging ? categorizeWaste(item.packaging) : 'Plastic'
    }))

    return items
  } catch (error) {
    console.error('Gemini API error:', error)
    throw createError({
      statusCode: 500,
      message: `Failed to parse receipt: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }
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

  const query = getQuery(event)
  const provider = (query.provider as string) || 'gemini'

  let items: ParsedItem[]

  if (provider === 'dummy') {
    items = generateMockItems()
  } else if (provider === 'gemini') {
    const mimeType = file.type || 'image/jpeg'
    items = await parseReceiptWithGemini(file.data, mimeType)
  } else if (provider === 'chatgpt') {
    throw createError({
      statusCode: 501,
      message: 'ChatGPT provider not yet implemented'
    })
  } else {
    throw createError({
      statusCode: 400,
      message: `Unknown provider: ${provider}`
    })
  }

  return {
    items,
    message: `Receipt parsed successfully using ${provider}`
  }
})

// Generate mock parsed items for demonstration
function generateMockItems(): ParsedItem[] {
  const sampleProducts = [
    { nameEn: 'Organic Apples', nameDe: 'Bio Äpfel', nameHu: 'Bio Alma', quantity: 1.5, unit: 'kg', price: 4.99, packaging: 'organic' },
    { nameEn: 'Whole Milk', nameDe: 'Vollmilch', nameHu: 'Teljes Tej', quantity: 2, unit: 'L', price: 3.49, packaging: 'mixed' },
    { nameEn: 'Bread', nameDe: 'Brot', nameHu: 'Kenyér', quantity: 1, unit: 'loaf', price: 2.99, packaging: 'paper' },
    { nameEn: 'Eggs', nameDe: 'Eier', nameHu: 'Tojás', quantity: 12, unit: 'pcs', price: 4.99, packaging: 'paper' },
    { nameEn: 'Chicken Breast', nameDe: 'Hähnchenbrust', nameHu: 'Csirkemell', quantity: 0.8, unit: 'kg', price: 9.99, packaging: 'plastic' },
    { nameEn: 'Tomatoes', nameDe: 'Tomaten', nameHu: 'Paradicsom', quantity: 0.5, unit: 'kg', price: 2.49, packaging: 'organic' },
    { nameEn: 'Orange Juice', nameDe: 'Orangensaft', nameHu: 'Narancslé', quantity: 1, unit: 'L', price: 3.99, packaging: 'mixed' },
    { nameEn: 'Butter', nameDe: 'Butter', nameHu: 'Vaj', quantity: 250, unit: 'g', price: 3.49, packaging: 'paper' },
    { nameEn: 'Pasta', nameDe: 'Nudeln', nameHu: 'Tészta', quantity: 500, unit: 'g', price: 1.99, packaging: 'plastic' },
    { nameEn: 'Cheese', nameDe: 'Käse', nameHu: 'Sajt', quantity: 200, unit: 'g', price: 4.49, packaging: 'plastic' }
  ]

  // Return 3-6 random items with categories
  const numItems = Math.floor(Math.random() * 4) + 3
  const shuffled = sampleProducts.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, numItems).map(item => ({
    ...item,
    category: categorizeProduct(item.nameEn),
    wasteCategory: categorizeWaste(item.packaging)
  }))
}
