import { randomUUID } from 'node:crypto';
import createPool from '../createPool';
import CREATE_TABLE from '../utils/createTable';
import { SPLIT_DEFAULT } from '../../const';

export class DropTypes {
  async init(pool) {
    this.pool = pool ?? createPool();

    await this.pool.query(
      `
        ${CREATE_TABLE} drop_types (
          id uuid primary key,
          name text,
          vendor_id uuid references users(id) not null,
          descr text not null,
          amount_price_pairs double precision[][],
          unit text not null,
          split double precision not null,
          floor_price double precision not null
        )
      `,
    );
    await this.pool.query(
      'CREATE INDEX IF NOT EXISTS drop_types_vendor_id_idx ON drop_types (vendor_id);'
    );

    return this;
  }

  static async create(client, {
    name, vendor_id, descr, unit,
  }) {
    const id = randomUUID();
    const result = await client.query(
      `
        INSERT INTO drop_types(
          id,
          name,
          vendor_id,
          descr,
          amount_price_pairs,
          unit,
          split,
          floor_price
        ) VALUES($1, $2, $3, $4, $5, $6, $7, $8)
      `,
      [id, name, vendor_id, descr, [], unit, SPLIT_DEFAULT, 0],
    );
    if (result.rowCount !== 1) { throw new Error('DropTypes.create rowCount !== 1'); }
    return id;
    // return id
  }

  create(params) {
    return DropTypes.create(this.pool, params);
  }

  async setAmountPricePairs(id, amount_price_pairs) {
    const result = await this.pool.query(
      'UPDATE drop_types SET amount_price_pairs = $1 WHERE id = $2',
      [amount_price_pairs, id],
    );
    if (result.rowCount !== 1) { throw new Error('DropTypes.setAmountPricePairs rowCount !== 1'); }
    // return id
  }

  async delete(id) {
    const result = await this.pool.query(
      'DELETE FROM drop_types WHERE id = $1',
      [id],
    );
    if (result.rowCount !== 1) { throw new Error('DropTypes.delete !== 1'); }
  }

  async setSplitAndFloorPrice(id, split, floor_price) {
    const result = await this.pool.query(
      `
        UPDATE drop_types
        SET split = $1, floor_price = $2
        WHERE id = $3`,
      [split, floor_price, id],
    );
    if (result.rowCount !== 1) { throw new Error('DropTypes.setSplitAndFloorPrice rowCount !== 1'); }
    // return id
  }

  async get(id) {
    const { rows } = await this.pool.query(
      'SELECT * FROM drop_Types WHERE id = $1',
      [id],
    );
    return rows[0];
    // return row
  }

  async getAll() {
    const { rows } = await this.pool.query(
      `
        SELECT drop_types.*, users.name as vendor_name
        FROM drop_Types
        LEFT JOIN users
        ON drop_types.vendor_id = users.id
        ORDER BY vendor_id
      `,
    );
    return rows;
    // return []
  }

  async getAllByVendor(vendor_id) {
    const { rows } = await this.pool.query(
      `
        SELECT *
        FROM drop_Types
        WHERE vendor_id = $1
        ORDER BY name
      `,
      [vendor_id],
    );
    return rows;
    // return []
  }

  async getAllAvailable() {
    const { rows } = await this.pool.query(
      `
        SELECT DISTINCT drop_types.*, users.name as vendor_name
        FROM drop_types
        JOIN drops
        ON
          drops.drop_type_id = drop_types.id AND
          drops.buyer_id IS NULL
        LEFT JOIN users
        ON drop_types.vendor_id = users.id
        ORDER BY vendor_id
      `,
    );
    return rows;
    // return []
  }

  async destroy() {
    await this.pool.end();
  }
}

const createDropTypes = (...args) => (new DropTypes()).init(...args);
export default createDropTypes;
