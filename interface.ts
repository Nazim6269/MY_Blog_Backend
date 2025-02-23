export interface Article {
  title: string;
  id: number;
  link: string;
  body: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
  };
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
