import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const url = process.env.NODE_ENV == "production" ?  "http://64.225.19.128" :  "http://127.0.0.1:5000"; 

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Bitcoin API",
            version: "1.0.0",
            description: "API documentation for user registration with OTP verification using Nodemailer SMTP and PostgreSQL",
        },
        servers: [{ url }],
    },
    apis: ["./src/routes/*.js"], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
