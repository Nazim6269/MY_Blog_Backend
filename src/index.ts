require("dotenv").config();
require("../db");

import { Request, Response } from "express";

const express = require("express");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDoc = YAML.load("./swagger.yaml");

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(express.json());
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.get("/health", (_req: Request, res: Response) => {
  res.status(201).json({ message: "ok" });
});

app.get("/api/v1/articles", (req: Request, res: Response) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const sortType = req.query.sort_type || "asc";
  const sortBy = req.query.sort_by || "updatedat";
  const searchTerm = req.query.search || "";
  res.status(201).json({ path: "/articles", method: "get" });
});

app.post("/api/v1/articles", (req: Request, res: Response) => {
  res.status(201).json({ path: "/articles", method: "post" });
});

app.get("/api/v1/articles/:id", (req: Request, res: Response) => {
  res.status(201).json({ path: "/articles/{id}", method: "get" });
});

app.get("/api/v1/articles", (req: Request, res: Response) => {
  res.status(201).json({ message: "Hellow Swagger" });
});

app.get("/api/v1/articles", (req: Request, res: Response) => {
  res.status(201).json({ message: "Hellow Swagger" });
});

app.get("/api/v1/articles", (req: Request, res: Response) => {
  res.status(201).json({ message: "Hellow Swagger" });
});

app.get("/api/v1/articles", (req: Request, res: Response) => {
  res.status(201).json({ message: "Hellow Swagger" });
});

app.get("/api/v1/articles", (req: Request, res: Response) => {
  res.status(201).json({ message: "Hellow Swagger" });
});

app.get("/api/v1/articles", (req: Request, res: Response) => {
  res.status(201).json({ message: "Hellow Swagger" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
