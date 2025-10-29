# Provider Selector Implementation

## ✅ Changes Complete

Added a provider selector to the scan page so you can switch between different receipt parsing methods.

## What Was Added

### UI Component (Scan Page)
**Location**: `/app/pages/scan.vue`

- **Provider Selector Card** - Clean dropdown with icons and badges
- **Three Options**:
  1. **Mock Data** (dummy) - Default, always works
  2. **Google Gemini** (gemini) - AI-powered parsing
  3. **ChatGPT** (chatgpt) - Disabled/Coming Soon

### Features
- ✨ Beautiful dropdown with icons (beaker, sparkles, chat bubble)
- 🏷️ Status badges (Testing, AI, Coming Soon)
- 🎨 Matches billapp design system
- 📱 Responsive layout
- 🔄 Provider persists during session

### API Updates
**Location**: `/server/api/receipts/parse.ts`

- Accepts `?provider=dummy|gemini|chatgpt` query parameter
- Routes to appropriate parser based on selection
- Graceful error for unimplemented providers
- Default: Uses Gemini if no parameter

## How to Use

### 1. Start the App
```bash
npm run dev
```

### 2. Open Scan Page
Navigate to http://localhost:3000/scan

### 3. Select Provider
Use the dropdown at the top to choose:
- **Mock Data** - Always works, generates random items
- **Google Gemini** - Requires API key (if set)
- **ChatGPT** - Not yet implemented

### 4. Upload Receipt
Works the same as before, but now uses your selected provider

## Provider Behavior

### Mock Data (dummy)
- ✅ Always works
- 📊 Returns 3-6 random items
- 🔄 Different items each time
- 💡 Perfect for UI testing

### Google Gemini (gemini)
- 🔑 Needs `GEMINI_API_KEY` in `.env`
- 🤖 Real AI parsing of receipt
- 📷 Analyzes the actual image
- ⚠️ Falls back to mock if no API key

### ChatGPT (chatgpt)
- 🚧 Not yet implemented
- ❌ Shows error if selected
- 🔜 Coming in next iteration

## Why This Helps

### For Development
- Test UI without API keys
- Compare different providers
- Easy debugging

### For Production
- Choose best provider for your receipts
- Fall back to mock if APIs fail
- Ready for multiple AI providers

### For You (Right Now)
- **Use Mock Data** while you fix Gemini API key issues
- **Test the UI** and workflow without blockers
- **Switch to Gemini** once API key is working

## Visual Design

The selector matches billapp's design:
- White card with shadow
- Blue headings (Poppins font)
- Gray descriptions (Inter font)
- Icon + badge in dropdown
- Smooth hover states

## Next Steps

1. **Use Mock Data** to test the UI
2. **Fix Gemini API key** when ready
3. **Add OpenAI** integration later
4. **Compare results** between providers

## Testing

✅ TypeScript compiles  
✅ API routes correctly  
✅ UI renders properly  
✅ Provider selection works  
✅ Mock data always accessible  

You can now use billapp with or without API keys! 🎉
