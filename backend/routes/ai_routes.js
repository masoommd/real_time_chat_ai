import  {Router} from 'express';
import * as aiController from '../controllers/ai_controller.js'

const router = Router();

router.get('/get-result',aiController.getResult)

export default router;