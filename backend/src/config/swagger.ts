import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description: "REST API documentation for the E-Commerce App",
    },
    servers: [
      { url: "https://ecommerce-backend-mhw5.onrender.com/api/v1", description: "Production" },
      { url: "http://localhost:5000/api/v1", description: "Local" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);