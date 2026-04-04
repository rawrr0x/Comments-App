import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCommentsFile1775311149926 implements MigrationInterface {
    name = 'UpdateCommentsFile1775311149926'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "fileUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "fileUrl"`);
    }

}
