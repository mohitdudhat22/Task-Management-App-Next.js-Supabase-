'use client';

import { useTasks } from "@/app/hooks/useTasks";
import { TaskTable } from "@/app/components/reusable/TaskTable";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { LoadingSpinner } from "@/app/components/reusable/LoadingSpinner";

export default function ProjectTasksPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const { updateTask, deleteTask, updateStatus, useProjectTasks } = useTasks();

  // Use our hook directly
  const { data: projectTasks = [], isLoading, isError } = useProjectTasks(projectId);

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Task List</CardTitle>
          <CardDescription>Manage your existing Tasks</CardDescription>
        </CardHeader>
        <CardContent className="w-full max-w-2xl mx-auto">

          <TaskTable
            isLoading={isLoading}
            tasks={projectTasks}
            onUpdateTask={updateTask}
            onUpdateStatus={updateStatus}
            onDelete={deleteTask}
          />
        </CardContent>
      </Card>
    </>
  );
}
