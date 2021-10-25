const {getAllMedicalVitals, getAQI, getAllMedicalVitalsWithPagination, getARecentVitalByCaretaker, getAllMedicalVitalsByNode, createMedicalVital, deleteMedicalVital, getARecentVital, getAQIGraph} = require('./controller');
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

router.get('/get-a-patient-latest-ecg-vital/:patient_id',  controller.getAPatientLatestECGVital, function (req, res) {
    res.send(res.locals.allMedicalVitals);
});

router.get('/get-patient-all-vitals-by-caretaker/:caretaker_id/:page/:pageSize/:sortingName/:sortingOrder',  controller.getPatientAllMedicalVitalsByCaretakerWithPagination, function (req, res) {
    res.send(res.locals.allMedicalVitals);
});

router.get('/get-all-vitals-by-patient/:id', getAllMedicalVitalsByNode, function (req, res) {
    res.send(res.locals.allMedicalVitals);
});

router.get('/get-daily-vitals-graph/:patient_id', controller.getDailyVitalGraph, function (req, res) {
    res.send(res.locals.GraphData);
});

router.get('/get-weekly-vitals-graph/:patient_id', controller.getWeeklyVitalGraph, function (req, res) {
    res.send(res.locals.GraphData);
});

router.get('/get-daily-vitals-graph-by-caretaker/:caretaker_id', controller.getDailyVitalGraphByCaretaker, function (req, res) {
    res.send(res.locals.GraphData);
});

router.get('/get-weekly-vitals-graph-by-caretaker/:caretaker_id', controller.getWeeklyVitalGraphByCaretaker, function (req, res) {
    res.send(res.locals.GraphData);
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

router.get('/get-a-recent-vital/:patient_id', getARecentVital, function (req, res) {
    res.send(res.locals.aMedicalVital);
});

router.get('/get-a-recent-vital-by-caretaker/:caretaker_id', getARecentVitalByCaretaker, function (req, res) {
    res.send(res.locals.aMedicalVital);
});


module.exports = router;