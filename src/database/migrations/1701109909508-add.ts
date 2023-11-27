import { MigrationInterface, QueryRunner } from "typeorm";

export class Add1701109909508 implements MigrationInterface {
    name = 'Add1701109909508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "advert_likes" ("advertId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_a2dc7d9e0b6a6f3cd6bde1114f8" PRIMARY KEY ("advertId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_61e7fe1eb965ef1ad81a7c4dd7" ON "advert_likes" ("advertId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b42fcff810b992d5c4bba500f0" ON "advert_likes" ("userId") `);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "advert_likes" ADD CONSTRAINT "FK_61e7fe1eb965ef1ad81a7c4dd7a" FOREIGN KEY ("advertId") REFERENCES "advert"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "advert_likes" ADD CONSTRAINT "FK_b42fcff810b992d5c4bba500f0e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advert_likes" DROP CONSTRAINT "FK_b42fcff810b992d5c4bba500f0e"`);
        await queryRunner.query(`ALTER TABLE "advert_likes" DROP CONSTRAINT "FK_61e7fe1eb965ef1ad81a7c4dd7a"`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b42fcff810b992d5c4bba500f0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_61e7fe1eb965ef1ad81a7c4dd7"`);
        await queryRunner.query(`DROP TABLE "advert_likes"`);
    }

}
