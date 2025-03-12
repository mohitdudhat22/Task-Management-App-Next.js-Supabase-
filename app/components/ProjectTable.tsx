import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface Project {
    id: string;
    name: string;
    description: string;
}

interface ProjectTableProps {
    projects: Project[];
    onDelete: (projectId: string) => void;
}

export function ProjectTable({ projects, onDelete }: ProjectTableProps) {
    const router = useRouter();

    return (
        <>
            <h1 className="text-2xl font-bold mb-6">Projects</h1>
            <div className="border rounded-md">
                <table className="w-full">
                    <thead>
                    <tr>
                        <th className="p-4 text-left border-b">Name</th>
                        <th className="p-4 text-left border-b">Description</th>
                        <th className="p-4 text-left border-b">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(project => (
                        <tr key={project.id}>
                            <td className="p-4 border-b">{project.name}</td>
                            <td className="p-4 border-b">{project.description || '-'}</td>
                            <td className="p-4 border-b space-x-2">
                                <Button size="sm" onClick={() => router.push(`/protected/tasks`)}>
                                    Manage Tasks
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => onDelete(project.id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
} 