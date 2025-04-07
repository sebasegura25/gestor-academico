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
      carreras: {
        Row: {
          created_at: string
          descripcion: string | null
          duracion: number
          id: string
          nombre: string
        }
        Insert: {
          created_at?: string
          descripcion?: string | null
          duracion: number
          id?: string
          nombre: string
        }
        Update: {
          created_at?: string
          descripcion?: string | null
          duracion?: number
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      correlatividades: {
        Row: {
          created_at: string
          id: string
          materia_id: string
          materia_requerida_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          materia_id: string
          materia_requerida_id: string
        }
        Update: {
          created_at?: string
          id?: string
          materia_id?: string
          materia_requerida_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "correlatividades_materia_id_fkey"
            columns: ["materia_id"]
            isOneToOne: false
            referencedRelation: "materias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "correlatividades_materia_requerida_id_fkey"
            columns: ["materia_requerida_id"]
            isOneToOne: false
            referencedRelation: "materias"
            referencedColumns: ["id"]
          },
        ]
      }
      estados_academicos: {
        Row: {
          created_at: string
          estado: string
          estudiante_id: string
          fecha_acreditacion: string | null
          fecha_regularizacion: string | null
          id: string
          materia_id: string
          nota: number | null
        }
        Insert: {
          created_at?: string
          estado: string
          estudiante_id: string
          fecha_acreditacion?: string | null
          fecha_regularizacion?: string | null
          id?: string
          materia_id: string
          nota?: number | null
        }
        Update: {
          created_at?: string
          estado?: string
          estudiante_id?: string
          fecha_acreditacion?: string | null
          fecha_regularizacion?: string | null
          id?: string
          materia_id?: string
          nota?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "estados_academicos_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "estudiantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estados_academicos_materia_id_fkey"
            columns: ["materia_id"]
            isOneToOne: false
            referencedRelation: "materias"
            referencedColumns: ["id"]
          },
        ]
      }
      estudiantes: {
        Row: {
          apellido: string
          carrera_id: string | null
          created_at: string
          dni: string
          email: string
          fecha_ingreso: string
          id: string
          nombre: string
        }
        Insert: {
          apellido: string
          carrera_id?: string | null
          created_at?: string
          dni: string
          email: string
          fecha_ingreso: string
          id?: string
          nombre: string
        }
        Update: {
          apellido?: string
          carrera_id?: string | null
          created_at?: string
          dni?: string
          email?: string
          fecha_ingreso?: string
          id?: string
          nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "estudiantes_carrera_id_fkey"
            columns: ["carrera_id"]
            isOneToOne: false
            referencedRelation: "carreras"
            referencedColumns: ["id"]
          },
        ]
      }
      inscripciones: {
        Row: {
          created_at: string
          estudiante_id: string
          fecha: string
          id: string
          materia_id: string
          periodo: string
          tipo: string
        }
        Insert: {
          created_at?: string
          estudiante_id: string
          fecha: string
          id?: string
          materia_id: string
          periodo: string
          tipo: string
        }
        Update: {
          created_at?: string
          estudiante_id?: string
          fecha?: string
          id?: string
          materia_id?: string
          periodo?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "inscripciones_estudiante_id_fkey"
            columns: ["estudiante_id"]
            isOneToOne: false
            referencedRelation: "estudiantes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inscripciones_materia_id_fkey"
            columns: ["materia_id"]
            isOneToOne: false
            referencedRelation: "materias"
            referencedColumns: ["id"]
          },
        ]
      }
      materias: {
        Row: {
          carrera_id: string
          codigo: string
          created_at: string
          cuatrimestre: number
          horas: number
          id: string
          nombre: string
          year: number
        }
        Insert: {
          carrera_id: string
          codigo: string
          created_at?: string
          cuatrimestre: number
          horas: number
          id?: string
          nombre: string
          year: number
        }
        Update: {
          carrera_id?: string
          codigo?: string
          created_at?: string
          cuatrimestre?: number
          horas?: number
          id?: string
          nombre?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "materias_carrera_id_fkey"
            columns: ["carrera_id"]
            isOneToOne: false
            referencedRelation: "carreras"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
