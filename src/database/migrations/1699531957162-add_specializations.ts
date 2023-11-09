import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSpecializations1699531957162 implements MigrationInterface {
    name = 'AddSpecializations1699531957162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_feedback" DROP CONSTRAINT "FK_25462eeffae3a9d782a90bc59c7"`);
        await queryRunner.query(`ALTER TABLE "user_feedback" DROP CONSTRAINT "FK_e4cc25c220dea064df29485e39a"`);
        await queryRunner.query(`CREATE TABLE "specialization" ("id" SERIAL NOT NULL, "specialization" character varying NOT NULL, CONSTRAINT "PK_904dfcbdb57f56f5b57b9c09cc5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_specializations" ("specializationId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_c6556e0689b661e632758225ae4" PRIMARY KEY ("specializationId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_780f9620d2243a1d6def259133" ON "users_specializations" ("specializationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_95cb6b5eedc0c4934fea7241c7" ON "users_specializations" ("userId") `);
        await queryRunner.query(`CREATE TABLE "user_specializations" ("userId" integer NOT NULL, "specializationId" integer NOT NULL, CONSTRAINT "PK_d151a411e20ed4b8690d72671a7" PRIMARY KEY ("userId", "specializationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f18c44ccd0c8bb98769d2551d8" ON "user_specializations" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_47fd98a7fa047980ab9dd8c432" ON "user_specializations" ("specializationId") `);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "user_feedback" ADD CONSTRAINT "FK_25462eeffae3a9d782a90bc59c7" FOREIGN KEY ("feedbackId") REFERENCES "feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_feedback" ADD CONSTRAINT "FK_e4cc25c220dea064df29485e39a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_specializations" ADD CONSTRAINT "FK_780f9620d2243a1d6def259133f" FOREIGN KEY ("specializationId") REFERENCES "specialization"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_specializations" ADD CONSTRAINT "FK_95cb6b5eedc0c4934fea7241c75" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_specializations" ADD CONSTRAINT "FK_f18c44ccd0c8bb98769d2551d89" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_specializations" ADD CONSTRAINT "FK_47fd98a7fa047980ab9dd8c432b" FOREIGN KEY ("specializationId") REFERENCES "specialization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_specializations" DROP CONSTRAINT "FK_47fd98a7fa047980ab9dd8c432b"`);
        await queryRunner.query(`ALTER TABLE "user_specializations" DROP CONSTRAINT "FK_f18c44ccd0c8bb98769d2551d89"`);
        await queryRunner.query(`ALTER TABLE "users_specializations" DROP CONSTRAINT "FK_95cb6b5eedc0c4934fea7241c75"`);
        await queryRunner.query(`ALTER TABLE "users_specializations" DROP CONSTRAINT "FK_780f9620d2243a1d6def259133f"`);
        await queryRunner.query(`ALTER TABLE "user_feedback" DROP CONSTRAINT "FK_e4cc25c220dea064df29485e39a"`);
        await queryRunner.query(`ALTER TABLE "user_feedback" DROP CONSTRAINT "FK_25462eeffae3a9d782a90bc59c7"`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`DROP INDEX "public"."IDX_47fd98a7fa047980ab9dd8c432"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f18c44ccd0c8bb98769d2551d8"`);
        await queryRunner.query(`DROP TABLE "user_specializations"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_95cb6b5eedc0c4934fea7241c7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_780f9620d2243a1d6def259133"`);
        await queryRunner.query(`DROP TABLE "users_specializations"`);
        await queryRunner.query(`DROP TABLE "specialization"`);
        await queryRunner.query(`ALTER TABLE "user_feedback" ADD CONSTRAINT "FK_e4cc25c220dea064df29485e39a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_feedback" ADD CONSTRAINT "FK_25462eeffae3a9d782a90bc59c7" FOREIGN KEY ("feedbackId") REFERENCES "feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
