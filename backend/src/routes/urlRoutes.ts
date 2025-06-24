import { Router } from 'express';
import { createUrl, getUrl} from '../controllers/urlController';

const router = Router();

router.post('/tinyurls', createUrl);
router.get('/tinyurls', getUrl);

export default router;

