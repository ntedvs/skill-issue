CREATE TABLE "reports" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"resumeId" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"jobUrl" text NOT NULL,
	"jobTitle" text NOT NULL,
	"companyName" text NOT NULL,
	"jobContent" text NOT NULL,
	"scrapingSucceeded" boolean NOT NULL,
	"jobRequiredSkills" text NOT NULL,
	"matchingSkills" text NOT NULL,
	"missingSkills" text NOT NULL,
	"overallMatchScore" text NOT NULL,
	"recommendations" text NOT NULL,
	"skillsToLearn" text NOT NULL,
	"strengthsToHighlight" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_resumeId_resumes_id_fk" FOREIGN KEY ("resumeId") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE no action;