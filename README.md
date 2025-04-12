# CueMeet API Client for Node.js

A TypeScript/JavaScript client library for interacting with the CueMeet API.

## Features

- User management
- API key management
- Meeting bot management
- Transcript retrieval
- TypeScript support
- Comprehensive error handling

## Installation

```bash
npm install cuemeet
```

## Usage

### Initialization

```typescript
import CueMeetClient from 'cuemeet';

const client = new CueMeetClient({
  baseUrl: 'https://api.cuemeet.com', // Your CueMeet API base URL
  timeout: 10000, // Optional: Request timeout in milliseconds
});
```

### User Management

#### Create a User

```typescript
const user = await client.createUser({
  email: 'user@example.com',
  name: 'John Doe'
});
```

#### Create an API Key

```typescript
const apiKey = await client.createApiKey({
  userId: 'user-123',
  name: 'My API Key',
  expiresAt: '2025-01-01T00:00:00Z', // Optional
  permissions: ['read', 'write'] // Optional
});
```

#### List API Keys

```typescript
const apiKeys = await client.listApiKeys('user-123');
```

#### Revoke an API Key

```typescript
const result = await client.revokeApiKey('api-key-123');
```

### Bot Management

#### Create a Bot

```typescript
const bot = await client.createBot('api-key-123', {
  name: 'Meeting Bot',
  meetingUrl: 'https://meet.google.com/abc-defg-hij',
  title: 'Team Meeting',
  recordingMode: 'SPEAKER_VIEW',
  joinAt: '2024-01-01T10:00:00Z',
  leaveAt: '2024-01-01T11:00:00Z'
});
```

#### Retrieve a Bot

```typescript
const bot = await client.retrieveBot('api-key-123', 'bot-123');
```

#### Remove a Bot from Call

```typescript
const result = await client.removeBotFromCall('api-key-123', 'bot-123');
```

### Transcript Management

#### Retrieve a Transcript

```typescript
const transcript = await client.retrieveTranscript('api-key-123', 'transcript-123', {
  page: 1,
  limit: 10
});
```

## API Reference

### CueMeetClient

#### Constructor

```typescript
new CueMeetClient(options: CueMeetClientOptions)
```

Options:
- `baseUrl` (string): Required. The base URL of the CueMeet API
- `timeout` (number): Optional. Request timeout in milliseconds (default: 10000)

#### Methods

##### createUser(userData: UserData): Promise<UserResponse>
Creates a new user.

##### createApiKey(keyData: ApiKeyData): Promise<ApiKey>
Creates a new API key.

##### listApiKeys(userId: string): Promise<ApiKeyListResponse[]>
Lists API keys for a specific user.

##### revokeApiKey(keyId: string): Promise<RevokeApiKeyResponse>
Revokes (deletes) an API key.

##### createBot(apiKey: string, botData: CreateBotRequest): Promise<BotResponse>
Creates a new bot.

##### retrieveBot(apiKey: string, botId: string): Promise<RetrieveBotResponse>
Retrieves a bot by ID.

##### removeBotFromCall(apiKey: string, botId: string): Promise<RemoveBotResponse>
Removes a bot from a call.

##### retrieveTranscript(apiKey: string, id: string, params?: TranscriptQueryParams): Promise<TranscriptResponse>
Retrieves a transcript for a specific bot recording.

##### setBaseUrl(baseUrl: string): void
Updates the base URL for the client.

## Error Handling

The client throws specific error types:

- `CueMeetError`: Base error class for all CueMeet errors
- `ValidationError`: Thrown when input validation fails
- `AuthenticationError`: Thrown when authentication fails
- `NotFoundError`: Thrown when a resource is not found
- `RateLimitError`: Thrown when rate limit is exceeded

Example error handling:

```typescript
try {
  await client.createUser({ email: 'invalid' });
} catch (error) {
  if (error instanceof CueMeetError) {
    console.error(`Error: ${error.message} (Status: ${error.status})`);
  }
}
```

## Testing

Run tests with:

```bash
npm test
```

Run tests with coverage:

```bash
npm test -- --coverage
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
