import TeamsModel, { TeamsAttributes } from '../database/models/Teams';

class TeamServices {
  public static async getAllTeams():Promise<TeamsAttributes[]> {
    const teams = await TeamsModel.findAll();
    return teams.map((team) => team.toJSON());
  }

  public static async getTeamById(id: number):Promise<TeamsAttributes | null> {
    const team = await TeamsModel.findByPk(id);
    if (!team) throw new Error('Team not found');
    return team.toJSON();
  }
}

export default TeamServices;
