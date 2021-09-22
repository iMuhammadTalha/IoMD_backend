const {getAllFleets, createFleet, loginFleet, deleteFleet, updateFleet, getFleetTotalRides, getFleetTotalCompletedRides, getFleetRevenue, getFleetTotalDrivers, getFleetTotalCancelledRides} = require('./controller');
const {validateFieldAndAlreadyEmailAndAlreadyMobile, isRequiredFieldMissed} = require('../patient/validations');
// const {isTokenExpired,paginationValidation, getFleetIdFromToken} = require('../../../lib/validation');
const controller = require('./controller');

const router = require('express').Router();
// const upload = require('../../../lib/imageUpload');


// isTokenExpired, paginationValidation,
router.get('/get-all-patients/:page/:pageSize/:sortingName/:sortingOrder/:searchKey',  controller.getAllpatientsWithPagination, function (req, res) {
    res.send(res.locals.allpatients);
});








router.get('/get-all-patients', controller.getAllpatients, function (req, res) {
    res.send(res.locals.allFleetUsers);
});



// isRequiredFieldMissed     validateFieldAndAlreadyEmailAndAlreadyMobile,
router.post('/create-patient', isRequiredFieldMissed,  controller.createpatient, function (req, res) {
    res.send(res.locals.Msg);
});

router.put('/update-patient/:id', controller.updatepatient, function (req, res) {
    res.send(res.locals.Msg);
});




















module.exports = router;