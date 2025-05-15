import { MigrationInterface, QueryRunner } from 'typeorm';

export class Files1742233495626 implements MigrationInterface {
  name = 'Files1742233495626';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "files" (
        "id" SERIAL NOT NULL,
        "path" character varying(500) NOT NULL,
        "size" bigint,
        "mimetype" character varying(255),
        "updatedById" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_6c16b9093a142e0e935b3c47c6d" PRIMARY KEY ("id")
      )`
    );

    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_UpdatedBy_User" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files" DROP CONSTRAINT "FK_UpdatedBy_User"`
    );
    await queryRunner.query(`DROP TABLE "files"`);
  }
}
