import { Router } from 'express';
import LeaderboardsControllers from '../controllers/leaderboardsControllers';

const router = Router();

router.get('/', LeaderboardsControllers.getLeaderboards);

export default router;
