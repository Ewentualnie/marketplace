import { MigrationInterface, QueryRunner } from "typeorm";

export class Booking1720864257938 implements MigrationInterface {
    name = 'Booking1720864257938'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_9f46fa28cd1be174e2ad12bc2a3"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_16524af86c0e3b3dd66517eec6a"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "teacherId"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "studentId"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "teacher" integer`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "student" integer`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_576fae94664ebfb276349d234c4" FOREIGN KEY ("teacher") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_c6991192b641e86d421762f2f0e" FOREIGN KEY ("student") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_c6991192b641e86d421762f2f0e"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_576fae94664ebfb276349d234c4"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "student"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "teacher"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "studentId" integer`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "teacherId" integer`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_16524af86c0e3b3dd66517eec6a" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_9f46fa28cd1be174e2ad12bc2a3" FOREIGN KEY ("teacherId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
