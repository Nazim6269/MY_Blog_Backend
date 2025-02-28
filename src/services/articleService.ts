import { Article, NewArticle } from "../../interface";
const ArticleClass = require("../models/ArticleModel");
const dbConnection = require("../../db");

const articlesService = async ({
  page = 1,
  limit = 10,
  sortType = "asc",
  sortBy = "updatedAt",
  searchTerm = "",
}) => {
  //   const searchString: string | null  =
  //     typeof searchTerm === "string"
  //       ? searchTerm
  //       : Array.isArray(searchTerm)
  //       ? searchTerm.find((item: any) => typeof item === "string") ?? null
  //       : null;

  const articleInstance = new ArticleClass(dbConnection.db.articles);

  let articles;

  //search article
  if (searchTerm) {
    articles = await articleInstance.search(searchTerm);
  } else {
    articles = await articleInstance.find();
  }

  // sort article
  articles = [...articles];
  articles = await articleInstance.sort(articles, sortType, sortBy);

  //pagination
  const { totalItems, totalPage, result, hasNext, hasPrev } =
    await articleInstance.pagination(articles, page, limit);

  return {
    totalItems,
    totalPage,
    hasNext,
    hasPrev,
    articles: result,
  };
};

const transformedArticles = ({ articles = [] }: { articles: Article[] }) => {
  return articles.map((article: Article) => {
    const transformed = { ...article };

    transformed.author = { id: transformed.authorId };
    transformed.link = `/articles/${transformed.id}`;

    delete transformed.body;
    delete transformed.authorId;

    return transformed;
  });
};

const createNewArticle = ({
  title,
  body,
  cover = "",
  status = "draft",
  authorId,
}: NewArticle) => {
  const articleInstance = new ArticleClass(dbConnection.db.articles);
  const article = articleInstance.create(
    { title, body, cover, authorId, status },
    dbConnection
  );

  return article;
};

module.exports = { articlesService, transformedArticles, createNewArticle };
