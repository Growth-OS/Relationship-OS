import { AuthProvider, OAuthConnection, Profile, Team, TeamMember, UserRole } from './auth';
import { AIPrompt, LinkedInProfile, SubstackPost } from './content';
import { Deal, DealStage, LeadSource } from './deals';
import { Prospect } from './prospects';
import { AffiliateEarning, AffiliatePartner, FinancialTransaction, TransactionAttachment, TransactionType } from './finances';
import { LinkedInMessage } from './linkedin';
import { Project, ProjectCredential, ProjectDocument, ProjectStatus } from './projects';
import { Task, TaskSource } from './tasks';

export type Database = {
  public: {
    Tables: {
      linkedin_messages: {
        Row: LinkedInMessage;
        Insert: Partial<LinkedInMessage> & Pick<LinkedInMessage, 'unipile_message_id' | 'sender_name' | 'content' | 'received_at' | 'user_id'>;
        Update: Partial<LinkedInMessage>;
      };
      affiliate_earnings: {
        Row: AffiliateEarning;
        Insert: Partial<AffiliateEarning> & Pick<AffiliateEarning, 'partner_id' | 'amount' | 'date' | 'user_id'>;
        Update: Partial<AffiliateEarning>;
      };
      affiliate_partners: {
        Row: AffiliatePartner;
        Insert: Partial<AffiliatePartner> & Pick<AffiliatePartner, 'name' | 'program' | 'user_id'>;
        Update: Partial<AffiliatePartner>;
      };
      ai_prompts: {
        Row: AIPrompt;
        Insert: Partial<AIPrompt> & Pick<AIPrompt, 'title' | 'system_prompt' | 'user_id'>;
        Update: Partial<AIPrompt>;
      };
      deals: {
        Row: Deal;
        Insert: Partial<Deal> & Pick<Deal, 'company_name' | 'user_id'>;
        Update: Partial<Deal>;
      };
      financial_transactions: {
        Row: FinancialTransaction;
        Insert: Partial<FinancialTransaction> & Pick<FinancialTransaction, 'type' | 'amount' | 'date' | 'user_id'>;
        Update: Partial<FinancialTransaction>;
      };
      linkedin_profiles: {
        Row: LinkedInProfile;
        Insert: Partial<LinkedInProfile> & Pick<LinkedInProfile, 'profile_url' | 'name' | 'user_id'>;
        Update: Partial<LinkedInProfile>;
      };
      oauth_connections: {
        Row: OAuthConnection;
        Insert: Partial<OAuthConnection> & Pick<OAuthConnection, 'provider' | 'access_token' | 'refresh_token' | 'expires_at' | 'user_id'>;
        Update: Partial<OAuthConnection>;
      };
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & Pick<Profile, 'id' | 'email'>;
        Update: Partial<Profile>;
      };
      project_credentials: {
        Row: ProjectCredential;
        Insert: Partial<ProjectCredential> & Pick<ProjectCredential, 'project_id' | 'service_name' | 'username' | 'password' | 'user_id'>;
        Update: Partial<ProjectCredential>;
      };
      project_documents: {
        Row: ProjectDocument;
        Insert: Partial<ProjectDocument> & Pick<ProjectDocument, 'project_id' | 'title' | 'file_path' | 'file_type' | 'user_id'>;
        Update: Partial<ProjectDocument>;
      };
      projects: {
        Row: Project;
        Insert: Partial<Project> & Pick<Project, 'name' | 'client_name' | 'user_id'>;
        Update: Partial<Project>;
      };
      prospects: {
        Row: Prospect;
        Insert: Partial<Prospect> & Pick<Prospect, 'company_name' | 'source' | 'user_id'>;
        Update: Partial<Prospect>;
      };
      substack_posts: {
        Row: SubstackPost;
        Insert: Partial<SubstackPost> & Pick<SubstackPost, 'title' | 'publish_date' | 'user_id'>;
        Update: Partial<SubstackPost>;
      };
      tasks: {
        Row: Task;
        Insert: Partial<Task> & Pick<Task, 'title' | 'user_id'>;
        Update: Partial<Task>;
      };
      team_members: {
        Row: TeamMember;
        Insert: Partial<TeamMember> & Pick<TeamMember, 'team_id' | 'user_id'>;
        Update: Partial<TeamMember>;
      };
      teams: {
        Row: Team;
        Insert: Partial<Team> & Pick<Team, 'name'>;
        Update: Partial<Team>;
      };
      transaction_attachments: {
        Row: TransactionAttachment;
        Insert: Partial<TransactionAttachment> & Pick<TransactionAttachment, 'transaction_id' | 'file_path' | 'file_name' | 'file_type'>;
        Update: Partial<TransactionAttachment>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      auth_provider: AuthProvider;
      deal_stage: DealStage;
      lead_source: LeadSource;
      project_status: ProjectStatus;
      task_source: TaskSource;
      transaction_type: TransactionType;
      user_role: UserRole;
    };
    CompositeTypes: {};
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

export * from './auth';
export * from './content';
export * from './deals';
export * from './prospects';
export * from './finances';
export * from './linkedin';
export * from './projects';
export * from './tasks';