import request from 'supertest';
import { initServer } from '../../../../../app';
import { API_PREFIX, API_VERSION, AppDataSource } from '../../../../../config';
import { Express } from 'express';
import { connectPostgresqlDB } from '../../../init';

let app: Express;
const createRequestRoute = `/${API_PREFIX}/${API_VERSION}/api-requests`;

describe('/api-requests endpoint', () => {
  beforeAll(async () => {
    app = await initServer();
    await connectPostgresqlDB();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('should successfully create a new request', async () => {
    const response = await request(app).post(createRequestRoute).send({
      endpoint: 'https://api.example.com/endpoint',
      parameters: 'is_active: true',
      companyId: 1,
      domainId: 1,
      status: true,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      name: 'Created',
      statusCode: 201,
      response: true,
      message: 'API Request created successfully',
      data: {
        request: {
          endpoint: 'https://api.example.com/endpoint',
          parameters: 'is_active: true',
          companyId: 1,
          domainId: 1,
          status: true,
        },
      },
    });
  });

  it('should return a 400 error for invalid input', async () => {
    const response = await request(app).post(createRequestRoute).send({
      companyId: 'not-a-number',
      domainId: 'invalid',
      endpoint: 'https://api.example.com/endpoint',
      parameters: 'is_active: true',
      status: 'not-boolean',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      name: 'InvalidRequestParametersError',
      response: false,
      message: 'Invalid request parameters',
      statusCode: 400,
      errors: expect.arrayContaining([
        {
          message: 'val-number-required',
          field: 'companyId',
          location: 'body',
        },
        {
          message: 'val-number-required',
          field: 'domainId',
          location: 'body',
        },
        { message: 'val-boolean-value', field: 'status', location: 'body' },
      ]),
    });
  });

  it('should return a 409 error if a duplicate request exists', async () => {
    await request(app).post(createRequestRoute).send({
      companyId: 1,
      domainId: 1,
      endpoint: 'https://api.example.com/endpoint',
      parameters: 'is_active: true',
      status: true,
    });

    const response = await request(app).post(createRequestRoute).send({
      companyId: 1,
      domainId: 1,
      endpoint: 'https://api.example.com/endpoint',
      parameters: 'is_active: true',
      status: true,
    });

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({
      response: false,
      name: 'ConflictError',
      message: 'error-request-already-exists',
      statusCode: 409,
      errors: [{ message: 'error-request-already-exists' }],
    });
  });

  it('should return a 500 error for internal server error', async () => {
    jest.spyOn(AppDataSource.manager, 'save').mockImplementationOnce(() => {
      throw new Error('Internal server error');
    });

    const response = await request(app).post(createRequestRoute).send({
      companyId: 1,
      domainId: 1,
      endpoint: 'https://api.example.com/endpoint',
      parameters: 'is_active: true',
      status: true,
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toMatchObject({
      response: false,
      name: 'InternalServerError',
      message: 'Internal server error',
      statusCode: 500,
      errors: [{ message: 'Internal server error' }],
    });
  });
});
