"use client";
import React, { useEffect, useState } from "react";
import { Search, Edit, Trash2, Plus } from "lucide-react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
}

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["pending", "in-progress", "completed"]),
  dueDate: z.string().refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) >= today;
  }, "Due date cannot be in the past"),
});

type TaskFormValues = z.infer<typeof taskSchema>;

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Complete Project Proposal",
    description: "Draft and submit the Q1 project proposal",
    status: "pending",
    dueDate: new Date().toISOString().split("T")[0],
  },
];

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(initialTasks);
  }, []);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | Task["status"]>(
    "all"
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const handleSubmit = async (
    values: TaskFormValues,
    { resetForm }: FormikHelpers<TaskFormValues>
  ): Promise<void> => {
    if (editingTask) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id ? { ...values, id: task.id } : task
        )
      );
    } else {
      setTasks([...tasks, { ...values, id: Date.now() }]);
    }

    resetForm();
    setEditingTask(null);
    setIsDialogOpen(false);
  };

  const handleDelete = (taskId: number): void => {
    if (confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const handleEdit = (task: Task): void => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const initialValues: TaskFormValues = editingTask || {
    title: "",
    description: "",
    status: "pending",
    dueDate: "",
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Dashboard</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTask(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTask ? "Edit Task" : "Create New Task"}
              </DialogTitle>
            </DialogHeader>
            <Formik
              initialValues={initialValues}
              validationSchema={toFormikValidationSchema(taskSchema)}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ errors, touched, values, setFieldValue }) => (
                <Form className="space-y-4">
                  <div>
                    <Field as={Input} name="title" placeholder="Task Title" />
                    {errors.title && touched.title && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.title}
                      </div>
                    )}
                  </div>
                  <div>
                    <Field
                      as={Input}
                      name="description"
                      placeholder="Description"
                    />
                    {errors.description && touched.description && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.description}
                      </div>
                    )}
                  </div>
                  <div>
                    <Select
                      value={values.status}
                      onValueChange={(value: Task["status"]) =>
                        setFieldValue("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        {editingTask && (
                          <SelectItem value="completed">Completed</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.status && touched.status && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.status}
                      </div>
                    )}
                  </div>
                  <div>
                    <Field
                      as={Input}
                      type="date"
                      name="dueDate"
                      min={new Date().toISOString().split("T")[0]}
                    />
                    {errors.dueDate && touched.dueDate && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.dueDate}
                      </div>
                    )}
                  </div>
                  <Button type="submit" className="w-full">
                    {editingTask ? "Update Task" : "Create Task"}
                  </Button>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value: "all" | Task["status"]) =>
            setStatusFilter(value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedTasks.map((task) => (
              <tr key={task.id}>
                <td className="px-6 py-4">{task.title}</td>
                <td className="px-6 py-4">{task.description}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                    ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : task.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {new Date(task.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(task)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Home;
