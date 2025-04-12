export interface TranscriptQueryParams {
  page?: number;  // Optional: Page number for pagination (default: 1)
  limit?: number; // Optional: Number of items per page (default: 10)
}

export interface TranscriptResponse {
  id: string;                           // Unique file identifier
  raw_file_key: string;                 // Key for the raw recording file
  audio_file_key: string;               // Key for the processed audio file
  meeting_title: string;                // Title of the meeting
  meeting_meeting_start_time: string;   // Meeting start time
  meeting_meeting_end_time: string;     // Meeting end time
  execution_id: string;                 // ID of the execution process
  bot_used: number;                     // ID of the bot used for recording
  status: number;                       // Status of the transcript
  created_by_user_id: string;           // ID of the user who created the recording
  transcript: TranscriptSegment[];      // Array of transcript segments
  total: number;                        // Total number of transcript items
  hasMore: boolean;                     // Whether there are more transcript items available
}

export interface Transcript {
  id: string;
  callId: string; 
  content: any;
  createdAt: string;
  [key: string]: any;
}

interface TranscriptSegment {
  id: string;                                       // Unique transcript segment identifier (UUID)
  speaker: string;                                  // Name or identifier of the speaker
  transcription_start_time_milliseconds: string;    // Start time of the transcription segment in milliseconds
  transcription_end_time_milliseconds: string;      // End time of the transcription segment in milliseconds
  transcription_Data: string;                       // The transcribed text content
}