import TeamsModel from '../database/models/Teams';
import MatchesModel, { MatchesAttributes } from '../database/models/Matches';

interface FinishedMatchAttr {
  homeTeamGoals: number;
  awayTeamGoals: number;
}

class MatchesServices {
  public static async getAllMatches(inProgress: boolean | undefined):Promise<MatchesAttributes[]> {
    if (inProgress === undefined) {
      const matches = await MatchesModel.findAll({
        include: [
          { model: TeamsModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
          { model: TeamsModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
        ],
      });
      return matches.map((match) => match.toJSON());
    }

    const matches = await MatchesModel.findAll({
      where: { inProgress },
      include: [
        { model: TeamsModel, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: TeamsModel, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });
    return matches.map((match) => match.toJSON());
  }

  public static async finishMatch(
    matchId: number,
  ):Promise<string> {
    const match = await MatchesModel.findByPk(matchId);
    if (!match) throw new Error('Match not found');
    match.update({
      inProgress: false,
    });
    return 'Finished';
  }

  public static async updateScore(
    matchId: number,
    homeTeamGoals: number,
    awayTeamGoals: number,
  ): Promise<FinishedMatchAttr> {
    const match = await MatchesModel.findByPk(matchId);
    if (!match) throw new Error('Match not found');
    match.update({
      homeTeamGoals,
      awayTeamGoals,
    });
    return { homeTeamGoals, awayTeamGoals };
  }
}

export default MatchesServices;
