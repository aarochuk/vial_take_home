import { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

async function setupSwagger(app: FastifyInstance) {
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Query Management System API',
        description: 'API to get queries and form data for a Query Management System',
        version: '1.0.0',
      },
      components: {
        schemas: {
          Query: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Query unique identifier' },
              title: { type: 'string', description: 'Query title' },
              description: { type: 'string', description: 'Query description' },
              status: { type: 'string', enum: ['OPEN', 'RESOLVED'], description: 'Query status' },
              createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
              updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' },
              formDataId: { type: 'string', description: 'Associated form data ID' }
            }
          },
          FormData: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Form data unique identifier' },
              question: { type: 'string', description: 'Question associated with the form data' },
              answer: { type: 'string', description: 'Answer associated with the form data' },
              query: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'Query unique identifier' },
                    title: { type: 'string', description: 'Query title' },
                    description: { type: 'string', description: 'Query description' },
                    status: { type: 'string', enum: ['OPEN', 'RESOLVED'], description: 'Query status' },
                    createdAt: { type: 'string', format: 'date-time', description: 'Creation timestamp' },
                    updatedAt: { type: 'string', format: 'date-time', description: 'Last update timestamp' },
                    formDataId: { type: 'string', description: 'Associated form data ID' }
                }
              }
            }
          },
          Error: {
            type: 'object',
            properties: {
              message: { type: 'string', description: 'Error message' }
            }
          }
        }
      },
      tags: [
        { name: 'FormData', description: 'Form Data related endpoints' },
        { name: 'Query', description: 'Query related endpoints' },
      ],
      paths: {
        '/form-data': {
          get: {
            tags: ['FormData'],
            summary: 'Gets all the form data',
            description: 'Retrieves all form data records with their associated queries from the database',
            responses: {
              '200': {
                description: 'Successfully retrieved all form data',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        total: { type: 'number', description: 'Total count of form data records' },
                        formData: {
                          type: 'array',
                          description: 'List of form data records',
                          items: {
                            type: 'object',
                            properties: {
                              id: { type: 'string', description: 'Form data unique identifier' },
                              question: { type: 'string', description: 'Question associated with the form data' },
                              answer: { type: 'string', description: 'Answer associated with the form data' },
                              query: { 
                                type: 'array',
                                description: 'Queries associated with the form data',
                                items: {
                                  $ref: '#/components/schemas/Query'
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              '400': {
                description: 'Failed to fetch all form data',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Error'
                    }
                  }
                }
              }
            }
          }
        },
        '/query': {
          post: {
            tags: ['Query'],
            summary: 'Create a new query',
            description: 'Creates a new query which is associated with a form data',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['title', 'formDataId'],
                    properties: {
                      title: { type: 'string', description: 'Title of the query' },
                      description: { type: 'string', description: 'Detailed description of the query this is optional' },
                      formDataId: { type: 'string', description: 'ID of the form data to associate with this query' }
                    }
                  }
                }
              }
            },
            responses: {
              '201': {
                description: 'Successfully created query',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Query'
                    }
                  }
                }
              },
              '400': {
                description: 'Failed to create query',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Error'
                    }
                  }
                }
              },
              '404': {
                description: 'Form data not found',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Error'
                    }
                  }
                }
              }
            }
          }
        },
        '/query/{id}': {
          put: {
            tags: ['Query'],
            summary: 'Update a query',
            description: 'Update an existing query by given ID',
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: {
                  type: 'string'
                },
                description: 'ID of query to update'
              }
            ],
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      title: { type: 'string', description: 'Updated title of the query' },
                      description: { type: 'string', description: 'Updated description of the query' },
                      status: { 
                        type: 'string', 
                        enum: ['OPEN', 'RESOLVED'], 
                        description: 'Updated status of the query' 
                      }
                    }
                  }
                }
              }
            },
            responses: {
              '200': {
                description: 'Successfully updated query',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Query'
                    }
                  }
                }
              },
              '400': {
                description: 'Failed to update query',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Error'
                    }
                  }
                }
              },
              '404': {
                description: 'Query not found',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Error'
                    }
                  }
                }
              }
            }
          },
          delete: {
            tags: ['Query'],
            summary: 'Delete a query',
            description: 'Delete a query by given ID',
            parameters: [
              {
                name: 'id',
                in: 'path',
                required: true,
                schema: {
                  type: 'string'
                },
                description: 'ID of query to delete'
              }
            ],
            responses: {
              '204': {
                description: 'Query successfully deleted'
              },
              '400': {
                description: 'Failed to delete query',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Error'
                    }
                  }
                }
              },
              '404': {
                description: 'Query not found',
                content: {
                  'application/json': {
                    schema: {
                      $ref: '#/components/schemas/Error'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) { next() },
      preHandler: function (request, reply, next) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
    transformSpecificationClone: true
  });
}

export default setupSwagger;