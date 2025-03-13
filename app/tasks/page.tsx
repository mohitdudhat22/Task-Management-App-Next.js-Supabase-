'use client'

import { TaskTable } from "@/app/components/TaskTable";
import { useTasks } from "@/app/hooks/useTasks";
import { useParams } from "next/navigation";

export default function TasksPage() {
  const { updateTask, deleteTask, updateStatus, useProjectTasks } = useTasks();
  const { projectId } = useParams();
  
  // Use the new hook directly
  const { data: projectTasks = [], isLoading, isError } = useProjectTasks(projectId as string);

  return (
    <>
      <TaskTable 
        tasks={projectTasks} 
        isLoading={isLoading}
        onUpdateTask={updateTask} 
        onUpdateStatus={updateStatus} 
        onDelete={deleteTask} 
      />
    </>
  );
}
