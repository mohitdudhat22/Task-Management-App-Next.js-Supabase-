import { createClient } from '@/utils/supabase/client';
import { Project, Task } from '@/types/database';

const supabase = createClient();

export const userApi = {
    getUserByEmail: async (email: string) => {
        const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
        if (error) throw error;
        return data;
    }
}

export const projectApi = {
  getAll: async () => {
    const { data: userData, error: authError }  = await supabase.auth.getUser();
    if (authError || !userData?.user?.id) throw new Error("User not authenticated");
    const { data, error } = await supabase.from('projects').select('*').eq('user_id', userData.user.id).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  create: async (project: Omit<Project, 'id' | 'created_at' | 'user_id'>) => {
    const { data: userData, error: authError }  = await supabase.auth.getUser();
    if (authError || !userData?.user?.id) throw new Error("User not authenticated");

    const { data, error } = await supabase
      .from('projects')
      .insert({ ...project, user_id: userData.user.id })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  getById: async (projectId: string) => {
    const { data, error } = await supabase.from('projects').select('*').eq('id', projectId).single();
    if (error) throw error;
    return data;
  },

  delete: async (projectId: string) => {
    //delete all tasks associated with the project
    const { error } = await supabase.from('projects').delete().eq('id', projectId);
    const { error: taskError } = await supabase.from('tasks').delete().eq('project_id', projectId);
    if (taskError) throw taskError;
    if (error) throw error;
  },

  update: async (projectId: string, project: Omit<Project, 'id' | 'created_at' | 'user_id'>) => {
    const { error } = await supabase.from('projects').update(project).eq('id', projectId);
    if (error) throw error;
  }
};

export const taskApi = {
    getAll: async () => {
        const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },
    getByProject: async (projectId: string) => {
        const { data, error } = await supabase.from('tasks').select('*').eq('project_id', projectId).order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  create: async (task: Omit<Task, 'id' | 'created_at' | 'project_id'>) => {
    const { data, error } = await supabase.from('tasks').insert(task).select().single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    if (!id) throw new Error("Task ID is required");
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) throw error;
  },
  updateStatus: async (taskId: string, status: "pending" | "in_progress" | "completed") => {
    if (!taskId) throw new Error("Task ID is required");
    const { error } = await supabase.from('tasks').update({ status }).eq('id', taskId);
    if (error) throw error;
  },
  updateTask: async (taskId: string, title: string) => {
    if (!taskId) throw new Error("Task ID is required");
    const { error } = await supabase.from('tasks').update({ title }).eq('id', taskId);
    if (error) throw error;
  }
};
