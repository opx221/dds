import createPool from '../createPool';
import CREATE_TABLE from '../utils/createTable';

export class TelegramUsers {
  async init(pool) {
    this.pool = pool ?? createPool();

    await this.pool.query(
      `
        ${CREATE_TABLE} telegram_users (
          id bigint primary key,
          username text,
          payment_id text not null,
          balance bigint[2] check (balance[1] >= 0 AND balance[2] >= 0)
        )
      `,
    );
    await this.pool.query(
      'CREATE INDEX IF NOT EXISTS telegram_users_payment_id_idx ON telegram_users (payment_id);'
    );

    return this;
  }

  async create({ id, username, payment_id }) {
    const result = await this.pool.query(
      `
        INSERT INTO telegram_users(id, username, payment_id, balance)
        VALUES($1, $2, $3, $4)
      `,
      [id, username, payment_id, [0, 0]],
    );
    if (result.rowCount !== 1) { throw new Error('TelegramUsers.create rowCount !== 1'); }
  }

  async get(id) {
    const { rows } = await this.pool.query(
      'SELECT * FROM telegram_users WHERE id = $1',
      [id],
    );

    return rows[0];
    // return row or undefined
  }

  async setUsername(id, username) {
    const result = await this.pool.query(
      'UPDATE telegram_users SET username = $1 WHERE id = $2',
      [username, id],
    );
    if (result.rowCount !== 1) { throw new Error('TelegramUsers.setUsername rowCount !== 1'); }
  }

  async getAll() {
    const { rows } = await this.pool.query(
      'SELECT * FROM telegram_users',
    );

    return rows;
    // returns rows
  }

  static async addBalance(client, id, balance) {
    const result = await client.query(
      `
        UPDATE telegram_users
        SET balance = ARRAY[balance[1] + $2, balance[2] + $3]
        WHERE id = $1
      `,
      [id, ...balance],
    );
    if (result.rowCount !== 1) { throw new Error('TelegramUsers.addBalance rowCount !== 1'); }
  }

  addBalance(id, balance) {
    return TelegramUsers.addBalance(this.pool, id, balance);
  }

  async getIdByPaymentId(paymentId) {
    const { rows } = await this.pool.query(
      'SELECT id FROM telegram_users WHERE payment_id = $1',
      [paymentId],
    );

    return rows[0]?.id;
    // return payment_id or undefined
  }

  async destroy() {
    await this.pool.end();
  }
}

const createTelegramUsers = (...args) => (new TelegramUsers()).init(...args);
export default createTelegramUsers;
