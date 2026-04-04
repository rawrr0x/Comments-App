export interface ParentCommentReturn {
  id: number;
  text: string;
  userId: number;
  repliesCount: number;
  fileUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}
