export type QueryListParams<T>
  = Partial<T & { page?: number; limit?: number; sort_field?: keyof T; sort_direction?: SortDirection
}>

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}
