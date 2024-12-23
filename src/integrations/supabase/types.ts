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
          stage?: Database["public"]["Enums"]["deal_stage"]
          user_id?: string
        }
        Relationships: []
      }
      prospects: {
        Row: {
          company_name: string
          contact_email: string | null
          contact_job_title: string | null
          created_at: string
          id: string
          notes: string | null
          source: Database["public"]["Enums"]["lead_source"]
          user_id: string
        }
        Insert: {
          company_name: string
          contact_email?: string | null
          contact_job_title?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
          user_id: string
        }
        Update: {
          company_name?: string
          contact_email?: string | null
          contact_job_title?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          source?: Database["public"]["Enums"]["lead_source"]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      deal_stage:
        | "lead"
        | "meeting"
        | "negotiation"
        | "project_preparation"
        | "in_progress"
        | "to_invoice"
        | "invoiced"
        | "paid"
      lead_source:
        | "website"
        | "referral"
        | "linkedin"
        | "cold_outreach"
        | "conference"
        | "other"
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
