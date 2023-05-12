import { Router } from 'express';
import TeamControllers from '../controllers/teamControllers';

const router = Router();

router.get('/', TeamControllers.getAllTeams);
router.get('/:id', TeamControllers.getTeamById);

export default router;
