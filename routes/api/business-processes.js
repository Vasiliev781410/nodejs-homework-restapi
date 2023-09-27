const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/business-processes');

const {validateBodyCatalog} = require('../../utils');

const { authenticate} = require('../../middlewares');

const {schemas} = require('../../models/business-process');

router.get('/', authenticate, ctrl.listBp);

router.get('/:id', authenticate, ctrl.getBpByFrontId);

router.post('/', authenticate, validateBodyCatalog(schemas.addSchema), ctrl.addBp);

router.delete('/:id', authenticate,  ctrl.removeBp);

router.patch('/:id', authenticate, validateBodyCatalog(schemas.addSchema), ctrl.updateBp);


module.exports = router
