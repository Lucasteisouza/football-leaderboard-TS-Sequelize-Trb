import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamServices from '../services/teamsServices';

import { Response } from 'superagent';

const allTeamsMock = [
  { id: 1, teamName: 'Avaí/Kindermann' },
  { id: 2, teamName: 'Bahia' },
  { id: 3, teamName: 'Botafogo' },
  { id: 4, teamName: 'Corinthians' },
  { id: 5, teamName: 'Cruzeiro' },
];

chai.use(chaiHttp);

const { expect } = chai;

describe('Teams tests', () => {
  let chaiHttpResponse: Response;

  afterEach(() => {
    sinon.restore();
  })
  it('Should return all teams', async () => {
    sinon
      .stub(TeamServices, 'getAllTeams')
      .resolves(allTeamsMock);
    chaiHttpResponse = await chai.request(app).get('/teams');
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(allTeamsMock);
  });

  it('Should return a team by id', async () => {
    const teamId = 1;
    sinon
      .stub(TeamServices, "getTeamById")
      .withArgs(teamId)
      .resolves(allTeamsMock[0]);
    chaiHttpResponse = await chai.request(app).get(`/teams/${teamId}`);
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(allTeamsMock[0]);
  });
});