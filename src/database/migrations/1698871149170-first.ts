import { MigrationInterface, QueryRunner } from 'typeorm';

export class First1698871149170 implements MigrationInterface {
  name = 'First1698871149170';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "feedback" ("id" SERIAL NOT NULL, "mark" integer NOT NULL, "message" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "toUserId" integer, CONSTRAINT "CHK_1bd95bab7451631ad8a0071a95" CHECK (mark >= 1 AND mark <= 5), CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "hobby" ("id" SERIAL NOT NULL, "hobby" character varying NOT NULL, CONSTRAINT "UQ_bcd0682a348fea58e8dba25fb81" UNIQUE ("hobby"), CONSTRAINT "PK_9cf21d5206ec584a4cc14a8703e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "hashedPass" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying, "role" character varying NOT NULL DEFAULT 'user', "isDeleted" boolean NOT NULL DEFAULT false, "lastVisit" TIMESTAMP NOT NULL DEFAULT now(), "country" character varying, "refreshToken" character varying, "advertId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_b78cd9491419afdda263fffdea" UNIQUE ("advertId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "language" ("id" SERIAL NOT NULL, "language" character varying NOT NULL, CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "advert" ("id" SERIAL NOT NULL, "price" numeric NOT NULL, "description" character varying NOT NULL, "imagePath" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "userId" integer, CONSTRAINT "REL_2a3714047a0c902fd9d5077fdc" UNIQUE ("userId"), CONSTRAINT "PK_4bd8b4cdfb562b02706beece450" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_feedback" ("feedbackId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_2346822913546ce54eafa393e1c" PRIMARY KEY ("feedbackId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_25462eeffae3a9d782a90bc59c" ON "user_feedback" ("feedbackId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e4cc25c220dea064df29485e39" ON "user_feedback" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users_hobby" ("hobbyId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_a5b131e9615cf0ebb3478867c32" PRIMARY KEY ("hobbyId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c354d32dac14aacb411041332f" ON "users_hobby" ("hobbyId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7e9678712c495eb0dca199e543" ON "users_hobby" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_hobbies" ("userId" integer NOT NULL, "hobbyId" integer NOT NULL, CONSTRAINT "PK_eb613c25d25ed909ae1022f3cb1" PRIMARY KEY ("userId", "hobbyId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_89d557429118dbb0e6f75aa946" ON "user_hobbies" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c17b94df9150e17763e80eb47d" ON "user_hobbies" ("hobbyId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "advert_spoken_languages_language" ("advertId" integer NOT NULL, "languageId" integer NOT NULL, CONSTRAINT "PK_1718c242964d22ebc3970306439" PRIMARY KEY ("advertId", "languageId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4127b3bf5e1270f4fdbec3d9c6" ON "advert_spoken_languages_language" ("advertId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5cbb3299026b08b9b65c24d348" ON "advert_spoken_languages_language" ("languageId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "advert_teaching_languages_language" ("advertId" integer NOT NULL, "languageId" integer NOT NULL, CONSTRAINT "PK_b819b315f2c2fb93a395ad4a371" PRIMARY KEY ("advertId", "languageId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c227167545e49aee3dfc493819" ON "advert_teaching_languages_language" ("advertId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c47df2456aac2cc2a325a24f25" ON "advert_teaching_languages_language" ("languageId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback" ADD CONSTRAINT "FK_fefc350f416e262e904dcf6b35e" FOREIGN KEY ("toUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_b78cd9491419afdda263fffdead" FOREIGN KEY ("advertId") REFERENCES "advert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "advert" ADD CONSTRAINT "FK_2a3714047a0c902fd9d5077fdcb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_feedback" ADD CONSTRAINT "FK_25462eeffae3a9d782a90bc59c7" FOREIGN KEY ("feedbackId") REFERENCES "feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_feedback" ADD CONSTRAINT "FK_e4cc25c220dea064df29485e39a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_hobby" ADD CONSTRAINT "FK_c354d32dac14aacb411041332fc" FOREIGN KEY ("hobbyId") REFERENCES "hobby"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_hobby" ADD CONSTRAINT "FK_7e9678712c495eb0dca199e5431" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_hobbies" ADD CONSTRAINT "FK_89d557429118dbb0e6f75aa9469" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_hobbies" ADD CONSTRAINT "FK_c17b94df9150e17763e80eb47dc" FOREIGN KEY ("hobbyId") REFERENCES "hobby"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "advert_spoken_languages_language" ADD CONSTRAINT "FK_4127b3bf5e1270f4fdbec3d9c62" FOREIGN KEY ("advertId") REFERENCES "advert"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "advert_spoken_languages_language" ADD CONSTRAINT "FK_5cbb3299026b08b9b65c24d3482" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "advert_teaching_languages_language" ADD CONSTRAINT "FK_c227167545e49aee3dfc4938191" FOREIGN KEY ("advertId") REFERENCES "advert"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "advert_teaching_languages_language" ADD CONSTRAINT "FK_c47df2456aac2cc2a325a24f25b" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "advert_teaching_languages_language" DROP CONSTRAINT "FK_c47df2456aac2cc2a325a24f25b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "advert_teaching_languages_language" DROP CONSTRAINT "FK_c227167545e49aee3dfc4938191"`,
    );
    await queryRunner.query(
      `ALTER TABLE "advert_spoken_languages_language" DROP CONSTRAINT "FK_5cbb3299026b08b9b65c24d3482"`,
    );
    await queryRunner.query(
      `ALTER TABLE "advert_spoken_languages_language" DROP CONSTRAINT "FK_4127b3bf5e1270f4fdbec3d9c62"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_hobbies" DROP CONSTRAINT "FK_c17b94df9150e17763e80eb47dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_hobbies" DROP CONSTRAINT "FK_89d557429118dbb0e6f75aa9469"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_hobby" DROP CONSTRAINT "FK_7e9678712c495eb0dca199e5431"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_hobby" DROP CONSTRAINT "FK_c354d32dac14aacb411041332fc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_feedback" DROP CONSTRAINT "FK_e4cc25c220dea064df29485e39a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_feedback" DROP CONSTRAINT "FK_25462eeffae3a9d782a90bc59c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "advert" DROP CONSTRAINT "FK_2a3714047a0c902fd9d5077fdcb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_b78cd9491419afdda263fffdead"`,
    );
    await queryRunner.query(
      `ALTER TABLE "feedback" DROP CONSTRAINT "FK_fefc350f416e262e904dcf6b35e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c47df2456aac2cc2a325a24f25"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c227167545e49aee3dfc493819"`,
    );
    await queryRunner.query(`DROP TABLE "advert_teaching_languages_language"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5cbb3299026b08b9b65c24d348"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4127b3bf5e1270f4fdbec3d9c6"`,
    );
    await queryRunner.query(`DROP TABLE "advert_spoken_languages_language"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c17b94df9150e17763e80eb47d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_89d557429118dbb0e6f75aa946"`,
    );
    await queryRunner.query(`DROP TABLE "user_hobbies"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7e9678712c495eb0dca199e543"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c354d32dac14aacb411041332f"`,
    );
    await queryRunner.query(`DROP TABLE "users_hobby"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e4cc25c220dea064df29485e39"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_25462eeffae3a9d782a90bc59c"`,
    );
    await queryRunner.query(`DROP TABLE "user_feedback"`);
    await queryRunner.query(`DROP TABLE "advert"`);
    await queryRunner.query(`DROP TABLE "language"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "hobby"`);
    await queryRunner.query(`DROP TABLE "feedback"`);
  }
}
