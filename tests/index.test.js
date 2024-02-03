// index.test.js
const request = require('supertest');
const server = require('../index');
const db = require('../db');

describe('GET /notes', () => {
  afterAll(async () => {
    // Close the server and the database connection after the tests have finished running
    await db.end();
    server.close();
  });

  it('responds with json', async () => {
    const response = await request(server).get(`/notes`);

    expect(response.statusCode).toBe(200);
    expect(response.type).toBe('application/json');
  });
});