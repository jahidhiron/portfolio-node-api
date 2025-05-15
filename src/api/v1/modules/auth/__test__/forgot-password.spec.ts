import request from 'supertest';
import { initServer } from '../../../../../app';
import { API_PREFIX, API_VERSION, AppDataSource } from '../../../../../config';
import { Express } from 'express';
import { connectPostgresqlDB } from '../../../init';

let app: Express;
const forgotPasswordRoute = `/${API_PREFIX}/${API_VERSION}/auth/forgot-password`;
const signupRoute = `/${API_PREFIX}/${API_VERSION}/auth/signup`;
const signinRoute = `/${API_PREFIX}/${API_VERSION}/auth/signin`;

describe('/auth/forgot-password endpoint', () => {
  let userEmail = 'jane.doe@example.com';
  let nonExistentEmail = 'nonexistent@example.com';
  const firstName = 'User';
  const lastName = 'Two';
  const email = 'user2@test.com';
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

  it('should successfully sign in with valid credentials', async () => {
    const response = await request(app).post(signinRoute).send({
      email,
      password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      name: 'OK',
      statusCode: 200,
      response: true,
      message: 'succ-signin',
      data: {
        user: {
          email,
          verified: expect.any(Boolean),
          role: expect.any(Number),
          lastLogin: expect.any(String),
        },
        tokens: {
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        },
      },
    });
  });

  it('should successfully send a password reset token to the email', async () => {
    const response = await request(app).post(forgotPasswordRoute).send({
      email,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      name: 'OK',
      statusCode: 200,
      response: true,
      message: 'succ-send-forgot-password-token',
    });
  });

  it('should return 400 for invalid email format', async () => {
    const response = await request(app).post(forgotPasswordRoute).send({
      email: 'invalid-email-format',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject({
      name: 'InvalidRequestParametersError',
      statusCode: 400,
      response: false,
      message: 'Invalid request parameters',
      errors: [
        {
          message: 'val-invalid-email',
          field: 'email',
          location: 'body',
        },
      ],
    });
  });

  it('should return 404 for non-existent user email', async () => {
    const response = await request(app).post(forgotPasswordRoute).send({
      email: nonExistentEmail,
    });

    expect(response.statusCode).toBe(404);
    expect(response.body).toMatchObject({
      response: false,
      name: 'NotFoundError',
      message: 'error-user-not-found',
      statusCode: 404,
      errors: [
        {
          message: 'error-user-not-found',
        },
      ],
    });
  });
});
