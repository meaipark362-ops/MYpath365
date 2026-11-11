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
}

export interface BreadcrumbItem {
  id: string;
  title: string;
  slug: string;
}
