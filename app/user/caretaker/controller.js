const moment = require('moment');
const services = require('./services');
const config = require('../../../config');
const logger = config.logger.createLogger('user/careTaker/controller');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = process.env.JWT_TOKEN_SECRET;


exports.getAllcareTakerWithPagination = function (req, res, next) {

logger.info(req.params);

    services.getAllcareTakerWithPagination(req.params.page, req.params.pageSize, req.params.sortingName, req.params.sortingOrder, req.params.searchKey, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all careTaker'});
        }
        res.locals.allcareTaker = rows;
        next();
    });
};


exports.getAllcareTaker = function (req, res, next) {
    services.getAllcareTaker(function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all careTaker'});
        }

        res.locals.allCareTaker = rows;
        next();
    });
};

exports.getDoctorAllcareTaker = function (req, res, next) {
    services.getDoctorAllcareTaker(req.params.doctor_id, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all careTaker'});
        }

        res.locals.allDoctorCareTaker = rows;
        next();
    });
};


exports.createcareTaker = function (req, res, next) {

    let password = req.body.password;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) throw err;
            password = hash;
            const careTakerProfile = {
                contact_no: req.body.contact_no,
                email: req.body.email,
               
                created_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                
                updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                
                patient_id: req.body.patient_id,
                password: password,
                name: req.body.name
            };
            // To handle insertion error due to ' in query
            careTakerProfile.name = careTakerProfile.name.replace(/'/g, '');
            careTakerProfile.email = careTakerProfile.email.replace(/'/g, '');
            services.createcareTaker(careTakerProfile, function (err, user) {
                if (err) {
                    logger.error(err);
                    return res.status(400).send({msg: 'Error in create careTaker'});
                }
                if (user === 1) {
                    res.status(200).send({msg: 'careTaker Created'});
                } else {
                    res.status(200).send({msg: 'careTaker not Created'});
                }
                next();
            });
        });
    });
};


exports.updatecareTaker = function (req, res, next) {


    const careTakerProfile = {
        contact_no: req.body.contact_no,
        email: req.body.email,
       
        name: req.body.name,
               
                
                patient_id: req.body.patient_id
                // password: password,
    };

    careTakerProfile.name = careTakerProfile.name.replace(/'/g, '');
    careTakerProfile.email = careTakerProfile.email.replace(/'/g, '');
    
    services.updatecareTaker(req.params.id, careTakerProfile, function (err, affectedRows) {
            if (err) {
                logger.error(err);
                return res.status(400).send({msg: 'Error in update careTaker'});
            }
            if (affectedRows === 0) {
                res.locals.Msg = 'No careTaker Found with the given id';
            } else {
                res.locals.Msg = 'careTaker Updated';
            }
            next();
    });
    
};





exports.deletecareTaker = function (req, res, next) {
    services.deletecareTaker(req.params.id, function (err, affectedRows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in delete careTaker'});
        }
        if (affectedRows === 0) {
            res.locals.Msg = {msg: 'No careTaker found with the given id'};
        } else {
            res.locals.Msg = {msg: 'careTaker Deleted'};
        }
        next();
    });
};




exports.getTotalCareTakers = function (req, res, next) {
    res.locals.totalCareTakers = {totalCareTakers: 0};
    services.getTotalCareTakers(function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all CareTakers'});
        }
        if (rows[0]) {
            res.locals.totalCareTakers.totalCareTakers = rows[0].count;
        }
        next();
    });
};




