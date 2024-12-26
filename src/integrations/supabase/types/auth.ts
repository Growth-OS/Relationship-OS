export type UserRole = 'owner' | 'admin' | 'member';
export type AuthProvider = 'google';

export interface OAuthConnection {
  id: string;
  user_id: string;
  provider: AuthProvider;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: UserRole;
  invited_by: string | null;
  invited_at: string;
  joined_at: string | null;
}

export interface Team {
  id: string;
  name: string;
  created_at: string;
}