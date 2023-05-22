import { Router } from 'express';
import LeaderboardsControllers from '../controllers/leaderboardsControllers';

const router = Router();

router.get('/', LeaderboardsControllers.getLeaderboards);
router.get('/away', LeaderboardsControllers.getLeaderboardsAway);
router.get('/home', LeaderboardsControllers.getLeaderboardsHome);

export default router;
