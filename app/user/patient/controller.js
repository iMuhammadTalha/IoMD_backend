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

        res.locals.allFleetUsers = rows;
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
                password: password,
                name: req.body.name,
                pmdc_no: req.body.pmdc_no,
                specialization: req.body.specialization
            };
            // To handle insertion error due to ' in query
            patientProfile.name = patientProfile.name.replace(/'/g, '');
            patientProfile.pmdc_no = patientProfile.pmdc_no.replace(/'/g, '');
            patientProfile.email = patientProfile.email.replace(/'/g, '');
            patientProfile.specialization = patientProfile.specialization.replace(/'/g, '');
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
       
        created_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        
        updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        // password: password,
        name: req.body.name,
        pmdc_no: req.body.pmdc_no,
        specialization: req.body.specialization
    };

    patientProfile.name = patientProfile.name.replace(/'/g, '');
    patientProfile.pmdc_no = patientProfile.pmdc_no.replace(/'/g, '');
    patientProfile.email = patientProfile.email.replace(/'/g, '');
    patientProfile.specialization = patientProfile.specialization.replace(/'/g, '');
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












