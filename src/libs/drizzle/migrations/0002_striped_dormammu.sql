CREATE TABLE IF NOT EXISTS "teams" (
	"id" varchar NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "students" ADD COLUMN "team_id" varchar;