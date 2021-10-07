/*
Interface used for frontend database for common object
*/

export interface Post {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  creator: string;
}
