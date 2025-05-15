import { Repository } from 'typeorm';
import { File } from './file.entity';
import { AppDataSource } from '../../../../config/postgresql.config';
import { PostgresqlService } from '../../services/postgresql/postgresql.service';
import { Query } from '../../helpers';
import { FileModel } from './interface';
import { FindFileProps } from './interface/find-file.interface';
import { CustomQuery } from '../../helpers/interfaces';

export class FileService extends PostgresqlService {
  private readonly fileRepository: Repository<File> =
    AppDataSource.getRepository(File);

  async fileList({ page, limit, sorting }: FindFileProps) {
    const queries: CustomQuery = [];

    const select = [
      'file.id',
      'file.path',
      'file.size',
      'file.mimetype',
      'file.createdAt',
      'file.updatedAt',
    ];

    const data = await this.getManyAndCount<File, FileModel>({
      repository: this.fileRepository,
      entityName: 'file',
      queries,
      select,
      page,
      limit,
      sorting,
    });

    return data;
  }

  async findOneFile(queryKeys: Query) {
    return this.findOne<File, FileModel>(this.fileRepository, queryKeys);
  }

  async detailFile(queryKeys: Query) {
    return this.findOne<File, FileModel>(this.fileRepository, queryKeys);
  }

  async addFile(payload: Partial<FileModel>) {
    const fileInput: Partial<FileModel> = { ...payload };
    return this.create<File, FileModel>(this.fileRepository, fileInput);
  }

  async deleteFile(query: Query) {
    return this.delete<File>(this.fileRepository, query);
  }
}
