import { restaurants, findRestaurantById, getAllRestaurants } from '../../../src/constants/restaurants';

describe('Restaurant Constants', () => {
  describe('restaurants array', () => {
    it('should contain at least one restaurant', () => {
      expect(restaurants).toBeDefined();
      expect(restaurants.length).toBeGreaterThan(0);
    });

    it('should have valid restaurant structure', () => {
      restaurants.forEach(restaurant => {
        expect(restaurant).toHaveProperty('id');
        expect(restaurant).toHaveProperty('name');
        expect(restaurant).toHaveProperty('phoneNumber');
        expect(restaurant).toHaveProperty('timezone');
        
        expect(typeof restaurant.id).toBe('string');
        expect(typeof restaurant.name).toBe('string');
        expect(typeof restaurant.phoneNumber).toBe('string');
        expect(typeof restaurant.timezone).toBe('string');
      });
    });
  });

  describe('findRestaurantById', () => {
    it('should find existing restaurant by ID', () => {
      const restaurant = findRestaurantById('sakura_breeze_japan');
      expect(restaurant).toBeDefined();
      expect(restaurant?.id).toBe('sakura_breeze_japan');
      expect(restaurant?.name).toBe('Sakura Breeze Japanese Cuisine');
    });

    it('should return undefined for non-existent ID', () => {
      const restaurant = findRestaurantById('non_existent_id');
      expect(restaurant).toBeUndefined();
    });

    it('should handle empty string ID', () => {
      const restaurant = findRestaurantById('');
      expect(restaurant).toBeUndefined();
    });
  });

  describe('getAllRestaurants', () => {
    it('should return all restaurants', () => {
      const allRestaurants = getAllRestaurants();
      expect(allRestaurants).toEqual(restaurants);
    });

    it('should return a copy of the array', () => {
      const allRestaurants = getAllRestaurants();
      expect(allRestaurants).not.toBe(restaurants); // Different reference
      expect(allRestaurants).toEqual(restaurants); // Same content
    });
  });
}); 