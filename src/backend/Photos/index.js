import { randomUUID } from 'node:crypto';

import createPool from '../createPool';
import CREATE_TABLE from '../utils/createTable';
import purgeExifData from '../utils/exif/purgeExifData';

export class Photos {
  async init(pool) {
    this.pool = pool ?? createPool();

    await this.pool.query(
      `
        ${CREATE_TABLE} photos (
          id uuid primary key,
          drop_id uuid references drops(id),
          drop_type_id uuid references drop_types(id),
          content bytea not null
        )
      `,
    );
    await this.pool.query(
      'CREATE INDEX IF NOT EXISTS photos_drop_id_idx ON photos (drop_id);'
    );

    return this;
  }

  static async create(client, { drop_id, drop_type_id, content }) {
    if (!drop_id && !drop_type_id) { throw new Error('Photos.create !drop_id && !drop_type_id'); }

    const contentWithoutMetadata = await purgeExifData(content);
    const id = randomUUID();
    const result = await client.query(
      `
        INSERT INTO photos(id, drop_id, drop_type_id, content)
        VALUES($1, $2, $3, $4)
      `,
      [id, drop_id, drop_type_id, contentWithoutMetadata],
    );
    if (result.rowCount !== 1) { throw new Error('Photos.create rowCount !== 1'); }
    return id;
    // return id
  }

  create(params) {
    return Photos.create(this.pool, params);
  }

  async getAllContentsByDropId(drop_id) {
    const { rows } = await this.pool.query(
      'SELECT content FROM photos WHERE drop_id = $1',
      [drop_id],
    );

    return rows.map((row) => row.content);
    // return []
  }

  async deleteByDropId(drop_id) {
    await this.pool.query(
      'DELETE FROM photos WHERE drop_id = $1',
      [drop_id],
    );
  }

  async getAllContentsByDropTypeId(drop_type_id) {
    const { rows } = await this.pool.query(
      'SELECT content FROM photos WHERE drop_type_id = $1',
      [drop_type_id],
    );

    return rows.map((row) => row.content);
    // return []
  }

  async deleteByDropTypeId(drop_type_id) {
    await this.pool.query(
      'DELETE FROM photos WHERE drop_type_id = $1',
      [drop_type_id],
    );
  }

  async destroy() {
    await this.pool.end();
  }
}

const createPhotos = (...args) => (new Photos()).init(...args);
export default createPhotos;
