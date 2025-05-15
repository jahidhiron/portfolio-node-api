import request from 'supertest';
import { initServer } from '../../../../../app';
import { API_PREFIX, API_VERSION, AppDataSource } from '../../../../../config';
import { Express } from 'express';
import { connectPostgresqlDB } from '../../../../../api/v1/init';

let app: Express;
const signupRoute = `/${API_PREFIX}/${API_VERSION}/auth/signup`;

describe('/auth/signup endpoint', () => {
  beforeAll(async () => {
    app = await initServer();
    await connectPostgresqlDB();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it('should successfully sign up a new user', async () => {
    const response = await request(app).post(signupRoute).send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'securePassword123',
      role: 3,
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      name: 'Created',
      statusCode: 201,
      response: true,
      message: 'succ-signup',
      data: {
        user: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          verified: false,
        },
      },
    });
  });

  it('should return a 400 error for invalid input', async () => {
    const response = await request(app).post(signupRoute).send({
      firstName: '',
      lastName: '',
      email: 'invalid-email',
      password: '123',
      role: 'invalid-role',
    });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      name: 'InvalidRequestParametersError',
      response: false,
      message: 'Invalid request parameters',
      statusCode: 400,
      errors: expect.arrayContaining([
        {
          message: 'val-field-required',
          field: 'firstName',
          location: 'body',
        },
        {
          message: 'val-field-required',
          field: 'lastName',
          location: 'body',
        },
        { message: 'val-invalid-email', field: 'email', location: 'body' },
        {
          message: 'val-password-requirement',
          field: 'password',
          location: 'body',
        },
        { message: 'val-numeric-value', field: 'role', location: 'body' },
      ]),
    });
  });

  it('should return a 409 error if the email already exists', async () => {
    await request(app).post(signupRoute).send({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'securePassword123',
      role: 3,
    });

    const response = await request(app).post(signupRoute).send({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'securePassword123',
      role: 3,
    });

    expect(response.status).toBe(409);
    expect(response.body).toMatchObject({
      response: false,
      name: 'ConflictError',
      message: 'error-email-already-use',
      statusCode: 409,
      errors: [{ message: 'error-email-already-use' }],
    });
  });

  it('should return a 500 error for internal server error', async () => {
    jest.spyOn(AppDataSource.manager, 'save').mockImplementationOnce(() => {
      throw new Error('Internal server error');
    });

    const response = await request(app).post(signupRoute).send({
      firstName: 'Mark',
      lastName: 'Smith',
      email: 'mark.smith@example.com',
      password: 'securePassword123',
      role: 3,
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
