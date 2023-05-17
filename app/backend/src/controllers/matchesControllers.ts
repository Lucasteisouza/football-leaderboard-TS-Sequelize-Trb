import { Request, Response } from 'express';
import MatchesServices from '../services/matchesServices';

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
    const { homeTeamGoals, awayTeamGoals } = req.body;
    const finishedMatch = await MatchesServices.finishMatch(
      parseInt(id, 10),
      homeTeamGoals,
      awayTeamGoals,
    );
    res.status(200).json(finishedMatch);
  }
}

export default MatchesControllers;
