import { CueMeetClient } from '../index';
import { CueMeetError } from '../utils/errors';
import axios, { AxiosInstance } from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('CueMeetClient', () => {
  let client: CueMeetClient;
  let mock: MockAdapter;
  const baseUrl = 'http://localhost:4000';
  let axiosInstance: AxiosInstance;

  beforeEach(() => {
    axiosInstance = axios.create();
    mock = new MockAdapter(axiosInstance);
    client = new CueMeetClient({ baseUrl }, axiosInstance);
  });

  afterEach(() => {
    mock.reset();
  });

  describe('constructor', () => {
    it('should initialize with valid baseUrl', () => {
      expect(client).toBeInstanceOf(CueMeetClient);
    });

    it('should throw error when baseUrl is not provided', () => {
      expect(() => new CueMeetClient({} as any)).toThrow('baseUrl is required for CueMeet client initialization');
    });
  });

  describe('createUser', () => {
    const userData = {
      email: 'jeff@gmail.com',
      name: 'Test User'
    };

    it('should create a user successfully', async () => {
      const mockResponse = {
        id: '123',
        email: userData.email,
        name: userData.name,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      mock.onPost('/auth/register').reply(201, mockResponse);

      const response = await client.createUser(userData);
      expect(response).toEqual(mockResponse);
    });

    it('should throw error when email is missing', async () => {
      await expect(client.createUser({ name: 'Test User' } as any))
        .rejects
        .toThrow('email is required for user creation');
    });

    it('should throw error when name is missing', async () => {
      await expect(client.createUser({ email: 'test@example.com' } as any))
        .rejects
        .toThrow('name is required for user creation');
    });
  });

  describe('createApiKey', () => {
    const keyData = {
      userId: '123',
      name: 'Test API Key'
    };

    it('should create an API key successfully', async () => {
      const mockResponse = {
        id: '456',
        name: keyData.name,
        createdAt: '2024-01-01T00:00:00Z',
        apiKey: 'test-api-key'
      };

      mock.onPost('/api-keys').reply(201, mockResponse);

      const response = await client.createApiKey(keyData);
      expect(response).toEqual(mockResponse);
    });

    it('should throw error when userId is missing', async () => {
      await expect(client.createApiKey({ name: 'Test API Key' } as any))
        .rejects
        .toThrow('userId is required for API key creation');
    });

    it('should throw error when name is missing', async () => {
      await expect(client.createApiKey({ userId: '123' } as any))
        .rejects
        .toThrow('name is required for API key creation');
    });

    it('should throw error when name exceeds 100 characters', async () => {
      const longName = 'a'.repeat(101);
      await expect(client.createApiKey({ userId: '123', name: longName }))
        .rejects
        .toThrow('name must not exceed 100 characters');
    });
  });

  describe('listApiKeys', () => {
    it('should list API keys successfully', async () => {
      const mockResponse = [{
        id: '456',
        name: 'Test API Key',
        createdAt: '2024-01-01T00:00:00Z',
        expiresAt: '2025-01-01T00:00:00Z',
        isActive: true,
        lastUsedAt: '2024-01-01T00:00:00Z'
      }];

      mock.onPost('/api-keys/list').reply(200, mockResponse);

      const response = await client.listApiKeys('123');
      expect(response).toEqual(mockResponse);
    });

    it('should throw error when userId is missing', async () => {
      await expect(client.listApiKeys(''))
        .rejects
        .toThrow('userId is required to list API keys');
    });
  });

  describe('createBot', () => {
    const botData = {
      name: 'Test Bot',
      meetingUrl: 'https://meet.google.com/vwj-kskt-ftf'
    };

    it('should create a bot successfully', async () => {
      const mockResponse = {
        id: '789',
        name: botData.name,
        title: 'Test Meeting',
        meetingUrl: botData.meetingUrl,
        recordingMode: 'SPEAKER_VIEW',
        platform: 'GOOGLE_MEET',
        apiKeyId: '456',
        status: 'PENDING',
        taskId: 'task-123',
        retryCount: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      mock.onPost('/bots').reply(201, mockResponse);

      const response = await client.createBot('test-api-key', botData);
      expect(response).toEqual(mockResponse);
    });

    it('should throw error when name is missing', async () => {
      await expect(client.createBot('test-api-key', { meetingUrl: 'https://meet.google.com/abc-defg-hij' } as any))
        .rejects
        .toThrow('name is required for bot creation');
    });

    it('should throw error when meetingUrl is missing', async () => {
      await expect(client.createBot('test-api-key', { name: 'Test Bot' } as any))
        .rejects
        .toThrow('meetingUrl is required for bot creation');
    });
  });

  describe('retrieveBot', () => {
    it('should retrieve a bot successfully', async () => {
      const mockResponse = {
        id: '789',
        name: 'Test Bot',
        title: 'Test Meeting',
        meetingUrl: 'https://meet.google.com/abc-defg-hij',
        recordingMode: 'SPEAKER_VIEW',
        platform: 'GOOGLE_MEET',
        apiKeyId: '456',
        status: 'PENDING',
        taskId: 'task-123',
        retryCount: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      mock.onGet('/bots/789').reply(200, mockResponse);

      const response = await client.retrieveBot('test-api-key', '789');
      expect(response).toEqual(mockResponse);
    });

    it('should throw error when botId is missing', async () => {
      await expect(client.retrieveBot('test-api-key', ''))
        .rejects
        .toThrow('botId is required to retrieve bot');
    });
  });

  describe('removeBotFromCall', () => {
    it('should remove a bot successfully', async () => {
      const mockResponse = {
        id: '789',
        name: 'Test Bot',
        title: 'Test Meeting',
        meetingUrl: 'https://meet.google.com/abc-defg-hij',
        recordingMode: 'SPEAKER_VIEW',
        platform: 'GOOGLE_MEET',
        apiKeyId: '456',
        status: 'STOPPED',
        taskId: 'task-123',
        retryCount: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      mock.onDelete('/bots/789').reply(200, mockResponse);

      const response = await client.removeBotFromCall('test-api-key', '789');
      expect(response).toEqual(mockResponse);
    });

    it('should throw error when botId is missing', async () => {
      await expect(client.removeBotFromCall('test-api-key', ''))
        .rejects
        .toThrow('botId is required to remove bot');
    });
  });

  describe('retrieveTranscript', () => {
    it('should retrieve a transcript successfully', async () => {
      const mockResponse = {
        id: 'transcript-123',
        raw_file_key: 'raw-123',
        audio_file_key: 'audio-123',
        meeting_title: 'Test Meeting',
        meeting_meeting_start_time: '2024-01-01T00:00:00Z',
        meeting_meeting_end_time: '2024-01-01T01:00:00Z',
        execution_id: 'exec-123',
        bot_used: 789,
        status: 1,
        created_by_user_id: '123',
        transcript: [],
        total: 0,
        hasMore: false
      };

      mock.onGet('/transcripts/transcript-123').reply(200, mockResponse);

      const response = await client.retrieveTranscript('test-api-key', 'transcript-123');
      expect(response).toEqual(mockResponse);
    });

    it('should throw error when id is missing', async () => {
      await expect(client.retrieveTranscript('test-api-key', ''))
        .rejects
        .toThrow('id is required to retrieve transcript');
    });
  });

  describe('setBaseUrl', () => {
    it('should update the base URL successfully', () => {
      const newBaseUrl = 'https://api-staging.cuemeet.com';
      client.setBaseUrl(newBaseUrl);
      expect(client['baseUrl']).toBe(newBaseUrl + '/api/v1');
    });

    it('should throw error when baseUrl is empty', () => {
      expect(() => client.setBaseUrl(''))
        .toThrow('baseUrl cannot be empty');
    });
  });
}); 