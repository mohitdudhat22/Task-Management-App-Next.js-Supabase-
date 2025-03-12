import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
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
            <h1 className="text-2xl font-bold my-3">Projects</h1>
            <div className="border rounded-md">
                <Table className="w-full">
                    <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {projects.map(project => (
                        <TableRow key={project.id}>
                            <TableCell>{project.name}</TableCell>
                            <TableCell>{project.description || '-'}</TableCell>
                            <TableCell className="p-4 border-b space-x-2">
                                <Button size="sm" onClick={() => router.push(`/protected/tasks`)}>
                                    Manage Tasks
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => onDelete(project.id)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
} 