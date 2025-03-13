'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from 'next/navigation';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit2, Save, Trash2, FileText, Search, SortAsc, SortDesc, X, Info } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from '@/app/components/LoadingSpinner';

interface Project {
  id: string;
  name: string;
  description: string;
}

interface ProjectTableProps {
  projects: Project[];
  isLoading?: boolean;
  onDelete: (projectId: string) => void;
  onUpdate: ({ projectId, project }: { projectId: string; project: { name: string; description: string } }) => void;
}

export function ProjectTable({ projects, isLoading = false, onDelete, onUpdate }: ProjectTableProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  const [editData, setEditData] = useState<{ name: string; description: string }>({ name: '', description: '' });
  
  // Add loading states for individual operations
  const [updatingProjectId, setUpdatingProjectId] = useState<string | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);
  const [navigatingToTasksId, setNavigatingToTasksId] = useState<string | null>(null);

  useEffect(() => {
    let result = [...projects];
    if (searchTerm) {
      result = result.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    result.sort((a, b) => (sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
    setFilteredProjects(result);
  }, [projects, searchTerm, sortDirection]);

  const startEditing = (project: Project) => {
    setEditingId(project.id);
    setEditData({ name: project.name, description: project.description });
  };

  const cancelEditing = () => setEditingId(null);

  const saveEditing = async (projectId: string) => {
    setUpdatingProjectId(projectId);
    try {
      await onUpdate({ 
        projectId, 
        project: { 
          name: editData.name, 
          description: editData.description 
        } 
      });
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setUpdatingProjectId(null);
      setEditingId(null);
    }
  };

  const handleDelete = async (projectId: string) => {
    setDeletingProjectId(projectId);
    try {
      await onDelete(projectId);
    } finally {
      setDeletingProjectId(null);
    }
  };

  const navigateToTasks = async (projectId: string) => {
    setNavigatingToTasksId(projectId);
    try {
      router.push(`/tasks/${projectId}`);
    } catch (error) {
      setNavigatingToTasksId(null);
    }
  };

  const toggleSort = () => setSortDirection(sortDirection === "asc" ? "desc" : "asc");

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
          />
          {searchTerm && (
            <Button variant="ghost" size="icon" className="absolute right-1 top-1.5 h-7 w-7" onClick={() => setSearchTerm("")}> <X className="h-4 w-4" /> </Button>
          )}
        </div>
        <Button variant="outline" size="icon" onClick={toggleSort}>
          {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
        </Button>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[30%]">Name</TableHead>
              <TableHead className="w-[40%]">Description</TableHead>
              <TableHead className="w-[30%] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <LoadingSpinner size={40} className="mb-2 opacity-50" />
                    <p>Loading projects...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Info className="h-10 w-10 mb-2 opacity-20" />
                    {projects.length === 0 ? (
                      <p>No projects found. Create your first project to get started.</p>
                    ) : (
                      <p>No projects match your search.</p>
                    )}
                    {searchTerm && (
                      <Button variant="link" onClick={() => setSearchTerm("")} className="mt-2">
                        Clear search
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map(project => (
                <TableRow key={project.id} className="hover:bg-muted/30">
                  <TableCell>
                    {editingId === project.id ? (
                      <Input 
                        value={editData.name} 
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })} 
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10"> <FileText className="h-3 w-3 mr-1" /> Project </Badge>
                        {project.name}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === project.id ? (
                      <Textarea 
                        value={editData.description} 
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })} 
                      />
                    ) : (
                      <span className="text-muted-foreground">{project.description || 'No description provided'}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {editingId === project.id ? (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => saveEditing(project.id)} 
                            className="h-8 px-3"
                            disabled={updatingProjectId === project.id}
                          >
                            {updatingProjectId === project.id ? (
                              <>
                                <LoadingSpinner size={16} className="mr-1" /> Saving...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-1" /> Save
                              </>
                            )}
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEditing} className="h-8 px-2">Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => navigateToTasks(project.id)}
                            className="h-8 px-2"
                            disabled={navigatingToTasksId === project.id}
                          >
                            {navigatingToTasksId === project.id ? (
                              <LoadingSpinner size={16} />
                            ) : (
                              "Tasks"
                            )}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => startEditing(project)} 
                            className="h-8 px-2"
                            disabled={!!editingId}
                          >
                            <Edit2 className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                className="h-8 px-2"
                                disabled={deletingProjectId === project.id}
                              >
                                {deletingProjectId === project.id ? (
                                  <LoadingSpinner size={16} />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                                <AlertDialogDescription>Are you sure you want to delete "{project.name}"? This action cannot be undone.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(project.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
