/**
 * AI Service - Rekomendasi makanan sederhana
 */

class AIService {
    constructor() {
        this.recommendations = [];
    }

    /**
     * Get food recommendations based on preferences
     */
    async getRecommendations(preferences = {}) {
        const { region, category, minRating = 0 } = preferences;
        
        try {
            // Get foods from API based on filters
            let foods = [];
            
            if (region) {
                const data = await window.ApiService.getFoodsByRegion(region);
                foods = data.foods || [];
            } else if (category) {
                const data = await window.ApiService.getFoodsByCategory(category);
                foods = data.foods || [];
            } else {
                const data = await window.ApiService.searchFoods('');
                foods = data.results || [];
            }

            // Filter by rating
            foods = foods.filter(food => (food.rating || 0) >= minRating);

            // Sort by rating
            foods.sort((a, b) => (b.rating || 0) - (a.rating || 0));

            this.recommendations = foods.slice(0, 5);
            return this.recommendations;
        } catch (error) {
            console.error('[AIService] Error getting recommendations:', error);
            return [];
        }
    }

    /**
     * Get similar foods
     */
    async getSimilarFoods(foodId) {
        try {
            // Simple implementation: get foods from same region
            const data = await window.ApiService.searchFoods('');
            const allFoods = data.results || [];
            
            const food = allFoods.find(f => f.id === foodId);
            if (!food) return [];

            return allFoods
                .filter(f => f.id !== foodId && f.region === food.region)
                .slice(0, 3);
        } catch (error) {
            console.error('[AIService] Error getting similar foods:', error);
            return [];
        }
    }

    /**
     * Get random recommendation
     */
    async getRandomRecommendation() {
        try {
            const data = await window.ApiService.searchFoods('');
            const foods = data.results || [];
            
            if (foods.length === 0) return null;
            
            const randomIndex = Math.floor(Math.random() * foods.length);
            return foods[randomIndex];
        } catch (error) {
            console.error('[AIService] Error getting random recommendation:', error);
            return null;
        }
    }

    /**
     * Analyze food preferences
     */
    analyzeFoodPreferences() {
        const favorites = window.storageService.get('favorites', []);
        // This would need actual food data to analyze
        // Simplified implementation
        return {
            topCategories: [],
            topRegions: []
        };
    }

    /**
     * Generate NLP response using OpenAI API
     */
    async generateNLPResponse(prompt, type = 'general', context = {}) {
        try {
            const response = await window.ApiService.generateNLPResponse(prompt, type, context);
            return response;
        } catch (error) {
            console.error('[AIService] Error generating NLP response:', error);
            return {
                response: 'Maaf, terjadi kesalahan saat memproses permintaan Anda.',
                type: type
            };
        }
    }

    /**
     * Chat with AI about food
     */
    async chatAboutFood(message, foodContext = null) {
        try {
            const context = foodContext ? {
                food_name: foodContext.name,
                region: foodContext.region,
                category: foodContext.category
            } : {};
            
            return await this.generateNLPResponse(message, 'general', context);
        } catch (error) {
            console.error('[AIService] Error in chat:', error);
            return {
                response: 'Maaf, saya tidak dapat menjawab saat ini.',
                type: 'general'
            };
        }
    }

    /**
     * Get food description
     */
    async getFoodDescription(foodName) {
        return await this.generateNLPResponse(
            `Jelaskan tentang makanan ${foodName}`,
            'food_description',
            { food_name: foodName }
        );
    }

    /**
     * Get food recommendation with AI explanation
     */
    async getAIRecommendation(preferences) {
        const { taste, region, category } = preferences;
        const prompt = `Rekomendasikan makanan ${region ? `dari ${region}` : ''} ${category ? `kategori ${category}` : ''} ${taste ? `dengan rasa ${taste}` : ''}`;
        
        return await this.generateNLPResponse(
            prompt,
            'recommendation',
            { taste, region, category }
        );
    }

    /**
     * Get recipe from AI
     */
    async getRecipe(foodName) {
        return await this.generateNLPResponse(
            `Bagaimana cara membuat ${foodName}?`,
            'recipe',
            { food_name: foodName }
        );
    }

    /**
     * Get cultural information
     */
    async getCulturalInfo(foodName, region) {
        return await this.generateNLPResponse(
            `Ceritakan tentang sejarah dan budaya ${foodName} dari ${region}`,
            'cultural',
            { food_name: foodName, region }
        );
    }
}

// Export singleton instance
const aiService = new AIService();
window.aiService = aiService; // Global reference
