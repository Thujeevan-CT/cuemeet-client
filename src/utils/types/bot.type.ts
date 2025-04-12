export interface CreateBotRequest {
  name: string;           // Required: Name of the bot
  meetingUrl: string;     // Required: URL of the meeting to join
  title?: string;         // Optional: Title for the meeting
  recordingMode?: 'SPEAKER_VIEW' | 'GALLERY_VIEW' | 'AUDIO_ONLY';  // Optional: Recording mode for the bot
  joinAt?: string;        // Optional: When the bot should join the meeting (ISO 8601 format, e.g. "2024-07-29T15:51:28.071Z")
  leaveAt?: string;      // Optional: When the bot should leave the meeting (ISO 8601 format, e.g. "2024-07-29T15:51:28.071Z")
  metadata?: Record<string, any>;  // Optional: Additional metadata for the bot
}

export interface BotResponse {
  id: string;            // Unique bot identifier (UUID)
  name: string;          // Name of the bot
  title: string;         // Title for the meeting
  meetingUrl: string;    // URL of the meeting
  recordingMode: 'SPEAKER_VIEW' | 'GALLERY_VIEW' | 'AUDIO_ONLY';  // Recording mode for the bot
  platform: 'GOOGLE_MEET' | 'ZOOM' | 'TEAMS';  // Meeting platform type
  apiKeyId: string;      // ID of the API key that created this bot
  joinAt?: string;       // When the bot should join the meeting (ISO 8601 format, e.g. "2024-07-29T15:51:28.071Z")
  leaveAt?: string;      // When the bot should leave the meeting (ISO 8601 format, e.g. "2024-07-29T15:51:28.071Z")
  status: 'PENDING' | 'STARTED' | 'COMPLETED' | 'FAILED' | 'STOPPED';  // Current status
  taskId: string;        // ID of the associated task
  retryCount: number;    // Number of retry attempts
  metadata?: Record<string, any>;  // Additional metadata for the bot
  createdAt: string;     // Bot creation timestamp (ISO 8601 format)
  updatedAt: string;     // Bot last update timestamp (ISO 8601 format)
}

export interface RetrieveBotResponse {
  id: string;            // Unique bot identifier
  name: string;          // Name of the bot
  title: string;         // Title for the meeting
  meetingUrl: string;    // URL of the meeting
  recordingMode: 'SPEAKER_VIEW' | 'GALLERY_VIEW' | 'AUDIO_ONLY';  // Recording mode for the bot
  platform: 'GOOGLE_MEET' | 'ZOOM' | 'TEAMS';  // Meeting platform type
  apiKeyId: string;      // ID of the API key that created this bot
  joinAt: string;        // When the bot should join the meeting
  leaveAt: string;       // When the bot should leave the meeting
  status: 'PENDING' | 'STARTED' | 'COMPLETED' | 'FAILED' | 'STOPPED';  // Current status of the bot execution
  taskId: string;        // ID of the associated task
  retryCount: number;    // Number of retry attempts
  metadata: object;      // Additional metadata for the bot
  createdAt: string;     // Bot creation timestamp
  updatedAt: string;     // Bot last update timestamp
}

export interface RemoveBotResponse {
  id: string;            // Unique bot identifier
  name: string;          // Name of the bot
  title: string;         // Title for the meeting
  meetingUrl: string;    // URL of the meeting
  recordingMode: string; // Recording mode for the bot
  platform: string;      // Meeting platform type
  apiKeyId: string;      // ID of the API key that created this bot
  joinAt: string;        // When the bot should join the meeting
  leaveAt: string;       // When the bot should leave the meeting
  status: string;        // Current status of the bot execution
  taskId: string;        // ID of the associated task
  retryCount: number;    // Number of retry attempts
  metadata: object;      // Additional metadata for the bot
  createdAt: string;     // Bot creation timestamp
  updatedAt: string;     // Bot last update timestamp
}