import { Request, Response } from "express";
import Task from "../models/taskModel";

export const getTasks = async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 5,
    sortBy = "dueDate",
    order = "desc",
    searchQuery = "",
    statusFilter = "all",
  } = req.query;

  const sortOrder = order === "asc" ? 1 : -1;

  try {
    const query: any = {};

    if (searchQuery) {
      query.title = { $regex: searchQuery, $options: "i" };
    }

    if (statusFilter && statusFilter !== "all") {
      query.status = statusFilter;
    }

    const tasks = await Task.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Task.countDocuments(query);
    const allTotal = await Task.countDocuments();

    res.status(200).json({ tasks, total, allTotal });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

export const addTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const { title, description, status, dueDate } = req.body;

    const parsedDueDate = new Date(dueDate);

    if (parsedDueDate < new Date()) {
      return res
        .status(400)
        .json({ message: "Due date cannot be in the past" });
    }

    const task = new Task({
      title,
      description,
      status,
      dueDate: parsedDueDate,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ message: "Error adding task" });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task" });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task" });
  }
};
