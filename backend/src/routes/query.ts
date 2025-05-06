import { FastifyInstance } from 'fastify';
import prisma from '../db/db_client';
import { serializer } from './middleware/pre_serializer';
import { CreateQuery, UpdateQuery } from './schemas/query.interface';
import { ApiError } from '../errors';

async function queryRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer);
  const log = app.log.child({ component: 'queryRoutes' });

  // Post Request to create new queries
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
            // Queries start with a status of OPEN
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            formDataId
          }
        })
        reply.status(201).send(query);
      } catch (err: any) {
        log.error({ err }, err.message);
        throw new ApiError('Failed to create query', 400);
      }
    },
  });

  // Put Request to edit Queries based on the provided id
  app.put<{
    Params: { id: string };
    Body: UpdateQuery;
  }>('/:id', {
    async handler(req, reply) {
      log.debug('update query');
      const { id } = req.params;
      const { status, title, description } = req.body;
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
            // You can edit the title, description and status manually
            // updatedAt cannot be modified by the user but is based on 
            // when the post or put requests are called, in addition, you
            // cannot change the formData a query is associated with or
            // when it was created
            title: title !== undefined ? title : existingQuery.title,
            description: description !== undefined ? description : existingQuery.description,
            status: status !== undefined ? status : existingQuery.status,
            updatedAt: new Date().toISOString()
          }
        });
        reply.status(200).send(updatedQuery);
      } catch (err: any) {
        log.error({ err }, err.message);
        if (err instanceof ApiError) {
          throw err;
        }
        throw new ApiError('Failed to update query', 400);
      }
    },
  });

  // Delete a query based on its id
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