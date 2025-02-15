import { User } from "@prisma/client";

export interface CONTEXT_TYPE {
  token: string;
  user: User;
}

export interface USER_LOGIN_PARAMS {
  email: string;
  password: string;
  isAdmin: boolean;
}

export interface PAGE_INFO {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  perPage: number;
  nextPage: number | null;
  previousPage: number | null;
}

export interface USER_REGISTER_PARAMS {
  email: string;
  password: string;
  [key: string]: any;
}
