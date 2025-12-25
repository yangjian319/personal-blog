export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Markdown-ish text
  coverImage: string;
  date: string;
  tags: string[];
  category: string;
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
}

export enum ViewState {
  VIEWING = 'VIEWING',
  EDITING = 'EDITING',
}