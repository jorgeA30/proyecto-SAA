const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Definición de las opciones para Swagger
const options = {
  definition: {
    openapi: '3.0.0', // Versión de OpenAPI utilizada
    info: {
      title: 'API de la Universidad Tecnológica del Valle de Toluca', // Título de la API
      version: '1.0.0', // Versión de la API
      description: 'Una API diseñada para facilitar la gestión de la Universidad Tecnológica del Valle de Toluca, una institución académica.', // Descripción de la API
    },
    servers: [
      {
        url: '/api', // URL base para la API
      },
    ],
  },
  apis: ['./src/Controllers/*.js', './src/Controllers/Auth/*.js', './src/Controllers/peticiones/*.js'], // Ruta donde se encuentran los archivos que contienen la definición de las rutas de la API
};

// Genera la documentación de Swagger con las opciones especificadas
const specs = swaggerJsDoc(options);

// Exporta los módulos necesarios para integrar Swagger en la aplicación
module.exports = {
  swaggerUi,
  specs,
};
