import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';
import { useState } from 'react';

interface CreateTaskFormProps {
    projects: { id: string; name: string }[];
    onCreate: (task: { project_id: string; title: string; status: "pending" | "in_progress" | "completed" }) => Promise<void>;
    isLoading?: boolean;
    preselectedProjectId?: string;
}

const taskSchema = z.object({
    project_id: z.string().min(1, "Project is required"),
    title: z.string().min(1, "Title is required"),
    status: z.enum(["pending", "in_progress", "completed"]),
});

export function CreateTaskForm({ projects, onCreate, isLoading: externalLoading, preselectedProjectId }: CreateTaskFormProps) {
    const [internalLoading, setInternalLoading] = useState(false);
    const isLoading = externalLoading || internalLoading;
    
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            project_id: preselectedProjectId || (projects[0]?.id || ''),
            title: '',
            status: 'pending' as const,
        }
    });
    
    const selectedProjectId = watch('project_id');

    const onSubmit = async (data: z.infer<typeof taskSchema>) => {
        setInternalLoading(true);
        try {
            await onCreate(data);
            // Reset only the title, keep the project selection
            reset({ 
                project_id: data.project_id, 
                title: '', 
                status: 'pending' 
            });
        } finally {
            setInternalLoading(false);
        }
    };

    const handleProjectChange = (value: string) => {
        setValue('project_id', value);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8 p-4 border rounded-md shadow-sm">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="title">Task Title</Label>
                    <Input 
                        id="title" 
                        {...register('title')} 
                        placeholder="Enter task title"
                        disabled={isLoading}
                    />
                    {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
                </div>
                <div>
                    <Label htmlFor="project">Assign to Project</Label>
                    <Select 
                        value={selectedProjectId} 
                        onValueChange={handleProjectChange}
                        disabled={isLoading || projects.length === 0}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                        <SelectContent>
                            {projects.map(project => (
                                <SelectItem key={project.id} value={project.id}>
                                    {project.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <input type="hidden" {...register('project_id')} />
                    {errors.project_id && <p className="text-destructive text-sm mt-1">{errors.project_id.message}</p>}
                </div>
                <Button 
                    type="submit" 
                    disabled={isLoading || projects.length === 0} 
                    className="w-full sm:w-auto"
                >
                    {isLoading ? (
                        <>
                            <LoadingSpinner size={16} className="mr-2" />
                            Creating...
                        </>
                    ) : (
                        'Create Task'
                    )}
                </Button>
                {projects.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                        You need to create a project before you can add tasks.
                    </p>
                )}
            </div>
        </form>
    );
} 