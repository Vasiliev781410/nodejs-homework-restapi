const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/auth');

const {validateBody} = require('../../utils');

const {authenticate, upload} = require('../../middlewares');

const {schemas} = require('../../models/user');

router.post('/register',validateBody(schemas.registerSchema), ctrl.register);

router.get('/verify/:verificationToken',ctrl.verifyEmail);

router.post('/verify',validateBody(schemas.verifySchema), ctrl.resendEmail);

router.post('/login',validateBody(schemas.registerSchema), ctrl.login);

router.get('/current',authenticate, ctrl.getCurrent);

router.post('/logout',authenticate, ctrl.logout);

router.patch('/avatars',authenticate, upload.single('avatar'), ctrl.updateAvatar);

module.exports = router;