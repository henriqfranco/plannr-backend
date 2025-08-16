const bucketControllers = {
    getAllBuckets: async (req, res) => {
        try {
            const userID = req.user.userId;
            const workspaceId = req.params.workspaceId;

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
            const workspaceId = req.params.workspaceId;

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
                message: 'Bucket created successfully.',
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
    deleteBucket: async (req, res) => {
        try {
            const { id } = req.params;
            const userID = req.user.userId;

            const bucket = await req.prisma.bucket.findFirst({
                where: {
                    id: parseInt(id)
                },
                include: {
                    workspace: true
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
                    message: 'You do not have permission to delete this bucket.',
                });
            }

            await req.prisma.bucket.delete({
                where: {
                    id: parseInt(id)
                }
            });

            res.status(200).json({
                status: 200,
                ok: true,
                message: 'Bucket deleted successfully.',
            });

        } catch (error) {
            res.status(500).json({
                status: 500,
                ok: false,
                message: `An internal server error ocurred: ${error.message}`,
            });
        }
    },
    renameBucket: async (req, res) => {
        try {
            const { newName } = req.body;
            const bucketID = Number(req.params.id);

            if (!newName) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: 'Bucket name cannot be empty.',
                });
            }

            const bucket = await req.prisma.bucket.findUnique({
                where: { id: bucketID }
            });

            if (!bucket) {
                return res.status(404).json({
                    status: 404,
                    ok: false,
                    message: 'Bucket not found.',
                });
            };

            if (newName === bucket.name) {
                return res.status(400).json({
                    status: 400,
                    ok: false,
                    message: "The submitted bucket name is the same as the current one.",
                });
            };

            await req.prisma.bucket.update({
                where: {
                    id: bucketID,
                },
                data: {
                    name: newName,
                },
            });

            res.status(200).json({
                status: 200,
                ok: true,
                message: 'Bucket name changed successfully.',
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

export default bucketControllers;