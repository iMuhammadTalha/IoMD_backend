const services = require('../services');
const config = require('../../../config');
const logger = config.logger.createLogger('users/drivers/validation');

// const isRequiredFieldMiss = function (req) {
//     return (!(req.body.email && req.body.contact_no && req.body.password && req.body.name && req.body.pmdc_no && req.body.specialization));
// };

const isValidEmail = function (email) {
    const regEx = /\S+@\S+\.\S+/;
    return regEx.test(email);
};
const validatePassword = function (password) {
    return !(password.length <= 5 || password === '');
};
const isMobileAlreadyExists = function (mobile, res) {
    return new Promise(async (resolve, reject) => {
        services.isAlreadyMobileExsists(mobile, function (err, result) {
            if (err) {
                res.status(400).send(err);
                return reject(err);
            }
            return resolve(result.length > 0);
        });
    });
};

const isEmailAlreadyExists = function (email, res) {
    return new Promise(async (resolve, reject) => {
        services.isAlreadyEmailExsists(email, function (err, result) {
            if (err) {
                res.status(400).send(err);
                return reject(err);
            }
            return resolve(result.length > 0);
        });
    });
};

exports.validateFieldAndAlreadyEmailAndAlreadyMobile = async function (req, res, next) {

    if (req.body.email && req.body.contact_no && req.body.password) {
        const regEmail = /\S+@\S+\.\S+/;
        if (req.body.password.length >= 5) {
            if (regEmail.test(req.body.email)) {
                const regMobile = /^[0-9]+$/;
                if (regMobile.test(req.body.mobile_number)) {
                    services.isAlreadyEmailExsists(req.body.email, function (err, result) {
                        if (err) {
                            logger.error(err);
                            res.status(400).send(err);
                            // return reject(err);
                        }
                        if (result.length === 0) {
                            // services.isAlreadyMobileExsists(req.body.mobile_number, function (err, result) {
                                // if (result.length === 0) {
                                    next();
                                // } else {
                                    // res.status(409).send({msg: 'Mobile number already exists...'});
                                // }
                            // });
                        } else {
                            res.status(409).send({msg: 'Email already exsists...'});
                        }
                    });
                } else {
                    res.status(400).send({msg: 'Wrong Mobile Number...'});
                }
            } else {
                res.status(400).send({msg: 'Wrong Email Address...'});
            }
        } else {
            res.status(400).send({msg: 'Password is too short. Minimum 5 length is required......'});
        }
    } else {
        res.status(400).send({msg: 'Please provide required fields...'});
    }
};

exports.validateEmailAndPassword = function (req, res, next) {

    if (req.body.email && req.body.password) {
        next();
    } else {
        res.status(400).send('Required fields missed...');
    }
};



exports.isRequiredFieldMissed = function (req, res, next) {
    logger.info(req.body);
    if (req.body.email && req.body.contact_no && req.body.password && req.body.name && req.body.doctor_id && req.body.city) {
        next();
    } else {
        logger.info("Req missed");
        res.status(400).send('Required fields missed...');
    }
};