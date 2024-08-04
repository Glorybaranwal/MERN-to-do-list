import express from 'express'
import jwt from "jsonwebtoken";
import { createTask, getTaskList, getTaskByTitle, getTasksByUserId, deleteTaskById, updateTaskById } from '../db/tasks'

const secret = 'secret';


export const getAllTaskList = async (req: express.Request, res: express.Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token

        if (!token) {
            return res.sendStatus(401); // Unauthorized if token is missing
        }

        // Verify and decrypt the JWT token
        let decoded: any;
        try {
            decoded = jwt.verify(token, secret);
        } catch (error) {
            return res.sendStatus(401); // Unauthorized if token is invalid
        }

        const userId = decoded.userID;

        const tasks = await getTasksByUserId(userId);

        return res.status(200).json(tasks);
    } catch (error: any) {
        console.log(error);
        return res.sendStatus(400); // Bad request on any other error
    }
};


export const createTaskList = async (req: express.Request, res: express.Response) => {
    try {
        const { title, description, status } = req.body;
        const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token

        if (!token) {
            return res.sendStatus(401); // Unauthorized if token is missing
        }

        // Verify and decrypt the JWT token
        let decoded: any;
        try {
            decoded = jwt.verify(token, secret);
        } catch (error) {
            return res.sendStatus(401); // Unauthorized if token is invalid
        }

        const userId = decoded.userID;
        console.log(userId)
        if (!title || !description || !status) {
            return res.sendStatus(400); // Bad request if any required field is missing
        }

        const existingTask = await getTaskByTitle(title);

        if (existingTask && existingTask.userId === userId) {
            return res.status(400).json({ message: "Task already exists" }); // Return error if the same user tries to create a task with the same title
        }
        const task = await createTask({
            title,
            description,
            status,
            userId
        });

        return res.status(200).json(task).end();
    } catch (error: any) {
        console.log(error);
        return res.sendStatus(400); // Bad request on any other error
    }
};


export const deleteTask = async (req: express.Request, res: express.Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        // Verify and decrypt the JWT token
        let decoded: any;
        try {
            decoded = jwt.verify(token, secret);
        } catch (error) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }

        const userId = decoded.userID;
        const { taskId } = req.body;

        if (!taskId) {
            return res.status(400).json({ error: "Bad Request: Task ID is required" });
        }

        const result = await deleteTaskById(taskId, userId);

        if (!result) {
            return res.status(404).json({ error: "Not Found: Task not found or does not belong to the user" });
        }

        return res.status(200).json({ message: "Success: Task deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting task:", error);
        return res.status(500).json({ error: "Internal Server Error: Unable to delete task" });
    }
};


export const updateTask = async (req: express.Request, res: express.Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token

        if (!token) {
            return res.sendStatus(401); // Unauthorized if token is missing
        }

        // Verify and decrypt the JWT token
        let decoded: any;
        try {
            decoded = jwt.verify(token, secret);
        } catch (error) {
            return res.sendStatus(401); // Unauthorized if token is invalid
        }

        const userId = decoded.userID;
        const { taskId, title, description, status } = req.body;

        if (!taskId) {
            return res.sendStatus(400); // Bad request if taskId is missing
        }

        if (!title || !description || !status) {
            return res.sendStatus(400); // Bad request if no fields are provided to update
        }

        const updatedTask = await updateTaskById(taskId, userId, { title, description, status });

        if (!updatedTask) {
            return res.sendStatus(404); // Not found if the task doesn't exist or doesn't belong to the user
        }

       
        return res.status(200).json(updatedTask); // Success
    } catch (error: any) {
        console.log(error);
        return res.sendStatus(400); // Bad request on any other error
    }
};