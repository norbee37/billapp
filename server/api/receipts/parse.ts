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
    'loose', 'fresh', 'unpackaged', 'bulk', 'organic'
  ],
  'Mixed': [
    'tetra pak', 'tetrapak', 'composite', 'mixed material', 'mixed'
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

function categorizeWaste(packagingInfo: string): string[] {
  const lowerInfo = packagingInfo.toLowerCase()
  const categories = new Set<string>()
  
  // Check all categories and collect matches
  for (const [category, keywords] of Object.entries(wasteCategoryKeywords)) {
    for (const keyword of keywords) {
      if (lowerInfo.includes(keyword)) {
        categories.add(category)
        break // Found match for this category, move to next
      }
    }
  }
  
  // Return array, or default to plastic if nothing found
  return categories.size > 0 ? Array.from(categories) : ['Plastic']
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
8. **CRITICAL: Extract the PURCHASE DATE AND TIME from the receipt (look for date/time near the top)**
9. **CRITICAL: PREDICT EXPIRATION/FRESHNESS for each product based on type and storage**
10. **CRITICAL: Determine ALL PACKAGING TYPES for waste management (products can have MULTIPLE types)**

FRESHNESS PREDICTION GUIDELINES:
- Consider product type, category, and typical shelf life
- Account for storage conditions (refrigerated, frozen, room temp)
- Predict DAYS_UNTIL_EXPIRATION from purchase date
- Be realistic and food-safety conscious

TYPICAL FRESHNESS PERIODS:
- **Fresh Meat/Poultry**: 1-2 days (refrigerated)
- **Fresh Fish/Seafood**: 1-2 days (refrigerated)
- **Dairy (Milk, Yogurt)**: 5-7 days (refrigerated, unopened)
- **Cheese (hard)**: 14-30 days (refrigerated)
- **Fresh Vegetables**: 3-7 days (refrigerated)
- **Fresh Fruits**: 3-10 days (room temp or refrigerated)
- **Bread**: 2-3 days (room temp)
- **Eggs**: 21-28 days (refrigerated)
- **Frozen items**: 90-180 days (frozen)
- **Pantry staples**: 180-365 days (dry, sealed)
- **Canned goods**: 365+ days (sealed)

PACKAGING DETECTION - IMPORTANT GUIDELINES:
- **Many products have MULTIPLE packaging components** - list ALL of them
- Think about the actual packaging layers: outer box, inner wrap, container, lid, etc.
- Common packaging types:
  * **Plastic**: bottles, bags, wrapped items, trays, film wrap, plastic containers
  * **Glass**: glass bottles, glass jars
  * **Paper**: cardboard boxes, paper bags, egg cartons, labels
  * **Metal**: cans (tuna, beans, soda), aluminum foil, metal lids
  * **Organic**: loose fresh produce (fruits, vegetables sold by weight without ANY packaging)
  * **Mixed**: Tetra Pak (composite juice/milk cartons with plastic-paper-aluminum layers)

DETAILED PACKAGING EXAMPLES:
  * "Milk 1L carton" → ["mixed", "plastic"] (Tetra Pak carton + plastic cap)
  * "Cheese sliced 200g" → ["plastic", "paper"] (plastic wrap + paper label/backing)
  * "Tomatoes loose 500g" → ["organic"] (no packaging)
  * "Tomatoes pre-packed 500g" → ["plastic", "paper"] (plastic tray + cardboard label)
  * "Beer bottle" → ["glass", "metal", "paper"] (glass bottle + metal cap + paper label)
  * "Tuna can" → ["metal", "paper"] (metal can + paper label)
  * "Orange juice carton" → ["mixed", "plastic"] (Tetra Pak + plastic cap)
  * "Yogurt cup" → ["plastic", "paper"] (plastic cup + paper lid)
  * "Bread" → ["plastic", "paper"] (plastic bag + paper label) OR ["paper"] if in paper bag only
  * "Eggs carton" → ["paper"] (cardboard carton)
  * "Butter" → ["paper", "plastic"] (paper wrapper + inner plastic/foil)
  * "Pasta pack" → ["plastic", "paper"] (plastic bag + cardboard box) OR ["plastic"] if bag only
  * "Chocolate bar" → ["plastic", "paper"] (plastic inner wrap + paper outer wrapper)
  * "Frozen pizza" → ["plastic", "paper"] (plastic wrap + cardboard box)
  * "Jam jar" → ["glass", "metal"] (glass jar + metal lid)
  * "Soda can" → ["metal"] (aluminum can)
  * "Water bottle" → ["plastic"] (PET bottle + plastic cap, count as one)
  * "Wine bottle" → ["glass", "metal", "paper"] (glass + metal cap/cork + paper label)

PRODUCT TYPE HINTS (use to infer typical packaging):
- Dairy (milk, yogurt, cheese): Usually plastic + paper, or mixed (Tetra Pak)
- Meat/Fish: Usually plastic tray + plastic wrap + paper label
- Bread/Bakery: Paper bags or plastic bags with paper labels
- Beverages in cartons: Mixed (Tetra Pak) + plastic cap
- Beverages in bottles: Glass or plastic, often with metal caps and paper labels
- Canned goods: Metal + paper label
- Fresh produce loose: Organic (no packaging)
- Fresh produce packed: Plastic tray/bag + paper label

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
  "purchaseDate": "2025-01-29T14:35:00",
  "items": [
    {
      "nameEn": "Product name in English",
      "nameDe": "Produktname auf Deutsch",
      "nameHu": "Terméknév magyarul",
      "quantity": 1.5,
      "unit": "kg|g|L|ml|pcs",
      "price": 2.99,
      "packaging": ["plastic", "paper"],
      "daysUntilExpiration": 3
    }
  ]
}

Return ONLY valid JSON, nothing else. Every item MUST have:
- All three name fields (nameEn, nameDe, nameHu)
- A packaging field as an ARRAY (even if just one type, e.g., ["organic"])
- daysUntilExpiration as a NUMBER (realistic estimate based on product type)
- Think carefully about ALL packaging components!
- The purchaseDate field in ISO format (YYYY-MM-DDTHH:MM:SS), including time if available on receipt`

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
    
    // Extract purchase date from the receipt, default to today if not found
    const purchaseDate = parsed.purchaseDate ? new Date(parsed.purchaseDate) : new Date()
    
    const items: ParsedItem[] = parsed.items.map((item: any) => {
      // Calculate expiration date from daysUntilExpiration
      const expiresAt = item.daysUntilExpiration 
        ? new Date(purchaseDate.getTime() + item.daysUntilExpiration * 24 * 60 * 60 * 1000)
        : undefined
      
      return {
        nameEn: item.nameEn || item.name || 'Unknown',
        nameDe: item.nameDe || item.name || 'Unbekannt',
        nameHu: item.nameHu || item.name || 'Ismeretlen',
        quantity: item.quantity || 1,
        unit: item.unit || 'pcs',
        price: item.price || 0,
        category: categorizeProduct(item.nameEn || item.name || ''),
        wasteCategories: item.packaging 
          ? (Array.isArray(item.packaging) 
              ? categorizeWaste(item.packaging.join(' ')) 
              : categorizeWaste(item.packaging))
          : ['Plastic'],
        purchaseDate,
        expiresAt
      }
    })

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
  // Use a recent mock date with time (e.g., 3 days ago at 14:35)
  const mockPurchaseDate = new Date()
  mockPurchaseDate.setDate(mockPurchaseDate.getDate() - 3)
  mockPurchaseDate.setHours(14, 35, 0, 0) // Set to 14:35:00
  
  const sampleProducts = [
    { nameEn: 'Organic Apples', nameDe: 'Bio Äpfel', nameHu: 'Bio Alma', quantity: 1.5, unit: 'kg', price: 4.99, packaging: 'organic', daysUntilExpiration: 7 },
    { nameEn: 'Whole Milk', nameDe: 'Vollmilch', nameHu: 'Teljes Tej', quantity: 2, unit: 'L', price: 3.49, packaging: 'mixed plastic', daysUntilExpiration: 6 },
    { nameEn: 'Bread', nameDe: 'Brot', nameHu: 'Kenyér', quantity: 1, unit: 'loaf', price: 2.99, packaging: 'paper plastic', daysUntilExpiration: 2 },
    { nameEn: 'Eggs', nameDe: 'Eier', nameHu: 'Tojás', quantity: 12, unit: 'pcs', price: 4.99, packaging: 'paper', daysUntilExpiration: 25 },
    { nameEn: 'Chicken Breast', nameDe: 'Hähnchenbrust', nameHu: 'Csirkemell', quantity: 0.8, unit: 'kg', price: 9.99, packaging: 'plastic paper', daysUntilExpiration: 1 },
    { nameEn: 'Tomatoes', nameDe: 'Tomaten', nameHu: 'Paradicsom', quantity: 0.5, unit: 'kg', price: 2.49, packaging: 'organic', daysUntilExpiration: 5 },
    { nameEn: 'Orange Juice', nameDe: 'Orangensaft', nameHu: 'Narancslé', quantity: 1, unit: 'L', price: 3.99, packaging: 'mixed plastic', daysUntilExpiration: 10 },
    { nameEn: 'Butter', nameDe: 'Butter', nameHu: 'Vaj', quantity: 250, unit: 'g', price: 3.49, packaging: 'paper plastic', daysUntilExpiration: 14 },
    { nameEn: 'Pasta', nameDe: 'Nudeln', nameHu: 'Tészta', quantity: 500, unit: 'g', price: 1.99, packaging: 'plastic paper', daysUntilExpiration: 365 },
    { nameEn: 'Cheese', nameDe: 'Käse', nameHu: 'Sajt', quantity: 200, unit: 'g', price: 4.49, packaging: 'plastic paper', daysUntilExpiration: 20 }
  ]

  // Return 3-6 random items with categories and expiration
  const numItems = Math.floor(Math.random() * 4) + 3
  const shuffled = sampleProducts.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, numItems).map(item => {
    const expiresAt = new Date(mockPurchaseDate.getTime() + item.daysUntilExpiration * 24 * 60 * 60 * 1000)
    return {
      nameEn: item.nameEn,
      nameDe: item.nameDe,
      nameHu: item.nameHu,
      quantity: item.quantity,
      unit: item.unit,
      price: item.price,
      category: categorizeProduct(item.nameEn),
      wasteCategories: categorizeWaste(item.packaging),
      purchaseDate: mockPurchaseDate,
      expiresAt
    }
  })
}
