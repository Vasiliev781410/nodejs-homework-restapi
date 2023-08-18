const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/subjects-select');

const {validateBodyCatalog} = require('../../utils');
// const {validateBody} = require('../../utils');

const { authenticate} = require('../../middlewares');

const {schemas} = require('../../models/subjects-select');

router.get('/:subject', authenticate, ctrl.listSubjects);

router.post('/:subject', authenticate, validateBodyCatalog(schemas.addSchema), ctrl.addSubject);

router.delete('/:subject', authenticate,  ctrl.removeSubject);

router.put('/:subject', authenticate, validateBodyCatalog(schemas.addSchema), ctrl.updateSubject);


module.exports = router
