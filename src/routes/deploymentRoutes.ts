import { Router } from 'express';
import {
  createDeployment,
  getDeployment,
  getAllDeployments,
  deleteDeployment
} from '../controllers/deploymentController';

const router = Router();

router.post('/', createDeployment);
router.get('/', getAllDeployments);
router.get('/:id', getDeployment);
router.delete('/:id', deleteDeployment);

export default router;