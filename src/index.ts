require("dotenv").config();
import { NextFunction, Request, Response } from "express";
const express = require("express");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDoc = YAML.load("./swagger.yaml");
const articleService = require("./services/articleService");
const dbConnection = require("../db");

import { DataResponse } from "../interface";

//Extending express requset
interface CustomRequest extends Request {
  user?: {
    id: number;
    name: string;
  };
}

const app = express();
const PORT = process.env.PORT ?? 4000;

app.use(express.json());
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  req.user = {
    id: 999,
    name: "Nazim Uddin",
  };

  next();
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(201).json({ message: "ok" });
});

app.get("/api/v1/articles", async (req: Request, res: Response) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;

  let { totalItems, totalPage, hasNext, hasPrev, articles } =
    await articleService.articlesService({ ...req.query, page, limit });

  const response: DataResponse = {
    data: articleService.transformedArticles({ articles }),
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
    response.links.prev = `${req.url}/page=${page - 1}&limit=${limit}`;
  }

  if (hasNext) {
    response.pagination.next = page + 1;
    response.links.next = `${req.url}/page=${page + 1}&limit=${limit}`;
  }

  res.status(201).json(response);
});

app.post("/api/v1/articles", async (req: CustomRequest, res: Response) => {
  const { title, body, cover, status } = req.body;

  const article = await articleService.createNewArticle({
    title,
    body,
    cover,
    status,
    authorId: req.user.id,
  });

  const response = {
    code: 201,
    message: "Article created Successfully",
    data: article,
    links: {
      self: `${req.url}/${article.id}`,
      author: `${req.url}/${article.id}/author`,
      comment: `${req.url}/${article.id}/comment`,
    },
  };
  res.status(201).json(response);
});

app.get("/api/v1/articles/:id", (req: Request, res: Response) => {
  res.status(201).json({ path: "/articles/{id}", method: "get" });
});

(async () => {
  await dbConnection.connect();
  console.log("DB is connected successfully");
  app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
  });
})();
