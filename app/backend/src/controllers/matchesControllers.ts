import { Request, Response } from 'express';
import MatchesServices from '../services/matchesServices';
import TeamsModels from '../database/models/Teams';

const NO_SUCH = 'There is no team with such id!';

class MatchesControllers {
  public static async getAllMatches(req: Request, res: Response) {
    const { inProgress } = req.query;
    let boolInprogress;
    if (inProgress === 'true') {
      boolInprogress = true;
    } else if (inProgress === 'false') {
      boolInprogress = false;
    }
    const matches = await MatchesServices.getAllMatches(boolInprogress);
    res.status(200).json(matches);
  }

  public static async finishMatch(req: Request, res: Response) {
    const { id } = req.params;
    const finishedMatch = await MatchesServices.finishMatch(
      parseInt(id, 10),
    );
    res.status(200).json({ message: finishedMatch });
  }

  public static async updateScore(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;
    if (!homeTeamGoals || !awayTeamGoals) {
      res.status(400).json({ message: 'Missing score' });
      return;
    }
    const updatedMatch = await MatchesServices.updateScore(
      parseInt(id, 10),
      homeTeamGoals,
      awayTeamGoals,
    );
    res.status(200).json(updatedMatch);
  }

  public static async createMatch(req: Request, res: Response) {
    const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = req.body;
    if (!homeTeamId || !awayTeamId || !homeTeamGoals || !awayTeamGoals) {
      return res.status(400).json({ message: 'Missing parameters' });
    }
    if (homeTeamId === awayTeamId) {
      return res.status(400)
        .json({ message: 'It is not possible to create a match with two equal teams' });
    }
    const homeTeam = await TeamsModels.findByPk(homeTeamId);
    const awayTeam = await TeamsModels.findByPk(awayTeamId);
    if (!homeTeam || !awayTeam) return res.status(400).json({ message: NO_SUCH });
    const match = await MatchesServices.createMatch(
      homeTeamId,
      awayTeamId,
      homeTeamGoals,
      awayTeamGoals,
    );
    res.status(201).json(match);
  }
}

export default MatchesControllers;
