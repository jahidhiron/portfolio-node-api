import request from 'supertest';
import { initServer } from '../../../../../app';
import { API_PREFIX, API_VERSION, AppDataSource } from '../../../../../config';
import { Express } from 'express';
import { connectPostgresqlDB } from '../../../init';

let app: Express;
const verifyEmailRoute = `/${API_PREFIX}/${API_VERSION}/auth/verify-email`;
const signupRoute = `/${API_PREFIX}/${API_VERSION}/auth/signup`;

describe('/auth/verify-email endpoint', () => {
  let userEmail = 'john.doe@example.com';
  let verificationToken = 'invalid-token';
  const firstName = 'User';
  const lastName = 'Eight';
  const email = 'user8@test.com';
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

  it('should return 400 for missing email or token', async () => {
    const response = await request(app).post(verifyEmailRoute).send({
      email: 'invalid-email',
      token: 'invalid-token',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      name: 'InvalidRequestParametersError',
      statusCode: 400,
      response: false,
      message: 'Invalid request parameters',
      errors: expect.arrayContaining([
        { message: 'val-invalid-email', field: 'email', location: 'body' },
      ]),
    });
  });

  it('should return 400 for invalid token', async () => {
    const response = await request(app).post(verifyEmailRoute).send({
      email,
      token: verificationToken,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      name: 'BadRequestError',
      statusCode: 400,
      response: false,
      message: 'error-time-expired',
      errors: [
        {
          message: 'error-time-expired',
        },
      ],
    });
  });
});
