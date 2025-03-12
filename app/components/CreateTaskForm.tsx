import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateTaskFormProps {
    projects: { id: string; name: string }[];
    onCreate: (task: { project_id: string; title: string; status: "pending" | "in_progress" | "completed" }) => void;
}

const taskSchema = z.object({
    project_id: z.string().min(1, "Project is required"),
    title: z.string().min(1, "Title is required"),
    status: z.enum(["pending", "in_progress", "completed"]),
});

export function CreateTaskForm({ projects, onCreate }: CreateTaskFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            project_id: projects[0]?.id || '',
            title: '',
            status: 'pending',
        }
    });

    const onSubmit = (data: z.infer<typeof taskSchema>) => {
        onCreate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8 p-4 border rounded-md">
            <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="title">Task Title</Label>
                    <Input id="title" {...register('title')} />
                    {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                </div>
                <div>
                    <Label htmlFor="project">Assign to Project</Label>
                    <select
                        id="project"
                        {...register('project_id')}
                        className="w-full p-2 border rounded"
                    >
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                    {errors.project_id && <p className="text-red-500">{errors.project_id.message}</p>}
                </div>
                <Button type="submit" disabled={!projects.length}>
                    Create Task
                </Button>
            </div>
        </form>
    );
} 