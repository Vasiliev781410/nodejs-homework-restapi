const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/business-processes');

const {validateBody} = require('../../utils');

const {isValidId, authenticate} = require('../../middlewares');

const {schemas} = require('../../models/business-process');

router.get('/', authenticate, ctrl.listBp);

router.get('/:id', authenticate, isValidId, ctrl.getBpById);

router.post('/', authenticate, validateBody(schemas.addBp), ctrl.addBp);

router.delete('/:id', authenticate, isValidId, ctrl.removeBp);

router.put('/:id', authenticate, isValidId, validateBody(schemas.addBp), ctrl.updateBp);


module.exports = router
