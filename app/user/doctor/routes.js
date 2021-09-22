const {getAllFleets, createFleet, loginFleet, deleteFleet, updateFleet, getFleetTotalRides, getFleetTotalCompletedRides, getFleetRevenue, getFleetTotalDrivers, getFleetTotalCancelledRides} = require('./controller');
const {validateFieldAndAlreadyEmailAndAlreadyMobile, isRequiredFieldMissed} = require('../doctor/validations');
// const {isTokenExpired,paginationValidation, getFleetIdFromToken} = require('../../../lib/validation');
const controller = require('./controller');

const router = require('express').Router();
// const upload = require('../../../lib/imageUpload');


// isTokenExpired, paginationValidation,
router.get('/get-all-doctors/:page/:pageSize/:sortingName/:sortingOrder/:searchKey',  controller.getAllDoctorsWithPagination, function (req, res) {
    res.send(res.locals.allDoctors);
});








router.get('/get-all-doctors', controller.getAllDoctors, function (req, res) {
    res.send(res.locals.allFleetUsers);
});



// isRequiredFieldMissed     validateFieldAndAlreadyEmailAndAlreadyMobile,
router.post('/create-doctor', isRequiredFieldMissed,  controller.createDoctor, function (req, res) {
    res.send(res.locals.Msg);
});

router.put('/update-doctor/:id', controller.updateDoctor, function (req, res) {
    res.send(res.locals.Msg);
});




















module.exports = router;