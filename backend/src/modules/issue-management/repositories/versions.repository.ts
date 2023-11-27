import { inject, injectable } from 'inversify';

import { DatabaseClient, BaseRepository, SortDirection } from '@modules/core';

import { Version, VersionWithIssues } from '../types';

@injectable()
export class VersionsRepository extends BaseRepository<Version> {
  constructor(@inject(DatabaseClient) databaseClient: DatabaseClient) {
    super('version', databaseClient);
  }

  async findWithIssues(
    where: Partial<Version> = {},
    {
      sortField,
      sortDirection,
      offset,
      limit,
    }: { limit?: number; offset?: number; sortField?: keyof Version; sortDirection?: SortDirection } = {},
  ): Promise<VersionWithIssues[]> {
    const [query, params] = this.databaseClient.escapeQueryWithParameters(
      `
          SELECT "version"."id",
                 "version"."title",
                 "version"."projectId",
                 "version"."startDate",
                 "version"."releaseDate",
                 "version"."createdAt",
                 COALESCE(
                         JSON_AGG(TO_JSONB("issue".*) ||
                                  JSONB_BUILD_OBJECT('type', "issue_type"."title", 'status', "issue_status"."title")),
                         JSON_BUILD_ARRAY()
                     ) AS "issues"
          FROM "version"
                   LEFT JOIN "issue" ON "issue"."versionId" = "version"."id"
                   LEFT JOIN "issue_status" ON "issue"."statusId" = "issue_status"."id"
                   LEFT JOIN "issue_type" ON "issue"."typeId" = "issue_type"."id"
          WHERE TRUE
              ${this.formWhereClause(where)}
          GROUP BY "version"."id", "version"."title", "version"."projectId", "version"."startDate", "version"."releaseDate",
              "version"."createdAt"
          ${
            sortField && sortDirection
              ? ` ORDER BY "${this.entityName}"."${sortField.toString()}" ${sortDirection}`
              : ''
          }
          ${limit ? ' LIMIT :limit' : ''} 
          ${offset ? ' OFFSET :offset' : ''}
          ;
      `,
      { ...where, sortField, sortDirection, offset, limit },
    );

    const res = await this.databaseClient.query<VersionWithIssues>(query, params);

    return res.rows;
  }
}
