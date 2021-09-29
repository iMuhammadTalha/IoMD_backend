const moment = require('moment');
const services = require('./services');
const config = require('../../../config');
const logger = config.logger.createLogger('user/patient/controller');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = process.env.JWT_TOKEN_SECRET;


exports.getAllpatientsWithPagination = function (req, res, next) {

logger.info(req.params);

    services.getAllpatientsWithPagination(req.params.page, req.params.pageSize, req.params.sortingName, req.params.sortingOrder, req.params.searchKey, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all patient'});
        }
        res.locals.allpatients = rows;
        next();
    });
};


exports.getAllpatients = function (req, res, next) {
    services.getAllpatients(function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all patient'});
        }

        res.locals.allPatients = rows;
        next();
    });
};

exports.getDoctorAllpatients = function (req, res, next) {
    services.getDoctorAllpatients(req.params.doctor_id, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get doctor all patient'});
        }

        res.locals.allDoctorPatients = rows;
        next();
    });
};

exports.createpatient = function (req, res, next) {

    let password = req.body.password;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            password = hash;
            const patientProfile = {
                contact_no: req.body.contact_no,
                email: req.body.email,
               
                created_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                
                updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                date_of_birth: req.body.date_of_birth,
                address: req.body.address,
                city: req.body.city,
                height: req.body.height,
                weight: req.body.weight,
                doctor_id: req.body.doctor_id,
                password: password,
                name: req.body.name,
                gender: req.body.gender
            };
            // To handle insertion error due to ' in query
            patientProfile.name = patientProfile.name.replace(/'/g, '');
            patientProfile.address = patientProfile.address.replace(/'/g, '');
            patientProfile.email = patientProfile.email.replace(/'/g, '');
            patientProfile.city = patientProfile.city.replace(/'/g, '');
            patientProfile.gender = patientProfile.gender.replace(/'/g, '');
            patientProfile.city = patientProfile.city.replace(/'/g, '');

            services.createpatient(patientProfile, function (err, user) {
                if (err) {
                    logger.error(err);
                    return res.status(400).send({msg: 'Error in create dopctor'});
                }
                if (user === 1) {
                    res.status(200).send({msg: 'patient Created'});
                } else {
                    res.status(200).send({msg: 'patient not Created'});
                }
                next();
            });
        });
    });
};


exports.updatepatient = function (req, res, next) {


    const patientProfile = {
        contact_no: req.body.contact_no,
        email: req.body.email,
       
        name: req.body.name,
               
                date_of_birth: req.body.date_of_birth,
                address: req.body.address,
                city: req.body.city,
                height: req.body.height,
                weight: req.body.weight,
                doctor_id: req.body.doctor_id,
                // password: password,
                gender: req.body.gender
    };

    patientProfile.name = patientProfile.name.replace(/'/g, '');
            patientProfile.address = patientProfile.address.replace(/'/g, '');
            patientProfile.email = patientProfile.email.replace(/'/g, '');
            patientProfile.city = patientProfile.city.replace(/'/g, '');
            patientProfile.gender = patientProfile.gender.replace(/'/g, '');
            patientProfile.city = patientProfile.city.replace(/'/g, '');

    services.updatepatient(req.params.id, patientProfile, function (err, affectedRows) {
            if (err) {
                logger.error(err);
                return res.status(400).send({msg: 'Error in update patient'});
            }
            if (affectedRows === 0) {
                res.locals.Msg = 'No patient Found with the given id';
            } else {
                res.locals.Msg = 'patient Updated';
            }
            next();
    });
    
};



exports.deletePatient = function (req, res, next) {
    services.deletePatient(req.params.id, function (err, affectedRows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in delete patient'});
        }
        if (affectedRows === 0) {
            res.locals.Msg = {msg: 'No patient found with the given id'};
        } else {
            res.locals.Msg = {msg: 'patient Deleted'};
        }
        next();
    });
};








exports.getTotalPatients = function (req, res, next) {
    res.locals.totalPatients = {totalPatients: 0};
    services.getTotalPatients(function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all Patient'});
        }
        if (rows[0]) {
            res.locals.totalPatients.totalPatients = rows[0].count;
        }
        next();
    });
};