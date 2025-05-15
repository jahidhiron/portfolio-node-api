import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddManagedByCol1743082480949 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "company" ADD "managed_by" integer`);
    await queryRunner.query(`ALTER TABLE "domains" ADD "managed_by" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "managed_by"`);
    await queryRunner.query(`ALTER TABLE "domains" DROP COLUMN "managed_by"`);
  }
}
