import { Article } from "../../interface";

const connection = require("../../db");

class ArticleClass {
  private articles: Article[] = [];
  constructor() {
    // this.init();
  }

  //=========== this funciton will init db connection===========//
  async init(): Promise<void> {
    const db = await connection.getDB();
    this.articles = db.articles;
  }

  //=========== this function will find all articles ========//
  async find(): Promise<Article[]> {
    return this.articles;
  }

  //======== this function will find =========//
  async findById(id: string) {
    return this.articles.find(
      (article: Article) => article.id.toString() === id
    );
  }

  //==========this function will find article===========//
  async findByProp(prop: string) {
    return this.articles.find((article: Article) => article[prop] === prop);
  }

  // ============this function find aritcle ============//
  async search(term: string): Promise<Article[]> {
    return this.articles.filter((article: Article) =>
      article.title.toLowerCase().includes(term)
    );
  }

  // ========= sort the articles===========//
  async sort(
    articles: Article[],
    sortType: string = "asc",
    sortBy: string = "updatedAt"
  ) {
    if (sortType === "asc") {
      return this.sortAsc(articles, sortBy);
    } else {
      return this.sortDsc(articles, sortBy);
    }
  }

  //======= pagination function============//
  async pagination(articles: Article[], page: number, limit: number) {
    const skip = page * limit - limit;
    const totalItems = articles.length;
    const totalPage = Math.ceil(this.articles.length / page);
    let result = articles.slice(skip, skip + limit);

    return {
      totalItems,
      totalPage,
      result,
      hasNext: page > totalPage,
      hasPrev: page < totalPage,
    };
  }

  //======this is sorting helper function==========//
  private async sortAsc(articles: Article[], sortBy: string) {
    return articles.sort((a, b) =>
      a[sortBy].toString().localeCompare(b[sortBy].toString())
    );
  }

  //======this is sorting helper function==========//
  private async sortDsc(articles: Article[], sortBy: string) {
    return articles.sort((a, b) =>
      b[sortBy].toString().localeCompare(a[sortBy].toString())
    );
  }
}

module.exports = ArticleClass;
