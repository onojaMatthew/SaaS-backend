import request from 'supertest';
import app from '../../src/app';
import { User } from '../../src/models/user';

describe('POST /api/v1/auth/register', () => {
  const userObj = {
    name: "Moses Agbo", 
    email: "moses@gmail.com", 
    password: "igochemat7@@", 
    businessName: "enyawuson",
    role: "user"
  };

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userObj)
      .expect(201);

    // console.log(response.body, " the response");
    const resp = response.body;
    console.log(resp.data, resp.success)
    expect(resp.success).toBe(true);

    // Assert businessId exists in data
    // expect(resp.data).toHaveProperty('business');
    // expect(resp.data).toHaveProperty('token');
    // expect(resp.message).toH
  });

  // it('should return 400 for missing fields', async () => {
  //   const response = await request(app)
  //     .post('/api/v1/auth/register')
  //     .send({ email: userObj.email })
  //     .expect(400);

  //   expect(response.body.success).toBeFalsy();
  // });

  // it('should return 400 for existing email', async () => {
  //   // Create user first
  //   await User.create(userObj);
    
  //   const response = await request(app)
  //     .post('/api/v1/auth/register')
  //     .send(userObj)
  //     .expect(400);

  //   expect(response.body.error).toMatch(/Email already taken/i);
  // });
});