import { server } from '..';
import request from 'supertest';
import { expect } from 'chai';

describe('express', function () {
  after(() => {
    server.close()
  })

  it('should respond with 200 for /status', async () => {
    const res = await request(server)
      .get('/status')
    expect(res.statusCode).to.equal(200)
  });

  it('should respond with 404 with non-existant routes', function testPath(done) {
    request(server)
      .get('/non-existant-path')
      .expect(404, done);
  });

  describe('basic auth', async() => {
    it('should respond with 200 when called with valid Authorization header value', async () => {
      const res = await request(server)
      .get('/basic-auth')
      .set('Authorization', 'Basic: bWF0dEBnbWFpbC5jb206dGhpcyBpcyBhIHZAbGlkIHBhc3N3b3JkIQ==');
      expect(res.statusCode).to.equal(200);
    });
  })

  describe('sad scenarios', ()=> {
    it('should return bad request when there is not auth header', async ()=> {
      const res = await request(server)
      .get('/basic-auth')
      expect(res.statusCode).to.equal(400);
    });
    it('should return bad request when there is no basic auth header', async ()=> {
      const res = await request(server)
      .get('/basic-auth')
      .set('Authorization', 'Bearer: bWF0dEBnbWFpbC5jb206dGhpcyBpcyBhIHZAbGlkIHBhc3N3b3JkIQ==');
      expect(res.statusCode).to.equal(400);
    });
    it('should return bad request when there is username and password combination is not given in auth header', async ()=> {
      const res = await request(server)
      .get('/basic-auth')
      .set('Authorization', 'Basic: YWJjPXh5eg==');
      expect(res.statusCode).to.equal(400);
    });
    it('should respond with 401 when called with invalid Authorization header value', async () => {
      const res = await request(server)
      .get('/basic-auth')
      .set('Authorization', 'Basic: dEBnbWFpbC5jb206dGhpcyBpcyBhIHZAbGlkIHBhc3N3b3JkIQ==');
      expect(res.statusCode).to.equal(401);
    });
  })
});