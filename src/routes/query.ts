import { FastifyInstance } from 'fastify';
import prisma from '../db/db_client';
import { serializer } from './middleware/pre_serializer';
import { CreateQuery } from './schemas/query.interface';
import { ApiError } from '../errors';

async function queryRoutes(app: FastifyInstance) {
  app.setReplySerializer(serializer);
  const log = app.log.child({ component: 'queryRoutes' });
  app.post<{
    Body: CreateQuery;
  }>('', {
    async handler(req, reply) {
      log.debug('create query');
      const { title, description, status, formDataId } = req.body;
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
            status,
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


}

export default queryRoutes;