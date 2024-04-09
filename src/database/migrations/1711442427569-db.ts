import { MigrationInterface, QueryRunner } from 'typeorm';

export class Db1711442427569 implements MigrationInterface {
  name = 'Db1711442427569';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`,
    );
    await queryRunner.query(
      `ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "rating" TYPE double precision`,
    );
  }
}
