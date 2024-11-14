import { Repository, SelectQueryBuilder, ObjectLiteral } from "typeorm";

/**
 * Utility function to paginate and fetch data using TypeORM.
 * @param repository - The TypeORM repository for the entity.
 * @param page - The current page number.
 * @param limit - The number of items per page.
 * @param queryCallback - A callback function to customize the query builder.
 * @returns An object containing paginated data and related information.
 */

export async function getPaginatedData<T extends ObjectLiteral>(
  entity: string,
  repository: Repository<T>,
  page: number = 1,
  limit: number = 10,
  queryCallback?: (queryBuilder: SelectQueryBuilder<T>) => void
): Promise<{
  status: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  const queryBuilder = repository.createQueryBuilder(entity);

  if (queryCallback) {
    queryCallback(queryBuilder);
  }

  queryBuilder.skip((page - 1) * limit).take(limit);

  const [data, total] = await queryBuilder.getManyAndCount();

  return {
    status: true,
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
