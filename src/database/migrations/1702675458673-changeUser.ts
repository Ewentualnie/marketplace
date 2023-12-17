import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUser1702675458673 implements MigrationInterface {
    name = 'ChangeUser1702675458673'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advert_likes" DROP CONSTRAINT "FK_b42fcff810b992d5c4bba500f0e"`);
        await queryRunner.query(`ALTER TABLE "advert_likes" DROP CONSTRAINT "FK_61e7fe1eb965ef1ad81a7c4dd7a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_61e7fe1eb965ef1ad81a7c4dd7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b42fcff810b992d5c4bba500f0"`);
        await queryRunner.query(`ALTER TABLE "advert_likes" DROP CONSTRAINT "PK_a2dc7d9e0b6a6f3cd6bde1114f8"`);
        await queryRunner.query(`ALTER TABLE "advert_likes" ADD CONSTRAINT "PK_b42fcff810b992d5c4bba500f0e" PRIMARY KEY ("userId")`);
        await queryRunner.query(`ALTER TABLE "advert_likes" DROP COLUMN "advertId"`);
        await queryRunner.query(`ALTER TABLE "advert_likes" DROP CONSTRAINT "PK_b42fcff810b992d5c4bba500f0e"`);
        await queryRunner.query(`ALTER TABLE "advert_likes" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "favoriteAdverts"`);
        await queryRunner.query(`ALTER TABLE "advert_likes" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "advert_likes" ADD CONSTRAINT "PK_52ceb8655220bf136f3f0d7bb5d" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "advert_likes" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "advert_likes" ADD "advert_id" integer`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "advert_likes" ADD CONSTRAINT "FK_5962e780a89d6980db361b4fa4f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advert_likes" ADD CONSTRAINT "FK_4b4ac7241f99a7d087e9967d5a6" FOREIGN KEY ("advert_id") REFERENCES "advert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advert_likes" DROP CONSTRAINT "FK_4b4ac7241f99a7d087e9967d5a6"`);
        await queryRunner.query(`ALTER TABLE "advert_likes" DROP CONSTRAINT "FK_5962e780a89d6980db361b4fa4f"`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "advert_likes" DROP COLUMN "advert_id"`);
        await queryRunner.query(`ALTER TABLE "advert_likes" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "advert_likes" DROP CONSTRAINT "PK_52ceb8655220bf136f3f0d7bb5d"`);
        await queryRunner.query(`ALTER TABLE "advert_likes" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "favoriteAdverts" integer array`);
        await queryRunner.query(`ALTER TABLE "advert_likes" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "advert_likes" ADD CONSTRAINT "PK_b42fcff810b992d5c4bba500f0e" PRIMARY KEY ("userId")`);
        await queryRunner.query(`ALTER TABLE "advert_likes" ADD "advertId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "advert_likes" DROP CONSTRAINT "PK_b42fcff810b992d5c4bba500f0e"`);
        await queryRunner.query(`ALTER TABLE "advert_likes" ADD CONSTRAINT "PK_a2dc7d9e0b6a6f3cd6bde1114f8" PRIMARY KEY ("advertId", "userId")`);
        await queryRunner.query(`CREATE INDEX "IDX_b42fcff810b992d5c4bba500f0" ON "advert_likes" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_61e7fe1eb965ef1ad81a7c4dd7" ON "advert_likes" ("advertId") `);
        await queryRunner.query(`ALTER TABLE "advert_likes" ADD CONSTRAINT "FK_61e7fe1eb965ef1ad81a7c4dd7a" FOREIGN KEY ("advertId") REFERENCES "advert"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "advert_likes" ADD CONSTRAINT "FK_b42fcff810b992d5c4bba500f0e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
