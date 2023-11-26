import { MigrationInterface, QueryRunner } from "typeorm";

export class Countries1700991590021 implements MigrationInterface {
    name = 'Countries1700991590021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "country" DROP COLUMN "countryEn"`);
        await queryRunner.query(`ALTER TABLE "country" DROP COLUMN "countryUa"`);
        await queryRunner.query(`ALTER TABLE "country" ADD "alpha2" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "country" ADD CONSTRAINT "UQ_05bb99dff5ece9e1234a48bf0da" UNIQUE ("alpha2")`);
        await queryRunner.query(`ALTER TABLE "language" ADD "alpha2" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "language" ADD CONSTRAINT "UQ_d72425d86fbf13a89b0ff4230d8" UNIQUE ("alpha2")`);
        await queryRunner.query(`ALTER TABLE "language" ALTER COLUMN "languageEn" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "language" ALTER COLUMN "languageUa" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "language" ALTER COLUMN "languageUa" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "language" ALTER COLUMN "languageEn" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "language" DROP CONSTRAINT "UQ_d72425d86fbf13a89b0ff4230d8"`);
        await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "alpha2"`);
        await queryRunner.query(`ALTER TABLE "country" DROP CONSTRAINT "UQ_05bb99dff5ece9e1234a48bf0da"`);
        await queryRunner.query(`ALTER TABLE "country" DROP COLUMN "alpha2"`);
        await queryRunner.query(`ALTER TABLE "country" ADD "countryUa" character varying`);
        await queryRunner.query(`ALTER TABLE "country" ADD "countryEn" character varying`);
    }

}
