import { randomUUID } from 'node:crypto';
import { authenticator } from 'otplib';

import Role from './Role';
import createPool from '../createPool';
import totpKeyToString from '../utils/totpKeyToString';
import CREATE_TABLE from '../utils/createTable';
import isTest from '../../utils/isTest';

class Users {
  async init(pool, { doNotCreateAdmin } = {}) {
    this.pool = pool ?? createPool();

    await this.pool.query(
      `
        ${CREATE_TABLE} users (
          id uuid primary key,
          name text not null unique,
          role text not null,
          totp_key text not null,
          withdraw_address text
        )
      `,
    );

    if (!doNotCreateAdmin) {
      if (!await this.getIdByName('admin')) {
        const adminId = await this.create({ name: 'admin', role: Role.Admin });

        if (!isTest) {
          const adminTotpKey = await this.getTotpKey(adminId);

          console.log(`Created admin with key ${adminTotpKey}`);
          console.log(await totpKeyToString(adminTotpKey));
        }
      }
    }

    return this;
  }

  async create({ name, role }) {
    const id = randomUUID();
    const totpKey = authenticator.generateSecret();
    const result = await this.pool.query(
      `
        INSERT INTO users(id, name, role, totp_key, withdraw_address)
        VALUES($1, $2, $3, $4, $5)
      `,
      [id, name, role, totpKey, ''],
    );
    if (result.rowCount !== 1) { throw new Error('Users.create rowCount !== 1'); }
    return id;
    // return id
  }

  async getTotpKey(id) {
    const { rows } = await this.pool.query(
      'SELECT totp_key FROM users WHERE id = $1',
      [id],
    );

    return rows[0]?.totp_key;
    // return totpKey or undefined
  }

  async getRole(id) {
    const { rows } = await this.pool.query(
      'SELECT role FROM users WHERE id = $1',
      [id],
    );

    return rows[0]?.role;
    // return totpKey or undefined
  }

  async getIdByName(name) {
    const { rows } = await this.pool.query(
      'SELECT id FROM users WHERE name = $1',
      [name],
    );

    return rows[0]?.id;
    // return id or undefined
  }

  async getWithdrawAddress(id) {
    const { rows } = await this.pool.query(
      'SELECT withdraw_address FROM users WHERE id = $1',
      [id],
    );

    return rows[0]?.withdraw_address;
    // return withdraw_address or undefined
  }

  async setWithdrawAddress(id, withdraw_address) {
    const result = await this.pool.query(
      'UPDATE users SET withdraw_address = $1 WHERE id = $2',
      [withdraw_address, id],
    );
    if (result.rowCount !== 1) { throw new Error('Users.setWithdrawAddress rowCount !== 1'); }
  }

  async delete(id) {
    const result = await this.pool.query(
      'DELETE FROM users WHERE id = $1',
      [id],
    );
    if (result.rowCount !== 1) { throw new Error('Users.delete rowCount !== 1'); }
  }

  async getAll() {
    const { rows } = await this.pool.query(
      `
        SELECT *
        FROM users
        ORDER BY name
      `,
    );
    return rows;
    // return []
  }

  async destroy() {
    await this.pool.end();
  }
}

const createUsers = (...args) => (new Users()).init(...args);
export default createUsers;
