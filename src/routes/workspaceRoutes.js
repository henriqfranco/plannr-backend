import { Router } from "express";
import workspaceControllers from "../controllers/workspaceControllers.js";
import authMiddlewares from "../middlewares/authMiddlewares.js";

const workspaceRoutes = Router();

workspaceRoutes.get('/workspaces', authMiddlewares.authenticateToken, workspaceControllers.getAllWorkspaces);

workspaceRoutes.post('/workspaces/create', authMiddlewares.authenticateToken, workspaceControllers.createWorkspace);

workspaceRoutes.delete('/workspaces/delete/:id', authMiddlewares.authenticateToken, workspaceControllers.deleteWorkspace);

export default workspaceRoutes;