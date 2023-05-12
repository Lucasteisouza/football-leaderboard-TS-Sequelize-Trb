import { Request, Response } from 'express';
import TeamServices from '../services/teamsServices';

class TeamControllers {
  public static async getAllTeams(_req: Request, res: Response) {
    const teams = await TeamServices.getAllTeams();
    res.status(200).json(teams);
  }

  public static async getTeamById(req: Request, res: Response) {
    const { id } = req.params;
    const team = await TeamServices.getTeamById(Number(id));
    res.status(200).json(team);
  }
}

export default TeamControllers;
