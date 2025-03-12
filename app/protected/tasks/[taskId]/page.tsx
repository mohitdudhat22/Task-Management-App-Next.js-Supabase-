import { useParams } from 'next/navigation';

export default function TaskDetailsPage() {
  const { taskId } = useParams();

  return <div>Task ID: {taskId}</div>;
}
