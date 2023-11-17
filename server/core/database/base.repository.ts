import { injectable, unmanaged } from 'inversify';

import { DatabaseClient } from './database.client';

@injectable()
export class BaseRepository<TEntity extends Record<string, unknown>> {
  constructor(@unmanaged() protected readonly entityName: string, @unmanaged() protected readonly databaseClient: DatabaseClient) {
  }

  async create(entity: Partial<TEntity>): Promise<number> {
    const entityKeys = Object.keys(entity);

    const [query, params] = this.databaseClient.escapeQueryWithParameters(`
      INSERT INTO "${this.entityName}" (${entityKeys.map((key) => `"${key}"`).join(', ')})
      VALUES (${entityKeys.map((key) => `:${key}`).join(', ')})
      RETURNING "id"
      ;
    `, entity);

    const res = await this.databaseClient.query(query, params);

    return res.rows[0].id;
  }

  async find(options: Partial<TEntity> = {}): Promise<TEntity[]> {
    const [query, params] = this.databaseClient.escapeQueryWithParameters(`
    ${this.getSelectSql(options)}
    ;
    `, options);

    const res = await this.databaseClient.query<TEntity>(query, params);

    return res.rows;
  }

  async findOne(options: Partial<TEntity> = {}): Promise<TEntity | undefined> {
    const [query, params] = this.databaseClient.escapeQueryWithParameters(`
    ${this.getSelectSql(options)}
    LIMIT 1
    ;
    `, options);

    const res = await this.databaseClient.query<TEntity>(query, params);

    return res.rows[0];
  }

  private getSelectSql(options: Partial<TEntity>): string {
    return `
    SELECT * FROM "${this.entityName}"
    WHERE TRUE
    ${Object.keys(options).map(
    (key) => `AND "${this.entityName}"."${key}" = :${key}`,
  ).join('\n')}
    `;
  }
}
