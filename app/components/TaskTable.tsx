import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
interface Task {
    id: string;
    title: string;
    status: "pending" | "in_progress" | "completed";
}

interface TaskTableProps {
    tasks: Task[];
            onUpdate: (task: { id: string; status: "pending" | "in_progress" | "completed" }) => void;
    onDelete: (taskId: string) => void;
}

export function TaskTable({ tasks, onUpdate, onDelete }: TaskTableProps) {
    return (
    <Table className="mt-4 border rounded-md">
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
                  onValueChange={(status: "pending" | "in_progress" | "completed") => onUpdate({ id: task.id, status })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {["pending", "in_progress", "completed"].map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => onDelete(task.id)}>
                  Delete
                </Button>
                <Button className="ml-2" variant="outline" onClick={() => onUpdate(task)}>
                  Update
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
        
    );
} 