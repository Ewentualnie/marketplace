import { MigrationInterface, QueryRunner } from "typeorm";

export class Messages1711233367530 implements MigrationInterface {
    name = 'Messages1711233367530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "senderId"`);
        await queryRunner.query(`ALTER TABLE "message" DROP COLUMN "receiverId"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "message" ADD "receiverId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "message" ADD "senderId" integer NOT NULL`);
    }

}
