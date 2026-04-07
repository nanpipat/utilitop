export interface Tool {
  id: string;
  name: string;
  description: string;
  category: Category;
  keywords: string[];
  path: string;
  icon: string;
}

export type Category =
  | "formatters"
  | "encoders"
  | "generators"
  | "converters"
  | "text"
  | "network"
  | "diagrams";

export interface CategoryInfo {
  label: string;
  icon: string;
  color: string;
}
