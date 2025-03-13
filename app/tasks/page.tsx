'use client'

import { TaskTable } from "@/app/components/TaskTable";
import { useTasks } from "@/app/hooks/useTasks";

export default function TasksPage() {
  const { tasks, updateTask, updateStatus, deleteTask } = useTasks();
    return (
      <>
         <TaskTable tasks={tasks} onUpdateTask={updateTask} onUpdateStatus={updateStatus} onDelete={deleteTask} />
      </>
    );
}
