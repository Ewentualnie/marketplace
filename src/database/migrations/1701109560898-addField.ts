import { MigrationInterface, QueryRunner } from "typeorm";

export class AddField1701109560898 implements MigrationInterface {
    name = 'AddField1701109560898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advert" ALTER COLUMN "price" TYPE numeric`);
    }

}
