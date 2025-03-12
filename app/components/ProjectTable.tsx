'use client';

import { useState, useEffect, useRef, type KeyboardEvent } from 'react';
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
import { Edit2, Save, Trash2, FileText, Search, SortAsc, SortDesc, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  name: string;
  description: string;
}

interface ProjectTableProps {
  projects: Project[];
  onDelete: (projectId: string) => void;
}

export function ProjectTable({ projects, onDelete }: ProjectTableProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ name: string; description: string }>({ name: '', description: '' });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);

  // Update filtered projects when projects, search term, or sort direction change
  useEffect(() => {
    let result = [...projects];

    // Apply search filter
    if (searchTerm) {
      result = result.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortDirection === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    setFilteredProjects(result);
  }, [projects, searchTerm, sortDirection]);

  const startEditing = (project: Project) => {
    setEditingId(project.id);
    setEditData({ name: project.name, description: project.description });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEditing = (project: Project) => {
    // Here you would typically call an update function passed as a prop
    // For now, we'll just cancel editing
    setEditingId(null);
  };

  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

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
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1.5 h-7 w-7"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
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
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  No projects found. Create your first project to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map(project => (
                <TableRow key={project.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">
                    {editingId === project.id ? (
                      <Input 
                        value={editData.name} 
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10">
                          <FileText className="h-3 w-3 mr-1" />
                          Project
                        </Badge>
                        {project.name}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === project.id ? (
                      <Textarea 
                        value={editData.description} 
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="w-full min-h-[80px]"
                      />
                    ) : (
                      <span className="text-muted-foreground">
                        {project.description || 'No description provided'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {editingId === project.id ? (
                        <>
                          <Button size="sm" onClick={() => saveEditing(project)} className="h-8 px-2">
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEditing} className="h-8 px-2">
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" variant="outline" onClick={() => startEditing(project)} className="h-8 px-2">
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => router.push(`/protected/tasks`)}
                            className="h-8 px-2"
                          >
                            Tasks
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive" className="h-8 px-2">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{project.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(project.id)}>
                                  Delete
                                </AlertDialogAction>
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

      {filteredProjects.length > 0 && (
        <div className="text-sm text-muted-foreground text-right">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      )}
    </div>
  );
}
