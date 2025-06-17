import axios, { type AxiosResponse } from 'axios';
import type {
  AvailDateResOS,
  OpeningHoursResOSResponse,
  ResOSBookingCreate,
} from '@/types';
import type { Environment } from '@/config/environment';

export class ResOSService {
  private readonly apiUrl = 'https://api.resos.com/v1';
  
  constructor(private readonly config: Environment) {}

  /**
   * Generic method to make API calls to ResOS
   */
  private async makeRequest<T>(
    path: string,
    method: 'post' | 'get' | 'delete',
    data?: unknown
  ): Promise<AxiosResponse<T>> {
    try {
      return await axios<T>(`${this.apiUrl}${path}`, {
        data,
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(this.config.RESOS_API_KEY)}`,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`ResOS API Error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get available booking times for a specific date and party size
   */
  async getAvailableTimes(
    people: number,
    date: string
  ): Promise<AvailDateResOS[]> {
    const response = await this.makeRequest<AvailDateResOS[]>(
      `/bookingFlow/times?people=${people}&date=${date}`,
      'get'
    );
    
    return response.data;
  }

  /**
   * Get restaurant opening hours
   */
  async getOpeningHours(): Promise<OpeningHoursResOSResponse> {
    const response = await this.makeRequest<OpeningHoursResOSResponse>(
      '/openingHours',
      'get'
    );
    
    return response.data;
  }

  /**
   * Create a new booking
   */
  async createBooking(bookingData: ResOSBookingCreate): Promise<string> {
    const response = await this.makeRequest<string>(
      '/bookings',
      'post',
      bookingData
    );
    
    return response.data;
  }

  /**
   * Get unavailable times for a specific date with time intervals
   */
  async getUnavailableTimes(
    people: number,
    date: string,
    deltaStepMinutes = 30
  ): Promise<{
    open_hr: number;
    close_hr: number;
    unavailable_times: string[];
    available_times: string[];
  }> {
    const [availableTimes, openingHours] = await Promise.all([
      this.getAvailableTimes(people, date),
      this.getOpeningHours(),
    ]);

    if (!availableTimes || availableTimes.length === 0) {
      throw new Error('No available restaurants found');
    }

    // Parse available times
    const availableTimesSet: Record<string, boolean> = {};
    availableTimes.forEach((v) => {
      v.availableTimes.forEach((timeStr) => {
        const [hr, min] = timeStr.split(':');
        const hrs = parseInt(hr, 10) + parseInt(min, 10) / 60.0;
        availableTimesSet[`${hrs}`] = true;
      });
    });

    const availableTimesForAllWeek = Object.keys(availableTimesSet)
      .map((v) => parseFloat(v))
      .sort((a, b) => a - b);

    // Get opening hours for the specific day
    const dayIndex = new Date(date).getDay();
    const openHr = openingHours[dayIndex].open_sec / 3600.0;
    const closeHr = openingHours[dayIndex].close_sec / 3600.0;

    // Calculate unavailable times
    const unavailableTimes: number[] = [];
    for (
      let time = openHr;
      time < closeHr;
      time += deltaStepMinutes / 60.0
    ) {
      if (!availableTimesForAllWeek.includes(time)) {
        unavailableTimes.push(time);
      }
    }

    return {
      open_hr: openHr,
      close_hr: closeHr,
      unavailable_times: unavailableTimes
        .sort((a, b) => a - b)
        .map((v) => this.formatTimeNumberHours(v)),
      available_times: availableTimesForAllWeek.map((v) =>
        this.formatTimeNumberHours(v)
      ),
    };
  }

  /**
   * Format time number in hours to HH:MM format
   */
  private formatTimeNumberHours(timeNumberHrs: number): string {
    const h = Math.floor(timeNumberHrs);
    const m = Math.round((timeNumberHrs - h) * 60);
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    return `${hh}:${mm}`;
  }
} 