import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Bitcoin API",
            version: "1.0.0",
            description: "API documentation for user registration with OTP verification using Nodemailer SMTP and PostgreSQL",
        },
        servers: [{ url: "http://64.225.19.128:5000" }],
    },
    apis: ["./src/routes/*.js"], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
