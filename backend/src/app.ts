import fastify from 'fastify'

import formDataRoutes from './routes/form_data'
import queryRoutes from './routes/query'
import errorHandler from './errors'
import setupSwagger from './swagger';

function build(opts = {}) {
  const app = fastify(opts)

  // register the route to view swagger documentation
  app.register(setupSwagger);

  app.register(formDataRoutes, { prefix: '/form-data' });

  // Register the route for the queries
  app.register(queryRoutes, { prefix: '/query' });

  return app;
}
export default build
