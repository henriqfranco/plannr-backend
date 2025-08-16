const taskControllers = {
    getAllTasks: async (req, res) => {
        try {
            const userID = req.user.userId;
            const bucketId = req.params.bucketId;

            const bucket = await req.prisma.bucket.findFirst({
                where: {
                    id: parseInt(bucketId)
                },
                include: {
                    workspace: {
                        select: {
                            userId: true,
                            id: true,
                            name: true
                        }
                    }
                }
            });

            if (!bucket) {
                return res.status(404).json({
                    status: 404,
                    ok: false,
                    message: 'Bucket not found.',
                });
            }

            if (bucket.workspace.userId !== userID) {
                return res.status(403).json({
                    status: 403,
                    ok: false,
                    message: 'You do not have permission to access this bucket.',
                });
            }

            const tasks = await req.prisma.task.findMany({
                where: {
                    bucketId: parseInt(bucketId)
                },
                select: {
                    id: true,
                    title: true,
                    completed: true,
                    notes: true,
                    status: true,
                    priority: true,
                    repeat: true,
                    startDate: true,
                    dueDate: true,
                    createdAt: true,
                    updatedAt: true,
                    bucket: {
                        select: {
                            id: true,
                            name: true,
                            workspace: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            });

            res.status(200).json({
                status: 200,
                ok: true,
                message: 'Displaying bucket tasks.',
                bucketId: bucketId,
                tasks: tasks
            });

        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },
    createTask: async (req, res) => {
        try {
            const { taskTitle } = req.body;
            const userID = req.user.userId;
            const bucketId = req.params.bucketId;

            if (!taskTitle) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: 'Task title is required.',
                });
            };

            const bucket = await req.prisma.bucket.findFirst({
                where: {
                    id: parseInt(bucketId),
                },
                include: {
                    workspace: {
                        select: {
                            userId: true
                        }
                    }
                }
            });

            if (!bucket) {
                return res.status(404).json({
                    status: 404,
                    ok: false,
                    message: 'Bucket not found or you do not have permission to access it.',
                });
            }

            const task = await req.prisma.task.create({
                data: {
                    title: taskTitle,
                    bucketId: parseInt(bucketId),
                    userId: userID
                }
            });

            res.status(200).json({
                status: 200,
                ok: true,
                message: 'Task created successfully.',
                task: task,
            });

        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },
    deleteTask: async (req, res) => {
        try {
            const { taskId } = req.params;
            const userID = req.user.userId;

            const task = await req.prisma.task.findFirst({
                where: {
                    id: parseInt(taskId)
                },
                include: {
                    bucket: {
                        include: {
                            workspace: true
                        }
                    }
                }
            });

            if (!task) {
                return res.status(404).json({
                    status: 404,
                    ok: false,
                    message: 'Task not found.',
                });
            }

            if (task.bucket.workspace.userId !== userID) {
                return res.status(403).json({
                    status: 403,
                    ok: false,
                    message: 'You do not have permission to delete this task.',
                });
            }

            await req.prisma.task.delete({
                where: {
                    id: parseInt(taskId)
                }
            });

            res.status(200).json({
                status: 200,
                ok: true,
                message: 'Task deleted successfully.',
            });

        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error occurred: ${error.message}`,
            });
        }
    },
    retitleTask: async (req, res) => {
        try {
            const { newTitle } = req.body;
            const { taskId } = req.params;
            const userID = req.user.userId;

            if (!newTitle) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: 'Task title cannot be empty.',
                });
            }

            const task = await req.prisma.task.findFirst({
                where: {
                    id: parseInt(taskId)
                },
                include: {
                    bucket: {
                        include: {
                            workspace: true
                        }
                    }
                }
            });

            if (!task) {
                return res.status(404).json({
                    status: 404,
                    ok: false,
                    message: 'Task not found.',
                });
            }

            if (task.bucket.workspace.userId !== userID) {
                return res.status(403).json({
                    status: 403,
                    ok: false,
                    message: 'You do not have permission to edit this task.',
                });
            }

            if (newTitle === task.title) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "The submitted task title is the same as the current one.",
                });
            }

            await req.prisma.task.update({
                where: {
                    id: parseInt(taskId),
                },
                data: {
                    title: newTitle,
                },
            });

            res.status(200).json({
                status: 200,
                ok: true,
                message: 'Task title changed successfully.',
            });

        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error occurred: ${error.message}`,
            });
        }
    }
}

export default taskControllers;