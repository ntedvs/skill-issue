ALTER TABLE "reports" RENAME COLUMN "overallMatchScore" TO "resumeScreeningChance";--> statement-breakpoint
ALTER TABLE "reports" RENAME COLUMN "matchingSkills" TO "strengthFactors";--> statement-breakpoint
ALTER TABLE "reports" RENAME COLUMN "missingSkills" TO "weaknessFactors";--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "improvementRoadmap" text NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "jobRequiredSkills";--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "recommendations";--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "skillsToLearn";--> statement-breakpoint
ALTER TABLE "reports" DROP COLUMN "strengthsToHighlight";