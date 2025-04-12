import axios, { AxiosInstance, AxiosError } from 'axios';

import { UserData, UserResponse } from './utils/types/user.type';
import { ApiKeyData, ApiKey, ApiKeyListResponse, RevokeApiKeyResponse } from './utils/types/api-key.type';
import { CreateBotRequest, BotResponse, RetrieveBotResponse, RemoveBotResponse } from './utils/types/bot.type';
import { TranscriptQueryParams, TranscriptResponse } from './utils/types/transcript.type';
import { CueMeetClientOptions } from './utils/types';

import { CueMeetError, ValidationError } from './utils/errors';

export default class CueMeetClient {
  private baseUrl: string;
  private client: AxiosInstance;

  /**
   * Creates a new CueMeet client instance
   * @param options - Configuration options for the client
   * @param axiosInstance - Optional axios instance to use (for testing)
   */
  constructor(options: CueMeetClientOptions, axiosInstance?: AxiosInstance) {
    if (!options.baseUrl) {
      throw new Error('baseUrl is required for CueMeet client initialization');
    }
    
    // Remove trailing slash if present, then append /api/v1
    this.baseUrl = options.baseUrl.endsWith('/') 
      ? options.baseUrl.slice(0, -1) + '/api/v1'
      : options.baseUrl + '/api/v1';
        
    // Configure axios instance with base URL and default headers
    this.client = axiosInstance || axios.create({
      baseURL: this.baseUrl,
      timeout: options.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message || error.message;
          const status = error.response?.status;
          throw new CueMeetError(message, status);
        }
        throw error;
      }
    );
  }

  /**
   * Create a new user
   * @param userData - User data including required email and name
   * @returns Created user details with 201 status on success
   */
  async createUser(userData: UserData): Promise<UserResponse> {
    try {
      if (!userData.email) {
        throw new CueMeetError('email is required for user creation', 400);
      }
      if (!userData.name) {
        throw new CueMeetError('name is required for user creation', 400);
      }
      
      const response = await this.client.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (error instanceof CueMeetError) throw error;
      throw new CueMeetError('Failed to create user', 500);
    }
  }

  /**
   * Create a new API key
   * @param keyData - API key creation parameters
   * @returns Created API key details with apiKey value (only returned upon creation)
   */
  async createApiKey(keyData: ApiKeyData): Promise<ApiKey> {    
    if (!keyData.userId) {
      throw new CueMeetError('userId is required for API key creation', 400);
    }
    if (!keyData.name) {
      throw new CueMeetError('name is required for API key creation', 400);
    }
    if (keyData.name.length > 100) {
      throw new CueMeetError('name must not exceed 100 characters', 400);
    }

    try {
      const response = await this.client.post('/api-keys', keyData);
      return response.data;
    } catch (error) {
      if (error instanceof CueMeetError) throw error;
      throw new CueMeetError('Failed to create API key', 500);
    }
  }

  /**
   * List API keys for a specific user
   * @param userId - ID of the user whose API keys to list
   * @returns Array of API key details
   */
  async listApiKeys(userId: string): Promise<ApiKeyListResponse[]> {    
    if (!userId) {
      throw new CueMeetError('userId is required to list API keys', 400);
    }

    try {
      const response = await this.client.post('/api-keys/list', { userId });
      return response.data;
    } catch (error) {
      if (error instanceof CueMeetError) throw error;
      throw new CueMeetError('Failed to list API keys', 500);
    }
  }

  /**
   * Revoke (delete) an API key
   * @param keyId - Required: ID of the API key to revoke (UUID)
   * @returns Promise resolving to RevokeApiKeyResponse indicating success
   */
  async revokeApiKey(keyId: string): Promise<RevokeApiKeyResponse> {
    if (!keyId) {
      throw new Error('keyId is required to revoke an API key');
    }

    try {
      const response = await this.client.delete(`/api-keys/${keyId}`);
      return response.data;
    } catch (error) {
      throw this._handleError(error as Error, `Failed to revoke API key: ${keyId}`);
    }
  }

  /**
   * Create a new bot
   * @param apiKey - API key for authentication
   * @param botData - Bot configuration details including required name and meetingUrl
   * @returns Created bot details
   */
  async createBot(apiKey: string, botData: CreateBotRequest): Promise<BotResponse> {    
    if (!botData.name) {
      throw new CueMeetError('name is required for bot creation', 400);
    }
    if (!botData.meetingUrl) {
      throw new CueMeetError('meetingUrl is required for bot creation', 400);
    }
    
    this._validateMeetingUrl(botData.meetingUrl);

    try {
      const response = await this.client.post('/bots', botData);
      return response.data;
    } catch (error) {
      if (error instanceof CueMeetError) throw error;
      throw new CueMeetError('Failed to create bot', 500);
    }
  }

  /**
   * Retrieve a bot by ID
   * @param apiKey - API key for authentication
   * @param botId - ID of the bot to retrieve (UUID)
   * @returns Bot details
   */
  async retrieveBot(apiKey: string, botId: string): Promise<RetrieveBotResponse> {
    this._validateApiKey(apiKey);
    
    if (!botId) {
      throw new CueMeetError('botId is required to retrieve bot', 400);
    }

    try {
      const response = await this.client.get(`/bots/${botId}`);
      return response.data;
    } catch (error) {
      if (error instanceof CueMeetError) throw error;
      throw new CueMeetError('Failed to retrieve bot', 500);
    }
  }

  /**
   * Remove a bot from a call
   * @param apiKey - API key for authentication
   * @param id - ID of the bot to remove (UUID)
   * @returns Bot details after removal
   */
  async removeBotFromCall(apiKey: string, botId: string): Promise<RemoveBotResponse> {
    this._validateApiKey(apiKey);
    
    if (!botId) {
      throw new CueMeetError('botId is required to remove bot', 400);
    }

    try {
      const response = await this.client.delete(`/bots/${botId}`);
      return response.data;
    } catch (error) {
      if (error instanceof CueMeetError) throw error;
      throw new CueMeetError('Failed to remove bot', 500);
    }
  }

  /**
   * Retrieve a transcript for a specific bot recording
   * @param apiKey - API key for authentication
   * @param id - ID of the bot recording (UUID)
   * @param params - Optional query parameters for pagination
   * @returns Transcript data including metadata and content
   */
  async retrieveTranscript(apiKey: string, id: string, params?: TranscriptQueryParams): Promise<TranscriptResponse> {
    this._validateApiKey(apiKey);
    
    if (!id) {
      throw new CueMeetError('id is required to retrieve transcript', 400);
    }

    try {
      const response = await this.client.get(`/transcripts/${id}`, { params });
      return response.data;
    } catch (error) {
      if (error instanceof CueMeetError) throw error;
      throw new CueMeetError('Failed to retrieve transcript', 500);
    }
  }

  /**
   * Update the base URL for the client
   * @param baseUrl - New base URL for the client
   */
  setBaseUrl(baseUrl: string): void {
    if (!baseUrl) {
      throw new Error('baseUrl cannot be empty');
    }
    
    // Remove trailing slash if present, then append /api/v1
    this.baseUrl = baseUrl.endsWith('/') 
      ? baseUrl.slice(0, -1) + '/api/v1'
      : baseUrl + '/api/v1';
    this.client.defaults.baseURL = this.baseUrl;
  }

  /**
   * Standard error handler for API requests
   * @private
   * @param error - Error from axios
   * @param message - Custom error message
   * @returns Error instance with detailed message
   */
  private _handleError(error: Error, message: string): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // Server responded with an error status
        return new Error(`${message}: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
      } else if (axiosError.request) {
        // Request made but no response received
        return new Error(`${message}: No response received from server`);
      }
    }
    // Generic error handling
    return new Error(`${message}: ${error.message}`);
  }

  private _validateApiKey(apiKey: string): void {
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      throw new ValidationError('API key is required and must be a non-empty string');
    }
  }

  private _validateMeetingUrl(url: string): void {
    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      throw new ValidationError('Meeting URL is required and must be a non-empty string');
    }
    
    try {
      new URL(url);
    } catch (error) {
      throw new ValidationError('Invalid meeting URL format');
    }
  }

  private _validateUserData(userData: UserData): void {
    if (!userData.email || typeof userData.email !== 'string' || !userData.email.includes('@')) {
      throw new ValidationError('Valid email is required');
    }
    if (!userData.name || typeof userData.name !== 'string' || userData.name.trim().length === 0) {
      throw new ValidationError('Name is required and must be a non-empty string');
    }
  }
}



export default CueMeetClient;