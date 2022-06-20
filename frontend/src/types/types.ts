export interface MovieType {
  urlKey: string;
  cast: string;
  description: string;
  genres: string[];
  logo: string;
  rate?: number;
  title: string;
  year: string;
  _id: string;
}

export interface MovieAttribute {
  field: string;
  isFilterable: boolean;
  isSortable: boolean;
  isDefaultSortField: boolean;
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export interface FilterItem {
  field: keyof MovieType;
  value?: string[];
}

export interface SortField {
  field: string;
  isDefault: boolean;
}

export interface UserType {
  createdDate: string;
  email: string;
  password?: string;
  passwordRepeat?: string;
  _id?: string;
}

export enum SortUrlParams {
  field = 'sort_field',
  dir = 'sort_dir',
}

export enum PaginationUrlParams {
  page = 'page',
  pageSize = 'limit',
}
