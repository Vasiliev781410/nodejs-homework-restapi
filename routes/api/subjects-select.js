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

router.patch('/update/:subject', authenticate, validateBodyCatalog(schemas.updateName), ctrl.updateSubject);

router.patch('/params/:subject', authenticate, validateBodyCatalog(schemas.updateParams), ctrl.updateSubjectParams);

router.patch('/sequence/:subject', authenticate, validateBodyCatalog(schemas.updateSequence), ctrl.updateSubjectParams);

router.patch('/headerparams/:subject', authenticate, validateBodyCatalog(schemas.updateCardHeaderParams), ctrl.updateSubjectParams);

router.patch('/tableparams/:subject', authenticate, validateBodyCatalog(schemas.updateCardTableParams), ctrl.updateSubjectParams);

router.patch('/formula/:subject', authenticate, validateBodyCatalog(schemas.updateFormula), ctrl.updateSubjectParams);

module.exports = router
