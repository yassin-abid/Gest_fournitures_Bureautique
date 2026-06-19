export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const getPaginationParams = (query: Record<string, any>): PaginationParams => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10', 10)));
  return { page, limit };
};

export const getPrismaSkip = (page: number, limit: number): number => (page - 1) * limit;

export const buildPaginatedResult = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T> => ({
  data,
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});
