export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          headline: string;
          bio: string;
          location: string;
          email: string;
          phone: string | null;
          website: string | null;
          linkedin: string | null;
          github: string | null;
          twitter: string | null;
          cv_url: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          headline: string;
          bio: string;
          location: string;
          email: string;
          phone?: string | null;
          website?: string | null;
          linkedin?: string | null;
          github?: string | null;
          twitter?: string | null;
          cv_url?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          headline?: string;
          bio?: string;
          location?: string;
          email?: string;
          phone?: string | null;
          website?: string | null;
          linkedin?: string | null;
          github?: string | null;
          twitter?: string | null;
          cv_url?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          summary: string;
          content: string;
          problem: string | null;
          approach: string | null;
          tools: string[];
          tags: string[];
          outcomes: string | null;
          featured: boolean;
          start_date: string | null;
          end_date: string | null;
          project_url: string | null;
          github_url: string | null;
          status: 'draft' | 'published';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          summary: string;
          content: string;
          problem?: string | null;
          approach?: string | null;
          tools?: string[];
          tags?: string[];
          outcomes?: string | null;
          featured?: boolean;
          start_date?: string | null;
          end_date?: string | null;
          project_url?: string | null;
          github_url?: string | null;
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          summary?: string;
          content?: string;
          problem?: string | null;
          approach?: string | null;
          tools?: string[];
          tags?: string[];
          outcomes?: string | null;
          featured?: boolean;
          start_date?: string | null;
          end_date?: string | null;
          project_url?: string | null;
          github_url?: string | null;
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
      };
      project_media: {
        Row: {
          id: string;
          project_id: string;
          image_url: string;
          caption: string | null;
          order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          image_url: string;
          caption?: string | null;
          order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          image_url?: string;
          caption?: string | null;
          order?: number;
          created_at?: string;
        };
      };
      certificates: {
        Row: {
          id: string;
          title: string;
          issuer: string;
          issue_date: string;
          expiry_date: string | null;
          credential_url: string | null;
          media_url: string | null;
          tags: string[];
          status: 'draft' | 'published';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          issuer: string;
          issue_date: string;
          expiry_date?: string | null;
          credential_url?: string | null;
          media_url?: string | null;
          tags?: string[];
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          issuer?: string;
          issue_date?: string;
          expiry_date?: string | null;
          credential_url?: string | null;
          media_url?: string | null;
          tags?: string[];
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          tags: string[];
          featured_image: string | null;
          published_at: string | null;
          status: 'draft' | 'published';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          tags?: string[];
          featured_image?: string | null;
          published_at?: string | null;
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          tags?: string[];
          featured_image?: string | null;
          published_at?: string | null;
          status?: 'draft' | 'published';
          created_at?: string;
          updated_at?: string;
        };
      };
      gallery: {
        Row: {
          id: string;
          media_url: string;
          caption: string | null;
          category: 'profile' | 'event' | 'speaking' | 'project' | 'other';
          order: number;
          status: 'draft' | 'published';
          created_at: string;
        };
        Insert: {
          id?: string;
          media_url: string;
          caption?: string | null;
          category: 'profile' | 'event' | 'speaking' | 'project' | 'other';
          order?: number;
          status?: 'draft' | 'published';
          created_at?: string;
        };
        Update: {
          id?: string;
          media_url?: string;
          caption?: string | null;
          category?: 'profile' | 'event' | 'speaking' | 'project' | 'other';
          order?: number;
          status?: 'draft' | 'published';
          created_at?: string;
        };
      };
      experience: {
        Row: {
          id: string;
          title: string;
          organization: string;
          location: string | null;
          start_date: string;
          end_date: string | null;
          current: boolean;
          description: string;
          highlights: string[] | null;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          organization: string;
          location?: string | null;
          start_date: string;
          end_date?: string | null;
          current?: boolean;
          description: string;
          highlights?: string[] | null;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          organization?: string;
          location?: string | null;
          start_date?: string;
          end_date?: string | null;
          current?: boolean;
          description?: string;
          highlights?: string[] | null;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      education: {
        Row: {
          id: string;
          school: string;
          program: string;
          degree: string | null;
          start_date: string;
          end_date: string | null;
          current: boolean;
          details: string | null;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school: string;
          program: string;
          degree?: string | null;
          start_date: string;
          end_date?: string | null;
          current?: boolean;
          details?: string | null;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school?: string;
          program?: string;
          degree?: string | null;
          start_date?: string;
          end_date?: string | null;
          current?: boolean;
          details?: string | null;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: 'data_bi' | 'databases' | 'ai_ml' | 'digital_health' | 'research' | 'programming' | 'tools' | 'soft_skills';
          level: number | null;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: 'data_bi' | 'databases' | 'ai_ml' | 'digital_health' | 'research' | 'programming' | 'tools' | 'soft_skills';
          level?: number | null;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: 'data_bi' | 'databases' | 'ai_ml' | 'digital_health' | 'research' | 'programming' | 'tools' | 'soft_skills';
          level?: number | null;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          role: string;
          organization: string | null;
          content: string;
          avatar_url: string | null;
          order: number;
          status: 'draft' | 'published';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          role: string;
          organization?: string | null;
          content: string;
          avatar_url?: string | null;
          order?: number;
          status?: 'draft' | 'published';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          role?: string;
          organization?: string | null;
          content?: string;
          avatar_url?: string | null;
          order?: number;
          status?: 'draft' | 'published';
          created_at?: string;
        };
      };
      visitors: {
        Row: {
          id: string;
          session_id: string;
          path: string;
          referrer: string | null;
          user_agent: string | null;
          viewport: string | null;
          visited_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          path: string;
          referrer?: string | null;
          user_agent?: string | null;
          viewport?: string | null;
          visited_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          path?: string;
          referrer?: string | null;
          user_agent?: string | null;
          viewport?: string | null;
          visited_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          read?: boolean;
          created_at?: string;
        };
      };
    };
  };
}
