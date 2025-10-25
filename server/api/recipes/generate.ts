import { GoogleGenerativeAI } from '@google/generative-ai'

interface RecipeRequest {
  ingredients: Array<{
    nameEn: string
    nameDe: string
    nameHu: string
    quantity: number
    unit?: string
  }>
  recipeType: string
  hint?: string
  provider: string
  language: string
  variation?: number
}

interface GeneratedRecipe {
  title: string
  prepTime: number
  servings: number
  ingredients: Array<{ text: string, available: boolean }>
  instructions: string[]
  tips?: string[]
}

const RECIPE_GENERATION_PROMPT = (ingredients: string[], recipeType: string, hint: string, language: string, variation: number) => `You are a professional chef assistant. Generate a delicious recipe based on the available ingredients.

AVAILABLE INGREDIENTS:
${ingredients.join(', ')}

RECIPE TYPE: ${recipeType === 'anything' ? 'Any meal type' : recipeType}
${hint ? `ADDITIONAL REQUIREMENTS: ${hint}` : ''}
OUTPUT LANGUAGE: ${language.toUpperCase()}

VARIATION: ${variation + 1} of 3
IMPORTANT: This is variation ${variation + 1}. Make it SIGNIFICANTLY DIFFERENT from typical ${recipeType} recipes. Use different cooking methods, flavor profiles, or cuisines.
${variation === 0 ? 'Make this a simple, quick recipe.' : ''}
${variation === 1 ? 'Make this recipe more complex and flavorful, perhaps with an ethnic or regional twist.' : ''}
${variation === 2 ? 'Make this recipe creative and unique, combining unexpected ingredients or using unusual techniques.' : ''}

RULES:
1. Create a recipe that uses as many available ingredients as possible
2. If additional ingredients are needed, list them clearly
3. Be creative but practical
4. Provide clear, step-by-step instructions
5. Include preparation time and servings
6. Add helpful cooking tips
7. Return ALL text in ${language.toUpperCase()} language
8. MAKE EACH VARIATION DISTINCTLY DIFFERENT - different cuisine style, cooking method, or flavor profile

OUTPUT FORMAT (JSON only, no markdown):
{
  "title": "Recipe name in ${language.toUpperCase()}",
  "prepTime": 30,
  "servings": 4,
  "ingredients": [
    {"text": "Ingredient with amount in ${language.toUpperCase()}", "available": true},
    {"text": "Missing ingredient with amount in ${language.toUpperCase()}", "available": false}
  ],
  "instructions": [
    "Step 1 in ${language.toUpperCase()}",
    "Step 2 in ${language.toUpperCase()}"
  ],
  "tips": [
    "Tip 1 in ${language.toUpperCase()}",
    "Tip 2 in ${language.toUpperCase()}"
  ]
}

Return ONLY valid JSON, nothing else. Use ${language.toUpperCase()} for all text fields.`

async function generateRecipeWithGemini(request: RecipeRequest): Promise<GeneratedRecipe> {
  const apiKey = process.env.GEMINI_API_KEY
  
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not set, using mock data')
    return generateMockRecipe(request)
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    // Get ingredient names in the target language
    const ingredientNames = request.ingredients.map(ing => {
      if (request.language === 'de') return ing.nameDe
      if (request.language === 'hu') return ing.nameHu
      return ing.nameEn
    })

    const prompt = RECIPE_GENERATION_PROMPT(
      ingredientNames,
      request.recipeType,
      request.hint || '',
      request.language,
      request.variation || 0
    )

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const recipe = JSON.parse(jsonMatch[0])
    return recipe as GeneratedRecipe
  } catch (error) {
    console.error('Gemini API error:', error)
    throw createError({
      statusCode: 500,
      message: `Failed to generate recipe: ${error instanceof Error ? error.message : 'Unknown error'}`
    })
  }
}

function generateMockRecipe(request: RecipeRequest): GeneratedRecipe {
  const lang = request.language
  
  const recipes = {
    en: {
      title: 'Quick Pantry Pasta',
      prepTime: 20,
      servings: 2,
      ingredients: [
        { text: '200g Pasta', available: true },
        { text: '2 Eggs', available: true },
        { text: '100g Cheese, grated', available: true },
        { text: '2 cloves Garlic, minced', available: false },
        { text: 'Salt and pepper to taste', available: false }
      ],
      instructions: [
        'Boil pasta according to package instructions',
        'Beat eggs and mix with grated cheese',
        'Drain pasta, reserving some pasta water',
        'Mix hot pasta with egg mixture, adding pasta water as needed',
        'Season with salt and pepper',
        'Serve immediately'
      ],
      tips: [
        'Use the pasta water to make the sauce creamy',
        'Work quickly so the eggs don\'t scramble',
        'Add black pepper for authentic carbonara flavor'
      ]
    },
    de: {
      title: 'Schnelle Vorrats-Pasta',
      prepTime: 20,
      servings: 2,
      ingredients: [
        { text: '200g Nudeln', available: true },
        { text: '2 Eier', available: true },
        { text: '100g Käse, gerieben', available: true },
        { text: '2 Knoblauchzehen, gehackt', available: false },
        { text: 'Salz und Pfeffer nach Geschmack', available: false }
      ],
      instructions: [
        'Nudeln nach Packungsanweisung kochen',
        'Eier verquirlen und mit geriebenem Käse mischen',
        'Nudeln abgießen, etwas Nudelwasser aufbewahren',
        'Heiße Nudeln mit Ei-Mischung vermengen, bei Bedarf Nudelwasser hinzufügen',
        'Mit Salz und Pfeffer würzen',
        'Sofort servieren'
      ],
      tips: [
        'Das Nudelwasser macht die Soße cremig',
        'Schnell arbeiten, damit die Eier nicht stocken',
        'Schwarzen Pfeffer für authentischen Carbonara-Geschmack'
      ]
    },
    hu: {
      title: 'Gyors Kamra Tészta',
      prepTime: 20,
      servings: 2,
      ingredients: [
        { text: '200g Tészta', available: true },
        { text: '2 Tojás', available: true },
        { text: '100g Sajt, reszelt', available: true },
        { text: '2 gerezd Fokhagyma, aprított', available: false },
        { text: 'Só és bors ízlés szerint', available: false }
      ],
      instructions: [
        'Főzze meg a tésztát a csomagoláson található utasítások szerint',
        'Verje fel a tojásokat és keverje össze a reszelt sajttal',
        'Szűrje le a tésztát, tartson meg egy kis tésztavizet',
        'Keverje össze a forró tésztát a tojáskeverékkel, szükség szerint tésztavizet adva hozzá',
        'Ízesítse sóval és borssal',
        'Azonnal tálalj'
      ],
      tips: [
        'A tésztavíz használata krémes szószt eredményez',
        'Gyorsan dolgozzon, hogy a tojás ne rántottásodjon',
        'Adjon hozzá fekete borsot az autentikus carbonara ízért'
      ]
    }
  }

  return recipes[lang as keyof typeof recipes] || recipes.en
}

export default defineEventHandler(async (event) => {
  const request = await readBody<RecipeRequest>(event)

  if (!request.ingredients || request.ingredients.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No ingredients provided'
    })
  }

  let recipe: GeneratedRecipe

  if (request.provider === 'dummy') {
    recipe = generateMockRecipe(request)
  } else if (request.provider === 'gemini') {
    recipe = await generateRecipeWithGemini(request)
  } else if (request.provider === 'chatgpt') {
    throw createError({
      statusCode: 501,
      message: 'ChatGPT provider not yet implemented'
    })
  } else {
    throw createError({
      statusCode: 400,
      message: `Unknown provider: ${request.provider}`
    })
  }

  return recipe
})
