CREATE TYPE "OS" AS ENUM ('Windows', 'Linux', 'MacOS');

CREATE TABLE IF NOT EXISTS developer_infos (
  "id" BIGSERIAL PRIMARY KEY,
  "developerSince" DATE NOT NULL,
  "preferredOS" "OS" NOT NULL
);

CREATE TABLE IF NOT EXISTS developers (
  "id" BIGSERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL,
  "email" VARCHAR(50) NOT NULL UNIQUE,
  "developerInfoId" BIGINT UNIQUE,
  FOREIGN KEY ("developerInfoId") REFERENCES developer_infos("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS projects (
  "id" BIGSERIAL PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL,
  "description" TEXT NOT NULL,
  "estimatedTime" VARCHAR(20) NOT NULL,
  "repository" VARCHAR(120) NOT NULL,
  "startDate" DATE NOT NULL,
  "endDate" DATE,
  "developerId" BIGINT NOT NULL REFERENCES developers("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS technologies (
  "id" BIGSERIAL PRIMARY KEY,
  "name" VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS projects_technologies (
  "id" BIGSERIAL PRIMARY KEY,
  "AddedIn" DATE NOT NULL,
  "projectId" BIGINT NOT NULL REFERENCES projects("id") ON DELETE CASCADE,
  "technologyId" BIGINT REFERENCES technologies("id")
);

INSERT INTO technologies ("name")
VALUES
  ('JavaScript'),
  ('Python'),
  ('React'),
  ('Express.js'),
  ('HTML'),
  ('CSS'),
  ('Django'),
  ('PostgreSQL'),
  ('MongoDB');