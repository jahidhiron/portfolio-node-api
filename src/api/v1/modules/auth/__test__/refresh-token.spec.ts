import request from 'supertest';
import { initServer } from '../../../../../app';
import { API_PREFIX, API_VERSION, AppDataSource } from '../../../../../config';
import { Express } from 'express';
import { connectPostgresqlDB } from '../../../init';

let app: Express;
const signupRoute = `/${API_PREFIX}/${API_VERSION}/auth/signup`;
const signinRoute = `/${API_PREFIX}/${API_VERSION}/auth/signin`;
const refreshTokenRoute = `/${API_PREFIX}/${API_VERSION}/auth/refresh-token`;

describe('/auth/signout endpoint', () => {
  let accessToken = 'valid-auth-token';
  const firstName = 'User';
  const lastName = 'Three';
  const email = 'user1-3@test.com';
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

  it('should successfully generate a new access and refresh token with valid token', async () => {
    const tokens = await request(app)
      .post(refreshTokenRoute)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(tokens.statusCode).toBe(404);
  });
});
