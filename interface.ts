export interface Article {
  title: string;
  id: number;
  link: string;
  body: string;
  authorId: number;
  author: {
    id: number;
  };
}
