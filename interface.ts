export interface Author {
  id: number;
}

export interface Article {
  title: string;
  id: number;
  link: string;
  body: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: string | number | Author;
  author: Author;
}

export interface DataResponse {
  data: Article;
  pagination: {
    page: number;
    limit: number;
    totalPage: number;
    totalItems: number;
    prev?: number;
    next?: number;
  };
  links: {
    self: string;
    next?: string;
    prev?: string;
  };
}

export interface NewArticle {
  title: string;
  body: string;
  cover?: string;
  status?: string;
  authorId?: number;
}
