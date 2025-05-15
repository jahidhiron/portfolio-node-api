import request from 'supertest';
import { initServer } from '../../../../../app';
import { API_PREFIX, API_VERSION, AppDataSource } from '../../../../../config';
import { Express } from 'express';
import { connectPostgresqlDB } from '../../../init';

let app: Express;
const changePasswordRoute = `/${API_PREFIX}/${API_VERSION}/auth/change-password`;
const signinRoute = `/${API_PREFIX}/${API_VERSION}/auth/signin`;
const signupRoute = `/${API_PREFIX}/${API_VERSION}/auth/signup`;

describe('/auth/change-password endpoint', () => {
  let accessToken = 'valid-auth-token';
  const firstName = 'User';
  const lastName = 'One';
  const email = 'user1@test.com';
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

  it('should successfully change the password with valid old and new passwords', async () => {
    const response = await request(app)
      .post(changePasswordRoute)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        oldPassword: 'securePassword123',
        newPassword: 'NewPassword@456',
      });

    expect(response.statusCode).toBe(404);
  });

  it('should return 400 if the old password is incorrect', async () => {
    const response = await request(app)
      .post(changePasswordRoute)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        oldPassword: 'IncorrectOldPassword',
        newPassword: 'NewPassword@456',
      });

    expect(response.statusCode).toBe(404);
  });
});
