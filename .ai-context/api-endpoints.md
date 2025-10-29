# API Endpoints

## Base URL
Development: `http://localhost:3000/api`

## Authentication
None currently - single user assumed.

---

## Receipt Parsing

### Parse Receipt Image

**Endpoint**: `POST /api/receipts/parse`

**File**: `server/api/receipts/parse.ts`

**Description**: Parses a receipt image using AI to extract product information.

**Request**:
- **Content-Type**: `multipart/form-data`
- **Body**: 
  - `file`: Image file (JPEG, PNG, HEIC)
- **Query Parameters**:
  - `provider` (optional): `'gemini' | 'chatgpt' | 'dummy'` (default: `'gemini'`)

**Response**:
```json
{
  "items": [
    {
      "nameEn": "Organic Apples",
      "nameDe": "Bio Äpfel",
      "nameHu": "Bio Alma",
      "quantity": 1.5,
      "unit": "kg",
      "price": 4.99,
      "category": "Fruits",
      "wasteCategories": ["organic"],
      "purchaseDate": "2025-10-26T00:00:00.000Z"
    }
  ],
  "message": "Receipt parsed successfully using gemini"
}
```

**Error Responses**:
- `400` - No file uploaded / Invalid file data
- `500` - Gemini API error / Parsing failed
- `501` - ChatGPT provider not implemented

**Implementation Details**:
- Uses Google Gemini 2.0 Flash Exp model
- Prompt includes multilingual instructions
- Extracts: purchase date from receipt, names (3 languages), quantities, units, prices
- Auto-categorizes products (keyword matching)
- Detects packaging types for waste categories
- Falls back to mock data if `GEMINI_API_KEY` not set

**Provider Options**:
- `gemini`: Uses Google Gemini Vision API (requires API key)
- `dummy`: Returns mock data (for testing)
- `chatgpt`: Not implemented yet (returns 501)

---

## Stock Management

### List All Stock Items

**Endpoint**: `GET /api/stock`

**File**: `server/api/stock/index.ts`

**Description**: Returns all items currently in stock.

**Request**: No body

**Response**:
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "nameEn": "Milk",
    "nameDe": "Milch",
    "nameHu": "Tej",
    "quantity": 2,
    "unit": "L",
    "price": 3.49,
    "category": "Dairy",
    "wasteCategories": ["mixed", "plastic"],
    "purchaseDate": "2025-10-26T00:00:00.000Z",
    "createdAt": "2025-10-29T10:30:00.000Z",
    "expiresAt": null
  }
]
```

**Error Responses**: None (returns empty array if no items)

---

### Add Items to Stock

**Endpoint**: `POST /api/stock`

**File**: `server/api/stock/index.ts`

**Description**: Adds new items to stock inventory. Creates separate entries for each item (doesn't merge with existing).

**Request**:
```json
{
  "items": [
    {
      "nameEn": "Bread",
      "nameDe": "Brot",
      "nameHu": "Kenyér",
      "quantity": 1,
      "unit": "loaf",
      "price": 2.99,
      "category": "Bakery",
      "wasteCategories": ["paper", "plastic"],
      "purchaseDate": "2025-10-26T00:00:00.000Z"
    }
  ]
}
```

**Response**:
```json
[
  {
    "id": "234e5678-e89b-12d3-a456-426614174001",
    "nameEn": "Bread",
    "nameDe": "Brot",
    "nameHu": "Kenyér",
    "quantity": 1,
    "unit": "loaf",
    "price": 2.99,
    "category": "Bakery",
    "wasteCategories": ["paper", "plastic"],
    "purchaseDate": "2025-10-26T00:00:00.000Z",
    "createdAt": "2025-10-29T10:35:00.000Z",
    "expiresAt": null
  }
]
```

**Implementation Details**:
- Generates UUID for each item
- Sets `purchaseDate` from item (or current date if not provided)
- Sets `createdAt` to current timestamp
- Handles backward compatibility: `wasteCategory` (string) → `wasteCategories` (array)
- Does NOT merge with existing items (creates new entry)

**Error Responses**:
- `405` - Method not allowed (wrong HTTP method)

---

### Delete Stock Item

**Endpoint**: `DELETE /api/stock/:id`

**File**: `server/api/stock/[id].ts`

**Description**: Removes a specific item from stock by ID.

**Request**: No body

**URL Parameters**:
- `id`: UUID of the stock item

**Response**: 
- Status `200` with `{ success: true }` if deleted
- Status `404` if item not found

**Error Responses**:
- `404` - Item not found
- `405` - Method not allowed (wrong HTTP method)

**Implementation Details**:
- Removes item from in-memory array
- Uses `findIndex()` and `splice()`

---

## Recipe Generation

### Generate Recipe Suggestions

**Endpoint**: `POST /api/recipes/generate`

**File**: `server/api/recipes/generate.ts`

**Description**: Generates recipe suggestions based on available ingredients using AI.

**Request**:
```json
{
  "ingredients": [
    "Chicken Breast",
    "Tomatoes",
    "Pasta",
    "Cheese"
  ]
}
```

**Response**:
```json
{
  "recipes": "**Recipe 1: Chicken Tomato Pasta**\n\nIngredients:\n- Chicken breast\n- Tomatoes\n- Pasta\n- Cheese\n\nInstructions:\n1. Cook pasta...\n2. Grill chicken...\n..."
}
```

**Error Responses**:
- `400` - No ingredients provided
- `500` - Gemini API error

**Implementation Details**:
- Uses Google Gemini for text generation
- Simple prompt: "Create recipes using: {ingredients}"
- Returns raw text response
- **Status**: Experimental, not fully integrated

---

## Implementation Notes

### In-Memory Storage
- All stock data stored in `stockItems` array in `server/api/stock/index.ts`
- Data lost on server restart
- No pagination (returns all items)
- No filtering/sorting on backend

### Error Handling Pattern
```typescript
throw createError({
  statusCode: 400,
  message: 'User-friendly error message'
})
```

### File Upload Handling
```typescript
const form = await readMultipartFormData(event)
const file = form[0]
const imageData = file.data  // Buffer
const mimeType = file.type   // 'image/jpeg', etc.
```

### CORS
Not configured - assumes same-origin requests.

### Rate Limiting
None - careful with Gemini API usage.

## Future Endpoints (Not Implemented)

Potential additions:

- `GET /api/stock/stats` - Inventory statistics
- `GET /api/stock/search?q=milk` - Search items
- `GET /api/stock/expiring` - Items expiring soon
- `PATCH /api/stock/:id` - Update item
- `GET /api/receipts` - Receipt history
- `GET /api/receipts/:id` - Single receipt
- `POST /api/users/login` - User authentication
- `GET /api/waste/stats` - Waste category statistics
