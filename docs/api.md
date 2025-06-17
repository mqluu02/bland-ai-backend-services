# Bland AI Backend Services API Documentation

## Overview

The Bland AI Backend Services provide a comprehensive solution for managing restaurant reservations, AI-powered phone calls, and intelligent date parsing. Built on Cloudflare Workers with TypeScript for maximum performance and reliability.

## Base URL

```
https://your-worker.your-subdomain.workers.dev
```

## Authentication

All API endpoints require Bearer token authentication:

```http
Authorization: Bearer YOUR_API_TOKEN
```

## Rate Limits

- **Development**: 1000 requests per minute
- **Production**: 10000 requests per minute

## Response Format

All responses follow a consistent format:

### Success Response
```json
{
  "status": "success",
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "status": "error",
  "error_type": "error_category",
  "message": "Detailed error description"
}
```

## Endpoints

### 📅 Date & Time Operations

#### Get Current Date/Time
```http
GET /now?timezone=America/Edmonton
```

**Parameters:**
- `timezone` (optional): IANA timezone identifier. Defaults to `America/Edmonton`

**Response:**
```json
{
  "full": "2024-04-15, 2:30:00 p.m.",
  "date": "2024-04-15",
  "time": "14:30:00",
  "timezone": "America/Edmonton",
  "day_name": "Monday"
}
```

#### Get Current Date
```http
GET /date_now?timezone=America/Edmonton
```

**Response:**
```json
{
  "date": "2024-04-15",
  "timezone": "America/Edmonton"
}
```

#### Get Current Time
```http
GET /time_now?timezone=America/Edmonton
```

**Response:**
```json
{
  "time": "14:30:00",
  "timezone": "America/Edmonton"
}
```

### 🏪 Restaurant Management

#### Initialize Restaurant
```http
GET /init/{restaurantId}
```

**Parameters:**
- `restaurantId` (required): Unique restaurant identifier

**Response:**
```json
{
  "time": {
    "date": "2024-04-15",
    "full": "2024-04-15, 2:30:00 p.m.",
    "time": "14:30:00",
    "day_name": "Monday",
    "timezone": "America/Edmonton"
  },
  "restaurant": {
    "id": "sakura_breeze_japan",
    "name": "Sakura Breeze Japanese Cuisine",
    "phoneNumber": "555-555-5555",
    "timezone": "America/Edmonton"
  }
}
```

#### Get Available Hours
```http
POST /hours
```

**Request Body:**
```json
{
  "date": "2024-04-15",
  "people": 4,
  "timezone": "America/Edmonton",
  "delta_step": 30
}
```

**Parameters:**
- `date` (required): Reservation date in YYYY-MM-DD format
- `people` (required): Number of guests
- `timezone` (optional): IANA timezone identifier
- `delta_step` (optional): Time slot interval in minutes. Defaults to 30

**Response:**
```json
{
  "open_hr": 11.0,
  "close_hr": 22.0,
  "unavailable_times": ["11:00", "11:30", "12:00"],
  "available_times": ["12:30", "13:00", "13:30", "14:00"]
}
```

### 📞 Phone Call Management

#### Initiate Phone Call
```http
POST /call?phone=+1234567890
```

**Parameters:**
- `phone` (optional): Phone number to call. Uses default if not provided

**Response:**
```json
{
  "call_id": "uuid-call-identifier",
  "status": "initiated",
  "to": "+1234567890",
  "from": "+15875012618",
  "created_at": "2024-04-15T14:30:00Z"
}
```

#### Get Call Details
```http
POST /call_id
```

**Request Body:**
```json
{
  "call_id": "uuid-call-identifier"
}
```

**Response:**
```json
{
  "to": "+1234567890",
  "from": "+15875012618"
}
```

**Test Mode:**
Add `?test=true` to return mock data without making actual API calls.

### 📝 Booking Management

#### Create Reservation
```http
POST /booking
```

**Request Body:**
```json
{
  "date": "2024-04-15T19:30:00Z",
  "time": "19:30",
  "people": 4,
  "duration": 120,
  "tables": ["table-1"],
  "guest": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "notificationSms": true,
    "notificationEmail": true
  },
  "status": "confirmed",
  "source": "api",
  "comment": "Birthday celebration",
  "note": "Window table preferred",
  "noteAuthor": "Guest",
  "referrer": "website",
  "languageCode": "en"
}
```

**Response:**
```json
{
  "status": "success",
  "reservation_id": "res-12345678"
}
```

### 🤖 AI Date Parsing

#### Parse Natural Language Date
```http
POST /parse_date?timezone=America/Edmonton
```

**Request Body:**
```json
{
  "date_description": "next Friday evening"
}
```

**Parameters:**
- `timezone` (optional): IANA timezone identifier for date interpretation

**Response:**
```json
{
  "status": "ok",
  "data": {
    "date": "2024-04-19",
    "timezone": "America/Edmonton"
  },
  "message": "Requested date obtained!"
}
```

**Supported Date Formats:**
- Relative dates: "tomorrow", "next Friday", "this weekend"
- Specific dates: "April 15", "2024-04-15"
- Natural language: "next Friday evening", "this Saturday morning"

## Error Codes

| HTTP Status | Error Type | Description |
|-------------|------------|-------------|
| 400 | `bad_request` | Invalid request parameters |
| 401 | `unauthorized` | Missing or invalid authentication |
| 403 | `forbidden` | Access denied |
| 404 | `not_found` | Resource not found |
| 422 | `unprocessable_entity` | Valid request but unable to process |
| 429 | `rate_limit_exceeded` | Too many requests |
| 500 | `internal_error` | Server error |

## Common Error Scenarios

### Invalid Restaurant ID
```json
{
  "status": "error",
  "error_type": "not_found",
  "message": "Restaurant ID does not exist."
}
```

### Missing Authentication
```json
{
  "status": "error",
  "error_type": "unauthorized", 
  "message": "Authentication required"
}
```

### Date in Past
```json
{
  "status": "error",
  "error_type": "past_date_error",
  "message": "The date description specified returns a date in the past which is not acceptable."
}
```

### No Available Seats
```json
{
  "status": "error",
  "error_type": "no_empty_seats",
  "message": "No empty seats found"
}
```

## SDKs and Examples

### JavaScript/TypeScript
```javascript
const API_BASE = 'https://your-worker.your-subdomain.workers.dev';
const API_TOKEN = 'your-bearer-token';

const headers = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json'
};

// Get current time
const response = await fetch(`${API_BASE}/now`, { headers });
const timeData = await response.json();

// Parse a date
const dateResponse = await fetch(`${API_BASE}/parse_date`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    date_description: 'next Friday at 7 PM'
  })
});
```

### cURL
```bash
# Get restaurant availability
curl -X POST "https://your-worker.your-subdomain.workers.dev/hours" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-04-15",
    "people": 4,
    "timezone": "America/Edmonton"
  }'
```

### Python
```python
import requests

API_BASE = "https://your-worker.your-subdomain.workers.dev"
headers = {
    "Authorization": "Bearer YOUR_TOKEN",
    "Content-Type": "application/json"
}

# Parse natural language date
response = requests.post(
    f"{API_BASE}/parse_date",
    headers=headers,
    json={"date_description": "tomorrow at 6 PM"}
)
date_info = response.json()
```

## Webhooks

### Call Status Updates
Configure webhook URL in Bland AI dashboard to receive call status updates:

```json
{
  "call_id": "uuid-call-identifier",
  "status": "completed",
  "duration": 125,
  "recording_url": "https://...",
  "transcript": "Call transcript..."
}
```

## Best Practices

1. **Always handle errors gracefully** - Check response status and error types
2. **Use appropriate timezones** - Specify timezone for accurate date/time operations
3. **Implement retry logic** - For temporary failures with exponential backoff
4. **Cache restaurant data** - Minimize calls to `/init` endpoint
5. **Validate dates** - Ensure reservation dates are in the future
6. **Test with mock data** - Use `?test=true` parameter during development

## Support

- **API Status**: [status.your-domain.com](https://status.your-domain.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/bland-ai-backend-services/issues)
- **Documentation**: [API Docs](https://your-worker.your-subdomain.workers.dev/) 