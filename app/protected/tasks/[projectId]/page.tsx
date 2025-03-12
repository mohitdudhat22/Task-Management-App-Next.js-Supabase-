'use client';

import { TaskTable } from "@/app/components/TaskTable";
import { useTasks } from "@/app/hooks/useTasks";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { useParams } from "next/navigation";

export default function TasksPage() {
    const { tasks, updateTask, deleteTask } = useTasks();
    return (
        <>     
         <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Task List</CardTitle>
                <CardDescription>Manage your existing Tasks</CardDescription>
            </CardHeader>
            <CardContent className="w-full max-w-2xl mx-auto">
                <TaskTable tasks={tasks} onUpdate={updateTask} onDelete={deleteTask} />
            </CardContent>
        </Card>

        </>
    );
}
