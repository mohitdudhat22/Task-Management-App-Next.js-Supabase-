'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { projectApi } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Label } from '@/components/ui/label';

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: projectApi.getAll
  });

  const createMutation = useMutation({
    mutationFn: projectApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setNewProject({ name: '', description: '' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: projectApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>
      
      <div className="mb-8 p-4 border rounded-md">
        <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={newProject.name}
              onChange={e => setNewProject(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newProject.description}
              onChange={e => setNewProject(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <Button onClick={() => createMutation.mutate(newProject)} disabled={!newProject.name}>
            Create Project
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <table className="w-full">
          <thead>
            <tr>
              <th className="p-4 text-left border-b">Name</th>
              <th className="p-4 text-left border-b">Description</th>
              <th className="p-4 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.id}>
                <td className="p-4 border-b">{project.name}</td>
                <td className="p-4 border-b">{project.description || '-'}</td>
                <td className="p-4 border-b space-x-2">
                  <Button size="sm" onClick={() => router.push(`/protected/projects/${project.id}`)}>
                    Manage Tasks
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(project.id)}>
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