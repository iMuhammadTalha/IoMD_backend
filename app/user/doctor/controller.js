const moment = require('moment');
const services = require('./services');
const config = require('../../../config');
const logger = config.logger.createLogger('user/doctor/controller');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = process.env.JWT_TOKEN_SECRET;


exports.getAllDoctorsWithPagination = function (req, res, next) {

logger.info(req.params);

    services.getAllDoctorsWithPagination(req.params.page, req.params.pageSize, req.params.sortingName, req.params.sortingOrder, req.params.searchKey, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all Doctor'});
        }
        res.locals.allDoctors = rows;
        next();
    });
};


exports.getAllDoctors = function (req, res, next) {
    services.getAllDoctors(function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all Doctor'});
        }

        res.locals.allFleetUsers = rows;
        next();
    });
};


exports.createDoctor = function (req, res, next) {

    let password = req.body.password;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            password = hash;
            const doctorProfile = {
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
            doctorProfile.name = doctorProfile.name.replace(/'/g, '');
            doctorProfile.pmdc_no = doctorProfile.pmdc_no.replace(/'/g, '');
            doctorProfile.email = doctorProfile.email.replace(/'/g, '');
            doctorProfile.specialization = doctorProfile.specialization.replace(/'/g, '');
            services.createDoctor(doctorProfile, function (err, user) {
                if (err) {
                    logger.error(err);
                    return res.status(400).send({msg: 'Error in create dopctor'});
                }
                if (user === 1) {
                    res.status(200).send({msg: 'Doctor Created'});
                } else {
                    res.status(200).send({msg: 'Doctor not Created'});
                }
                next();
            });
        });
    });
};


exports.updateDoctor = function (req, res, next) {


    const doctorProfile = {
        contact_no: req.body.contact_no,
        email: req.body.email,
       
        created_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        
        updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        // password: password,
        name: req.body.name,
        pmdc_no: req.body.pmdc_no,
        specialization: req.body.specialization
    };

    doctorProfile.name = doctorProfile.name.replace(/'/g, '');
    doctorProfile.pmdc_no = doctorProfile.pmdc_no.replace(/'/g, '');
    doctorProfile.email = doctorProfile.email.replace(/'/g, '');
    doctorProfile.specialization = doctorProfile.specialization.replace(/'/g, '');
    services.updateDoctor(req.params.id, doctorProfile, function (err, affectedRows) {
            if (err) {
                logger.error(err);
                return res.status(400).send({msg: 'Error in update doctor'});
            }
            if (affectedRows === 0) {
                res.locals.Msg = 'No doctor Found with the given id';
            } else {
                res.locals.Msg = 'doctor Updated';
            }
            next();
    });
    
};












