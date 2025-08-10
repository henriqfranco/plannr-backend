import { Router } from "express";
import authControllers from "../controllers/authControllers.js";
import authMiddlewares from "../middlewares/authMiddlewares.js";

const routes = Router();

routes.get('/', (req, res) => {
    res.status(200).json({ message: "Plannr backend system." })
});

routes.post('/auth/register', authMiddlewares.validateRegister, authControllers.createUser);
routes.post('/auth/login', authControllers.login);

routes.get('/users', authControllers.getAllUsers);
routes.get('/users/me', authMiddlewares.authenticateToken, authControllers.getCurrentUser);

routes.delete('/users/me', authMiddlewares.authenticateToken, authControllers.deleteCurrentUser);

routes.put('/users/me/name', authMiddlewares.authenticateToken, authControllers.updateCurrentName);

routes.put('/users/me/password', authMiddlewares.authenticateToken, authMiddlewares.passwordValidation, authControllers.updatePassword);

routes.get('/auth/validate', authMiddlewares.authenticateToken, (req, res) => {
    res.status(200).json({
        status: 200,
        ok: true,
        valid: true,
        message: 'Token is valid',
        user: req.userExists
    });
});

export default routes;