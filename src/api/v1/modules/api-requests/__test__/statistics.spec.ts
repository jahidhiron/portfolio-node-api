import request from 'supertest';
import { initServer } from '../../../../../app';
import { API_PREFIX, API_VERSION, AppDataSource } from '../../../../../config';
import { Express } from 'express';
import { connectPostgresqlDB } from '../../../init';

let app: Express;
const requestRoute = `/${API_PREFIX}/${API_VERSION}/api-requests`;
const statisticsRoute = `/${API_PREFIX}/${API_VERSION}/api-requests/statistics`;

describe('/api-requests/statistics endpoint', () => {
  let accessToken = 'valid_token';

  beforeAll(async () => {
    app = await initServer();
    await connectPostgresqlDB();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('should successfully get statistics', async () => {
    const from = '2024-10-01';
    const to = '2024-10-16';

    const res = await request(app)
      .get(`${statisticsRoute}?from=${from}&to=${to}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.response).toBe(true);
    expect(res.body.data.stats).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'API Requests',
          dates: expect.any(Array),
          data: expect.any(Array),
        }),
      ])
    );
  });
});
