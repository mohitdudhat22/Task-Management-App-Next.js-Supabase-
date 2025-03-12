import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateProjectFormProps {
    onCreate: (project: { name: string; description: string }) => void;
}

export function CreateProjectForm({ onCreate }: CreateProjectFormProps) {
    const [newProject, setNewProject] = useState({ name: '', description: '' });

    const handleCreate = () => {
        onCreate(newProject);
        setNewProject({ name: '', description: '' });
    };

    return (
        <div className="mb-8 p-4 border rounded-md">
            <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={newProject.name}
                        onChange={e => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    />
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                        id="description"
                        value={newProject.description}
                        onChange={e => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    />
                </div>
                <Button onClick={handleCreate} disabled={!newProject.name}>
                    Create Project
                </Button>
            </div>
        </div>
    );
} 