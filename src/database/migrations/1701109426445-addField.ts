import { MigrationInterface, QueryRunner } from "typeorm";

export class AddField1701109426445 implements MigrationInterface {
    name = 'AddField1701109426445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "advert_likes_user" ("advertId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_86e08d37988e6024b7fc266d003" PRIMARY KEY ("advertId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_35aa09ac1edc6d575311bb7dde" ON "advert_likes_user" ("advertId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9de3cb17dd3faadbc7eb713215" ON "advert_likes_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "advert_likes_user" ADD CONSTRAINT "FK_35aa09ac1edc6d575311bb7ddee" FOREIGN KEY ("advertId") REFERENCES "advert"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "advert_likes_user" ADD CONSTRAINT "FK_9de3cb17dd3faadbc7eb7132158" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advert_likes_user" DROP CONSTRAINT "FK_9de3cb17dd3faadbc7eb7132158"`);
        await queryRunner.query(`ALTER TABLE "advert_likes_user" DROP CONSTRAINT "FK_35aa09ac1edc6d575311bb7ddee"`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9de3cb17dd3faadbc7eb713215"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_35aa09ac1edc6d575311bb7dde"`);
        await queryRunner.query(`DROP TABLE "advert_likes_user"`);
    }

}
