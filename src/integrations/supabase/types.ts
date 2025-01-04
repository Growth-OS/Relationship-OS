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
      boards: {
        Row: {
          canvas_data: Json | null
          created_at: string
          description: string | null
          id: string
          last_edited_at: string
          name: string
          user_id: string
        }
        Insert: {
          canvas_data?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          last_edited_at?: string
          name: string
          user_id: string
        }
        Update: {
          canvas_data?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          last_edited_at?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      content_strategy: {
        Row: {
          content_pillars: string[] | null
          created_at: string
          description: string | null
          id: string
          key_topics: string[] | null
          publishing_frequency: string | null
          target_audience: string | null
          title: string
          user_id: string
        }
        Insert: {
          content_pillars?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          key_topics?: string[] | null
          publishing_frequency?: string | null
          target_audience?: string | null
          title: string
          user_id: string
        }
        Update: {
          content_pillars?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          key_topics?: string[] | null
          publishing_frequency?: string | null
          target_audience?: string | null
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
      development_items: {
        Row: {
          category: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          status: string
          title: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          status?: string
          title?: string
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
      invoice_items: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          invoice_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          quantity: number
          unit_price: number
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_address: string | null
          client_email: string | null
          client_name: string
          company_address: string | null
          company_email: string | null
          company_name: string
          created_at: string
          deal_id: string | null
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          payment_terms: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal: number
          tax_amount: number | null
          tax_rate: number | null
          total: number
          user_id: string
        }
        Insert: {
          client_address?: string | null
          client_email?: string | null
          client_name: string
          company_address?: string | null
          company_email?: string | null
          company_name: string
          created_at?: string
          deal_id?: string | null
          due_date: string
          id?: string
          invoice_number: string
          issue_date: string
          notes?: string | null
          payment_terms?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal: number
          tax_amount?: number | null
          tax_rate?: number | null
          total: number
          user_id: string
        }
        Update: {
          client_address?: string | null
          client_email?: string | null
          client_name?: string
          company_address?: string | null
          company_email?: string | null
          company_name?: string
          created_at?: string
          deal_id?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          payment_terms?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
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
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          headline: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          headline?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          headline?: string | null
          id?: string
        }
        Relationships: []
      }
      project_chat_history: {
        Row: {
          created_at: string
          deal_id: string | null
          id: string
          message: string
          project_id: string | null
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deal_id?: string | null
          id?: string
          message: string
          project_id?: string | null
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          deal_id?: string | null
          id?: string
          message?: string
          project_id?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_chat_history_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_chat_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
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
          deal_id: string | null
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
          deal_id?: string | null
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
          deal_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          last_activity_date?: string
          name?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_project_deal"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
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
      sequence_assignments: {
        Row: {
          completed_at: string | null
          created_at: string
          current_step: number | null
          id: string
          is_interested: boolean | null
          paused_at: string | null
          prospect_id: string
          sequence_id: string
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_step?: number | null
          id?: string
          is_interested?: boolean | null
          paused_at?: string | null
          prospect_id: string
          sequence_id: string
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_step?: number | null
          id?: string
          is_interested?: boolean | null
          paused_at?: string | null
          prospect_id?: string
          sequence_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sequence_assignments_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: true
            referencedRelation: "prospect_sequence_info"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sequence_assignments_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: true
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sequence_assignments_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "sequences"
            referencedColumns: ["id"]
          },
        ]
      }
      sequence_history: {
        Row: {
          action: string
          assignment_id: string
          completed_at: string | null
          created_at: string
          id: string
          notes: string | null
          scheduled_for: string | null
          snoozed_until: string | null
          step_number: number
          step_type: Database["public"]["Enums"]["sequence_step_type"]
        }
        Insert: {
          action: string
          assignment_id: string
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          scheduled_for?: string | null
          snoozed_until?: string | null
          step_number: number
          step_type: Database["public"]["Enums"]["sequence_step_type"]
        }
        Update: {
          action?: string
          assignment_id?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          scheduled_for?: string | null
          snoozed_until?: string | null
          step_number?: number
          step_type?: Database["public"]["Enums"]["sequence_step_type"]
        }
        Relationships: [
          {
            foreignKeyName: "sequence_history_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "sequence_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      sequence_steps: {
        Row: {
          created_at: string
          delay_days: number | null
          id: string
          message_template: string | null
          preferred_time: string | null
          sequence_id: string
          step_number: number
          step_type: Database["public"]["Enums"]["sequence_step_type"]
        }
        Insert: {
          created_at?: string
          delay_days?: number | null
          id?: string
          message_template?: string | null
          preferred_time?: string | null
          sequence_id: string
          step_number: number
          step_type: Database["public"]["Enums"]["sequence_step_type"]
        }
        Update: {
          created_at?: string
          delay_days?: number | null
          id?: string
          message_template?: string | null
          preferred_time?: string | null
          sequence_id?: string
          step_number?: number
          step_type?: Database["public"]["Enums"]["sequence_step_type"]
        }
        Relationships: [
          {
            foreignKeyName: "sequence_steps_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "sequences"
            referencedColumns: ["id"]
          },
        ]
      }
      sequences: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_deleted: boolean | null
          max_steps: number | null
          name: string
          status: Database["public"]["Enums"]["sequence_status"] | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_deleted?: boolean | null
          max_steps?: number | null
          name: string
          status?: Database["public"]["Enums"]["sequence_status"] | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_deleted?: boolean | null
          max_steps?: number | null
          name?: string
          status?: Database["public"]["Enums"]["sequence_status"] | null
          user_id?: string
        }
        Relationships: []
      }
      social_posts: {
        Row: {
          content: string | null
          created_at: string
          hashtags: string[] | null
          id: string
          images: string[] | null
          is_archived: boolean
          notes: string | null
          platform: Database["public"]["Enums"]["social_platform"]
          published_at: string | null
          scheduled_for: string | null
          status: Database["public"]["Enums"]["social_post_status"]
          title: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          hashtags?: string[] | null
          id?: string
          images?: string[] | null
          is_archived?: boolean
          notes?: string | null
          platform?: Database["public"]["Enums"]["social_platform"]
          published_at?: string | null
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["social_post_status"]
          title: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          hashtags?: string[] | null
          id?: string
          images?: string[] | null
          is_archived?: boolean
          notes?: string | null
          platform?: Database["public"]["Enums"]["social_platform"]
          published_at?: string | null
          scheduled_for?: string | null
          status?: Database["public"]["Enums"]["social_post_status"]
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      substack_posts: {
        Row: {
          ai_suggestions: Json | null
          category: string | null
          content: string | null
          created_at: string
          id: string
          last_auto_save_at: string | null
          publish_date: string
          status: Database["public"]["Enums"]["substack_post_status"]
          tags: string[] | null
          title: string
          url: string | null
          user_id: string
          version_history: Json[] | null
        }
        Insert: {
          ai_suggestions?: Json | null
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          last_auto_save_at?: string | null
          publish_date: string
          status?: Database["public"]["Enums"]["substack_post_status"]
          tags?: string[] | null
          title: string
          url?: string | null
          user_id: string
          version_history?: Json[] | null
        }
        Update: {
          ai_suggestions?: Json | null
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          last_auto_save_at?: string | null
          publish_date?: string
          status?: Database["public"]["Enums"]["substack_post_status"]
          tags?: string[] | null
          title?: string
          url?: string | null
          user_id?: string
          version_history?: Json[] | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed: boolean | null
          created_at: string
          deal_id: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          project_id: string | null
          sequence_id: string | null
          source: Database["public"]["Enums"]["task_source"] | null
          source_id: string | null
          substack_post_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          sequence_id?: string | null
          source?: Database["public"]["Enums"]["task_source"] | null
          source_id?: string | null
          substack_post_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          deal_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          project_id?: string | null
          sequence_id?: string | null
          source?: Database["public"]["Enums"]["task_source"] | null
          source_id?: string | null
          substack_post_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "sequences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_substack_post_id_fkey"
            columns: ["substack_post_id"]
            isOneToOne: false
            referencedRelation: "substack_posts"
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
      invoice_metrics: {
        Row: {
          avg_payment_days: number | null
          overdue_amount: number | null
          overdue_invoices: number | null
          paid_amount: number | null
          paid_invoices: number | null
          total_amount: number | null
          total_invoices: number | null
          user_id: string | null
        }
        Relationships: []
      }
      monthly_financial_metrics: {
        Row: {
          month: string | null
          total_amount: number | null
          transaction_count: number | null
          type: Database["public"]["Enums"]["transaction_type"] | null
          user_id: string | null
        }
        Relationships: []
      }
      prospect_sequence_info: {
        Row: {
          company_name: string | null
          completed_at: string | null
          contact_email: string | null
          contact_job_title: string | null
          contact_linkedin: string | null
          created_at: string | null
          current_step: number | null
          id: string | null
          notes: string | null
          paused_at: string | null
          sequence_name: string | null
          sequence_status: string | null
          source: Database["public"]["Enums"]["lead_source"] | null
          status: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      auth_provider: "google"
      board_element_type: "sticky_note" | "shape" | "arrow" | "text"
      deal_stage:
        | "lead"
        | "meeting"
        | "negotiation"
        | "project_preparation"
        | "in_progress"
        | "to_invoice"
        | "invoiced"
        | "paid"
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
      lead_source:
        | "website"
        | "referral"
        | "linkedin"
        | "cold_outreach"
        | "conference"
        | "other"
      project_status: "active" | "completed" | "on_hold"
      sequence_status: "active" | "paused" | "completed"
      sequence_step_type: "email" | "linkedin"
      social_platform: "linkedin" | "instagram" | "both"
      social_post_status: "draft" | "ready" | "published" | "scheduled"
      substack_post_status: "idea" | "writing" | "review" | "schedule" | "live"
      task_source:
        | "deals"
        | "content"
        | "ideas"
        | "substack"
        | "other"
        | "projects"
        | "sequences"
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
