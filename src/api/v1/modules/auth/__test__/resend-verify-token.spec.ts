import request from 'supertest';
import { initServer } from '../../../../../app';
import { API_PREFIX, API_VERSION, AppDataSource } from '../../../../../config';
import { Express } from 'express';
import { connectPostgresqlDB } from '../../../init';

let app: Express;
const signupRoute = `/${API_PREFIX}/${API_VERSION}/auth/signup`;
const resendVerifyTokenRoute = `/${API_PREFIX}/${API_VERSION}/auth/resend-verify-token`;

describe('/auth/resend-verify-token endpoint', () => {
  const firstName = 'User';
  const lastName = 'Four';
  const email = 'user1=4@test.com';
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

  it('should successfully resend the verification token', async () => {
    const response = await request(app).post(resendVerifyTokenRoute).send({
      email,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      name: 'OK',
      statusCode: 200,
      response: true,
      message: 'succ-resend-email-verification-token',
    });
  });

  it('should return 400 for invalid email format', async () => {
    const response = await request(app).post(resendVerifyTokenRoute).send({
      email: 'invalid-email-format',
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

  it('should return 404 for user not found', async () => {
    const response = await request(app).post(resendVerifyTokenRoute).send({
      email: 'nonexistent.user@example.com',
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
