import dotenv from 'dotenv';
import { config } from './config';
import { testDbClient } from './api/v1/init';

dotenv.config({ path: '.env.test' });

// const testDB = config.POSTGRES_DATABASE;

// beforeAll(async () => {
//   jest.setTimeout(10000);

//   try {
//     const client = testDbClient();
//     await client.connect();

//     const result = await client.query(
//       `SELECT 1 FROM pg_database WHERE datname = '${testDB}'`
//     );

//     if (result && result.rowCount && !result.rowCount) {
//       await client.query(`CREATE DATABASE "${testDB}"`);
//     }

//     await client.end();
//   } catch (error) {
//     console.error('Error creating database:', error);
//     throw error;
//   }
// });

// afterAll(async () => {
//   try {
//     jest.setTimeout(10000);
//     const client = testDbClient();
//     await client.connect();

//     const result = await client.query(
//       `SELECT 1 FROM pg_database WHERE datname = '${testDB}'`
//     );

//     if (result && result.rowCount && result.rowCount > 0) {
//       await client.query(`DROP DATABASE "${testDB}"`);
//     }

//     await client.end();
//   } catch (error) {
//     console.error('Error creating database:', error);
//   }
// });
