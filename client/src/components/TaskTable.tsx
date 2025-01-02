import React from "react";
import { Button } from "@/components/ui/button";
import { Task } from "@/utils/types";

interface TaskTableProps {
  paginatedTasks: Task[];
  handleEdit: (task: Task) => void;
  handleDelete: (taskId: string) => void;
  totalTasks: number;
}

const TaskTable: React.FC<TaskTableProps> = ({
  paginatedTasks,
  handleEdit,
  handleDelete,
  totalTasks,
}) => {
  console.log("first", paginatedTasks);
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4">
        <p>
          Showing {paginatedTasks.length} of {totalTasks} tasks
        </p>
      </div>
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
          {paginatedTasks.map((task, index: number) => (
            <tr key={index}>
              <td className="px-6 py-4">{task.title}</td>
              <td className="px-6 py-4">{task.description}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
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
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(task._id.toString())}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
