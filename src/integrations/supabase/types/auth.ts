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
  avatar_url: string | null;
  headline: string | null;
}

export interface Team {
  id: string;
  name: string;
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
  temp_password: string | null;
  credentials_shared: boolean;
  credentials_created_at: string;
}

export interface TeamInvitation {
  id: string;
  created_at: string;
  team_id: string;
  email: string;
  role: UserRole;
  token: string;
  invited_by: string;
  expires_at: string;
  status: string;
}