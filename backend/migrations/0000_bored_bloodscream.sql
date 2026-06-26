CREATE TYPE "public"."role_enum" AS ENUM('EMP', 'RM', 'APE', 'CFO');--> statement-breakpoint
CREATE TYPE "public"."approval_status_enum" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" "role_enum" DEFAULT 'EMP' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "employee_manager" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"manager_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "employee_manager_employee_id_unique" UNIQUE("employee_id"),
	CONSTRAINT "different_user_check" CHECK ("employee_manager"."employee_id" != "employee_manager"."manager_id")
);
--> statement-breakpoint
CREATE TABLE "reimbursements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"amount" numeric NOT NULL,
	"rm_approval" "approval_status_enum" DEFAULT 'PENDING' NOT NULL,
	"ape_approval" "approval_status_enum" DEFAULT 'PENDING' NOT NULL,
	"final_status" "approval_status_enum" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "employee_manager" ADD CONSTRAINT "employee_manager_employee_id_users_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_manager" ADD CONSTRAINT "employee_manager_manager_id_users_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reimbursements" ADD CONSTRAINT "reimbursements_employee_id_users_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;