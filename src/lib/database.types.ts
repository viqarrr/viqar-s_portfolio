export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'admin_users_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      site_settings: {
        Row: {
          id: string;
          site_title: string;
          meta_description: string;
          og_title: string;
          og_description: string;
          og_image: string;
          brand_name: string;
          hero_lead: string;
          hero_word: string;
          statement_lines: string[];
          statement_lead: string;
          work_lead: string;
          again_lead: string;
          capabilities_lead: string;
          method_lead: string;
          contact_lead: string;
          email?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          instagram_url?: string | null;
          contact_url?: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_title: string;
          meta_description: string;
          og_title: string;
          og_description: string;
          og_image: string;
          brand_name: string;
          hero_lead: string;
          hero_word: string;
          statement_lines?: string[];
          statement_lead: string;
          work_lead: string;
          again_lead: string;
          capabilities_lead: string;
          method_lead: string;
          contact_lead: string;
          email?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          instagram_url?: string | null;
          contact_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          site_title?: string;
          meta_description?: string;
          og_title?: string;
          og_description?: string;
          og_image?: string;
          brand_name?: string;
          hero_lead?: string;
          hero_word?: string;
          statement_lines?: string[];
          statement_lead?: string;
          work_lead?: string;
          again_lead?: string;
          capabilities_lead?: string;
          method_lead?: string;
          contact_lead?: string;
          email?: string | null;
          github_url?: string | null;
          linkedin_url?: string | null;
          instagram_url?: string | null;
          contact_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          slug: string;
          name: string;
          tag: string;
          line: string;
          live_url?: string | null;
          github_url?: string | null;
          image_srcset: string;
          image_src: string;
          image_sizes: string;
          image_width: number;
          image_height: number;
          image_alt: string;
          image_bg: string;
          sort_order: number;
          status: 'draft' | 'published';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          tag: string;
          line: string;
          live_url?: string | null;
          github_url?: string | null;
          image_srcset: string;
          image_src: string;
          image_sizes: string;
          image_width: number;
          image_height: number;
          image_alt: string;
          image_bg: string;
          sort_order?: number;
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          tag?: string;
          line?: string;
          live_url?: string | null;
          github_url?: string | null;
          image_srcset?: string;
          image_src?: string;
          image_sizes?: string;
          image_width?: number;
          image_height?: number;
          image_alt?: string;
          image_bg?: string;
          sort_order?: number;
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          slug: string;
          name: string;
          category: string;
          card_bg: string;
          logo_svg: string;
          sort_order: number;
          status: 'draft' | 'published';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          category: string;
          card_bg: string;
          logo_svg: string;
          sort_order?: number;
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          category?: string;
          card_bg?: string;
          logo_svg?: string;
          sort_order?: number;
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      credentials: {
        Row: {
          id: string;
          slug: string;
          kind: string;
          level: string;
          year: string;
          scope_label: string;
          scope_icon_svg: string;
          award: string;
          name: string;
          issuer: string;
          description: string;
          image_src: string;
          image_width: number;
          image_height: number;
          image_alt: string;
          sort_order: number;
          status: 'draft' | 'published';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          kind: string;
          level: string;
          year: string;
          scope_label: string;
          scope_icon_svg: string;
          award: string;
          name: string;
          issuer: string;
          description: string;
          image_src: string;
          image_width: number;
          image_height: number;
          image_alt: string;
          sort_order?: number;
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          kind?: string;
          level?: string;
          year?: string;
          scope_label?: string;
          scope_icon_svg?: string;
          award?: string;
          name?: string;
          issuer?: string;
          description?: string;
          image_src?: string;
          image_width?: number;
          image_height?: number;
          image_alt?: string;
          sort_order?: number;
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      experiences: {
        Row: {
          id: string;
          slug: string;
          kind: string;
          tag: string;
          period: string;
          title: string;
          org: string;
          description: string;
          tags: string[];
          sort_order: number;
          status: 'draft' | 'published';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          kind: string;
          tag: string;
          period: string;
          title: string;
          org: string;
          description: string;
          tags?: string[];
          sort_order?: number;
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          kind?: string;
          tag?: string;
          period?: string;
          title?: string;
          org?: string;
          description?: string;
          tags?: string[];
          sort_order?: number;
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_links: {
        Row: {
          id: string;
          slug: string;
          label: string;
          href: string;
          description: string;
          icon_svg: string;
          external: boolean;
          sort_order: number;
          status: 'draft' | 'published';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          label: string;
          href: string;
          description: string;
          icon_svg: string;
          external?: boolean;
          sort_order?: number;
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          label?: string;
          href?: string;
          description?: string;
          icon_svg?: string;
          external?: boolean;
          sort_order?: number;
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
