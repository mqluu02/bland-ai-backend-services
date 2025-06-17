# Bland AI Backend Services

[![CI/CD Pipeline](https://github.com/yourusername/bland-ai-backend-services/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/yourusername/bland-ai-backend-services/actions)
[![Coverage](https://codecov.io/gh/yourusername/bland-ai-backend-services/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/bland-ai-backend-services)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Professional backend services for Bland AI with phone calls, booking management, and intelligent date parsing. Built with TypeScript, Hono, and deployed on Cloudflare Workers.

## Features

- **Restaurant Booking Management**: Complete booking system with availability checking
- **AI-Powered Phone Calls**: Automated calls using Bland AI integration
- **Smart Date Parsing**: Natural language date interpretation with OpenAI
- **Real-time Availability**: Integration with ResOS for live restaurant data
- **Timezone Support**: Proper handling of different timezones
- **OpenAPI Documentation**: Auto-generated API docs with Swagger UI
- **Production Ready**: Comprehensive testing, CI/CD, and monitoring

## Architecture

```
src/
├── config/           # Environment and configuration management
├── constants/        # Static data and restaurant information
├── middleware/       # Authentication, CORS, error handling
├── services/         # Business logic for external APIs
├── types/           # TypeScript interfaces and types
├── utils/           # Helper functions and utilities
└── index.ts         # Main application entry point
```

## Prerequisites

- Node.js 18+ and npm/pnpm
- Cloudflare Workers account
- API keys for:
  - [OpenAI](https://platform.openai.com/)
  - [Bland AI](https://bland.ai/)
  - [ResOS](https://resos.com/)

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bland-ai-backend-services.git
cd bland-ai-backend-services
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your actual API keys and configuration
   ```

4. **Set up Cloudflare Workers**
   ```bash
   npm run cf-typegen
   npx wrangler login
   ```

## Development

```bash
# Start development server
npm run dev

# Open Swagger documentation
open http://localhost:8787/

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint and format code
npm run lint
npm run format
```

##  API Documentation

### Authentication

All endpoints require Bearer token authentication:
```
Authorization: Bearer YOUR_API_TOKEN
```

### Core Endpoints

#### Date & Time
- `GET /now?timezone=America/Edmonton` - Current date/time
- `GET /date_now?timezone=America/Edmonton` - Current date only
- `GET /time_now?timezone=America/Edmonton` - Current time only

#### Restaurant Management
- `GET /init/{restaurantId}` - Initialize restaurant with current time
- `POST /hours` - Get available/unavailable booking times

#### Phone Calls
- `POST /call?phone=+1234567890` - Initiate AI phone call
- `POST /call_id` - Get call details by ID

#### Booking Management
- `POST /booking` - Create new restaurant reservation

####  AI Date Parsing
- `POST /parse_date` - Parse natural language dates

### Example Requests

#### Get Available Hours
```bash
curl -X POST "https://your-worker.your-subdomain.workers.dev/hours" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-04-15",
    "people": 4,
    "timezone": "America/Edmonton"
  }'
```

#### Parse Natural Language Date
```bash
curl -X POST "https://your-worker.your-subdomain.workers.dev/parse_date" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date_description": "next Friday evening"
  }'
```

## Deployment

### Production Deployment
```bash
# Deploy to production
npm run deploy

# Deploy with environment
npx wrangler deploy --env production
```

### Environment Configuration

Set these secrets in Cloudflare Workers:
```bash
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put BLAND_AI_API_KEY
npx wrangler secret put RESOS_API_KEY
npx wrangler secret put API_BEARER_TOKEN
```

## Testing

The project includes comprehensive test coverage:

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Coverage report
npm run test:coverage
```

### Test Categories
- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Service Tests**: External API integration testing

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | OpenAI API key for date parsing | Yes | - |
| `BLAND_AI_API_KEY` | Bland AI API key for phone calls | Yes | - |
| `RESOS_API_KEY` | ResOS API key for bookings | Yes | - |
| `API_BEARER_TOKEN` | API authentication token | Yes | - |
| `ADMIN_USERNAME` | Admin interface username | No | `admin` |
| `ADMIN_PASSWORD` | Admin interface password | Yes | - |
| `DEFAULT_TIMEZONE` | Default timezone for operations | No | `America/Edmonton` |
| `DEFAULT_PHONE_NUMBER` | Default phone number | No | `+15875012618` |

## Restaurant Configuration

Add restaurants in `src/constants/restaurants.ts`:

```typescript
export const restaurants: RestaurantDetails[] = [
  {
    id: 'your_restaurant_id',
    name: 'Your Restaurant Name',
    phoneNumber: '+1234567890',
    timezone: 'America/Edmonton',
  },
];
```

## Error Handling

The API returns consistent error responses:

```json
{
  "status": "error",
  "error_type": "validation_error",
  "message": "Detailed error description"
}
```

### Common Error Types
- `validation_error` - Invalid input data
- `authentication_error` - Invalid or missing auth token
- `not_found` - Resource not found
- `rate_limit_exceeded` - Too many requests
- `internal_error` - Server error

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Write tests for new features
- Follow TypeScript best practices
- Use conventional commit messages
- Ensure 80%+ test coverage

## Monitoring & Observability

- **Logs**: Cloudflare Workers Analytics
- **Metrics**: Custom metrics via Cloudflare Analytics
- **Alerts**: Set up via Cloudflare Workers
- **Health Checks**: `/health` endpoint (coming soon)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Hono](https://hono.dev/) - Fast web framework
- [Chanfana](https://chanfana.pages.dev/) - OpenAPI integration
- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless platform
- [Bland AI](https://bland.ai/) - AI phone call platform
- [ResOS](https://resos.com/) - Restaurant management system

## Support

- **Documentation**: Visit the [Swagger UI](https://your-worker.your-subdomain.workers.dev/)
- **Issues**: [GitHub Issues](https://github.com/yourusername/bland-ai-backend-services/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/bland-ai-backend-services/discussions)

---


