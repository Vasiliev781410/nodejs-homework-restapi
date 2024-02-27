const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/settings'); // !!!

const {validateBodyCatalog} = require('../../utils');

const { authenticate} = require('../../middlewares');

const {schemas} = require('../../models/settings');  // !!!

router.post('/', authenticate, validateBodyCatalog(schemas.addSchema), ctrl.add);


module.exports = router
