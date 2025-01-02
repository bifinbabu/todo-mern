import express from "express";
import * as redoc from "redoc-express";
import YAML from "yamljs";
import path from "path";

const router = express.Router();

// Load the OpenAPI specification
const openApiPath = path.join(__dirname, "../openapi.yaml");
const openApiSpec = YAML.load(openApiPath);

// Serve ReDoc HTML
router.get(
  "/docs",
  // Serve the Redoc HTML page
  redoc.default({
    title: "Task Management API Documentation",
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
