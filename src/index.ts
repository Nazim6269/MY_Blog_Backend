require("dotenv").config();
import { Request, Response } from "express";
const express = require("express");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDoc = YAML.load("./swagger.yaml");
const connection = require("../db");

import { Article } from "../interface";

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
  const sortType = req.query.sort_type || "asc";
  const sortBy = req.query.sort_by || "updatedat";
  const searchTerm = req.query.search || "";
  console.log(req.query);

  const searchString: string | null =
    typeof searchTerm === "string"
      ? searchTerm
      : Array.isArray(searchTerm)
      ? searchTerm.find((item) => typeof item === "string") ?? null
      : null;

  const db = await connection.getDB();
  let articles = db.articles;

  if (searchTerm) {
    articles = articles.filter((article: Article) =>
      article.title.toLowerCase().includes(searchString)
    );
  }

  const transformedArticles = articles.map((article: Article) => {
    const transformed = { ...article };

    transformed.author = { id: transformed.authorId };
    transformed.link = `/articles/${transformed.id}`;

    delete transformed.body;
    delete transformed.authorId;

    return transformed;
  });

  const response = {
    data: transformedArticles,
    pagination: {
      page,
      limit,
      next: 3,
      prev: 1,
      totalPages: Math.ceil(articles.length / page),
      totalItems: articles.length,
    },
    links: {
      self: req.url,
      next: `/articles/page=${page + 1}&limit=${limit}`,
      prev: `/articles/page=${page - 1}&limit=${limit}`,
    },
  };

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
