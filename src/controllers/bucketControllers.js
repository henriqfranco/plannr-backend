const bucketControllers = {
    getAllBuckets: async (req, res) => {
        try {
            const userID = req.user.userId;
            const workspaceId = req.params.id;

            const workspace = await req.prisma.workspace.findFirst({
                where: {
                    id: parseInt(workspaceId),
                    userId: userID,
                }
            });

            if (!workspace) {
                return res.status(404).json({
                    status: 404,
                    ok: false,
                    message: 'Workspace not found or you do not have permission to access it.',
                });
            }

            const buckets = await req.prisma.bucket.findMany({
                where: {
                    workspaceId: parseInt(workspaceId)
                },
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                    workspace: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            });

            res.status(200).json({
                status: 200,
                ok: true,
                message: 'Displaying workspace buckets.',
                workspaceId: workspaceId,
                buckets: buckets
            });

        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },
    createBucket: async (req, res) => {
        try {
            const { bucketName } = req.body;
            const userID = req.user.userId;
            const workspaceId = req.params.id;

            if (!bucketName) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: 'Bucket name is required.',
                });
            };

            const workspace = await req.prisma.workspace.findFirst({
                where: {
                    id: parseInt(workspaceId),
                    userId: userID
                }
            });

            if (!workspace) {
                return res.status(404).json({
                    status: 404,
                    ok: false,
                    message: 'Workspace not found or you do not have permission to access it.',
                });
            }

            const checkBucketName = await req.prisma.bucket.findFirst({
                where: {
                    name: bucketName,
                    workspaceId: parseInt(workspaceId),
                }
            });

            if (checkBucketName) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "Bucket with the same name already exists.",
                });
            }

            const bucket = await req.prisma.bucket.create({
                data: {
                    name: bucketName,
                    workspaceId: parseInt(workspaceId)
                }
            });

            res.status(200).json({
                status: 200,
                ok: true,
                message: 'Workspace created successfully.',
                bucket: bucket,
            });

        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },
    // deleteWorkspace: async (req, res) => {
    //     try {
    //         const { id } = req.params;
    //         const userID = req.user.userId;

    //         const workspace = await req.prisma.workspace.findFirst({
    //             where: {
    //                 id: parseInt(id),
    //                 userId: userID
    //             }
    //         });

    //         if (!workspace) {
    //             return res.status(404).json({
    //                 status: 404,
    //                 ok: false,
    //                 message: 'Workspace not found or you do not have permission to delete it.',
    //             });
    //         }

    //         await req.prisma.workspace.delete({
    //             where: {
    //                 id: parseInt(id)
    //             }
    //         });

    //         res.status(200).json({
    //             status: 200,
    //             ok: true,
    //             message: 'Workspace deleted successfully.',
    //         });

    //     } catch (error) {
    //         res.status(500).json({
    //             status: 500,
    //             ok: false,
    //             message: `An internal server error ocurred: ${error.message}`,
    //         });
    //     }
    // },
    // renameWorkspace: async (req, res) => {
    //     try {
    //         const { newName } = req.body;
    //         const workspaceID = Number(req.params.id);

    //         if (!newName) {
    //             return res.status(400).json({
    //                 status: 400,
    //                 ok: false,
    //                 message: 'Workspace name cannot be empty.',
    //             });
    //         }

    //         const workspace = await req.prisma.workspace.findUnique({
    //             where: { id: workspaceID }
    //         });

    //         if (!workspace) {
    //             return res.status(404).json({
    //                 status: 404,
    //                 ok: false,
    //                 message: 'Workspace not found.',
    //             });
    //         };

    //         if (newName === workspace.name) {
    //             return res.status(400).json({
    //                 status: 400,
    //                 ok: false,
    //                 message: "The submitted workspace name is the same as the current one.",
    //             });
    //         };

    //         await req.prisma.workspace.update({
    //             where: {
    //                 id: workspaceID,
    //             },
    //             data: {
    //                 name: newName,
    //             },
    //         });

    //         res.status(200).json({
    //             status: 200,
    //             ok: true,
    //             message: 'Workspace name changed successfully.',
    //         });

    //     } catch (error) {
    //         res.status(500).json({
    //             status: 500,
    //             ok: false,
    //             message: `An internal server error ocurred: ${error.message}`,
    //         });
    //     }
    // }
}

export default bucketControllers;