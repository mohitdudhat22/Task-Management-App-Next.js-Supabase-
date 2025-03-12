'use client';

import { useState } from 'react';
import { useProjects } from '@/app/hooks/useProjects';
import { ProjectTable } from '@/app/components/ProjectTable';
import { CreateProjectForm } from '@/app/components/CreateProjectForm';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/app/hooks/useTasks';
import { CreateTaskForm } from '@/app/components/CreateTaskForm';
import { TaskTable } from '@/app/components/TaskTable';

export default function ProjectsPage() {
    const { projects, createProject, deleteProject } = useProjects();
    const [showProjectTable, setShowProjectTable] = useState(true);
    const [showCreateProjectForm, setShowCreateProjectForm] = useState(true);
    const { tasks, createTask, updateTask, deleteTask } = useTasks();
    const [showTaskTable, setShowTaskTable] = useState(true);
    const [showCreateTaskForm, setShowCreateTaskForm] = useState(true);
    return (
        <div className="p-8">
            <Button size="sm" className='ml-4' onClick={() => setShowCreateProjectForm(!showCreateProjectForm)}>
                Toggle Create Project Form
            </Button>
            <Button size="sm" className='mx-4' onClick={() => setShowProjectTable(!showProjectTable)}>
                Toggle Project Table
            </Button>
            <Button size="sm" className='ml-4' onClick={() => setShowCreateTaskForm(!showCreateTaskForm)}>
                Toggle Create Task Form
            </Button>
            <Button size="sm" className='mx-4' onClick={() => setShowTaskTable(!showTaskTable)}>
                Toggle Task Table
            </Button>
            {showCreateProjectForm && <CreateProjectForm onCreate={createProject} />}
            {showProjectTable && <ProjectTable projects={projects} onDelete={deleteProject} />}
            {showCreateTaskForm && <CreateTaskForm projects={projects} onCreate={createTask} />}
            {showTaskTable && <TaskTable tasks={tasks} onUpdate={updateTask} onDelete={deleteTask} />}
        </div>
    );
}