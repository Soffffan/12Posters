const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '12 Posters API',
      version: '1.0.0',
      description: 'API для кинотеатра',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Локальный сервер',
      },
    ],
    components: {
      schemas: {
        Cinema: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            address: { type: 'string' },
            metro: { type: 'string' },
            city: { type: 'string' },
          },
        },
        CinemaHall: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            numberHall: { type: 'integer' },
            cinemaId: { type: 'integer' },
          },
        },
        CinemaWithHalls: {
          allOf: [
            { $ref: '#/components/schemas/Cinema' },
            {
              type: 'object',
              properties: {
                CinemaHalls: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/CinemaHall' },
                },
              },
            },
          ],
        },
        Film: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            poster: { type: 'string' },
          },
        },
        FilmSession: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            dateTime: { type: 'string', format: 'date-time' },
            filmId: { type: 'integer' },
            cinemaId: { type: 'integer' },
            cinemaHallId: { type: 'integer' },
            film: { $ref: '#/components/schemas/Film' },
            cinema: { $ref: '#/components/schemas/Cinema' },
            hall: { $ref: '#/components/schemas/CinemaHall' },
          },
        },
      },
    },
  },
  apis: ['./routes/user/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;