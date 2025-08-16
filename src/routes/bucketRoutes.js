import { Router } from "express";
import bucketControllers from "../controllers/bucketControllers.js";
import authMiddlewares from "../middlewares/authMiddlewares.js";

const bucketRoutes = Router();

bucketRoutes.get('/buckets/:workspaceId', authMiddlewares.authenticateToken, bucketControllers.getAllBuckets);

bucketRoutes.post('/buckets/create/:workspaceId', authMiddlewares.authenticateToken, bucketControllers.createBucket);

bucketRoutes.delete('/buckets/delete/:bucketId', authMiddlewares.authenticateToken, bucketControllers.deleteBucket);

bucketRoutes.put('/buckets/updateName/:workspaceId', authMiddlewares.authenticateToken, bucketControllers.renameBucket);

export default bucketRoutes;