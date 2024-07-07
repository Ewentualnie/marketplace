import { MigrationInterface, QueryRunner } from "typeorm";

export class Booking1720324045867 implements MigrationInterface {
    name = 'Booking1720324045867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" ADD "isBooked" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "isBooked"`);
    }

}
