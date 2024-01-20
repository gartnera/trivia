export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      categories: {
        Row: {
          id: number
          league_id: number
          name: string | null
        }
        Insert: {
          id?: never
          league_id: number
          name?: string | null
        }
        Update: {
          id?: never
          league_id?: number
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          }
        ]
      }
      game_prompts: {
        Row: {
          closed_at: string | null
          closes_at: string | null
          created_at: string | null
          game_id: number | null
          id: number
          opened_at: string | null
          prompt_id: number | null
          round: number
          round_position: number
        }
        Insert: {
          closed_at?: string | null
          closes_at?: string | null
          created_at?: string | null
          game_id?: number | null
          id?: never
          opened_at?: string | null
          prompt_id?: number | null
          round: number
          round_position: number
        }
        Update: {
          closed_at?: string | null
          closes_at?: string | null
          created_at?: string | null
          game_id?: number | null
          id?: never
          opened_at?: string | null
          prompt_id?: number | null
          round?: number
          round_position?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_prompts_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_prompts_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_prompts_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "team_game_prompts"
            referencedColumns: ["prompt_id"]
          }
        ]
      }
      game_team_category_bonus: {
        Row: {
          category_id: number | null
          game_id: number
          team_id: number
        }
        Insert: {
          category_id?: number | null
          game_id: number
          team_id: number
        }
        Update: {
          category_id?: number | null
          game_id?: number
          team_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_team_category_bonus_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_team_category_bonus_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_team_category_bonus_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      games: {
        Row: {
          advance_ctr: number | null
          category_bonus_enabled: boolean | null
          completed_at: string | null
          created_at: string | null
          current_round: number | null
          id: number
          join_code: string
          round_position: number | null
          started_at: string | null
          total_round_positions: number | null
          total_rounds: number | null
          tournament_id: number
        }
        Insert: {
          advance_ctr?: number | null
          category_bonus_enabled?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_round?: number | null
          id?: never
          join_code: string
          round_position?: number | null
          started_at?: string | null
          total_round_positions?: number | null
          total_rounds?: number | null
          tournament_id: number
        }
        Update: {
          advance_ctr?: number | null
          category_bonus_enabled?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_round?: number | null
          id?: never
          join_code?: string
          round_position?: number | null
          started_at?: string | null
          total_round_positions?: number | null
          total_rounds?: number | null
          tournament_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "games_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          }
        ]
      }
      league_owners: {
        Row: {
          league_id: number
          user_id: string | null
        }
        Insert: {
          league_id: number
          user_id?: string | null
        }
        Update: {
          league_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "league_owners_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "league_owners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      leagues: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: never
          name?: string | null
        }
        Update: {
          id?: never
          name?: string | null
        }
        Relationships: []
      }
      prompts: {
        Row: {
          answer: string | null
          category_id: number | null
          id: number
          question: string | null
        }
        Insert: {
          answer?: string | null
          category_id?: number | null
          id?: never
          question?: string | null
        }
        Update: {
          answer?: string | null
          category_id?: number | null
          id?: never
          question?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      response_scores: {
        Row: {
          is_correct: boolean | null
          is_scored: boolean | null
          response_id: number | null
        }
        Insert: {
          is_correct?: boolean | null
          is_scored?: boolean | null
          response_id?: number | null
        }
        Update: {
          is_correct?: boolean | null
          is_scored?: boolean | null
          response_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "response_scores_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "responses"
            referencedColumns: ["id"]
          }
        ]
      }
      responses: {
        Row: {
          answer: string | null
          game_prompt_id: number | null
          id: number
          team_id: number | null
          user_id: string | null
        }
        Insert: {
          answer?: string | null
          game_prompt_id?: number | null
          id?: never
          team_id?: number | null
          user_id?: string | null
        }
        Update: {
          answer?: string | null
          game_prompt_id?: number | null
          id?: never
          team_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "responses_game_prompt_id_fkey"
            columns: ["game_prompt_id"]
            isOneToOne: false
            referencedRelation: "game_prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_game_prompt_id_fkey"
            columns: ["game_prompt_id"]
            isOneToOne: false
            referencedRelation: "team_game_prompts"
            referencedColumns: ["game_prompt_id"]
          },
          {
            foreignKeyName: "responses_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      team_games: {
        Row: {
          game_id: number
          joined_at: string | null
          team_id: number
        }
        Insert: {
          game_id: number
          joined_at?: string | null
          team_id: number
        }
        Update: {
          game_id?: number
          joined_at?: string | null
          team_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "team_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_games_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          }
        ]
      }
      team_members: {
        Row: {
          team_id: number
          user_id: string
        }
        Insert: {
          team_id: number
          user_id: string
        }
        Update: {
          team_id?: number
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
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          id: number
          join_code: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          join_code: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: never
          join_code?: string
          name?: string
        }
        Relationships: []
      }
      tournaments: {
        Row: {
          id: number
          league_id: number
          name: string | null
        }
        Insert: {
          id?: never
          league_id: number
          name?: string | null
        }
        Update: {
          id?: never
          league_id?: number
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "leagues"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      team_game_prompts: {
        Row: {
          actual_answer: string | null
          category_id: number | null
          category_name: string | null
          closed_at: string | null
          closes_at: string | null
          game_prompt_created_at: string | null
          game_prompt_id: number | null
          is_correct: boolean | null
          is_scored: boolean | null
          opened_at: string | null
          prompt_id: number | null
          question: string | null
          round: number | null
          round_position: number | null
          team_answer: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      advance_game: {
        Args: {
          game_id: number
        }
        Returns: undefined
      }
      join_game: {
        Args: {
          team_id: number
          join_code: string
        }
        Returns: undefined
      }
      join_team: {
        Args: {
          join_code: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never

