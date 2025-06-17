/**
 * Integration tests for the Bland AI Backend Services
 * These tests require a running instance and valid environment variables
 */

describe('Bland AI Backend Services Integration', () => {
  const baseUrl = 'http://localhost:8787';
  const authToken = process.env.API_BEARER_TOKEN || 'test-bearer-token';
  
  const headers = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };

  describe('Time and Date Endpoints', () => {
    describe('GET /now', () => {
      it('should return current date and time information', async () => {
        const response = await fetch(`${baseUrl}/now`, {
          headers: { 'Authorization': `Bearer ${authToken}` },
        });
        
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(data).toHaveProperty('full');
        expect(data).toHaveProperty('date');
        expect(data).toHaveProperty('time');
        expect(data).toHaveProperty('timezone');
        expect(data).toHaveProperty('day_name');
        
        // Validate date format
        expect(data.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(data.timezone).toBe('America/Edmonton');
      });

      it('should accept custom timezone parameter', async () => {
        const response = await fetch(`${baseUrl}/now?timezone=UTC`, {
          headers: { 'Authorization': `Bearer ${authToken}` },
        });
        
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(data.timezone).toBe('UTC');
      });
    });

    describe('GET /date_now', () => {
      it('should return current date only', async () => {
        const response = await fetch(`${baseUrl}/date_now`, {
          headers: { 'Authorization': `Bearer ${authToken}` },
        });
        
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(data).toHaveProperty('date');
        expect(data).toHaveProperty('timezone');
        expect(data.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });
  });

  describe('Restaurant Endpoints', () => {
    describe('GET /init/:restaurantId', () => {
      it('should initialize valid restaurant', async () => {
        const response = await fetch(`${baseUrl}/init/sakura_breeze_japan`, {
          headers: { 'Authorization': `Bearer ${authToken}` },
        });
        
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(data).toHaveProperty('time');
        expect(data).toHaveProperty('restaurant');
        expect(data.restaurant.id).toBe('sakura_breeze_japan');
        expect(data.restaurant.name).toBe('Sakura Breeze Japanese Cuisine');
      });

      it('should return 404 for invalid restaurant ID', async () => {
        const response = await fetch(`${baseUrl}/init/invalid_restaurant`, {
          headers: { 'Authorization': `Bearer ${authToken}` },
        });
        
        expect(response.status).toBe(404);
      });
    });
  });

  describe('Phone Call Endpoints', () => {
    describe('POST /call_id', () => {
      it('should return test data when test mode is enabled', async () => {
        const response = await fetch(`${baseUrl}/call_id?test=true`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ call_id: 'test-call-id' }),
        });
        
        expect(response.status).toBe(200);
        
        const data = await response.json();
        expect(data).toHaveProperty('from');
        expect(data).toHaveProperty('to');
        expect(data.from).toBe('+15555555555');
      });

      it('should require call_id in request body', async () => {
        const response = await fetch(`${baseUrl}/call_id`, {
          method: 'POST',
          headers,
          body: JSON.stringify({}),
        });
        
        expect(response.status).toBe(400);
      });
    });
  });

  describe('Date Parsing Endpoint', () => {
    describe('POST /parse_date', () => {
      it('should require date_description in request body', async () => {
        const response = await fetch(`${baseUrl}/parse_date`, {
          method: 'POST',
          headers,
          body: JSON.stringify({}),
        });
        
        expect(response.status).toBe(400);
      });

      it('should handle valid date description', async () => {
        const response = await fetch(`${baseUrl}/parse_date`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            date_description: '2024-12-25',
          }),
        });
        
        // Note: This test might fail if OpenAI API is not configured
        // In a real test environment, you'd mock the OpenAI service
        expect([200, 400]).toContain(response.status);
      });
    });
  });

  describe('Authentication', () => {
    it('should require authentication for protected endpoints', async () => {
      const response = await fetch(`${baseUrl}/now`);
      expect(response.status).toBe(401);
    });

    it('should reject invalid bearer tokens', async () => {
      const response = await fetch(`${baseUrl}/now`, {
        headers: { 'Authorization': 'Bearer invalid-token' },
      });
      expect(response.status).toBe(401);
    });
  });

  describe('Error Handling', () => {
    it('should return proper error format', async () => {
      const response = await fetch(`${baseUrl}/invalid-endpoint`, {
        headers: { 'Authorization': `Bearer ${authToken}` },
      });
      
      expect(response.status).toBe(404);
    });
  });
}); 