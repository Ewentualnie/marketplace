import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1700846654861 implements MigrationInterface {
    name = 'Test1700846654861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_fefc350f416e262e904dcf6b35e"`);
        await queryRunner.query(`ALTER TABLE "feedback" DROP COLUMN "toUserId"`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD "to_user" integer`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD "from_user" integer`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "imagePath" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_98acbc5c76b68d477c32765d16d" FOREIGN KEY ("to_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_dea0ccf246161e5e7d46f1bf9fd" FOREIGN KEY ("from_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_dea0ccf246161e5e7d46f1bf9fd"`);
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_98acbc5c76b68d477c32765d16d"`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "imagePath" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "feedback" DROP COLUMN "from_user"`);
        await queryRunner.query(`ALTER TABLE "feedback" DROP COLUMN "to_user"`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD "toUserId" integer`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_fefc350f416e262e904dcf6b35e" FOREIGN KEY ("toUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
