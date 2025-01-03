import express from "express";
import * as redoc from "redoc-express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const router = express.Router();

const openApiPath = path.join(__dirname, "../openapi.yaml");
const openApiSpec = YAML.load(openApiPath);
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

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
    customCss:
      ".swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }",
    customCssUrl: CSS_URL,
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
