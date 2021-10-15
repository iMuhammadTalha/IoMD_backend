exports.validateField = function (req, res, next) {

    if (req.body.heart_rate && req.body.body_temperature && req.body.ecg && req.body.ppg && req.body.sbp && req.body.dbp && req.body.spo2 && req.body.respiration_rate && req.body.created_at) {
        next();
    } else {
        next();
        // res.status(400).send('Required fields missed...');
    }

};