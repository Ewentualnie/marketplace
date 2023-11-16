import { MigrationInterface, QueryRunner } from "typeorm";

export class Countries1700132003561 implements MigrationInterface {
    name = 'Countries1700132003561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_feedback" DROP CONSTRAINT "FK_e4cc25c220dea064df29485e39a"`);
        await queryRunner.query(`ALTER TABLE "user_feedback" DROP CONSTRAINT "FK_25462eeffae3a9d782a90bc59c7"`);
        await queryRunner.query(`CREATE TABLE "country" ("id" SERIAL NOT NULL, "countryEn" character varying, "countryUa" character varying, CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "country" integer`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_5cb2b3e0419a73a360d327d497f" FOREIGN KEY ("country") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_feedback" ADD CONSTRAINT "FK_25462eeffae3a9d782a90bc59c7" FOREIGN KEY ("feedbackId") REFERENCES "feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_feedback" ADD CONSTRAINT "FK_e4cc25c220dea064df29485e39a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_feedback" DROP CONSTRAINT "FK_e4cc25c220dea064df29485e39a"`);
        await queryRunner.query(`ALTER TABLE "user_feedback" DROP CONSTRAINT "FK_25462eeffae3a9d782a90bc59c7"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_5cb2b3e0419a73a360d327d497f"`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "country" character varying`);
        await queryRunner.query(`DROP TABLE "country"`);
        await queryRunner.query(`ALTER TABLE "user_feedback" ADD CONSTRAINT "FK_25462eeffae3a9d782a90bc59c7" FOREIGN KEY ("feedbackId") REFERENCES "feedback"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_feedback" ADD CONSTRAINT "FK_e4cc25c220dea064df29485e39a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
