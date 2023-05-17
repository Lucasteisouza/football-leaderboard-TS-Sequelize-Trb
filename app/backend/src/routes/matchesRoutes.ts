import { Router } from 'express';
import MatchesControllers from '../controllers/matchesControllers';
import loginInfo from '../middlewares/loginInfo';

const router = Router();

router.get('/', MatchesControllers.getAllMatches);
router.patch('/:id/finish', loginInfo.hasValidToken, MatchesControllers.finishMatch);

export default router;
