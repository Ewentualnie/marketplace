import { MigrationInterface, QueryRunner } from "typeorm";

export class New1712658429907 implements MigrationInterface {
    name = 'New1712658429907'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
    }

}
