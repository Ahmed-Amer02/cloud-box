import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CloudBox API',
      version: '1.0.0',
      description:
        'A backend API for a cloud storage service — folders, files, tags, streaming uploads, and trash/restore.',
    },
    servers: [
      { url: 'https://cloud-box-rsst.onrender.com/api', description: 'Production' },
      { url: 'http://localhost:3000/api', description: 'Local' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/features/**/*Routes.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
