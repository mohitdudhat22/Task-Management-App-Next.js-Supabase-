'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi, taskApi } from '@/utils/api';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader } from 'lucide-react';

const TASK_STATUSES = ['pending', 'in_progress', 'completed'];

export default function ProjectDetails() {
  const params = useParams();
  const projectId = params?.projectId;
  const queryClient = useQueryClient();

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectApi.getById(projectId as string),
    enabled: !!projectId,
  });

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => taskApi.getByProject(projectId as string),
    enabled: !!projectId,
  });

  const [newTask, setNewTask] = useState({ title: '', status: 'pending' });

  const createTaskMutation = useMutation({
    mutationFn: async () => {
      if (!projectId) throw new Error('Invalid Project ID');
      return taskApi.create({ ...newTask, project_id: projectId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      setNewTask({ title: '', status: 'pending' });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: (task: Task) => taskApi.updateTask(task.id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: string }) => {
      return taskApi.updateStatus(taskId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });

  if (projectLoading) return <Loader />;
  if (!project) return <p>Project not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{project.name}</h1>
      <p className="text-gray-600">{project.description || 'No description provided.'}</p>

      <div className="mt-6 border p-4 rounded-md">
        <h2 className="text-lg font-semibold">Add New Task</h2>
        <Input
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
        />
        <Select
          value={newTask.status}
          onValueChange={(status) => setNewTask((prev) => ({ ...prev, status }))}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {TASK_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {status.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          className="mt-2"
          onClick={() => createTaskMutation.mutate()}
          disabled={!newTask.title || createTaskMutation.isLoading}
        >
          {createTaskMutation.isLoading ? 'Adding...' : 'Add Task'}
        </Button>
      </div>

      <div className="mt-6 border p-4 rounded-md">
        <h2 className="text-lg font-semibold">Tasks</h2>
        {tasksLoading ? (
          <Loader />
        ) : tasks.length === 0 ? (
          <p>No tasks found</p>
        ) : (
          <ul className="mt-4">
            {tasks.map((task) => (
              <li key={task.id} className="flex justify-between p-2 border-b">
                <div>
                  <p className="font-medium">{task.title}</p>
                </div>
                <Select
                  value={task.status}
                  onValueChange={(status) => updateTaskStatusMutation.mutate({ taskId: task.id, status })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}