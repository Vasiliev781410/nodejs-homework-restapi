const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/finances'); // !!!

const {validateBodyCatalog} = require('../../utils');

const { authenticate} = require('../../middlewares');

const {schemas} = require('../../models/finances');  // !!!

router.get('/', authenticate, ctrl.getList);

router.post('/', authenticate, validateBodyCatalog(schemas.addSchema), ctrl.add);


module.exports = router
