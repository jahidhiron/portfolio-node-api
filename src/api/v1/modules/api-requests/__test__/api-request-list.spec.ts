import request from 'supertest';
import { initServer } from '../../../../../app';
import { API_PREFIX, API_VERSION, AppDataSource } from '../../../../../config';
import { Express } from 'express';
import { connectPostgresqlDB } from '../../../init';

let app: Express;
const requestRoute = `/${API_PREFIX}/${API_VERSION}/api-requests`;

describe('/api-requests endpoint', () => {
  let accessToken = 'valid_token';

  beforeAll(async () => {
    app = await initServer();
    await connectPostgresqlDB();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('should successfully create api requests for listing', async () => {
    for (let i = 1; i <= 3; i++) {
      const createResponse = await request(app)
        .post(requestRoute)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          companyId: i,
          domainId: i,
          endpoint: `https://api.example.com/endpoint${i}`,
          parameters: `{"param1": "value1", "param2": "value2"}`,
          status: false,
        });

      expect(createResponse.statusCode).toBe(201);
      expect(createResponse.body.response).toBe(true);
    }
  });

  it('should successfully retrieve a list of api requests', async () => {
    const response = await request(app)
      .get(requestRoute)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      name: 'OK',
      statusCode: 200,
      response: true,
      message: 'API Request list retrieved successfully',
      data: {
        requests: expect.any(Array),
        total: expect.any(Number),
      },
    });
    expect(response.body.data.requests.length).toBeGreaterThanOrEqual(3);
  });

  it('should return 401 if unauthorized', async () => {
    const response = await request(app).get(requestRoute);

    expect(response.statusCode).toBe(401);
    expect(response.body).toMatchObject({
      name: 'UnauthorizedError',
      response: false,
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('should return paginated results when pagination is applied', async () => {
    const response = await request(app)
      .get(`${requestRoute}?page=1&limit=2`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.requests.length).toBeLessThanOrEqual(2);
  });

  it('should return an empty list if no requests exist', async () => {
    await AppDataSource.manager.query('DELETE FROM requests');

    const response = await request(app)
      .get(requestRoute)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.requests).toEqual([]);
  });
});
