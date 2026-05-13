export interface User {
  id: number;
  name: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
  subCategories: SubCategory[];
}

export interface Prompt {
  id: number;
  userId: number;
  categoryId: number;
  subCategoryId: number;
  prompt: string;
  response: string;
  createdAt: string;
  category: { name: string };
  subCategory: { name: string };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}
