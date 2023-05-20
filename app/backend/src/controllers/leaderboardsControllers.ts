import { Request, Response } from 'express';
import LeaderboardsServices from '../services/leaderboardsServices';

class LeaderboardsControllers {
  public static async getLeaderboards(_req: Request, res: Response) {
    const leaderboards = await LeaderboardsServices.getLeaderboards();
    res.status(200).json(leaderboards);
  }
}

export default LeaderboardsControllers;
