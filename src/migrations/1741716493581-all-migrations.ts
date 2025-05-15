import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllMigrations1741716493581 implements MigrationInterface {
  name = 'AllMigrations1741716493581';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "description" text, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "domains" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "key" character varying(255) NOT NULL, "color" character varying(7), "status" boolean NOT NULL DEFAULT false, "embedded_code" text, "sale_email" character varying(255), "google_ga4_key" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" integer NOT NULL, CONSTRAINT "UQ_f36af68a2defaa8ae5fdd9b5640" UNIQUE ("name"), CONSTRAINT "UQ_b9ce657eb173ba1aced88e30bf2" UNIQUE ("key"), CONSTRAINT "PK_05a6b087662191c2ea7f7ddfc4d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "3dwheels" ("id" SERIAL NOT NULL, "wheel" character varying(255) NOT NULL, "style_id" character varying(255) NOT NULL, "wheel_picture" character varying(255) NOT NULL, "brand" character varying(255) NOT NULL, "model" character varying(255) NOT NULL, "submodel" character varying(255), "model_size" character varying(50) NOT NULL, "customizable" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5ecb74913b107994e0df53d4579" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "request" ("id" SERIAL NOT NULL, "message" text, "status" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "company_id" integer NOT NULL, "user_id" integer NOT NULL, "wheel_id" integer NOT NULL, CONSTRAINT "PK_167d324701e6867f189aed52e18" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "company" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "primary_contact_name" character varying(255), "primary_contact_email" character varying(255), "logo" character varying(255), "is_active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a76c5cd486f7779bd9c319afd27" UNIQUE ("name"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_tokens_type_enum" AS ENUM('account_verification', 'reset_password')`
    );
    await queryRunner.query(
      `CREATE TABLE "user_tokens" ("id" SERIAL NOT NULL, "code" character varying(255) NOT NULL, "type" "public"."user_tokens_type_enum" NOT NULL, "is_used" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "expired_at" TIMESTAMP NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_63764db9d9aaa4af33e07b2f4bf" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_login_histories" ("id" SERIAL NOT NULL, "login_at" TIMESTAMP NOT NULL DEFAULT now(), "ip_address" character varying(255) NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_24de45b93d9f32965fdfba6b64e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "first_name" character varying(255) NOT NULL, "last_name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "is_active" boolean NOT NULL DEFAULT false, "is_verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "role_id" integer NOT NULL, "company_id" integer, "requests_id" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "company_product_wheel_mappings" ("id" SERIAL NOT NULL, "external_product_id" character varying(255) NOT NULL, "wheel_id" character varying(255) NOT NULL, "is_active" smallint NOT NULL DEFAULT '0', "company_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3545fc5edae3d3837faaf3866f5" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "domains" ADD CONSTRAINT "FK_a5b4a4004b6504f17f77a435bb0" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "request" ADD CONSTRAINT "FK_5db5cab8a309bd0e5fb0c5fa80a" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "request" ADD CONSTRAINT "FK_3a3d93f532a056b0d89d09cdd21" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "request" ADD CONSTRAINT "FK_75a2014b40348f08fe9370c6fea" FOREIGN KEY ("wheel_id") REFERENCES "3dwheels"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_tokens" ADD CONSTRAINT "FK_9e144a67be49e5bba91195ef5de" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_login_histories" ADD CONSTRAINT "FK_e26d65d603125818a6bc193a015" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_7ae6334059289559722437bcc1c" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_d8a5e92421a4e7c7382cbf14198" FOREIGN KEY ("requests_id") REFERENCES "request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_d8a5e92421a4e7c7382cbf14198"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_7ae6334059289559722437bcc1c"`
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_login_histories" DROP CONSTRAINT "FK_e26d65d603125818a6bc193a015"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_tokens" DROP CONSTRAINT "FK_9e144a67be49e5bba91195ef5de"`
    );
    await queryRunner.query(
      `ALTER TABLE "request" DROP CONSTRAINT "FK_75a2014b40348f08fe9370c6fea"`
    );
    await queryRunner.query(
      `ALTER TABLE "request" DROP CONSTRAINT "FK_3a3d93f532a056b0d89d09cdd21"`
    );
    await queryRunner.query(
      `ALTER TABLE "request" DROP CONSTRAINT "FK_5db5cab8a309bd0e5fb0c5fa80a"`
    );
    await queryRunner.query(
      `ALTER TABLE "domains" DROP CONSTRAINT "FK_a5b4a4004b6504f17f77a435bb0"`
    );
    await queryRunner.query(`DROP TABLE "company_product_wheel_mappings"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "user_login_histories"`);
    await queryRunner.query(`DROP TABLE "user_tokens"`);
    await queryRunner.query(`DROP TYPE "public"."user_tokens_type_enum"`);
    await queryRunner.query(`DROP TABLE "company"`);
    await queryRunner.query(`DROP TABLE "request"`);
    await queryRunner.query(`DROP TABLE "3dwheels"`);
    await queryRunner.query(`DROP TABLE "domains"`);
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
