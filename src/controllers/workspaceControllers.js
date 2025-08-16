const workspaceControllers = {
    getAllWorkspaces: async (req, res) => {
        try {
            const userID = req.user.userId;

            const workspaces = await req.prisma.workspace.findMany({
                where: {
                    userId: userID
                },
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            });

            res.status(200).json({
                status: 200,
                ok: true,
                message: 'Displaying user workspaces.',
                workspaces: workspaces
            });

        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },
    createWorkspace: async (req, res) => {
        try {
            const { workspaceName } = req.body;
            const userID = req.user.userId;

            if (!workspaceName) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "Workspace name cannot be empty.",
                });
            }

            const checkWorkspaceName = await req.prisma.workspace.findFirst({
                where: {
                    name: workspaceName,
                    userId: userID
                }
            });

            if (checkWorkspaceName) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "Workspace with the same name already exists.",
                });
            }

            const workspace = await req.prisma.workspace.create({
                data: {
                    name: workspaceName,
                    userId: userID
                }
            });

            res.status(200).json({
                status: 200,
                ok: true,
                message: 'Workspace created successfully.',
                workspace: workspace,
            });

        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },
    deleteWorkspace: async (req, res) => {
        try {
            const { id } = req.params;
            const userID = req.user.userId;

            const workspace = await req.prisma.workspace.findFirst({
                where: {
                    id: parseInt(id),
                    userId: userID
                }
            });

            if (!workspace) {
                return res.status(404).json({
                    status: 404,
                    ok: false,
                    message: 'Workspace not found or you do not have permission to delete it.',
                });
            }

            await req.prisma.workspace.delete({
                where: {
                    id: parseInt(id)
                }
            });

            res.status(200).json({
                status: 200,
                ok: true,
                message: 'Workspace deleted successfully.',
            });

        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },
    renameWorkspace: async (req, res) => {
        try {
            const { newName } = req.body;
            const workspaceID = Number(req.params.id);

            if (!newName) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: 'Workspace name cannot be empty.',
                });
            }

            const workspace = await req.prisma.workspace.findUnique({
                where: { id: workspaceID }
            });

            if (!workspace) {
                return res.status(404).json({
                    status: 404,
                    ok: false,
                    message: 'Workspace not found.',
                });
            };

            if (newName === workspace.name) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "The submitted workspace name is the same as the current one.",
                });
            };

            await req.prisma.workspace.update({
                where: {
                    id: workspaceID,
                },
                data: {
                    name: newName,
                },
            });

            res.status(200).json({
                status: 200,
                ok: true,
                message: 'Workspace name changed successfully.',
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

export default workspaceControllers;