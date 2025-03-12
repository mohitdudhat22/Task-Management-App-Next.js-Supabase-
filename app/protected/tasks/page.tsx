
// Tasks Page
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { taskApi } from '@/utils/api';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TasksPage({ params }) {
  const { projectId } = params;
  const queryClient = useQueryClient();
  const router = useRouter();
  const [newTask, setNewTask] = useState({ name: '', status: 'pending' });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => taskApi.getByProject(projectId)
  });

  const createMutation = useMutation({
    mutationFn: task => taskApi.create({ ...task, project_id: projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      setNewTask({ name: '', status: 'pending' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => taskApi.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: taskApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    }
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>
      <Button onClick={() => router.push('/projects')}>Back to Projects</Button>
      
      <div className="mb-8 p-4 border rounded-md">
        <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Task Name</Label>
            <Input
              id="name"
              value={newTask.name}
              onChange={e => setNewTask(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <Button onClick={() => createMutation.mutate(newTask)} disabled={!newTask.name}>
            Create Task
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-4 text-left border-b">Task Name</th>
              <th className="p-4 text-left border-b">Status</th>
              <th className="p-4 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td className="p-4 border-b">{task.name}</td>
                <td className="p-4 border-b">
                  <select value={task.status} onChange={e => updateMutation.mutate({ id: task.id, status: e.target.value })}>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td className="p-4 border-b">
                  <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(task.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
