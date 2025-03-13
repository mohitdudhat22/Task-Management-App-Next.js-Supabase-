'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '@/utils/api';
import toast from 'react-hot-toast';

interface Task {
    id: string;
    name: string;
    title: string;
    status: "pending" | "in_progress" | "completed";
    project_id: string;
    // Add other fields as necessary
}

export function useTasks() {
    const queryClient = useQueryClient();

    const { data: tasks = [], isLoading: isTasksLoading } = useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: taskApi.getAll
    });
    const createMutation = useMutation({
        mutationFn: (task: { title: string; project_id: string; status: "pending" | "in_progress" | "completed" }) => 
            taskApi.create({ ...task}),
        onSuccess: () => {
            toast.success('Task created successfully');
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
        onError: (error) => {
            toast.error('Failed to create task');
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: "pending" | "in_progress" | "completed" }) => 
            taskApi.updateStatus(id, status), // Ensure this matches your API method
        onSuccess: () => {
            toast.success('Task updated successfully');
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
        onError: (error) => {
            toast.error('Failed to update task');
        }
    });
    const updateTaskMutation = useMutation({
        mutationFn: ({ id, title, status }: { id: string; title: string; status: "pending" | "in_progress" | "completed" }) => 
            taskApi.updateTask(id, title ),
        onSuccess: () => {
            toast.success('Task updated successfully');
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
        onError: (error) => {
            toast.error('Failed to update task');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: taskApi.delete,
        onSuccess: () => {
            toast.success('Task deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        },
        onError: (error) => {
            toast.error('Failed to delete task');
        }
    });

    // New function that returns a hook for project tasks
    const useProjectTasks = (projectId: string | undefined) => {
        return useQuery<Task[]>({
            queryKey: ['tasks', 'project', projectId],
            queryFn: () => projectId ? taskApi.getByProject(projectId) : Promise.resolve([]),
            enabled: !!projectId,
        });
    };

    return {
        tasks,
        isLoading: isTasksLoading,
        createTask: createMutation.mutate,
        isCreating: createMutation.isPending,
        updateTask: updateTaskMutation.mutate,
        isUpdating: updateTaskMutation.isPending,
        updateStatus: updateStatusMutation.mutate,
        isUpdatingStatus: updateStatusMutation.isPending,
        deleteTask: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
        useProjectTasks, // Export the new hook
    };
} 