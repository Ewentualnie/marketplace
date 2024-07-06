import { MigrationInterface, QueryRunner } from "typeorm";

export class Booking1720246368314 implements MigrationInterface {
    name = 'Booking1720246368314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "language" ("id" SERIAL NOT NULL, "alpha2" character varying NOT NULL, "languageEn" character varying NOT NULL, "languageUa" character varying NOT NULL, CONSTRAINT "UQ_d72425d86fbf13a89b0ff4230d8" UNIQUE ("alpha2"), CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "feedback" ("id" SERIAL NOT NULL, "mark" integer NOT NULL, "message" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "to_user" integer, "from_user" integer, CONSTRAINT "CHK_1bd95bab7451631ad8a0071a95" CHECK (mark >= 1 AND mark <= 5), CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "country" ("id" SERIAL NOT NULL, "alpha2" character varying NOT NULL, CONSTRAINT "UQ_05bb99dff5ece9e1234a48bf0da" UNIQUE ("alpha2"), CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "advert_likes" ("id" SERIAL NOT NULL, "user_id" integer, "advert_id" integer, CONSTRAINT "PK_52ceb8655220bf136f3f0d7bb5d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "text" character varying NOT NULL, "isReaded" boolean NOT NULL DEFAULT false, "writtedAt" TIMESTAMP NOT NULL DEFAULT now(), "senderId" integer NOT NULL, "receiverId" integer NOT NULL, "chatId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chat" ("id" SERIAL NOT NULL, "user1Id" integer, "user2Id" integer, CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "timeslot" ("id" SERIAL NOT NULL, "start" TIMESTAMP WITH TIME ZONE NOT NULL, "end" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" integer, CONSTRAINT "PK_cd8bca557ee1eb5b090b9e63009" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "booking" ("id" SERIAL NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "studingLanguage" character varying NOT NULL, "teacherId" integer, "studentId" integer, CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "hashedPass" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying, "role" character varying NOT NULL DEFAULT 'user', "isDeleted" boolean NOT NULL DEFAULT false, "lastVisit" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "registeredAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "rating" double precision NOT NULL DEFAULT '5', "birthday" TIMESTAMP, "sex" character varying, "photo" character varying, "refreshToken" character varying, "aboutMe" character varying, "country" integer, "advertId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_b78cd9491419afdda263fffdea" UNIQUE ("advertId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "specialization" ("id" SERIAL NOT NULL, "specializationEn" character varying, "specializationUa" character varying, CONSTRAINT "PK_904dfcbdb57f56f5b57b9c09cc5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "advert" ("id" SERIAL NOT NULL, "price" numeric NOT NULL, "description" character varying NOT NULL, "imagePath" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "isDeleted" boolean NOT NULL DEFAULT false, "userId" integer, CONSTRAINT "REL_2a3714047a0c902fd9d5077fdc" UNIQUE ("userId"), CONSTRAINT "PK_4bd8b4cdfb562b02706beece450" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "adverts_specializations" ("specializationId" integer NOT NULL, "advertId" integer NOT NULL, CONSTRAINT "PK_4f8c55f301a6fb60636fc8a96f3" PRIMARY KEY ("specializationId", "advertId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_220b3a0ed76876797d77d22d4b" ON "adverts_specializations" ("specializationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c198272c66d3efb41c7c2b0e48" ON "adverts_specializations" ("advertId") `);
        await queryRunner.query(`CREATE TABLE "advert_spoken_languages_language" ("advertId" integer NOT NULL, "languageId" integer NOT NULL, CONSTRAINT "PK_1718c242964d22ebc3970306439" PRIMARY KEY ("advertId", "languageId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4127b3bf5e1270f4fdbec3d9c6" ON "advert_spoken_languages_language" ("advertId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5cbb3299026b08b9b65c24d348" ON "advert_spoken_languages_language" ("languageId") `);
        await queryRunner.query(`CREATE TABLE "advert_teaching_languages_language" ("advertId" integer NOT NULL, "languageId" integer NOT NULL, CONSTRAINT "PK_b819b315f2c2fb93a395ad4a371" PRIMARY KEY ("advertId", "languageId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c227167545e49aee3dfc493819" ON "advert_teaching_languages_language" ("advertId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c47df2456aac2cc2a325a24f25" ON "advert_teaching_languages_language" ("languageId") `);
        await queryRunner.query(`CREATE TABLE "advert_specializations" ("advertId" integer NOT NULL, "specializationId" integer NOT NULL, CONSTRAINT "PK_07d4c30377b88c951bb1f4fef29" PRIMARY KEY ("advertId", "specializationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_29f1472e1417dd7b1d77b30c3f" ON "advert_specializations" ("advertId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c064f8ba0021dd408cca4307c7" ON "advert_specializations" ("specializationId") `);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_98acbc5c76b68d477c32765d16d" FOREIGN KEY ("to_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_dea0ccf246161e5e7d46f1bf9fd" FOREIGN KEY ("from_user") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advert_likes" ADD CONSTRAINT "FK_5962e780a89d6980db361b4fa4f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advert_likes" ADD CONSTRAINT "FK_4b4ac7241f99a7d087e9967d5a6" FOREIGN KEY ("advert_id") REFERENCES "advert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_e263d1c2fdcbc5a97216a28e226" FOREIGN KEY ("user1Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chat" ADD CONSTRAINT "FK_99f86fa5d1a0f13f9cbbeae3120" FOREIGN KEY ("user2Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "timeslot" ADD CONSTRAINT "FK_47d06adf246fcfea1d318423ee3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_9f46fa28cd1be174e2ad12bc2a3" FOREIGN KEY ("teacherId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "booking" ADD CONSTRAINT "FK_16524af86c0e3b3dd66517eec6a" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_5cb2b3e0419a73a360d327d497f" FOREIGN KEY ("country") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_b78cd9491419afdda263fffdead" FOREIGN KEY ("advertId") REFERENCES "advert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advert" ADD CONSTRAINT "FK_2a3714047a0c902fd9d5077fdcb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "adverts_specializations" ADD CONSTRAINT "FK_220b3a0ed76876797d77d22d4b3" FOREIGN KEY ("specializationId") REFERENCES "specialization"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "adverts_specializations" ADD CONSTRAINT "FK_c198272c66d3efb41c7c2b0e480" FOREIGN KEY ("advertId") REFERENCES "advert"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advert_spoken_languages_language" ADD CONSTRAINT "FK_4127b3bf5e1270f4fdbec3d9c62" FOREIGN KEY ("advertId") REFERENCES "advert"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "advert_spoken_languages_language" ADD CONSTRAINT "FK_5cbb3299026b08b9b65c24d3482" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advert_teaching_languages_language" ADD CONSTRAINT "FK_c227167545e49aee3dfc4938191" FOREIGN KEY ("advertId") REFERENCES "advert"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "advert_teaching_languages_language" ADD CONSTRAINT "FK_c47df2456aac2cc2a325a24f25b" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "advert_specializations" ADD CONSTRAINT "FK_29f1472e1417dd7b1d77b30c3f6" FOREIGN KEY ("advertId") REFERENCES "advert"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "advert_specializations" ADD CONSTRAINT "FK_c064f8ba0021dd408cca4307c71" FOREIGN KEY ("specializationId") REFERENCES "specialization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "advert_specializations" DROP CONSTRAINT "FK_c064f8ba0021dd408cca4307c71"`);
        await queryRunner.query(`ALTER TABLE "advert_specializations" DROP CONSTRAINT "FK_29f1472e1417dd7b1d77b30c3f6"`);
        await queryRunner.query(`ALTER TABLE "advert_teaching_languages_language" DROP CONSTRAINT "FK_c47df2456aac2cc2a325a24f25b"`);
        await queryRunner.query(`ALTER TABLE "advert_teaching_languages_language" DROP CONSTRAINT "FK_c227167545e49aee3dfc4938191"`);
        await queryRunner.query(`ALTER TABLE "advert_spoken_languages_language" DROP CONSTRAINT "FK_5cbb3299026b08b9b65c24d3482"`);
        await queryRunner.query(`ALTER TABLE "advert_spoken_languages_language" DROP CONSTRAINT "FK_4127b3bf5e1270f4fdbec3d9c62"`);
        await queryRunner.query(`ALTER TABLE "adverts_specializations" DROP CONSTRAINT "FK_c198272c66d3efb41c7c2b0e480"`);
        await queryRunner.query(`ALTER TABLE "adverts_specializations" DROP CONSTRAINT "FK_220b3a0ed76876797d77d22d4b3"`);
        await queryRunner.query(`ALTER TABLE "advert" DROP CONSTRAINT "FK_2a3714047a0c902fd9d5077fdcb"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_b78cd9491419afdda263fffdead"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_5cb2b3e0419a73a360d327d497f"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_16524af86c0e3b3dd66517eec6a"`);
        await queryRunner.query(`ALTER TABLE "booking" DROP CONSTRAINT "FK_9f46fa28cd1be174e2ad12bc2a3"`);
        await queryRunner.query(`ALTER TABLE "timeslot" DROP CONSTRAINT "FK_47d06adf246fcfea1d318423ee3"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_99f86fa5d1a0f13f9cbbeae3120"`);
        await queryRunner.query(`ALTER TABLE "chat" DROP CONSTRAINT "FK_e263d1c2fdcbc5a97216a28e226"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"`);
        await queryRunner.query(`ALTER TABLE "advert_likes" DROP CONSTRAINT "FK_4b4ac7241f99a7d087e9967d5a6"`);
        await queryRunner.query(`ALTER TABLE "advert_likes" DROP CONSTRAINT "FK_5962e780a89d6980db361b4fa4f"`);
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_dea0ccf246161e5e7d46f1bf9fd"`);
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_98acbc5c76b68d477c32765d16d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c064f8ba0021dd408cca4307c7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_29f1472e1417dd7b1d77b30c3f"`);
        await queryRunner.query(`DROP TABLE "advert_specializations"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c47df2456aac2cc2a325a24f25"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c227167545e49aee3dfc493819"`);
        await queryRunner.query(`DROP TABLE "advert_teaching_languages_language"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5cbb3299026b08b9b65c24d348"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4127b3bf5e1270f4fdbec3d9c6"`);
        await queryRunner.query(`DROP TABLE "advert_spoken_languages_language"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c198272c66d3efb41c7c2b0e48"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_220b3a0ed76876797d77d22d4b"`);
        await queryRunner.query(`DROP TABLE "adverts_specializations"`);
        await queryRunner.query(`DROP TABLE "advert"`);
        await queryRunner.query(`DROP TABLE "specialization"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "booking"`);
        await queryRunner.query(`DROP TABLE "timeslot"`);
        await queryRunner.query(`DROP TABLE "chat"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "advert_likes"`);
        await queryRunner.query(`DROP TABLE "country"`);
        await queryRunner.query(`DROP TABLE "feedback"`);
        await queryRunner.query(`DROP TABLE "language"`);
    }

}
