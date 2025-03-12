'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectApi, taskApi } from '@/utils/api';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => taskApi.delete(task.id).then(() => queryClient.invalidateQueries({ queryKey: ['tasks', projectId] }))}
                    >
                      Delete
                    </Button>
                    <Button
                      className="ml-4"
                      variant="outline"
                      onClick={() => taskApi.updateTask(task.id, task).then(() => queryClient.invalidateQueries({ queryKey: ['tasks', projectId] }))}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
