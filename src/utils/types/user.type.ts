export interface UserData {
  email: string; // Required: User's email address
  name: string;  // Required: User's full name
}

export interface UserResponse {
  id: string;        // Unique user identifier (UUID)
  email: string;     // User's email address
  name: string;      // User's full name
  createdAt: string; // User creation timestamp
  updatedAt: string; // User last update timestamp
}