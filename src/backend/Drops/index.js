import { randomUUID } from 'node:crypto';
import createPool from '../createPool';
import CREATE_TABLE from '../utils/createTable';

export class Drops {
  async init(pool) {
    this.pool = pool ?? createPool();

    await this.pool.query(
      `
        ${CREATE_TABLE} drops (
          id uuid primary key,
          drop_type_id uuid references drop_types(id) not null,
          amount double precision not null,
          descr text not null,
          buyer_id bigint references telegram_users(id),
          txid text
        )
      `,
    );
    await this.pool.query(
      'CREATE INDEX IF NOT EXISTS drops_drop_type_id_idx ON drops (drop_type_id)',
    );

    return this;
  }

  static async create(client, { drop_type_id, amount, descr }) {
    const id = randomUUID();
    const result = await client.query(
      `
        INSERT INTO drops(id, drop_type_id, amount, descr)
        VALUES($1, $2, $3, $4)
      `,
      [id, drop_type_id, amount, descr],
    );
    if (result.rowCount !== 1) { throw new Error('Drops.create rowCount !== 1'); }
    return id;
    // return id
  }

  create(params) {
    return Drops.create(this.pool, params);
  }

  async delete(id) {
    const result = await this.pool.query(
      'DELETE FROM drops WHERE id = $1',
      [id],
    );
    if (result.rowCount !== 1) { throw new Error('Drops.delete rowCount !== 1'); }
  }

  static async setBuyerId(client, id, buyer_id) {
    const result = await client.query(
      'UPDATE drops SET buyer_id = $2 WHERE id = $1 AND buyer_id IS NULL',
      [id, buyer_id],
    );
    if (result.rowCount !== 1) { throw new Error('Drops.setBuyerId rowCount !== 1'); }
  }

  setBuyerId(id, buyer_id) {
    return Drops.setBuyerId(this.pool, id, buyer_id);
  }

  static async setTXID(client, id, txid) {
    const result = await client.query(
      'UPDATE drops SET txid = $1 WHERE id = $2 AND txid IS NULL',
      [txid, id],
    );
    if (result.rowCount !== 1) { throw new Error('Drops.setTXID rowCount !== 1'); }
  }

  setTXID(id, txid) {
    return Drops.setTXID(this.pool, id, txid);
  }

  async get(id) {
    const { rows } = await this.pool.query(
      'SELECT * FROM drops WHERE id = $1',
      [id],
    );
    return rows[0];
    // returns row
  }

  async getAvailableByAmountAndDropType({ drop_type_id, amount }) {
    const { rows } = await this.pool.query(
      `
        SELECT *
        FROM drops
        WHERE
          drop_type_id = $1 AND
          amount = $2 AND
          buyer_id IS NULL
        LIMIT 1
      `,
      [drop_type_id, amount],
    );
    return rows[0];
    // returns row
  }

  async getAllByVendor(vendor_id) {
    const { rows } = await this.pool.query(
      `
        SELECT drops.*, telegram_users.username as buyer_username
        FROM drops
        JOIN drop_types
        ON
          drops.drop_type_id = drop_types.id AND
          drop_types.vendor_id = $1
        LEFT JOIN telegram_users
        ON drops.buyer_id = telegram_users.id
        ORDER BY drop_type_id, amount, descr
      `,
      [vendor_id],
    );
    return rows;
    // return []
  }

  async getAllByDropType(drop_type_id) {
    const { rows } = await this.pool.query(
      'SELECT * FROM drops WHERE drop_type_id = $1',
      [drop_type_id],
    );
    return rows;
    // return []
  }

  async getAllAvailableDropTypeAmounts(drop_type_id) {
    const { rows } = await this.pool.query(
      `
        SELECT DISTINCT amount
        FROM drops
        WHERE
          drop_type_id = $1 AND
          buyer_id IS NULL
        order by amount
      `,
      [drop_type_id],
    );
    return rows.map((row) => row.amount);
    // return []
  }

  async destroy() {
    await this.pool.end();
  }
}

const createDrops = (...args) => (new Drops()).init(...args);
export default createDrops;
