export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_questions: {
        Row: {
          admin_id: string
          created_at: string
          date: string
          id: string
          question_text: string
          response: string | null
        }
        Insert: {
          admin_id: string
          created_at?: string
          date?: string
          id?: string
          question_text: string
          response?: string | null
        }
        Update: {
          admin_id?: string
          created_at?: string
          date?: string
          id?: string
          question_text?: string
          response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_questions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_weekly_surveys: {
        Row: {
          admin_id: string
          behavior_concerns: string | null
          completed_at: string | null
          created_at: string | null
          help_needed: string | null
          id: string
          problem_report: string | null
          survey_feedback: string | null
          team_status: string | null
          week_start: string
        }
        Insert: {
          admin_id: string
          behavior_concerns?: string | null
          completed_at?: string | null
          created_at?: string | null
          help_needed?: string | null
          id?: string
          problem_report?: string | null
          survey_feedback?: string | null
          team_status?: string | null
          week_start: string
        }
        Update: {
          admin_id?: string
          behavior_concerns?: string | null
          completed_at?: string | null
          created_at?: string | null
          help_needed?: string | null
          id?: string
          problem_report?: string | null
          survey_feedback?: string | null
          team_status?: string | null
          week_start?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      check_ins: {
        Row: {
          ai_classification: string | null
          content: string | null
          created_at: string
          date: string
          id: string
          mood: Database["public"]["Enums"]["mood_level"] | null
          type: Database["public"]["Enums"]["check_in_type"]
          user_id: string
        }
        Insert: {
          ai_classification?: string | null
          content?: string | null
          created_at?: string
          date?: string
          id?: string
          mood?: Database["public"]["Enums"]["mood_level"] | null
          type: Database["public"]["Enums"]["check_in_type"]
          user_id: string
        }
        Update: {
          ai_classification?: string | null
          content?: string | null
          created_at?: string
          date?: string
          id?: string
          mood?: Database["public"]["Enums"]["mood_level"] | null
          type?: Database["public"]["Enums"]["check_in_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "check_ins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          completed: boolean | null
          created_at: string
          date: string
          goal_text: string
          id: string
          progress: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          date?: string
          goal_text: string
          id?: string
          progress?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          date?: string
          goal_text?: string
          id?: string
          progress?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nudges: {
        Row: {
          created_at: string
          date: string
          id: string
          is_read: boolean | null
          nudge_text: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          is_read?: boolean | null
          nudge_text: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          is_read?: boolean | null
          nudge_text?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nudges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      weekly_surveys: {
        Row: {
          ai_summary: string | null
          completed_at: string | null
          created_at: string | null
          goals: string | null
          health: string | null
          id: string
          mood: string | null
          moodmeter_score: number | null
          productivity: string | null
          risks: string | null
          user_id: string
          voice_input: string | null
          week_start: string
          wellbeing: string | null
        }
        Insert: {
          ai_summary?: string | null
          completed_at?: string | null
          created_at?: string | null
          goals?: string | null
          health?: string | null
          id?: string
          mood?: string | null
          moodmeter_score?: number | null
          productivity?: string | null
          risks?: string | null
          user_id: string
          voice_input?: string | null
          week_start: string
          wellbeing?: string | null
        }
        Update: {
          ai_summary?: string | null
          completed_at?: string | null
          created_at?: string | null
          goals?: string | null
          health?: string | null
          id?: string
          mood?: string | null
          moodmeter_score?: number | null
          productivity?: string | null
          risks?: string | null
          user_id?: string
          voice_input?: string | null
          week_start?: string
          wellbeing?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "employee"
      check_in_type: "emoji" | "text" | "voice"
      mood_level: "very_happy" | "happy" | "neutral" | "sad" | "very_sad"
      user_role: "employee" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "employee"],
      check_in_type: ["emoji", "text", "voice"],
      mood_level: ["very_happy", "happy", "neutral", "sad", "very_sad"],
      user_role: ["employee", "admin"],
    },
  },
} as const
