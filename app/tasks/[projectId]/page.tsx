'use client';

import { useEffect, useState } from 'react';
import { TaskTable } from "@/app/components/TaskTable";
import { useTasks } from "@/app/hooks/useTasks";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { Task } from '@/types/database';

export default function TasksPage() {
    const { updateTask, deleteTask, getTasksByProject, updateStatus } = useTasks();
    const { projectId } = useParams();
    const [projectTasks, setProjectTasks] = useState<Task[]>([]);

    useEffect(() => {
        if (projectId) {
            getTasksByProject(projectId as string).then(setProjectTasks as any);
        }
    }, [projectId, getTasksByProject]);
    return (
        <>     
         <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Task List</CardTitle>
                <CardDescription>Manage your existing Tasks</CardDescription>
            </CardHeader>
            <CardContent className="w-full max-w-2xl mx-auto">
            <TaskTable tasks={projectTasks} onUpdateTask={updateTask} onUpdateStatus={updateStatus} onDelete={deleteTask} />
            </CardContent>
        </Card>
        </>
    );
}
