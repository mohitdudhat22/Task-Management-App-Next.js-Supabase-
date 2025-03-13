"use client"

import { useState } from "react"
import { useProjects } from "@/app/hooks/useProjects"
import { CreateProjectForm } from "@/app/components/CreateProjectForm"
import { CreateTaskForm } from "@/app/components/CreateTaskForm"
import { useTasks } from "@/app/hooks/useTasks"
import { ProjectTable } from "@/app/components/ProjectTable"
import { TaskTable } from "@/app/components/TaskTable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, MinusCircle, Layers, CheckSquare } from "lucide-react"
import { Project } from "@/types/database"

export default function ProjectsPage() {
  const { 
    projects, 
    isLoading: isProjectsLoading,
    createProject, 
    deleteProject, 
    updateProject 
  } = useProjects()
  
  const { 
    tasks, 
    isLoading: isTasksLoading,
    createTask, 
    updateTask, 
    updateStatus, 
    deleteTask 
  } = useTasks()

  const [showCreateProjectForm, setShowCreateProjectForm] = useState(false)
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false)

  return (
    <div className="container mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Project Management Dashboard</h1>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Tasks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <div className="flex justify-end items-center">
            <Button
              onClick={() => setShowCreateProjectForm(!showCreateProjectForm)}
              variant="outline"
              className="flex items-center gap-2"
            >
              {showCreateProjectForm ? (
                <>
                  <MinusCircle className="h-4 w-4" />
                  Hide Form
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  New Project
                </>
              )}
            </Button>
          </div>

          {showCreateProjectForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Create New Project</CardTitle>
                <CardDescription>Add a new project to your dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <CreateProjectForm
                  onCreate={async (project) => {
                    await createProject(project as any);
                    setShowCreateProjectForm(false);
                  }}
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Project List</CardTitle>
              <CardDescription>Manage your existing projects</CardDescription>
            </CardHeader>
            <CardContent className="w-full max-w-2xl mx-auto">
              <ProjectTable 
                projects={projects} 
                isLoading={isProjectsLoading}
                onDelete={deleteProject} 
                onUpdate={(projectId, updatedProject) => {
                  updateProject(projectId as any, updatedProject as any)
                }} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <div className="flex justify-end items-center">
            <Button
              onClick={() => setShowCreateTaskForm(!showCreateTaskForm)}
              variant="outline"
              className="flex items-center gap-2"
            >
              {showCreateTaskForm ? (
                <>
                  <MinusCircle className="h-4 w-4" />
                  Hide Form
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  New Task
                </>
              )}
            </Button>
          </div>

          {showCreateTaskForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Create New Task</CardTitle>
                <CardDescription>Add a new task to one of your projects</CardDescription>
              </CardHeader>
              <CardContent>
                <CreateTaskForm
                  projects={projects}
                  onCreate={async (task) => {
                    await createTask(task as any)
                    setShowCreateTaskForm(false)
                  }}
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Task List</CardTitle>
              <CardDescription>Manage your existing tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskTable 
                tasks={tasks} 
                isLoading={isTasksLoading}
                onUpdateTask={updateTask} 
                onUpdateStatus={updateStatus} 
                onDelete={deleteTask} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

