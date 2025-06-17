import type { RestaurantDetails } from '@/types';

export const restaurants: RestaurantDetails[] = [
  {
    id: 'sakura_breeze_japan',
    name: 'Sakura Breeze Japanese Cuisine',
    phoneNumber: '555-555-5555',
    timezone: 'America/Edmonton',
  },
  // Add more restaurants here as needed
];

/**
 * Find a restaurant by ID
 */
export function findRestaurantById(id: string): RestaurantDetails | undefined {
  return restaurants.find((restaurant) => restaurant.id === id);
}

/**
 * Get all available restaurants
 */
export function getAllRestaurants(): RestaurantDetails[] {
  return [...restaurants];
} 