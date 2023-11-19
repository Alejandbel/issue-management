-- Up Migration
INSERT INTO "employee_role" ("title")
VALUES ('user'),
       ('admin'),
       ('project_manager'),
       ('sales');

-- Down Migration
DELETE FROM "employee_role"
WHERE "title" IN ('user', 'admin', 'project_manager', 'sales')
