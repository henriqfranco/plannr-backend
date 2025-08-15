import { Router } from "express";
import taskControllers from "../controllers/taskControllers.js";
import authMiddlewares from "../middlewares/authMiddlewares.js";

const taskRoutes = Router();

taskRoutes.get('/tasks/:id', authMiddlewares.authenticateToken, taskControllers.getAllTasks);

export default taskRoutes;