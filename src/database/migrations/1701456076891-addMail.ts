import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMail1701456076891 implements MigrationInterface {
    name = 'AddMail1701456076891'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mail" ("id" SERIAL NOT NULL, "message" character varying NOT NULL, "writtedAt" TIMESTAMP NOT NULL DEFAULT now(), "isReaded" boolean NOT NULL, "toUserId" integer, "fromUserId" integer, CONSTRAINT "PK_5407da42b983ba54c6c62d462d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "mail" ADD CONSTRAINT "FK_0786c0bc3be6ba4c459da8410fe" FOREIGN KEY ("toUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mail" ADD CONSTRAINT "FK_2072657acad78cf0f0ebf459cba" FOREIGN KEY ("fromUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mail" DROP CONSTRAINT "FK_2072657acad78cf0f0ebf459cba"`);
        await queryRunner.query(`ALTER TABLE "mail" DROP CONSTRAINT "FK_0786c0bc3be6ba4c459da8410fe"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`DROP TABLE "mail"`);
    }

}
