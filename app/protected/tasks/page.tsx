// Tasks Page
'use client';

import { useState } from 'react';
import { CreateTaskForm } from '@/app/components/CreateTaskForm';
import { TaskTable } from '@/app/components/TaskTable';
import { useTasks } from '@/app/hooks/useTasks';
import { useProjects } from '@/app/hooks/useProjects';
import { Button } from '@/components/ui/button';

export default function TasksPage() {
    const { tasks, createTask, updateTask, deleteTask } = useTasks();
    const { projects } = useProjects();
    const [showTaskTable, setShowTaskTable] = useState(true);
    const [showCreateTaskForm, setShowCreateTaskForm] = useState(true);

    return (
        <div className="p-8">
            <Button size="sm" className='ml-4' onClick={() => setShowCreateTaskForm(!showCreateTaskForm)}>
                Toggle Create Task Form
            </Button>
            <Button size="sm" className='mx-4' onClick={() => setShowTaskTable(!showTaskTable)}>
                Toggle Task Table
            </Button>
            {showCreateTaskForm && <CreateTaskForm projects={projects} onCreate={createTask} />}
            {showTaskTable && <TaskTable tasks={tasks} onUpdate={updateTask} onDelete={deleteTask} />}
        </div>
    );
}
