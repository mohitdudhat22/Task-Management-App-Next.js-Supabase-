import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '@/utils/api';
import toast from 'react-hot-toast';

export function useProjects() {
    const queryClient = useQueryClient();

    const { data: projects = [] } = useQuery({
        queryKey: ['projects'],
        queryFn: projectApi.getAll
    });

    const createMutation = useMutation({
        mutationFn: projectApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Project created successfully');
        },
        onError: (error) => {
            toast.error('Failed to create project');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: projectApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Project deleted successfully');
        },
        onError: (error) => {
            toast.error('Failed to delete project');
        }
    });

    return {
        projects,
        createProject: createMutation.mutate,
        deleteProject: deleteMutation.mutate,
    };
} 