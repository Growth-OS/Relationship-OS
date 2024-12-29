export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      affiliate_earnings: {
        Row: {
          amount: number
          created_at: string
          date: string
          id: string
          notes: string | null
          partner_id: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          date: string
          id?: string
          notes?: string | null
          partner_id: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          partner_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_earnings_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "affiliate_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_partners: {
        Row: {
          commission_rate: string | null
          created_at: string
          dashboard_url: string | null
          id: string
          login_email: string | null
          login_password: string | null
          name: string
          program: string
          user_id: string
        }
        Insert: {
          commission_rate?: string | null
          created_at?: string
          dashboard_url?: string | null
          id?: string
          login_email?: string | null
          login_password?: string | null
          name: string
          program: string
          user_id: string
        }
        Update: {
          commission_rate?: string | null
          created_at?: string
          dashboard_url?: string | null
          id?: string
          login_email?: string | null
          login_password?: string | null
          name?: string
          program?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_prompts: {
        Row: {
          category: string | null
          created_at: string
          id: string
          is_active: boolean | null
          system_prompt: string
          title: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          system_prompt: string
          title: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          system_prompt?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      deals: {
        Row: {
          company_name: string
          contact_email: string | null
          contact_job_title: string | null
          contact_linkedin: string | null
          country: string | null
          country_flag: string | null
          created_at: string
          deal_value: number
          delivery_end_date: string | null
          delivery_start_date: string | null
          id: string
          last_activity_date: string
          notes: string | null
          source: Database["public"]["Enums"]["lead_source"] | null
          stage: Database["public"]["Enums"]["deal_stage"]
          user_id: string
        }
        Insert: {
          company_name: string
          contact_email?: string | null
          contact_job_title?: string | null
          contact_linkedin?: string | null
          country?: string | null
          country_flag?: string | null
          created_at?: string
          deal_value?: number
          delivery_end_date?: string | null
          delivery_start_date?: string | null
          id?: string
          last_activity_date?: string
          notes?: string | null
          source?: Database["public"]["Enums"]["lead_source"] | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          user_id: string
        }
        Update: {
          company_name?: string
          contact_email?: string | null
          contact_job_title?: string | null
          contact_linkedin?: string | null
          country?: string | null
          country_flag?: string | null
          created_at?: string
          deal_value?: number
          delivery_end_date?: string | null
          delivery_start_date?: string | null
          id?: string
          last_activity_date?: string
          notes?: string | null
          source?: Database["public"]["Enums"]["lead_source"] | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          user_id?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          is_favorite: boolean | null
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          title: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_favorite?: boolean | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      emails: {
        Row: {
          body: string | null
          created_at: string
          from_email: string
          id: string
          is_archived: boolean | null
          is_read: boolean | null
          is_sent: boolean | null
          is_starred: boolean | null
          is_trashed: boolean | null
          message_id: string
          received_at: string
          snippet: string | null
          snoozed_until: string | null
          subject: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          from_email: string
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          is_sent?: boolean | null
          is_starred?: boolean | null
          is_trashed?: boolean | null
          message_id: string
          received_at: string
          snippet?: string | null
          snoozed_until?: string | null
          subject: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          from_email?: string
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          is_sent?: boolean | null
          is_starred?: boolean | null
          is_trashed?: boolean | null
          message_id?: string
          received_at?: string
          snippet?: string | null
          snoozed_until?: string | null
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          notes: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          notes?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          notes?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: []
      }
      linkedin_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_outbound: boolean | null
          received_at: string
          sender_avatar_url: string | null
          sender_name: string
          sender_profile_url: string | null
          status: string | null
          thread_id: string | null
          unipile_message_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_outbound?: boolean | null
          received_at: string
          sender_avatar_url?: string | null
          sender_name: string
          sender_profile_url?: string | null
          status?: string | null
          thread_id?: string | null
          unipile_message_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_outbound?: boolean | null
          received_at?: string
          sender_avatar_url?: string | null
          sender_name?: string
          sender_profile_url?: string | null
          status?: string | null
          thread_id?: string | null
          unipile_message_id?: string
          user_id?: string
        }
        Relationships: []
      }
      linkedin_profiles: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          job_title: string | null
          name: string
          profile_image_url: string | null
          profile_url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          job_title?: string | null
          name: string
          profile_image_url?: string | null
          profile_url: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          job_title?: string | null
          name?: string
          profile_image_url?: string | null
          profile_url?: string
          user_id?: string
        }
        Relationships: []
      }
      oauth_connections: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          id: string
          provider: Database["public"]["Enums"]["auth_provider"]
          refresh_token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          id?: string
          provider: Database["public"]["Enums"]["auth_provider"]
          refresh_token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          id?: string
          provider?: Database["public"]["Enums"]["auth_provider"]
          refresh_token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      project_credentials: {
        Row: {
          created_at: string
          id: string
          password: string
          project_id: string
          service_name: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          password: string
          project_id: string
          service_name: string
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          password?: string
          project_id?: string
          service_name?: string
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_credentials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_documents: {
        Row: {
          created_at: string
          file_path: string
          file_type: string
          id: string
          project_id: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_path: string
          file_type: string
          id?: string
          project_id: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_path?: string
          file_type?: string
          id?: string
          project_id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          client_name: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          last_activity_date: string
          name: string
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          user_id: string
        }
        Insert: {
          budget?: number | null
          client_name: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          last_activity_date?: string
          name: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          user_id: string
        }
        Update: {
          budget?: number | null
          client_name?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          last_activity_date?: string
          name?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          user_id?: string
        }
        Relationships: []
      }
      prospects: {
        Row: {
          company_name: string
          contact_email: string | null
          contact_job_title: string | null
          contact_linkedin: string | null
          created_at: string
          id: string
          notes: string | null
          source: Database["public"]["Enums"]["lead_source"]
          status: string | null
          user_id: string
        }
        Insert: {
          company_name: string
          contact_email?: string | null
          contact_job_title?: string | null
          contact_linkedin?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: string | null
          user_id: string
        }
        Update: {
          company_name?: string
          contact_email?: string | null
          contact_job_title?: string | null
          contact_linkedin?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      substack_posts: {
        Row: {
          content: string | null
          created_at: string
          id: string
          publish_date: string
          status: string
          title: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          publish_date: string
          status?: string
          title: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          publish_date?: string
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed: boolean | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          project_id: string | null
          source: Database["public"]["Enums"]["task_source"] | null
          source_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          source?: Database["public"]["Enums"]["task_source"] | null
          source_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          source?: Database["public"]["Enums"]["task_source"] | null
          source_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          invited_at: string
          invited_by: string | null
          joined_at: string | null
          role: Database["public"]["Enums"]["user_role"]
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          invited_at?: string
          invited_by?: string | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          invited_at?: string
          invited_by?: string | null
          joined_at?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      transaction_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_type: string
          id: string
          transaction_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_type: string
          id?: string
          transaction_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_type?: string
          id?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_attachments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "financial_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          default_snooze_times: Json | null
          email_signature: string | null
          id: string
          keyboard_shortcuts: Json | null
          layout_preferences: Json | null
          theme: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          default_snooze_times?: Json | null
          email_signature?: string | null
          id?: string
          keyboard_shortcuts?: Json | null
          layout_preferences?: Json | null
          theme?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          default_snooze_times?: Json | null
          email_signature?: string | null
          id?: string
          keyboard_shortcuts?: Json | null
          layout_preferences?: Json | null
          theme?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      auth_provider: "google"
      deal_stage:
        | "lead"
        | "meeting"
        | "negotiation"
        | "project_preparation"
        | "in_progress"
        | "to_invoice"
        | "invoiced"
        | "paid"
      email_status: "unread" | "read" | "archived" | "snoozed" | "trashed"
      lead_source:
        | "website"
        | "referral"
        | "linkedin"
        | "cold_outreach"
        | "conference"
        | "other"
      project_status: "active" | "completed" | "on_hold"
      task_source:
        | "deals"
        | "content"
        | "ideas"
        | "substack"
        | "other"
        | "projects"
      transaction_type: "income" | "expense"
      user_role: "owner" | "admin" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
