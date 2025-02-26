require("dotenv").config();
import { Request, Response } from "express";
const express = require("express");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDoc = YAML.load("./swagger.yaml");
const article = require("./services/article");
// const connection = require("../db");

import { DataResponse } from "../interface";

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(express.json());
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.get("/health", (_req: Request, res: Response) => {
  res.status(201).json({ message: "ok" });
});

app.get("/api/v1/articles", async (req: Request, res: Response) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;

  let { totalItems, totalPage, hasNext, hasPrev, articles } =
    await article.articlesService({ ...req.query, page, limit });

  const response: DataResponse = {
    data: article.transformedArticles({ articles }),
    pagination: {
      page,
      limit,
      totalPage,
      totalItems,
    },
    links: {
      self: req.url,
    },
  };

  if (hasPrev) {
    response.pagination.prev = page - 1;
    response.links.prev = `/articles/page=${page - 1}&limit=${limit}`;
  }

  if (hasNext) {
    response.pagination.next = page + 1;
    response.links.next = `/articles/page=${page + 1}&limit=${limit}`;
  }

  res.status(201).json(response);
});

app.post("/api/v1/articles", (req: Request, res: Response) => {
  res.status(201).json({ path: "/articles", method: "post" });
});

app.get("/api/v1/articles/:id", (req: Request, res: Response) => {
  res.status(201).json({ path: "/articles/{id}", method: "get" });
});

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
