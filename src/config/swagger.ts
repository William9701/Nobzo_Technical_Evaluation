import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog REST API',
      version: '1.0.0',
      description: 'A comprehensive Blog REST API with authentication, authorization, and CRUD operations',
      contact: {
        name: 'API Support',
        email: 'hello@nobzoent.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '6986e61a80b6720aa89fc026',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Post: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '6986e64f80b6720aa89fc02a',
            },
            title: {
              type: 'string',
              example: 'Getting Started with Node.js',
            },
            slug: {
              type: 'string',
              example: 'getting-started-with-nodejs',
            },
            content: {
              type: 'string',
              example: 'Node.js is a powerful JavaScript runtime...',
            },
            author: {
              $ref: '#/components/schemas/User',
            },
            status: {
              type: 'string',
              enum: ['draft', 'published'],
              example: 'published',
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['nodejs', 'javascript', 'backend'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
            deletedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [],
  },
  apis: [
    './src/routes/*.ts',
    './dist/routes/*.js',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
