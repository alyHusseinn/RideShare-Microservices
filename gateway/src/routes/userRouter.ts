import express from 'express';
import userController from '../controllers/userController';
import { checkJwt } from '../middleware/checkJwt';
import { checkRole } from '../middleware/checkRole';
import { User } from '../models/user';
import { Request } from 'express';

const router = express.Router();

router.post('/auth/register', userController.createUser);
router.post('/auth/login', userController.loginUser);
router.get('/auth/me', checkJwt, async (req: Request & { user?: User }, res) => {
  const user = req.user
  res.status(200).json({ username: user?.username, id: user?.id, role: user?.role });
});
router.get('/:id', checkJwt, userController.getUser);
router.get('/', checkJwt, userController.getAllUsers);
router.delete('/:id', checkJwt, userController.deleteUser);

export default router;
