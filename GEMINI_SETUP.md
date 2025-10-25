# Google Gemini Setup Guide

## Quick Start

### 1. Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google Workspace account
3. Click "Create API Key"
4. Copy the key

### 2. Configure billapp

```bash
# Create your .env file
cp .env.example .env

# Edit .env and paste your API key
nano .env  # or use your preferred editor
```

Your `.env` should look like:
```
GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

### 3. Test It

```bash
# Start the dev server
npm run dev

# Open http://localhost:3000/scan
# Upload your Lidl receipt (docs/lidl-receipt-1.jpg)
# See the magic happen!
```

## How It Works

1. **Upload**: You upload a receipt image (JPG/PNG)
2. **Analysis**: Image is sent to Gemini 2.0 Flash (experimental model)
3. **Extraction**: AI parses the receipt and extracts:
   - Store name (e.g., "Lidl")
   - Product names (expanded from abbreviations)
   - Quantities with units (kg, g, L, ml, pcs)
   - Individual prices
4. **Categorization**: Items are auto-categorized (Vegetables, Dairy, etc.)
5. **Review**: You can edit before adding to stock

## Prompt Tuning

The parsing quality depends heavily on the prompt. Edit it in:
```
/server/api/receipts/parse.ts
```

Look for `RECEIPT_PARSING_PROMPT` constant around line 35.

### Tips for Better Results

**If Gemini misses items:**
- Add more emphasis in the prompt: "Extract EVERY SINGLE product"
- Specify common patterns: "Look for product codes like '12345678'"

**If abbreviations aren't expanded:**
- Add specific examples: "BROT → Bread, MILCH → Milk"
- Include language context: "Receipt is in German/English"

**If quantities are wrong:**
- Add examples: "0.5 kg, 250 g, 1 L, 2 pcs"
- Clarify units: "Convert all weights to kg or g"

**If prices are wrong:**
- Emphasize: "Extract ONLY individual item prices, not subtotals"
- Add format: "Prices are in format: 2.99 EUR or 2,99€"

## Cost Tracking

Gemini 2.0 Flash free tier:
- **15 requests/minute**
- **1,000,000 requests/day**
- **No credit card required**

Your Lidl receipt (~710KB) uses roughly:
- ~1,000 tokens input (image)
- ~200 tokens output (JSON)
- **Total: FREE** (well within limits)

You can parse **thousands** of receipts per day without paying!

## Troubleshooting

### "GEMINI_API_KEY not set"
- Check your `.env` file exists
- Verify the key is correct (starts with `AIzaSy`)
- Restart the dev server after adding the key

### "No JSON found in response"
- Gemini might be returning markdown format
- Check console logs for raw response
- Adjust prompt to emphasize "JSON only, no markdown"

### Poor Accuracy
- Test with the example receipt first
- Check receipt image quality (not blurry, good lighting)
- Iterate on the prompt (see "Prompt Tuning" above)
- Try different Gemini models (gemini-pro, gemini-pro-vision)

### Rate Limits
- Free tier: 15 req/min, 1M req/day
- Add delays between uploads if hitting limits
- Consider caching parsed results

## Next Steps

1. **Test with your Lidl receipt** (`docs/lidl-receipt-1.jpg`)
2. **Compare results** with what you expect
3. **Iterate the prompt** for better accuracy
4. **Try more receipts** to validate consistency

Once you're happy with Gemini results, we can add OpenAI as an alternative!
