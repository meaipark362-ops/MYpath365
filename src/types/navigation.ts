// src/types/navigation.ts

export interface NavigationNode {
  id: string;
  title: string;
  slug: string;
  parentId: string | null;
  icon?: string | null;
  order: number;
  children: NavigationNode[];
  depth: number;
  category?: string;
  timestamp?: string;
  status?: string;
}

export interface BreadcrumbItem {
  id: string;
  title: string;
  slug: string;
}
