import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TaskFormValues, taskSchema } from "@/utils/types";
import { Task } from "@/utils/types";

interface TaskFormProps {
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  handleSubmit: (
    values: TaskFormValues,
    helpers: FormikHelpers<TaskFormValues>
  ) => Promise<void>;
}

const TaskForm: React.FC<TaskFormProps> = ({
  editingTask,
  setEditingTask,
  isDialogOpen,
  setIsDialogOpen,
  handleSubmit,
}) => {
  const initialValues: TaskFormValues = editingTask
    ? {
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
        dueDate: editingTask.dueDate,
      }
    : {
        title: "",
        description: "",
        status: "pending",
        dueDate: "",
      };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setEditingTask(null)}>Add Task</Button>
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
          {({ errors, touched, setFieldValue, values }) => (
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
  );
};

export default TaskForm;
