const {adminLogin, getUserInfoByJWTToken} = require('./controller');
const {validateMobileAndOTP, validateMobile, validateMobileAndAccessLogin, validateEmailAndPassword, validateJWT, validateMobileAndFcm} = require('../auth/validations');
const controller = require('./controller');

const router = require('express').Router();

router.post('/admin-login', validateEmailAndPassword, controller.adminLogin, function (req, res) {
    res.send(res.locals.Msg);
});

router.post('/doctor-login', validateEmailAndPassword, controller.doctorLogin, function (req, res) {
    res.send(res.locals.Msg);
});

router.post('/patient-login', validateEmailAndPassword, controller.patientLogin, function (req, res) {
    res.send(res.locals.Msg);
});

router.post('/caretaker-login', validateEmailAndPassword, controller.caretakerLogin, function (req, res) {
    res.send(res.locals.Msg);
});

router.post('/access-token', getUserInfoByJWTToken, function (req, res) {
    res.send(res.locals.Msg);
});

module.exports = router;