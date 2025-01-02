import express from "express";
import * as redoc from "redoc-express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const router = express.Router();

const openApiPath = path.join(__dirname, "../openapi.yaml");
const openApiSpec = YAML.load(openApiPath);

// Serve Swagger UI for testing
router.use("/api-test", swaggerUi.serve);
router.get(
  "/api-test",
  swaggerUi.setup(openApiSpec, {
    swaggerOptions: {
      persistAuthorization: true,
      tryItOutEnabled: true,
      displayRequestDuration: true,
      filter: true,
    },
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "To-Do API Testing",
  })
);

// Serve ReDoc for documentation
router.get(
  "/docs",
  redoc.default({
    title: "To-Do API Documentation",
    specUrl: "/openapi.json",
    redocOptions: {
      theme: {
        colors: {
          primary: {
            main: "#2196f3",
          },
        },
      },
    },
  })
);

// Serve the OpenAPI specification as JSON
router.get("/openapi.json", (req, res) => {
  res.json(openApiSpec);
});

export default router;
