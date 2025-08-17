import { Router } from "express";
import taskControllers from "../controllers/taskControllers.js";
import authMiddlewares from "../middlewares/authMiddlewares.js";

const taskRoutes = Router();

taskRoutes.get('/tasks/:bucketId', authMiddlewares.authenticateToken, taskControllers.getAllTasks);

taskRoutes.post('/tasks/create/:bucketId', authMiddlewares.authenticateToken, taskControllers.createTask);

taskRoutes.delete('/tasks/delete/:taskId', authMiddlewares.authenticateToken, taskControllers.deleteTask);

taskRoutes.put('/tasks/retitle/:taskId', authMiddlewares.authenticateToken, taskControllers.retitleTask);
taskRoutes.put('/tasks/completion/:taskId', authMiddlewares.authenticateToken, taskControllers.toggleCompletion);
taskRoutes.put('/tasks/updateStatus/:taskId', authMiddlewares.authenticateToken, taskControllers.updateStatus);
taskRoutes.put('/tasks/updatePriority/:taskId', authMiddlewares.authenticateToken, taskControllers.updatePriority);
taskRoutes.put('/tasks/updateRepeat/:taskId', authMiddlewares.authenticateToken, taskControllers.updateRepeatability);

export default taskRoutes;