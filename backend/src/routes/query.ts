import { FastifyInstance } from 'fastify';
import prisma from '../db/db_client';
import { serializer } from './middleware/pre_serializer';
import { CreateQuery, UpdateQuery } from './schemas/query.interface';
import { ApiError } from '../errors';

async function queryRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer);
  const log = app.log.child({ component: 'queryRoutes' });
  app.post<{
    Body: CreateQuery;
  }>('', {
    async handler(req, reply) {
      log.debug('create query');
      const { title, description, formDataId } = req.body;
      try {
        const formData = await prisma.formData.findUnique({
          where: { id: formDataId }
        });
        if (!formData) {
          throw new ApiError('The form data you are trying to add this query to does not exist', 404);
        }
        const query = await prisma.query.create({
          data: {
            title,
            description: description,
            status: "OPEN",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            formDataId
          }
        })
        console.log("hello worlds")
        reply.status(201);
      } catch (err: any) {
        log.error({ err }, err.message);
        throw new ApiError('Failed to create query', 400);
      }
    },
  });

  app.put<{
    Params: { id: string };
    Body: UpdateQuery;
  }>('/:id', {
    async handler(req, reply) {
      log.debug('update query');
      const { id } = req.params;
      const { status } = req.body;
      try {
        const existingQuery = await prisma.query.findUnique({
          where: { id }
        });
        if (!existingQuery) {
          throw new ApiError('Query not found', 404);
        }
        const updatedQuery = await prisma.query.update({
          where: { id },
          data: {
            title: existingQuery.title,
            description: existingQuery.description,
            status: status ?? existingQuery.status,
            updatedAt: new Date().toISOString()
          }
        });
        reply.status(200);
      } catch (err: any) {
        log.error({ err }, err.message);
        if (err instanceof ApiError) {
          throw err;
        }
        throw new ApiError('Failed to update query', 400);
      }
    },
  });

  app.delete<{
    Params: { id: string };
  }>('/:id', {
    async handler(req, reply) {
      log.debug('delete query');
      const { id } = req.params;
      try {
        const existingQuery = await prisma.query.findUnique({
          where: { id }
        });
        if (!existingQuery) {
          throw new ApiError('Query not found', 404);
        }
        await prisma.query.delete({
          where: { id }
        });

        reply.status(204);
      } catch (err: any) {
        log.error({ err }, err.message);
        if (err instanceof ApiError) {
          throw err;
        }
        throw new ApiError('Failed to delete query', 400);
      }
    },
  });
}

export default queryRoutes;