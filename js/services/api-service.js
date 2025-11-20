// API Service - Handles all API calls to Python Flask backend
const API_BASE_URL = "https://festika-ai.vercel.app/api";// Use full URL for Vercel

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const REQUEST_TIMEOUT = 60000 // 60 seconds for Vercel cold starts
const MAX_RETRIES = 2 // Retry twice on failure

const apiCache = new Map()

function getCacheKey(endpoint, params) {
  return `${endpoint}-${JSON.stringify(params)}`
}

function isValidCache(timestamp) {
  return Date.now() - timestamp < CACHE_DURATION
}

async function fetchWithTimeout(url, options = {}, retryCount = 0) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    return response
  } catch (error) {
    clearTimeout(timeoutId)

    if (error.name === "AbortError") {
      // Retry on timeout if we haven't exceeded max retries
      if (retryCount < MAX_RETRIES) {
        console.log(`[v0] Request timeout, retrying... (${retryCount + 1}/${MAX_RETRIES})`)
        await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait 2 seconds before retry
        return fetchWithTimeout(url, options, retryCount + 1)
      }
      throw new Error(
        "Request timeout after multiple retries. The server may be cold starting. Please try again in a moment.",
      )
    }
    throw error
  }
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const cacheKey = getCacheKey(endpoint, options)

  // Check cache for GET requests
  if (!options.method || options.method === "GET") {
    const cached = apiCache.get(cacheKey)
    if (cached && isValidCache(cached.timestamp)) {
      console.log(`[v0] Using cached data for ${endpoint}`)
      return cached.data
    }
  }

  try {
    console.log(`[v0] Fetching ${url}`)
    const response = await fetchWithTimeout(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log(`[v0] Successfully fetched data from ${endpoint}`)

    // Cache successful GET requests
    if (!options.method || options.method === "GET") {
      apiCache.set(cacheKey, {
        data: data,
        timestamp: Date.now(),
      })
    }

    return data
  } catch (error) {
    console.error("[v0] API request failed:", error)

    if (!options.method || options.method === "GET") {
      console.warn(`[v0] Returning fallback data for ${endpoint}`)
      return {
        regions: [],
        categories: [],
        foods: [],
        results: [],
        success: false,
        error: error.message,
      }
    }

    throw error
  }
}

// Region endpoints
async function getRegions() {
  return apiRequest("/regions")
}

async function getRegionById(id) {
  return apiRequest(`/regions/${id}`)
}

async function createRegion(regionData) {
  return apiRequest("/regions", {
    method: "POST",
    body: regionData,
  })
}

async function updateRegion(regionId, regionData) {
  return apiRequest(`/regions/${regionId}`, {
    method: "PUT",
    body: regionData,
  })
}

async function deleteRegion(regionId) {
  return apiRequest(`/regions/${regionId}`, {
    method: "DELETE",
  })
}

// Category endpoints
async function getCategories() {
  return apiRequest("/categories")
}

async function getCategoryById(id) {
  return apiRequest(`/categories/${id}`)
}

// Food endpoints
async function getFoodsByRegion(regionId) {
  return apiRequest(`/regions/${regionId}/foods`)
}

async function getFoodsByCategory(categoryId) {
  return apiRequest(`/categories/${categoryId}/foods`)
}

async function createFood(foodData) {
  return apiRequest("/foods", {
    method: "POST",
    body: foodData,
  })
}

async function updateFood(foodId, foodData) {
  return apiRequest(`/foods/${foodId}`, {
    method: "PUT",
    body: foodData,
  })
}

async function deleteFood(foodId) {
  return apiRequest(`/foods/${foodId}`, {
    method: "DELETE",
  })
}

// Search endpoint
async function searchFoods(query) {
  return apiRequest(`/search?q=${encodeURIComponent(query || "")}`)
}

// NLP endpoint
async function generateNLPResponse(prompt, type = "general", context = {}) {
  return apiRequest("/nlp/generate", {
    method: "POST",
    body: { prompt, type, context },
  })
}

// Clear cache
function clearCache() {
  apiCache.clear()
}

// Export API methods
window.ApiService = {
  getRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  getCategories,
  getCategoryById,
  getFoodsByRegion,
  getFoodsByCategory,
  createFood,
  updateFood,
  deleteFood,
  searchFoods,
  generateNLPResponse,
  clearCache,
}
