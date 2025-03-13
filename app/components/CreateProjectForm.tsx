import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

interface CreateProjectFormProps {
    onCreate: (project: { name: string; description: string }) => void;
}

const projectSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
});

export function CreateProjectForm({ onCreate, isLoading }: CreateProjectFormProps & { isLoading?: boolean }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(projectSchema),
    });

    const onSubmit = (data: { name: string; description: string }) => {
        onCreate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8 p-4 border rounded-md">
            <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register('name')} />
                    {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" {...register('description')} />
                    {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                </div>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <LoadingSpinner size={16} className="mr-2" />
                            Creating...
                        </>
                    ) : (
                        'Create Project'
                    )}
                </Button>
            </div>
        </form>
    );
} 