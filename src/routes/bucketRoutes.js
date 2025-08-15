import { Router } from "express";
import bucketControllers from "../controllers/bucketControllers.js";
import authMiddlewares from "../middlewares/authMiddlewares.js";

const bucketRoutes = Router();

bucketRoutes.get('/buckets/:id', authMiddlewares.authenticateToken, bucketControllers.getAllBuckets);

bucketRoutes.post('/buckets/create/:id', authMiddlewares.authenticateToken, bucketControllers.createBucket);

bucketRoutes.delete('/buckets/delete/:id', authMiddlewares.authenticateToken, bucketControllers.deleteBucket);

bucketRoutes.put('/buckets/updateName/:id', authMiddlewares.authenticateToken, bucketControllers.renameBucket);

export default bucketRoutes;