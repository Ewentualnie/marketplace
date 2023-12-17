import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUser1702674807787 implements MigrationInterface {
    name = 'ChangeUser1702674807787'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advert_likes" DROP CONSTRAINT "FK_b42fcff810b992d5c4bba500f0e"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "favoriteAdverts" integer array`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "advert_likes" ADD CONSTRAINT "FK_b42fcff810b992d5c4bba500f0e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advert_likes" DROP CONSTRAINT "FK_b42fcff810b992d5c4bba500f0e"`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "favoriteAdverts"`);
        await queryRunner.query(`ALTER TABLE "advert_likes" ADD CONSTRAINT "FK_b42fcff810b992d5c4bba500f0e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
