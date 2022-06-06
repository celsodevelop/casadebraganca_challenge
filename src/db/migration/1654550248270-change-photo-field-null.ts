import { MigrationInterface, QueryRunner } from "typeorm";

export class changePhotoFieldNull1654550248270 implements MigrationInterface {
    name = 'changePhotoFieldNull1654550248270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "photo" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "photo" SET NOT NULL`);
    }

}
