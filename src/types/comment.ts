export type TComment = {
  id: string;
  _id: string;
  owner: {
    ip: string;
    gravatar: string;
    email: string;
    name: string;
  };
  pageUrl: string;
  pageId: string;
  body: string;
  secret: string;
  createdAt: Date;
};
