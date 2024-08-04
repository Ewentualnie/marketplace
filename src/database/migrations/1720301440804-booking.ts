import { MigrationInterface, QueryRunner } from "typeorm";

export class Booking1720301440804 implements MigrationInterface {
    name = 'Booking1720301440804'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "studingLanguage"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "isActive" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "languageId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_6c6631333e36f3e3f300129e62f" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_6c6631333e36f3e3f300129e62f"`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "languageId"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "studingLanguage" character varying NOT NULL`);
    }

}
