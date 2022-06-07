/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class alterColumnNameSnakeCase1654639357090 implements MigrationInterface {
  name = 'alterColumnNameSnakeCase1654639357090';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('card', 'phoneNumber', 'phone_number');
    await queryRunner.renameColumn('card', 'jobTitle', 'job_title');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('card', 'phone_number', 'phoneNumber');
    await queryRunner.renameColumn('card', 'job_title', 'jobTitle');
  }
}
