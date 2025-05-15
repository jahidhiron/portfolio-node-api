import request from 'supertest';
import { initServer } from '../../../../../app';
import { API_PREFIX, API_VERSION, AppDataSource } from '../../../../../config';
import { Express } from 'express';
import { connectPostgresqlDB } from '../../../init';

let app: Express;
const signinRoute = `/${API_PREFIX}/${API_VERSION}/auth/signin`;
const signupRoute = `/${API_PREFIX}/${API_VERSION}/auth/signup`;

describe('/auth/signin endpoint', () => {
  let accessToken = 'valid-auth-token';
  const firstName = 'User';
  const lastName = 'Six';
  const email = 'user6@test.com';
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

    accessToken = response.body.data.tokens.accessToken;
  });

  it('should return 400 for missing email or password', async () => {
    const response = await request(app)
      .post(signinRoute)
      .send({ email: 'invalid-email', password: '123' });
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      name: 'InvalidRequestParametersError',
      response: false,
      message: 'Invalid request parameters',
      statusCode: 400,
      errors: expect.arrayContaining([
        { message: 'val-invalid-email', field: 'email', location: 'body' },
        {
          message: 'val-password-requirement',
          field: 'password',
          location: 'body',
        },
      ]),
    });
  });

  it('should return 401 for invalid credentials', async () => {
    const response = await request(app).post(signinRoute).send({
      email: 'john.doe@example.com',
      password: 'WrongPassword@1234',
    });
    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      name: 'UnauthorizedError',
      response: false,
      message: 'error-invalid-credentials',
      statusCode: 401,
      errors: expect.arrayContaining([
        { message: 'error-invalid-credentials' },
      ]),
    });
  });
});
