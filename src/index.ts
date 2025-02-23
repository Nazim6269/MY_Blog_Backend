require("dotenv").config();
import { Request, Response } from "express";
const express = require("express");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDoc = YAML.load("./swagger.yaml");
const connection = require("../db");

import { Article, DataResponse } from "../interface";

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
  const sortBy = (req.query.sort_by as keyof Article) || "updatedAt";
  const searchTerm = req.query.search || "";

  const searchString: string | null =
    typeof searchTerm === "string"
      ? searchTerm
      : Array.isArray(searchTerm)
      ? searchTerm.find((item) => typeof item === "string") ?? null
      : null;

  const db = await connection.getDB();
  let articles = db.articles;

  //search article
  if (searchTerm) {
    articles = articles.filter((article: Article) =>
      article.title.toLowerCase().includes(searchString)
    );
  }

  // sort article
  articles.sort((a: Article, b: Article) => {
    if (sortType === "asc")
      return a[sortBy].toString().localeCompare(b[sortBy].toString());
    if (sortType === "dsc")
      return b[sortBy].toString().localeCompare(a[sortBy].toString());
  });

  //pagination
  const skip = page * limit - limit;
  let resultedArticles = articles.slice(skip, skip + limit);
  const totalItems = articles.length;
  const totalPage = Math.ceil(articles.length / page);

  resultedArticles = resultedArticles.map((article: Article) => {
    const transformed = { ...article };

    transformed.author = { id: transformed.authorId };
    transformed.link = `/articles/${transformed.id}`;

    delete transformed.body;
    delete transformed.authorId;

    return transformed;
  });

  const response: DataResponse = {
    data: resultedArticles,
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

  if (page > 1) {
    response.pagination.prev = page - 1;
    response.links.prev = `/articles/page=${page - 1}&limit=${limit}`;
  }

  if (page < totalPage) {
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
