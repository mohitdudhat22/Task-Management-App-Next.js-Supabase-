import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateTaskFormProps {
    projects: { id: string; name: string }[];
    onCreate: (task: { project_id: string; title: string; status: "pending" | "in_progress" | "completed" }) => void;
}

export function CreateTaskForm({ projects, onCreate }: CreateTaskFormProps) {
    const [newTask, setNewTask] = useState({project_id: projects[0]?.id || '', title: '', status: 'pending' });

    const handleCreate = () => {
        console.log(newTask);
        onCreate({ ...newTask, status: newTask.status as "pending" | "in_progress" | "completed" });
        setNewTask({  project_id: projects[0]?.id || '', title: '', status: 'pending' });
    };

    return (
        <div className="mb-8 p-4 border rounded-md">
            <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="title">Task Title</Label>
                    <Input
                        id="title"
                        value={newTask.title}
                        onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    />
                </div>
                <div>
                    <Label htmlFor="project">Assign to Project</Label>
                    <select
                        id="project"
                        value={newTask.project_id}
                        onChange={e => setNewTask(prev => ({ ...prev, project_id: e.target.value }))}
                        className="w-full p-2 border rounded"
                    >
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>
                <Button onClick={handleCreate} disabled={!newTask.project_id}>
                    Create Task
                </Button>
            </div>
        </div>
    );
} 