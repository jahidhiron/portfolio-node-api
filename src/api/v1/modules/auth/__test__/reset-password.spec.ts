import request from 'supertest';
import { initServer } from '../../../../../app';
import { API_PREFIX, API_VERSION, AppDataSource } from '../../../../../config';
import { Express } from 'express';
import { connectPostgresqlDB } from '../../../init';

let app: Express;
const resetPasswordRoute = `/${API_PREFIX}/${API_VERSION}/auth/reset-password`;
const signupRoute = `/${API_PREFIX}/${API_VERSION}/auth/signup`;

describe('/auth/reset-password endpoint', () => {
  let userEmail = 'jane.doe@example.com';
  let invalidToken = 'invalid-token-example';
  const firstName = 'User';
  const lastName = 'Five';
  const email = 'user5@test.com';
  const password = 'securePassword123';
  const role = 3;

  beforeAll(async () => {
    app = await initServer();
    await connectPostgresqlDB();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('should successfully sign up a new user', async () => {
    const response = await request(app).post(signupRoute).send({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      name: 'Created',
      statusCode: 201,
      response: true,
      message: 'succ-signup',
      data: {
        user: {
          firstName,
          lastName,
          email,
          verified: false,
        },
      },
    });
  });

  it('should return 400 for invalid input (missing fields)', async () => {
    const response = await request(app).post(resetPasswordRoute).send({
      email: 'invalid-email',
      token: 'invalid-token',
      password: '123456',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      name: 'InvalidRequestParametersError',
      statusCode: 400,
      response: false,
      message: 'Invalid request parameters',
      errors: [
        { message: 'val-invalid-email', field: 'email', location: 'body' },
      ],
    });
  });

  it('should return 400 for invalid token format', async () => {
    const response = await request(app).post(resetPasswordRoute).send({
      email,
      token: invalidToken,
      password: 'NewPassword@123',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      name: 'BadRequestError',
      response: false,
      message: 'error-time-expired',
      statusCode: 400,
      errors: [{ message: 'error-time-expired' }],
    });
  });

  it('should return 404 for non-existent user email', async () => {
    const response = await request(app).post(resetPasswordRoute).send({
      email: 'nonexistent@example.com',
      token: invalidToken,
      password: 'NewPassword@123',
    });

    expect(response.statusCode).toBe(404);
    expect(response.body).toMatchObject({
      response: false,
      name: 'NotFoundError',
      message: 'error-user-not-found',
      statusCode: 404,
      errors: [{ message: 'error-user-not-found' }],
    });
  });
});
