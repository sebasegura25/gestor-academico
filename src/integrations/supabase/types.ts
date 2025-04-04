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
