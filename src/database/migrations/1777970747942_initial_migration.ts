import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration_1777970747942 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {

    // ─── AUTH ───────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TYPE "roles_admin_enum" AS ENUM ('admin', 'superadmin');
    `);

    await queryRunner.query(`
      CREATE TABLE "auth" (
        "id"            SERIAL PRIMARY KEY,
        "username"      VARCHAR        NOT NULL UNIQUE,
        "name"          VARCHAR        NOT NULL,
        "email"         VARCHAR        NOT NULL UNIQUE,
        "password"      VARCHAR        NOT NULL,
        "role"          "roles_admin_enum" NOT NULL DEFAULT 'admin',
        "refresh_token" VARCHAR,
        "otp"           VARCHAR,
        "otp_time"      BIGINT,
        "created_at"    TIMESTAMP      NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMP      NOT NULL DEFAULT now(),
        "deleted_at"    TIMESTAMP
      );
    `);

    // ─── TEACHER ────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "teacher" (
        "id"         SERIAL PRIMARY KEY,
        "name"       VARCHAR NOT NULL,
        "phone"      VARCHAR NOT NULL UNIQUE,
        "image"      VARCHAR,
        "direction"  VARCHAR NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP
      );
    `);

    // ─── STUDENT ────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "student" (
        "id"           SERIAL PRIMARY KEY,
        "name"         VARCHAR        NOT NULL,
        "phone"        VARCHAR        NOT NULL UNIQUE,
        "parent_name"  VARCHAR        NOT NULL,
        "parent_phone" VARCHAR        NOT NULL,
        "balance"      DECIMAL(10,2)  NOT NULL DEFAULT 0,
        "created_at"   TIMESTAMP      NOT NULL DEFAULT now(),
        "updated_at"   TIMESTAMP      NOT NULL DEFAULT now(),
        "deleted_at"   TIMESTAMP
      );
    `);

    // ─── GROUP ──────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TYPE "week_days_enum"   AS ENUM ('odd', 'even');
      CREATE TYPE "lesson_time_enum" AS ENUM ('10:00-12:00', '14:30-16:30', '17:00-19:00');
    `);

    await queryRunner.query(`
      CREATE TABLE "group" (
        "id"          SERIAL PRIMARY KEY,
        "name"        VARCHAR            NOT NULL,
        "direction"   VARCHAR            NOT NULL,
        "week_days"   "week_days_enum"   NOT NULL,
        "lesson_time" "lesson_time_enum" NOT NULL,
        "monthly_fee" DECIMAL(10,2)      NOT NULL,
        "teacher_id"  INT,
        "created_at"  TIMESTAMP          NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMP          NOT NULL DEFAULT now(),
        "deleted_at"  TIMESTAMP,
        CONSTRAINT "fk_group_teacher"
          FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE SET NULL
      );
    `);

    // ─── GROUP_STUDENTS (junction) ──────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "group_students" (
        "group_id"   INT NOT NULL,
        "student_id" INT NOT NULL,
        PRIMARY KEY ("group_id", "student_id"),
        CONSTRAINT "fk_gs_group"
          FOREIGN KEY ("group_id")   REFERENCES "group"("id")   ON DELETE CASCADE,
        CONSTRAINT "fk_gs_student"
          FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE
      );
    `);

    // ─── PAYMENT ────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TYPE "payment_method_enum" AS ENUM ('cash', 'card', 'transfer');
    `);

    await queryRunner.query(`
      CREATE TABLE "payment" (
        "id"          SERIAL PRIMARY KEY,
        "amount"      DECIMAL(10,2)        NOT NULL,
        "method"      "payment_method_enum" NOT NULL DEFAULT 'cash',
        "description" VARCHAR,
        "month"       VARCHAR(7)           NOT NULL,
        "student_id"  INT                  NOT NULL,
        "admin_id"    INT,
        "created_at"  TIMESTAMP            NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMP            NOT NULL DEFAULT now(),
        "deleted_at"  TIMESTAMP,
        CONSTRAINT "fk_payment_student"
          FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_payment_admin"
          FOREIGN KEY ("admin_id")   REFERENCES "auth"("id")    ON DELETE SET NULL
      );
    `);

    // ─── ATTENDANCE ─────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TYPE "attendance_status_enum" AS ENUM ('present', 'absent', 'late');
    `);

    await queryRunner.query(`
      CREATE TABLE "attendance" (
        "id"         SERIAL PRIMARY KEY,
        "date"       DATE                     NOT NULL,
        "status"     "attendance_status_enum"  NOT NULL DEFAULT 'present',
        "student_id" INT                       NOT NULL,
        "group_id"   INT                       NOT NULL,
        "admin_id"   INT,
        "created_at" TIMESTAMP                 NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP                 NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "fk_attendance_student"
          FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_attendance_group"
          FOREIGN KEY ("group_id")   REFERENCES "group"("id")   ON DELETE CASCADE,
        CONSTRAINT "fk_attendance_admin"
          FOREIGN KEY ("admin_id")   REFERENCES "auth"("id")    ON DELETE SET NULL,
        -- One record per student per group per day
        CONSTRAINT "uq_attendance_student_group_date"
          UNIQUE ("student_id", "group_id", "date")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "attendance"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "attendance_status_enum"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "payment"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payment_method_enum"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "group_students"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "group"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "lesson_time_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "week_days_enum"`);

    await queryRunner.query(`DROP TABLE IF EXISTS "student"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "teacher"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "auth"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "roles_admin_enum"`);
  }
}