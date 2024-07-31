import Pg from 'pg';
import isTest from '../utils/isTest';

const { Pool } = Pg;

const createPool = () => new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  database: isTest ? 'test' : undefined,
});
export default createPool;
