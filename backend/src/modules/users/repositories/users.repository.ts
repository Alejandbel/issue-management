import { inject, injectable } from 'inversify';

import { User, UserWithRole } from '../types';

import { DatabaseClient, BaseRepository } from '@modules/core';

@injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@inject(DatabaseClient) databaseClient: DatabaseClient) {
    super('user', databaseClient);
  }

  async findOneWithRole(options: Partial<User> = {}): Promise<UserWithRole | undefined> {
    const [query, params] = this.databaseClient.escapeQueryWithParameters(
      `
          SELECT "user"."id",
                 "user"."email",
                 "user"."name",
                 "user"."startWorksAt",
                 "user"."endWorksAt",
                 "er"."title" AS "role"
          FROM "user"
                   INNER JOIN "employee_role" "er" ON "user"."roleId" = "er"."id"
          WHERE TRUE
            ${this.formWhereClause(options)}
          LIMIT 1
      `,
      options,
    );

    const result = await this.databaseClient.query<UserWithRole>(query, params);
    return result.rows[0];
  }
}
