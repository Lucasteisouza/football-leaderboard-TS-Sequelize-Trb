import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UsersModel from '../database/models/Users';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

const validUserMock = { email: 'admin@admin.com', password: '123456' };
const invalidUserMock = { email: 'aaaa', password: '123456' };

describe('User and login tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  // it('Should return a token when login', async () => {
  //   sinon.stub(UsersModel, 'findAll').resolves([validUserMock] as UsersModel[]);
  //   const chaiHttpResponse: Response = await chai.request(app).post('/login').send(validUserMock);
  //   expect(chaiHttpResponse.status).to.be.equal(200);
  //   expect(chaiHttpResponse.body).to.have.property('token');
  // })

  it('Should return an error when login with invalid email', async () => {
    sinon.stub(UsersModel, 'findAll').resolves([validUserMock] as UsersModel[]);
    const chaiHttpResponse: Response = await chai.request(app).post('/login').send(invalidUserMock);
    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body.message).to.be.equal('Invalid email or password');
  });

  it('Should return an error when login with invalid password', async () => {
    sinon.stub(UsersModel, 'findAll').resolves([validUserMock] as UsersModel[]);
    const chaiHttpResponse: Response = await chai.request(app).post('/login').send({ ...validUserMock, password: '123' });
    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body.message).to.be.equal('Invalid email or password');
  });

  it('Should return an error when login with empty email', async () => {
    sinon.stub(UsersModel, 'findAll').resolves([validUserMock] as UsersModel[]);
    const chaiHttpResponse: Response = await chai.request(app).post('/login').send({ ...validUserMock, email: '' });
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
  });

  it('Should return an error when login with empty password', async () => {
    sinon.stub(UsersModel, 'findAll').resolves([validUserMock] as UsersModel[]);
    const chaiHttpResponse: Response = await chai.request(app).post('/login').send({ ...validUserMock, password: '' });
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
  });

  it('Should return an error when login with empty email and password', async () => {
    sinon.stub(UsersModel, 'findAll').resolves([validUserMock] as UsersModel[]);
    const chaiHttpResponse: Response = await chai.request(app).post('/login').send({ ...validUserMock, email: '', password: '' });
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
  });
});