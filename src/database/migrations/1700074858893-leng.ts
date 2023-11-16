import { MigrationInterface, QueryRunner } from "typeorm";

export class Leng1700074858893 implements MigrationInterface {
    name = 'Leng1700074858893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_feedback" DROP CONSTRAINT "FK_e4cc25c220dea064df29485e39a"`);
        await queryRunner.query(`ALTER TABLE "user_feedback" DROP CONSTRAINT "FK_25462eeffae3a9d782a90bc59c7"`);
        await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "language"`);
        await queryRunner.query(`ALTER TABLE "language" ADD "languageEn" character varying`);
        await queryRunner.query(`ALTER TABLE "language" ADD "languageUa" character varying`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "user_feedback" ADD CONSTRAINT "FK_25462eeffae3a9d782a90bc59c7" FOREIGN KEY ("feedbackId") REFERENCES "feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_feedback" ADD CONSTRAINT "FK_e4cc25c220dea064df29485e39a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_feedback" DROP CONSTRAINT "FK_e4cc25c220dea064df29485e39a"`);
        await queryRunner.query(`ALTER TABLE "user_feedback" DROP CONSTRAINT "FK_25462eeffae3a9d782a90bc59c7"`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "languageUa"`);
        await queryRunner.query(`ALTER TABLE "language" DROP COLUMN "languageEn"`);
        await queryRunner.query(`ALTER TABLE "language" ADD "language" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_feedback" ADD CONSTRAINT "FK_25462eeffae3a9d782a90bc59c7" FOREIGN KEY ("feedbackId") REFERENCES "feedback"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_feedback" ADD CONSTRAINT "FK_e4cc25c220dea064df29485e39a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
