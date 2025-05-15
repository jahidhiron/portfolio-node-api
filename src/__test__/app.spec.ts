import { Express } from 'express';
import request from 'supertest';
import { initServer } from '../app';
import { config } from '../config';

const testDB = config.POSTGRES_DATABASE;

let app: Express;

beforeAll(async () => {
  app = await initServer();
  jest.setTimeout(10000);
});

describe('App', () => {
  it('should respond to API documentation endpoint', async () => {
    const response = await request(app).get('/api-docs');
    expect(response.status).toBe(301);
  });

  it('should respond with a 200 status on the root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('should respond to API documentation endpoint', async () => {
    const response = await request(app).get('/not-found-route');
    expect(response.status).toBe(404);
  });
});
