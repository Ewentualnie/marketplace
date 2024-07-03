import { MigrationInterface, QueryRunner } from "typeorm";

export class Timeslots1719945017349 implements MigrationInterface {
    name = 'Timeslots1719945017349'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "timeslot" DROP CONSTRAINT "FK_07d9f4ced4681d78a56e4605b51"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_1623431c6b0b303dc22ac38d09a"`);
        await queryRunner.query(`ALTER TABLE "timeslot" RENAME COLUMN "scheduleId" TO "userId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "REL_137987426659ac1570c018c071"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "slotsId"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "timeslot" ADD CONSTRAINT "FK_47d06adf246fcfea1d318423ee3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "timeslot" DROP CONSTRAINT "FK_47d06adf246fcfea1d318423ee3"`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "user" ADD "slotsId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "REL_137987426659ac1570c018c071" UNIQUE ("slotsId")`);
        await queryRunner.query(`ALTER TABLE "timeslot" RENAME COLUMN "userId" TO "scheduleId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_1623431c6b0b303dc22ac38d09a" FOREIGN KEY ("slotsId") REFERENCES "user_slots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "timeslot" ADD CONSTRAINT "FK_07d9f4ced4681d78a56e4605b51" FOREIGN KEY ("scheduleId") REFERENCES "user_slots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
