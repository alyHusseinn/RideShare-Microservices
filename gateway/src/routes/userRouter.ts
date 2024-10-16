import express from 'express';
import { UserController } from '../controllers/userController';
import { checkJwt } from '../middleware/checkJwt';
import { checkRole } from '../middleware/checkRole';

const router = express.Router();

const userController = new UserController();

router.post('/auth/register', userController.createUser.bind(userController));
router.post('/auth/login', userController.loginUser.bind(userController));
router.get('/:id', checkJwt, userController.getUser.bind(userController));
router.get('/', checkJwt, userController.getAllUsers.bind(userController));
router.delete('/:id', checkJwt, userController.deleteUser.bind(userController));

export default router;
