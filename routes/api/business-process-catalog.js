const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/business-process-catalog');


const { authenticate} = require('../../middlewares');

router.get('/', authenticate, ctrl.getCatalog);

router.put('/:name', authenticate, ctrl.updateCatalog);


module.exports = router
