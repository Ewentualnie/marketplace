import { MigrationInterface, QueryRunner } from "typeorm";

export class A1701208074843 implements MigrationInterface {
    name = 'A1701208074843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "rating" double precision NOT NULL DEFAULT '5'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "rating" integer NOT NULL DEFAULT '5'`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
    }

}
