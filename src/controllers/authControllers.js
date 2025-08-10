import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

const authControllers = {
    getAllUsers: async (req, res) => {
        try {
            const users = await req.prisma.user.findMany();

            if (!users) {
                return res.status(404).json({
                    status: 404,
                    ok: false,
                    message: 'No users found.',
                })
            }

            res.status(200).json({
                status: 200,
                ok: true,
                message: 'Displaying all users.',
                users: users
            })

        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },

    getCurrentUser: async (req, res) => {
        try {
            const userID = req.user.userId;

            const user = await req.prisma.user.findUnique({
                where: {
                    id: userID,
                }
            });

            if (!user) {
                return res.status(404).json({
                    status: 404,
                    ok: false,
                    message: 'User not found.',
                })
            }

            res.status(200).json({
                status: 200,
                ok: true,
                message: 'Displaying current user.',
                user: user
            })

        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await req.prisma.user.findUnique({
                where: { email }
            });

            if (!user) {
                return res.status(404).json({
                    status: 404,
                    ok: false,
                    message: 'User not found.',
                })
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({
                    status: 401,
                    ok: false,
                    message: 'Invalid email or password.',
                })
            }

            const token = jwt.sign(
                {
                    userId: user.id,
                    email: user.email
                },
                config.jwt.secret,
                {
                    expiresIn: config.jwt.expiration
                }
            );

            const { password: _, ...userWithoutPassword } = user;

            res.status(200).json({
                status: 200,
                ok: true,
                message: 'Login successfull.',
                user: userWithoutPassword,
                token
            });

        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },

    createUser: async (req, res) => {
        try {
            const { name, email } = req.body;

            const checkEmail = await req.prisma.user.findUnique({
                where: { email }
            });

            if (checkEmail) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "Account with the same email already exists.",
                });
            }

            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const user = await req.prisma.user.create({
                data: {
                    email: email,
                    name: name,
                    password: hashedPassword
                }
            });

            const { password, ...userWithoutPassword } = user;

            res.status(200).json({
                status: 200,
                ok: true,
                message: 'Account created successfully.',
                user: userWithoutPassword,
            });

        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },

    deleteCurrentUser: async (req, res) => {
        try {
            const { password } = req.body;
            const userID = req.user.userId;

            if (!password) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: 'Password is required.',
                });
            }

            const user = await req.prisma.user.findUnique({
                where: { id: userID }
            });

            if (!user) {
                return res.status(404).json({
                    status: 404,
                    ok: false,
                    message: 'User not found.',
                });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({
                    status: 401,
                    ok: false,
                    message: 'Invalid password.',
                });
            }

            await req.prisma.user.delete({
                where: { id: userID }
            });

            res.status(200).json({
                status: 200,
                ok: true,
                message: 'Account deleted successfully.',
            });

        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },
    updateCurrentName: async (req, res) => {
        try {
            const { newName } = req.body;
            const userID = req.user.userId;

            const user = await req.prisma.user.findUnique({
                where: { id: userID }
            });

            if (!user) {
                return res.status(404).json({
                    status: 404,
                    ok: false,
                    message: 'User not found.',
                });
            };

            if (newName === user.name) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "The submitted username is the same as the current one.",
                });
            }

            await req.prisma.user.update({
                where: {
                    id: userID,
                },
                data: {
                    name: newName,
                },
            });

            res.status(200).json({
                status: 200,
                ok: true,
                message: 'Name changed successfully.',
            });

        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },

    updatePassword: async (req, res) => {
        try {
            const { newPassword } = req.body;
            const userID = req.user.userId;

            const user = await req.prisma.user.findUnique({
                where: { id: userID }
            });
            if (!user) {
                return res.status(404).json({
                    status: 404,
                    ok: false,
                    message: 'User not found.',
                });
            };

            const isSamePassword = await bcrypt.compare(newPassword, user.password);
            if (isSamePassword) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "You cannot use the same password as your current one.",
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await req.prisma.user.update({
                where: {
                    id: userID,
                },
                data: {
                    password: hashedPassword,
                },
            });

            res.status(200).json({
                status: 200,
                ok: true,
                message: 'Password updated successfully.',
            });

        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    }
}

export default authControllers;