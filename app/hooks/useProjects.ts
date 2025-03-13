import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi } from '@/utils/api';
import toast from 'react-hot-toast';

export function useProjects() {
    const queryClient = useQueryClient();

    const { data: projects = [], isLoading: isProjectsLoading } = useQuery({
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

    const updateMutation = useMutation({
        mutationFn: ({ projectId, project }: { projectId: string; project: { name: string; description: string } }) => 
            projectApi.update(projectId, { name: project.name, description: project.description }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            toast.success('Project updated successfully');
        },
        onError: (error) => {
            toast.error('Failed to update project');
        }
    });

    return {
        projects,
        isLoading: isProjectsLoading,
        createProject: createMutation.mutate,
        isCreating: createMutation.isPending,
        deleteProject: deleteMutation.mutate,
        isDeleting: deleteMutation.isPending,
        updateProject: updateMutation.mutate,
        isUpdating: updateMutation.isPending,
    };
} 