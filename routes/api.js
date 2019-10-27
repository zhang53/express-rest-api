const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const verifyToken = require('../middleware/VerifyToken');
const verifyRefreshToken = require('../middleware/VerifyRefreshToken');
const hasRole = require('../middleware/HasRole');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const authController = require('../controllers/AuthController');
router.post('/auth/login', authController.login);
router.post('/auth/logout', verifyRefreshToken, authController.logout);
router.post('/auth/refresh', verifyRefreshToken, authController.refresh);
router.post('/auth/register', authController.register);
router.get('/auth/user', verifyToken, authController.user);

const passwordController = require('../controllers/PasswordController');
router.put('/password/forgot', passwordController.forgot);
router.put('/password/reset', passwordController.reset);
router.put('/password/change', verifyToken, passwordController.change);

const userController = require('../controllers/UserController');
router.post('/user', verifyToken, hasRole('admin'), userController.create);
router.get('/user', verifyToken, hasRole('admin'), userController.all);
router.get('/user/:id', verifyToken, hasRole('admin'), userController.one);
router.delete('/user/:id', verifyToken, hasRole('admin'), userController.remove);
router.put('/user/:id', verifyToken, hasRole('admin'), userController.update);

module.exports = router;