import { fromHono } from 'chanfana';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { bearerAuth } from 'hono/bearer-auth';
import { basicAuth } from 'hono/basic-auth';
import { cors } from 'hono/cors';

// Types
import type {
  ApiResponse,
  TimeResponse,
  RestaurantInitResponse,
  HoursRequest,
  DateParseRequest,
  CallIdRequest,
  ResOSBookingCreate,
} from './types';

// Services
import { BlandAIService } from './services/blandai-service';
import { ResOSService } from './services/resos-service';
import { OpenAIService } from './services/openai-service';

// Utils and constants
import { findRestaurantById } from './constants/restaurants';
import { callButtonHtmlPage } from './callButtonHtmlPage';
import {
  getLocaleDateTimeString,
  getLocaleDateString,
  getLocaleTimeString,
  getDateDayName,
} from './utils/datetime';

// Configuration
import { getEnvironmentConfig } from './config/environment';

/**
 * Application class for dependency injection
 */
class RestaurantBookingAPI {
  private app: Hono;
  private config: ReturnType<typeof getEnvironmentConfig>;
  private blandAIService: BlandAIService;
  private resOSService: ResOSService;
  private openAIService: OpenAIService;

  constructor(env: Record<string, unknown>) {
    this.config = getEnvironmentConfig(env);
    this.app = new Hono();

    // Initialize services
    this.blandAIService = new BlandAIService(this.config);
    this.resOSService = new ResOSService(this.config);
    this.openAIService = new OpenAIService(this.config);

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    // CORS middleware
    this.app.use(
      '/*',
      cors({
        origin: '*',
        allowMethods: ['POST', 'GET', 'OPTIONS'],
        exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
        maxAge: 600,
        credentials: true,
      })
    );

    // Authentication middleware
    this.app.use(
      '/call-page',
      basicAuth({
        username: this.config.ADMIN_USERNAME,
        password: this.config.ADMIN_PASSWORD,
      })
    );

    this.app.use('/*', bearerAuth({ token: this.config.API_BEARER_TOKEN }));
  }

  private setupRoutes(): void {
    const openapi = fromHono(this.app, {
      docs_url: '/',
    });

    // Call page (HTML interface)
    openapi.get('/call-page', (c) => {
      return c.html(callButtonHtmlPage);
    });

    // Time and date endpoints
    openapi.get('/now', async (c) => {
      const timezone = c.req.query('timezone') || this.config.DEFAULT_TIMEZONE;

      const response: TimeResponse = {
        full: getLocaleDateTimeString(new Date(), timezone),
        date: getLocaleDateString(new Date(), timezone),
        time: getLocaleTimeString(new Date(), timezone),
        timezone,
        day_name: getDateDayName(new Date(), timezone),
      };

      return c.json(response);
    });

    openapi.get('/date_now', async (c) => {
      const timezone = c.req.query('timezone') || this.config.DEFAULT_TIMEZONE;
      return c.json({
        date: getLocaleDateString(new Date(), timezone),
        timezone,
      });
    });

    openapi.get('/time_now', async (c) => {
      const timezone = c.req.query('timezone') || this.config.DEFAULT_TIMEZONE;
      return c.json({
        time: getLocaleTimeString(new Date(), timezone),
        timezone,
      });
    });

    // Restaurant initialization
    openapi.get('/init/:restaurantId', async (c) => {
      const restaurantId = c.req.param('restaurantId');
      if (!restaurantId) {
        throw new HTTPException(400, {
          message: 'Restaurant ID must be specified',
        });
      }

      const restaurant = findRestaurantById(restaurantId);
      if (!restaurant) {
        throw new HTTPException(404, {
          message: 'Restaurant ID does not exist.',
        });
      }

      const timezone = restaurant.timezone;
      const response: RestaurantInitResponse = {
        time: {
          date: getLocaleDateString(new Date(), timezone),
          full: getLocaleDateTimeString(new Date(), timezone),
          time: getLocaleTimeString(new Date(), timezone),
          day_name: getDateDayName(new Date(), timezone),
          timezone,
        },
        restaurant,
      };

      return c.json(response);
    });

    // Phone call endpoints
    openapi.post('/call', async (c) => {
      const phone = c.req.query('phone');

      try {
        const result = await this.blandAIService.initiateCall(phone);
        return c.json(result);
      } catch (error) {
        const response: ApiResponse = {
          status: 'error',
          error_type: 'call_error',
          message: `There was an error making the call: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        };
        return c.json(response, 400);
      }
    });

    openapi.post('/call_id', async (c) => {
      const isTest = c.req.query('test');

      if (isTest === 'true') {
        return c.json({
          from: '+15555555555',
          to: this.config.DEFAULT_PHONE_NUMBER,
        });
      }

      const body = (await c.req.json()) as CallIdRequest;
      if (!body.call_id) {
        throw new HTTPException(400, {
          message: 'call_id must be specified',
        });
      }

      try {
        const contactInfo = await this.blandAIService.getCallContactInfo(
          body.call_id
        );
        return c.json(contactInfo);
      } catch (error) {
        const response: ApiResponse = {
          status: 'error',
          error_type: 'call_error',
          message: `Error retrieving call details: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        };
        return c.json(response, 400);
      }
    });

    // Restaurant hours and booking
    openapi.post('/hours', async (c) => {
      const body = (await c.req.json()) as HoursRequest;
      // const timezone = body.timezone || this.config.DEFAULT_TIMEZONE;
      const deltaStep = body.delta_step || 30;

      if (!body.date) {
        const response: ApiResponse = {
          status: 'error',
          error_type: 'invalid_body_data',
          message: 'no date specified',
        };
        return c.json(response, 400);
      }

      if (!body.people) {
        const response: ApiResponse = {
          status: 'error',
          error_type: 'invalid_body_data',
          message: 'no people specified',
        };
        return c.json(response, 400);
      }

      try {
        const hoursData = await this.resOSService.getUnavailableTimes(
          body.people,
          body.date,
          deltaStep
        );
        return c.json(hoursData);
      } catch (error) {
        const response: ApiResponse = {
          status: 'error',
          error_type: 'no_restaurants',
          message:
            error instanceof Error
              ? error.message
              : 'No available restaurants found',
        };
        return c.json(response, 404);
      }
    });

    openapi.post('/booking', async (c) => {
      const body = (await c.req.json()) as ResOSBookingCreate;

      try {
        const reservationId = await this.resOSService.createBooking(body);
        return c.json({
          status: 'success',
          reservation_id: reservationId,
        });
      } catch (error) {
        if (error instanceof Error && error.message.includes('422')) {
          const response: ApiResponse = {
            status: 'error',
            error_type: 'no_empty_seats',
            message: 'No empty seats found',
          };
          return c.json(response, 422);
        }

        const response: ApiResponse = {
          status: 'error',
          error_type: 'internal_error',
          message: 'There was an internal error',
        };
        return c.json(response, 500);
      }
    });

    // Date parsing
    openapi.post('/parse_date', async (c) => {
      const body = (await c.req.json()) as DateParseRequest;

      if (!body.date_description) {
        throw new HTTPException(400, {
          message: 'date_description not specified',
        });
      }

      const timezone = c.req.query('timezone') || this.config.DEFAULT_TIMEZONE;

      try {
        const result = await this.openAIService.parseDate(
          body.date_description,
          timezone
        );
        const response: ApiResponse<{ date: string; timezone: string }> = {
          status: 'success',
          data: result,
          message: 'Requested date obtained!',
        };
        return c.json(response);
      } catch (error) {
        let errorType = 'internal_error';
        let message = 'There was an error parsing the date';

        if (error instanceof Error) {
          if (error.message.includes('past')) {
            errorType = 'past_date_error';
            message = error.message;
          }
        }

        const response: ApiResponse = {
          status: 'error',
          error_type: errorType,
          message,
        };
        return c.json(response, 400);
      }
    });
  }

  public getApp(): Hono {
    return this.app;
  }
}

// Export the factory function for Cloudflare Workers
export default {
  async fetch(request: Request, env: Record<string, unknown>): Promise<Response> {
    const api = new RestaurantBookingAPI(env);
    return await api.getApp().fetch(request, env);
  },
}; 