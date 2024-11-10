CREATE TABLE IF NOT EXISTS "challenges" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "students_to_challenge" (
	"student_id" varchar NOT NULL,
	"challenge_id" varchar NOT NULL,
	"status" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "students_to_challenge" ADD CONSTRAINT "students_to_challenge_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "students_to_challenge" ADD CONSTRAINT "students_to_challenge_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
