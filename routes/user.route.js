var express = require('express');
var router = express.Router();
const userController = require('../controller/user.controller');
const userValidation = require('../middleware/validation/user.validation');
const userMiddelwere = require('../middleware/user.middleware');

router.get('/registration', userMiddelwere.userNotAuthenticated, userController.getRegistration);

router.get('/resendmail', userController.getResend);

router.get('/', userMiddelwere.userNotAuthenticated, userController.getLogin);

router.get('/verify/:token', userMiddelwere.userNotAuthenticated, userController.getVerify);

router.get('/user/dashboard', userMiddelwere.userAuthentication, userController.getDashboard);

router.get('/resetpassword/:token', userController.getResetPassword);

router.get('/forgetpassword', userController.getForgetPassword);

router.get('/auth/google', userController.getPassportAuth);

router.get('/auth/google/callback', userController.getGoogleCallback);

router.post('/resendmail', userController.postResend);

router.post('/registration', userMiddelwere.userNotAuthenticated, userValidation.registrationValidation, userController.postRegistration);

router.post('/', userMiddelwere.userNotAuthenticated, userValidation.loginValidation, userController.postLogin);

router.post('/user/dashboard', userMiddelwere.userAuthentication, userController.postDashboard);

router.post('/forgetpassword', userController.postForgetPassword);

router.post('/resetpassword', userValidation.resetPasswordValidation, userController.postResetPassword);

router.post('/logout', userMiddelwere.userAuthentication, userController.postLogout);

module.exports = router;
