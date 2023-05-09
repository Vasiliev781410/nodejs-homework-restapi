const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/business-processes');

const {validateBodyCatalog} = require('../../utils');

const { authenticate} = require('../../middlewares');

const {schemas} = require('../../models/business-process');

router.get('/', authenticate, ctrl.listBp);

router.get('/:name', authenticate, ctrl.getBpByName);

router.post('/', authenticate, validateBodyCatalog(schemas.addSchema), ctrl.addBp);

router.delete('/:name', authenticate,  ctrl.removeBp);

router.put('/:name', authenticate, validateBodyCatalog(schemas.addSchema), ctrl.updateBp);


module.exports = router
