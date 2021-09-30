const {getAllMedicalVitals, getAQI, getAllMedicalVitalsWithPagination, getANodeAllMedicalVitalsWithPagination, getAllMedicalVitalsByNode, createMedicalVital, deleteMedicalVital, getARecentVital, getAQIGraph} = require('./controller');
const {validateField} = require('../vital/validations');
// const {isTokenExpired,paginationValidation} = require('../../lib/validation');
const controller = require('./controller');

const router = require('express').Router();
                                
router.get('/get-all-vitals', getAllMedicalVitals, function (req, res) {
    res.send(res.locals.allMedicalVitals);
});
                                                                        // isTokenExpired,paginationValidation,
router.get('/get-all-vitals/:page/:pageSize/:sortingName/:sortingOrder',  controller.getAllMedicalVitalsWithPagination, function (req, res) {
    res.send(res.locals.allMedicalVitals);
});

router.get('/get-a-doctor-all-vitals/:doctor_id/:page/:pageSize/:sortingName/:sortingOrder',  controller.getADoctorAllMedicalVitalsWithPagination, function (req, res) {
    res.send(res.locals.allMedicalVitals);
});

router.get('/get-a-patient-all-vitals/:patient_id/:page/:pageSize/:sortingName/:sortingOrder',  controller.getAPatientAllMedicalVitalsWithPagination, function (req, res) {
    res.send(res.locals.allMedicalVitals);
});

router.get('/get-patient-all-vitals-by-caretaker/:caretaker_id/:page/:pageSize/:sortingName/:sortingOrder',  controller.getPatientAllMedicalVitalsByCaretakerWithPagination, function (req, res) {
    res.send(res.locals.allMedicalVitals);
});

router.get('/get-all-vitals-by-patient/:id', getAllMedicalVitalsByNode, function (req, res) {
    res.send(res.locals.allMedicalVitals);
});

router.post('/create-vital', validateField, createMedicalVital, function (req, res) {
    res.send(res.locals.Msg);
});

router.delete('/delete-vital/:id', deleteMedicalVital, function (req, res) {
    res.send(res.locals.Msg);
});

router.get('/get-AQI/:id', getAQI, function (req, res) {
    res.send(res.locals.aqi);
});

router.get('/get-a-recent-vital/:id', getARecentVital, function (req, res) {
    res.send(res.locals.aMedicalVital);
});

router.get('/get-aqi-graph/:id', getAQIGraph, function (req, res) {
    res.send(res.locals.AQIGraphData);
});


module.exports = router;