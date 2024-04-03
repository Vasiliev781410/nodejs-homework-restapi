const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/settings'); // !!!

const {validateBodyCatalog} = require('../../utils');

const { authenticate} = require('../../middlewares');

const {schemas} = require('../../models/settings');  // !!!

router.post('/', authenticate, validateBodyCatalog(schemas.addSchema), ctrl.add);
router.get('/:id', authenticate, validateBodyCatalog(schemas.addSchema), ctrl.getByName);
router.patch('/:id', authenticate, validateBodyCatalog(schemas.addSchema), ctrl.update);

module.exports = router
