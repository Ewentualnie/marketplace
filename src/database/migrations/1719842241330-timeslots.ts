import { MigrationInterface, QueryRunner } from "typeorm";

export class Timeslots1719842241330 implements MigrationInterface {
    name = 'Timeslots1719842241330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "timeslot" DROP CONSTRAINT "FK_07d9f4ced4681d78a56e4605b51"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_137987426659ac1570c018c0711"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "scheduleId" TO "slotsId"`);
        await queryRunner.query(`CREATE TABLE "user_slots" ("id" SERIAL NOT NULL, "userId" integer, CONSTRAINT "REL_d21b8c187bde6cb56d1ccfc234" UNIQUE ("userId"), CONSTRAINT "PK_8ec2e8fd9ce303586d3bff72fc0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "timeslot" ADD CONSTRAINT "FK_07d9f4ced4681d78a56e4605b51" FOREIGN KEY ("scheduleId") REFERENCES "user_slots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_slots" ADD CONSTRAINT "FK_d21b8c187bde6cb56d1ccfc2348" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_1623431c6b0b303dc22ac38d09a" FOREIGN KEY ("slotsId") REFERENCES "user_slots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_1623431c6b0b303dc22ac38d09a"`);
        await queryRunner.query(`ALTER TABLE "user_slots" DROP CONSTRAINT "FK_d21b8c187bde6cb56d1ccfc2348"`);
        await queryRunner.query(`ALTER TABLE "timeslot" DROP CONSTRAINT "FK_07d9f4ced4681d78a56e4605b51"`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`DROP TABLE "user_slots"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "slotsId" TO "scheduleId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_137987426659ac1570c018c0711" FOREIGN KEY ("scheduleId") REFERENCES "schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "timeslot" ADD CONSTRAINT "FK_07d9f4ced4681d78a56e4605b51" FOREIGN KEY ("scheduleId") REFERENCES "schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
