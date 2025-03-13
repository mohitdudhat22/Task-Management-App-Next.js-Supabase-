export interface Project {
  id?: string;
  name: string;
  description: string | null;
  user_id: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  project_id: string;
  created_at: string;
} 