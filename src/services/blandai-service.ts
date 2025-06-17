import axios, { type AxiosResponse } from 'axios';
import type { BlandAICallDetailsResponse, BlandAICallConfig } from '@/types';
import type { Environment } from '@/config/environment';

export class BlandAIService {
  private readonly apiUrl = 'https://api.bland.ai';
  
  constructor(private readonly config: Environment) {}

  /**
   * Generic method to make API calls to Bland AI
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
          Authorization: this.config.BLAND_AI_API_KEY,
        },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Bland AI API Error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Initiate a phone call
   */
  async initiateCall(phoneNumber?: string): Promise<BlandAICallDetailsResponse> {
    const callConfig: BlandAICallConfig = {
      phone_number: phoneNumber || this.config.DEFAULT_PHONE_NUMBER,
      voice: 'Kinsley',
      wait_for_greeting: false,
      record: true,
      answered_by_enabled: true,
      noise_cancellation: false,
      interruption_threshold: 100,
      block_interruptions: false,
      max_duration: 6,
      model: 'base',
      language: 'en',
      background_track: 'none',
      endpoint: 'https://api.bland.ai',
      voicemail_action: 'hangup',
      pathway_id: '6c61d516-a64b-4843-b9f0-c7272433887e',
    };

    const response = await this.makeRequest<BlandAICallDetailsResponse>(
      '/v1/calls',
      'post',
      callConfig
    );
    
    return response.data;
  }

  /**
   * Get call details by call ID
   */
  async getCallDetails(callId: string): Promise<BlandAICallDetailsResponse> {
    const response = await this.makeRequest<BlandAICallDetailsResponse>(
      `/v1/calls/${callId}`,
      'get'
    );
    
    return response.data;
  }

  /**
   * Get call contact information (to/from numbers)
   */
  async getCallContactInfo(callId: string): Promise<{ to: string; from: string }> {
    const callDetails = await this.getCallDetails(callId);
    return {
      to: callDetails.to,
      from: callDetails.from,
    };
  }
} 