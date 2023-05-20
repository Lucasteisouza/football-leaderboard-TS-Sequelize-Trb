import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import { Response } from 'superagent';
// import MatchesServices from '../services/matchesServices';
import MatchesModel from '../database/models/Matches';

chai.use(chaiHttp);

const { expect } = chai;

const allMatchesMock = [
  {
    id: 1,
    homeTeamId: 16,
    homeTeamGoals: 1,
    awayTeamId: 8,
    awayTeamGoals: 1,
    inProgress: 0,
  },
  {
    id: 2,
    homeTeamId: 9,
    homeTeamGoals: 1,
    awayTeamId: 14,
    awayTeamGoals: 1,
    inProgress: 0,
  },
  {
    id: 3,
    homeTeamId: 4,
    homeTeamGoals: 3,
    awayTeamId: 11,
    awayTeamGoals: 0,
    inProgress: 1,
  },
]

describe ('Matches tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return a list with all matches' , async () => {
    sinon.stub(MatchesModel, 'findAll').resolves(allMatchesMock as unknown as MatchesModel[]);
    const chaiHttpResponse: Response = await chai.request(app).post('/matches').send();
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal(allMatchesMock);
  });

  it('should return in progress matches only', async () => {
    sinon.stub(MatchesModel, 'findAll').resolves(allMatchesMock as unknown as MatchesModel[]);
    const chaiHttpResponse: Response = await chai.request(app).post('/matches/?inProgress=true').send();
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal([allMatchesMock[2]]);
  });

  it('should return in NOT progress matches only', async () => {
    sinon.stub(MatchesModel, 'findAll').resolves(allMatchesMock as unknown as MatchesModel[]);
    const chaiHttpResponse: Response = await chai.request(app).post('/matches/?inProgress=false').send();
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body).to.be.deep.equal([allMatchesMock[0], allMatchesMock[1]]);
  });

  it('should finish a game and return "finished"', async () => {
    sinon.stub(MatchesModel, 'findByPk'). resolves(allMatchesMock[0] as unknown as MatchesModel);
    const chaiHttpResponse: Response = await chai.request(app).patch('/1/finish').send();
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body.message).to.be.equal('Finished')
  });
});