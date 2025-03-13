import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';
import { useState } from 'react';

interface CreateProjectFormProps {
    onCreate: (project: { name: string; description: string }) => Promise<void>;
    isLoading?: boolean;
}

const projectSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
});

export function CreateProjectForm({ onCreate, isLoading: externalLoading }: CreateProjectFormProps) {
    const [internalLoading, setInternalLoading] = useState(false);
    const isLoading = externalLoading || internalLoading;
    
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: '',
            description: '',
        }
    });

    const onSubmit = async (data: z.infer<typeof projectSchema>) => {
        setInternalLoading(true);
        try {
            await onCreate(data as { name: string; description: string });
            reset(); // Reset form after successful creation
        } finally {
            setInternalLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8 p-4 border rounded-md shadow-sm">
            <div className="space-y-4">
                <div>
                    <Label htmlFor="name">Project Name</Label>
                    <Input 
                        id="name" 
                        {...register('name')} 
                        placeholder="Enter project name"
                        disabled={isLoading}
                    />
                    {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
                </div>
                <div>
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea 
                        id="description" 
                        {...register('description')} 
                        placeholder="Enter project description"
                        className="resize-none"
                        rows={3}
                        disabled={isLoading}
                    />
                    {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
                </div>
                <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
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