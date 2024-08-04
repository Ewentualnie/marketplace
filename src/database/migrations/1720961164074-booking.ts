import { MigrationInterface, QueryRunner } from "typeorm";

export class Booking1720961164074 implements MigrationInterface {
    name = 'Booking1720961164074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" ADD "advertId" integer`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_d5330dccf1f6e751851b50ab29d" FOREIGN KEY ("advertId") REFERENCES "advert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_d5330dccf1f6e751851b50ab29d"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "advertId"`);
    }

}
