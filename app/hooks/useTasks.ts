import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '@/utils/api';

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

    const { data: tasks = [] } = useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: taskApi.getAll
    });

    const createMutation = useMutation({
        mutationFn: (task: { title: string; project_id: string; status: "pending" | "in_progress" | "completed" }) => 
            taskApi.create({ ...task}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: "pending" | "in_progress" | "completed" }) => 
            taskApi.updateStatus(id, status), // Ensure this matches your API method
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: taskApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    });

    return {
        tasks,
        createTask: createMutation.mutate,
        updateTask: updateMutation.mutate,
        deleteTask: deleteMutation.mutate,
    };
} 