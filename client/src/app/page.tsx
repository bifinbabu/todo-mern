"use client";
import React, { useEffect, useState } from "react";
import { FormikHelpers } from "formik";
import TaskForm from "@/components/TaskForm";
import TaskTable from "@/components/TaskTable";
import TaskFilters from "@/components/TaskFilters";
import Pagination from "@/components/Pagination";
import { Task, TaskFormValues } from "@/utils/types";
import axiosInstance from "@/utils/axiosInstance";

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | Task["status"]>(
    "all"
  );
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get("/tasks");
        setTasks(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleSubmit = async (
    values: TaskFormValues,
    { resetForm }: FormikHelpers<TaskFormValues>
  ): Promise<void> => {
    try {
      if (editingTask) {
        await axiosInstance.put(`/tasks/${editingTask.id}`, values);
        setTasks(
          tasks.map((task) =>
            task.id === editingTask.id ? { ...values, id: task.id } : task
          )
        );
      } else {
        const response = await axiosInstance.post("/tasks", values);
        setTasks([...tasks, { ...response.data, id: response.data.id }]);
      }
      resetForm();
      setEditingTask(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  const handleDelete = async (taskId: number): Promise<void> => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await axiosInstance.delete(`/tasks/${taskId}`);
        setTasks(tasks.filter((task) => task.id !== taskId));
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleEdit = (task: Task): void => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    return sortOrder === "asc"
      ? dateA.getTime() - dateB.getTime()
      : dateB.getTime() - dateA.getTime();
  });

  const totalPages = Math.ceil(sortedTasks.length / itemsPerPage);
  const paginatedTasks = sortedTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Dashboard</h1>
        <TaskForm
          editingTask={editingTask}
          setEditingTask={setEditingTask}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          handleSubmit={handleSubmit}
        />
      </div>

      <TaskFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <TaskTable
        paginatedTasks={paginatedTasks}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default Home;
