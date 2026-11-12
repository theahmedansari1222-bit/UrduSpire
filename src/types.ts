export type EntityId = number;
export type DocumentStatus = 'draft' | 'pending_review' | 'published' | 'rejected';
export type ResearchItemType = 'article' | 'note' | 'reference';

export interface NewsSource {
  id: EntityId;
  name: string;
  url: string;
  enabled: boolean;
  status?: string;
}

export interface NewsArticle {
  id: EntityId;
  sourceId: EntityId;
  category: string;
  title: string;
  summary: string;
  body: string;
  url: string;
  publishedAt: string;
  readMinutes?: number;
  read?: boolean;
}

export interface ResearchFolder {
  id: EntityId;
  title: string;
  description: string;
  createdAt: string;
  color?: string;
}

export interface Note {
  id: EntityId;
  title: string;
  body: string;
  projectId: EntityId | null;
  articleId: EntityId | null;
  pinned: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface WritingDocument {
  id: EntityId;
  title: string;
  subtitle: string;
  excerpt: string;
  body: string;
  category: string;
  tags: string[];
  status: DocumentStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface ResearchItem {
  id: EntityId;
  projectId: EntityId;
  type: ResearchItemType;
  itemId: EntityId;
  createdAt: string;
}

export interface AuthorProfile {
  name: string;
  username: string;
  bio: string;
  profession: string;
}

export interface WorkspaceData {
  sources: NewsSource[];
  articles: NewsArticle[];
  projects: ResearchFolder[];
  notes: Note[];
  documents: WritingDocument[];
  saved: EntityId[];
  read: EntityId[];
  researchItems: ResearchItem[];
  profile: AuthorProfile;
  theme: 'light' | 'dark';
}
