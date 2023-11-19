import { injectable, unmanaged } from 'inversify';

import { DatabaseClient } from './database.client';

import { SortDirection } from '@modules/core';

@injectable()
export class BaseRepository<TEntity extends Record<string, unknown> & { id: number }> {
  constructor(
    @unmanaged() protected readonly entityName: string,
    @unmanaged() protected readonly databaseClient: DatabaseClient,
  ) {}

  async create(entity: Partial<TEntity>): Promise<number> {
    const entityKeys = Object.keys(entity);

    const [query, params] = this.databaseClient.escapeQueryWithParameters(
      `
          INSERT INTO "${this.entityName}" (${entityKeys.map((key) => `"${key}"`).join(', ')})
          VALUES (${entityKeys.map((key) => `:${key}`).join(', ')})
          RETURNING "id"
          ;
      `,
      entity,
    );

    const res = await this.databaseClient.query(query, params);

    return res.rows[0].id;
  }

  async updateById(id: number, set: Partial<Omit<TEntity, 'id'>>): Promise<number> {
    if (!set || !Object.keys(set).length) {
      return 0;
    }

    const setKeys = Object.keys(set);

    const [query, params] = this.databaseClient.escapeQueryWithParameters(
      `
          UPDATE "${this.entityName}"
          SET ${setKeys.map((key) => `"${key}" = :${key}`).join(', ')}
          WHERE "id" = :id
          RETURNING "id"
          ;
      `,
      { ...set, id },
    );

    const res = await this.databaseClient.query(query, params);

    return res.rows.length;
  }

  async find(
    options: Partial<TEntity> = {},
    pagination: { limit?: number; offset?: number } = {},
    { sortField, sortDirection }: { sortField?: keyof TEntity; sortDirection?: SortDirection } = {},
  ): Promise<TEntity[]> {
    const [query, params] = this.databaseClient.escapeQueryWithParameters(
      `
          SELECT *
          FROM "${this.entityName}"
          WHERE TRUE
              ${this.formWhereClause(options)}
          ${pagination.limit ? ' LIMIT :limit' : ''} 
          ${pagination.offset ? ' OFFSET :offset' : ''}
          ${sortField && sortDirection ? ` ORDER BY "${this.entityName}" ${sortDirection}` : ''}
          ;
      `,
      { ...options, ...pagination },
    );

    const res = await this.databaseClient.query<TEntity>(query, params);

    return res.rows;
  }

  protected formWhereClause(options: Partial<TEntity>, entityName: string = this.entityName): string {
    return Object.keys(options)
      .map((key) => `AND "${entityName}"."${key}" = :${key}`)
      .join('\n');
  }

  async findOne(options: Partial<TEntity> = {}): Promise<TEntity | undefined> {
    const res = await this.find(options, { limit: 1 });
    return res[0];
  }
}
