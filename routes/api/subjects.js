const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/subjects');

const {validateBodyCatalog} = require('../../utils');

const { authenticate} = require('../../middlewares');

const {schemas} = require('../../models/subjects');

router.get('/', authenticate, ctrl.listSubjects);

router.get('/:id', authenticate, ctrl.getSubjectById);

router.post('/', authenticate, validateBodyCatalog(schemas.addSchema), ctrl.addSubject);

router.delete('/:id', authenticate,  ctrl.removeSubject);

router.put('/:id', authenticate, validateBodyCatalog(schemas.addSchema), ctrl.updateSubject);


module.exports = router
