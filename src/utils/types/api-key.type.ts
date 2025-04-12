export interface ApiKeyData {
  userId: string;  // Required: ID of the user the API key belongs to
  name: string;    // Required: Descriptive name for the API key (max 100 chars)
  expiresAt?: string;  // Optional: Expiration date for the API key
  permissions?: string[];  // Optional: Array of permission strings
}

export interface ApiKey {
  id: string;         // Unique API key identifier (UUID)
  name: string;       // Descriptive name for the API key
  createdAt: string;  // API key creation timestamp
  expiresAt?: string; // API key expiration timestamp
  apiKey?: string;    // The actual API key value (only returned upon creation)
}

export interface ApiKeyListResponse {
  id: string;         // Unique API key identifier
  name: string;       // Descriptive name for the API key
  createdAt: string;  // API key creation timestamp
  expiresAt: string;  // API key expiration timestamp
  isActive: boolean;  // Whether the API key is active
  lastUsedAt: string; // When the API key was last used
}

export interface RevokeApiKeyResponse {
  success: boolean;  // Indicates if the API key was successfully revoked
}