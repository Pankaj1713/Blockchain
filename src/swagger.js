import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "User Registration API",
            version: "1.0.0",
            description: "API documentation for user registration with OTP verification using Amazon SES and PostgreSQL",
        },
        servers: [{ url: "http://localhost:5000" }],
    },
    apis: ["./src/routes/*.js"], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
