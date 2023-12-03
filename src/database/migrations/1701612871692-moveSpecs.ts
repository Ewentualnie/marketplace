import { MigrationInterface, QueryRunner } from "typeorm";

export class MoveSpecs1701612871692 implements MigrationInterface {
    name = 'MoveSpecs1701612871692'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "adverts_specializations" ("specializationId" integer NOT NULL, "advertId" integer NOT NULL, CONSTRAINT "PK_4f8c55f301a6fb60636fc8a96f3" PRIMARY KEY ("specializationId", "advertId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_220b3a0ed76876797d77d22d4b" ON "adverts_specializations" ("specializationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c198272c66d3efb41c7c2b0e48" ON "adverts_specializations" ("advertId") `);
        await queryRunner.query(`CREATE TABLE "advert_specializations" ("advertId" integer NOT NULL, "specializationId" integer NOT NULL, CONSTRAINT "PK_07d4c30377b88c951bb1f4fef29" PRIMARY KEY ("advertId", "specializationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_29f1472e1417dd7b1d77b30c3f" ON "advert_specializations" ("advertId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c064f8ba0021dd408cca4307c7" ON "advert_specializations" ("specializationId") `);
        await queryRunner.query(`ALTER TABLE "mail" ALTER COLUMN "isReaded" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "adverts_specializations" ADD CONSTRAINT "FK_220b3a0ed76876797d77d22d4b3" FOREIGN KEY ("specializationId") REFERENCES "specialization"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "adverts_specializations" ADD CONSTRAINT "FK_c198272c66d3efb41c7c2b0e480" FOREIGN KEY ("advertId") REFERENCES "advert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advert_specializations" ADD CONSTRAINT "FK_29f1472e1417dd7b1d77b30c3f6" FOREIGN KEY ("advertId") REFERENCES "advert"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "advert_specializations" ADD CONSTRAINT "FK_c064f8ba0021dd408cca4307c71" FOREIGN KEY ("specializationId") REFERENCES "specialization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advert_specializations" DROP CONSTRAINT "FK_c064f8ba0021dd408cca4307c71"`);
        await queryRunner.query(`ALTER TABLE "advert_specializations" DROP CONSTRAINT "FK_29f1472e1417dd7b1d77b30c3f6"`);
        await queryRunner.query(`ALTER TABLE "adverts_specializations" DROP CONSTRAINT "FK_c198272c66d3efb41c7c2b0e480"`);
        await queryRunner.query(`ALTER TABLE "adverts_specializations" DROP CONSTRAINT "FK_220b3a0ed76876797d77d22d4b3"`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "mail" ALTER COLUMN "isReaded" DROP DEFAULT`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c064f8ba0021dd408cca4307c7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_29f1472e1417dd7b1d77b30c3f"`);
        await queryRunner.query(`DROP TABLE "advert_specializations"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c198272c66d3efb41c7c2b0e48"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_220b3a0ed76876797d77d22d4b"`);
        await queryRunner.query(`DROP TABLE "adverts_specializations"`);
    }

}
