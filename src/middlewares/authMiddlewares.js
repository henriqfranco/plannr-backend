import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { body, validationResult, check } from 'express-validator';

const authMiddlewares = {
    authenticateToken: async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: 'Access token required',
                valid: false
            });
        }

        try {
            const decoded = jwt.verify(token, config.jwt.secret);

            const currentTime = Math.floor(Date.now() / 1000);
            if (decoded.exp && decoded.exp < currentTime) {
                return res.status(403).json({
                    error: 'Token has expired',
                    valid: false
                });
            }

            const user = await req.prisma.user.findUnique({
                where: { id: decoded.userId },
                select: { id: true, email: true }
            });

            if (!user) {
                return res.status(403).json({
                    error: 'User no longer exists',
                    valid: false
                });
            }

            req.user = decoded;
            req.userExists = user;
            next();

        } catch (err) {
            let errorMessage = 'Invalid or expired token';

            if (err.name === 'TokenExpiredError') {
                errorMessage = 'Token has expired';
            } else if (err.name === 'JsonWebTokenError') {
                errorMessage = 'Invalid token format';
            } else if (err.name === 'NotBeforeError') {
                errorMessage = 'Token not active yet';
            }

            return res.status(403).json({
                error: errorMessage,
                valid: false
            });
        }
    },

    passwordValidation: [
        body('newPassword')
            .notEmpty()
            .withMessage('Password cannot be empty.')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long.')
            .matches(/\d/)
            .withMessage('Password must contain at least one number.'),

        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: errors.array()[0].msg,
                    errors: errors.array()
                });
            }

            next();
        }
    ],

    validateRegister: [
        check("name")
            .notEmpty().withMessage("Name is required.")
            .trim()
            .escape()
            .matches(/^[A-Za-z]+\s[A-Za-z]+$/).withMessage("Name must be in 'Firstname Lastname' format.")
            .isLength({ min: 3, max: 50 }).withMessage("Name must be 3-50 characters"),
        check("password")
            .notEmpty().withMessage("Password is required.")
            .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long.")
            .matches(/\d/).withMessage("Password must contain at least one number."),
        check("email")
            .notEmpty().withMessage("Email is required.")
            .isEmail().withMessage("Invalid email format."),

        (req, res, next) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: errors.array()[0].msg,
                    errors: errors.array()
                });
            }
            next();
        }
    ]
}

export default authMiddlewares;