import fastify from 'fastify'

import formDataRoutes from './routes/form_data'
import queryRoutes from './routes/query'
import errorHandler from './errors'
import setupSwagger from './swagger';

function build(opts = {}) {
  const app = fastify(opts)

  app.register(setupSwagger);

  // Set up a hook to ensure routes have proper tags
  app.addHook('onRoute', (routeOptions) => {
    if (routeOptions.schema && !routeOptions.schema.tags) {
      // Add default tag if missing
      routeOptions.schema.tags = ['API'];
    }
  });

  // Now register the routes after Swagger is set up
  app.register(formDataRoutes, { prefix: '/form-data' });
  app.register(queryRoutes, { prefix: '/query' });

  // Ready event to ensure everything is properly registered
  app.addHook('onReady', () => {
    app.log.info('All routes and plugins registered!');
    app.log.info('Documentation available at /documentation');
  });

  return app;
}
export default build
