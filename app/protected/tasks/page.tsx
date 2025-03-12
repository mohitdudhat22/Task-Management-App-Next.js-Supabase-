import { TaskTable } from "@/app/components/TaskTable";
import { useTasks } from "@/app/hooks/useTasks";

export default function TasksPage() {
  const { tasks, updateTask, deleteTask } = useTasks();
    return (
      <>
         <TaskTable tasks={tasks} onUpdate={updateTask} onDelete={deleteTask} />
      </>
    );
}
