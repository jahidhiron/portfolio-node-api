import request from 'supertest';
import { initServer } from '../../../../../app';
import { API_PREFIX, API_VERSION, AppDataSource } from '../../../../../config';
import { Express } from 'express';
import { connectPostgresqlDB } from '../../../init';

let app: Express;
const signinRoute = `/${API_PREFIX}/${API_VERSION}/auth/signin`;
const signOutRoute = `/${API_PREFIX}/${API_VERSION}/auth/signout`;
const signupRoute = `/${API_PREFIX}/${API_VERSION}/auth/signup`;

describe('/auth/signout endpoint', () => {
  let invalidToken = 'valid-auth-token';
  let accessToken = 'valid-auth-token';
  const firstName = 'User';
  const lastName = 'Seven';
  const email = 'user7@test.com';
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

  it('should successfully sign out with a valid token', async () => {
    const response = await request(app)
      .get(signOutRoute)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      name: 'OK',
      statusCode: 200,
      response: true,
      message: 'succ-signout',
    });
  });

  it('should return 401 for missing or invalid token', async () => {
    const response = await request(app)
      .get(signOutRoute)
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.statusCode).toBe(401);
    expect(response.body).toMatchObject({
      name: 'UnauthorizedError',
      statusCode: 401,
      response: false,
      message: 'error-unauthorized',
      errors: [{ message: 'error-unauthorized' }],
    });
  });

  it('should return 401 for missing authorization header', async () => {
    const response = await request(app).get(signOutRoute);

    expect(response.statusCode).toBe(401);
    expect(response.body).toMatchObject({
      name: 'UnauthorizedError',
      statusCode: 401,
      response: false,
      message: 'error-unauthorized',
      errors: [{ message: 'error-unauthorized' }],
    });
  });
});
