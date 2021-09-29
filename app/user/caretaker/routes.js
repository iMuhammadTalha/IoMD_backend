const {getAllFleets, createFleet, loginFleet, deleteFleet, updateFleet, getFleetTotalRides, getFleetTotalCompletedRides, getFleetRevenue, getFleetTotalDrivers, getFleetTotalCancelledRides} = require('./controller');
const {validateFieldAndAlreadyEmailAndAlreadyMobile, isRequiredFieldMissed} = require('../careTaker/validations');
// const {isTokenExpired,paginationValidation, getFleetIdFromToken} = require('../../../lib/validation');
const controller = require('./controller');

const router = require('express').Router();
// const upload = require('../../../lib/imageUpload');


// isTokenExpired, paginationValidation,
router.get('/get-all-careTaker/:page/:pageSize/:sortingName/:sortingOrder/:searchKey',  controller.getAllcareTakerWithPagination, function (req, res) {
    res.send(res.locals.allcareTaker);
});








router.get('/get-all-careTaker', controller.getAllcareTaker, function (req, res) {
    res.send(res.locals.allCareTaker);
});

router.get('/get-doctor-all-careTaker/:doctor_id', controller.getDoctorAllcareTaker, function (req, res) {
    res.send(res.locals.allDoctorCareTaker);
});

// isRequiredFieldMissed     validateFieldAndAlreadyEmailAndAlreadyMobile,
router.post('/create-careTaker', isRequiredFieldMissed,  controller.createcareTaker, function (req, res) {
    res.send(res.locals.Msg);
});

router.put('/update-careTaker/:id', controller.updatecareTaker, function (req, res) {
    res.send(res.locals.Msg);
});


router.delete('/delete-careTaker/:id',  controller.deletecareTaker, function (req, res) {
    res.send(res.locals.Msg);
});


router.get('/get-total-caretakers', controller.getTotalCareTakers, function (req, res) {
    res.send(res.locals.totalCareTakers);
});














module.exports = router;