// Food Service - Handles food-related data and operations
const FoodService = {
  currentFoods: [],
  
  async loadFoodsByRegion(regionId) {
    try {
      const foods = await ApiService.getFoodsByRegion(regionId);
      this.currentFoods = foods;
      return foods;
    } catch (error) {
      console.error('Failed to load foods:', error);
      return [];
    }
  },
  
  async loadFoodsByCategory(categoryId) {
    try {
      const foods = await ApiService.getFoodsByCategory(categoryId);
      this.currentFoods = foods;
      return foods;
    } catch (error) {
      console.error('Failed to load foods:', error);
      return [];
    }
  },
  
  async searchFoods(query) {
    try {
      const foods = await ApiService.searchFoods(query);
      this.currentFoods = foods;
      return foods;
    } catch (error) {
      console.error('Failed to search foods:', error);
      return [];
    }
  },
  
  getFoodById(id) {
    return this.currentFoods.find(food => food.id === id);
  },
  
  filterByPrice(minPrice, maxPrice) {
    return this.currentFoods.filter(food => {
      const price = parseFloat(food.price);
      return price >= minPrice && price <= maxPrice;
    });
  },
  
  sortByName(ascending = true) {
    return [...this.currentFoods].sort((a, b) => {
      return ascending 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
  },
  
  sortByPrice(ascending = true) {
    return [...this.currentFoods].sort((a, b) => {
      const priceA = parseFloat(a.price);
      const priceB = parseFloat(b.price);
      return ascending ? priceA - priceB : priceB - priceA;
    });
  }
};

window.FoodService = FoodService;
