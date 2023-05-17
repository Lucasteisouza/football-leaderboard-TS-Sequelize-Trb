import { Router } from 'express';
import MatchesControllers from '../controllers/matchesControllers';
import loginInfo from '../middlewares/loginInfo';

const router = Router();

router.get('/', MatchesControllers.getAllMatches);
router.patch('/:id/finish', loginInfo.hasValidToken, MatchesControllers.finishMatch);
router.patch('/:id', loginInfo.hasValidToken, MatchesControllers.updateScore);
router.post('/', loginInfo.hasValidToken, MatchesControllers.createMatch);

export default router;
