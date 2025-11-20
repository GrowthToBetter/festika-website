// Storage Service - Menangani localStorage
class StorageService {
    constructor() {
        this.prefix = 'citarasa_';
    }

    /**
     * Get favorites
     */
    getFavorites() {
        const favorites = localStorage.getItem(`${this.prefix}favorites`);
        return favorites ? JSON.parse(favorites) : [];
    }

    /**
     * Add favorite
     */
    addFavorite(foodId) {
        const favorites = this.getFavorites();
        if (!favorites.includes(foodId)) {
            favorites.push(foodId);
            localStorage.setItem(`${this.prefix}favorites`, JSON.stringify(favorites));
            return true;
        }
        return false;
    }

    /**
     * Remove favorite
     */
    removeFavorite(foodId) {
        const favorites = this.getFavorites();
        const filtered = favorites.filter(id => id !== foodId);
        localStorage.setItem(`${this.prefix}favorites`, JSON.stringify(filtered));
        return filtered.length !== favorites.length;
    }

    /**
     * Check if favorite
     */
    isFavorite(foodId) {
        const favorites = this.getFavorites();
        return favorites.includes(foodId);
    }

    /**
     * Get recent searches
     */
    getRecentSearches() {
        const searches = localStorage.getItem(`${this.prefix}recent_searches`);
        return searches ? JSON.parse(searches) : [];
    }

    /**
     * Add recent search
     */
    addRecentSearch(query) {
        let searches = this.getRecentSearches();
        searches = searches.filter(s => s !== query);
        searches.unshift(query);
        searches = searches.slice(0, 10); // Keep only last 10
        localStorage.setItem(`${this.prefix}recent_searches`, JSON.stringify(searches));
    }

    /**
     * Clear recent searches
     */
    clearRecentSearches() {
        localStorage.removeItem(`${this.prefix}recent_searches`);
    }

    /**
     * Get preference
     */
    getPreference(key, defaultValue = null) {
        const value = localStorage.getItem(`${this.prefix}pref_${key}`);
        return value !== null ? JSON.parse(value) : defaultValue;
    }

    /**
     * Set preference
     */
    setPreference(key, value) {
        localStorage.setItem(`${this.prefix}pref_${key}`, JSON.stringify(value));
    }

    /**
     * Clear all data
     */
    clearAll() {
        localStorage.clear();
    }

    // Helper method to get namespaced data
    get(key, defaultValue = null) {
        const value = localStorage.getItem(`${this.prefix}${key}`);
        return value !== null ? JSON.parse(value) : defaultValue;
    }

    // Helper method to set namespaced data
    set(key, value) {
        localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(value));
    }
}

// Export singleton instance
const storageService = new StorageService();
window.storageService = storageService; // Global reference
