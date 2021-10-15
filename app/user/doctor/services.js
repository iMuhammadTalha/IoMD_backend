const pool = require('../../../config/db/db');
const config = require('../../../config');
const logger = config.logger.createLogger('user/doctor/services');


exports.getAllDoctorsWithPagination = function (page, pageSize, sortingName, sortingOrder, searchKey, result) {
    let sortingQuery = ' ORDER BY doctor.id DESC ';
    if (sortingOrder === 'Undefined' || sortingName === 'Undefined' || sortingOrder === 'undefined' || sortingName === 'undefined') {
        sortingQuery = ' ORDER BY doctor.id DESC ';
    } else {
        sortingQuery = 'ORDER BY ' + sortingName + ' ' + sortingOrder;
    }
    let searchQuery='';
    let count=0;
    

    if (searchKey !== "Undefined" && searchKey !== "undefined") {
        if(count==0){
            searchQuery+=' WHERE ';
        } else {
            searchQuery+=' AND ';
        }
        searchQuery += ` LOWER(concat(doctor.name)) LIKE '%${searchKey}%' `;
    }
    const sqlQuery = `
    SELECT id, name, pmdc_no, contact_no, email, specialization, password
	FROM public.doctor 
    ${searchQuery}
    ${sortingQuery} 
    LIMIT ${pageSize} 
    OFFSET ${page * pageSize} `;

    const sqlCountQuery = `
	SELECT COUNT(*) as count 
	
	FROM doctor 
	
	
    ${searchQuery}
    `;

    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }
            client.query(sqlQuery, (err, res) => {
                if (err) {
                    logger.error('Error: ', err.stack);
                    result(err, null);
                } else {
                    client.query(sqlCountQuery, (err, countResponse) => {
                        release();
                        if (err) {
                            logger.error('Error: ', err.stack);
                            result(err, null);
                        } else {
                            let pages = Math.floor(countResponse.rows[0].count / pageSize);
                            if (countResponse.rows[0].count % pageSize > 0) {
                                pages += 1;
                            }
                            const dataToSend = {
                                totalPages: pages,
                                totalCount: countResponse.rows[0].count,
                                records: res.rows
                            };
                            result(null, dataToSend);
                        }
                    });
                }
            });
        });
    } catch (error) {
        logger.error(error);
    }
};






exports.getAllDoctors = function (result) {
    const sqlQuery = `
    SELECT id, name, pmdc_no, contact_no, email, specialization, password
	FROM public.doctor
    `;
    try {
        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            } else {
                result(null, res.rows);
            }
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.createDoctor = function (doctor, result) {
    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }
            client.query(`INSERT INTO Doctor ( name, pmdc_no, contact_no, email, specialization, password, created_at) VALUES ( '${doctor.name}', '${doctor.pmdc_no}', '${doctor.contact_no}', '${doctor.email}', '${doctor.specialization}', '${doctor.password}', '${doctor.created_date}') RETURNING id`, (err, res) => {
                if (err) {
                    logger.error('Error: ', err.stack);
                    result(err, null);
                } else {
                    
                     release();
                    result(null, res.rowCount);
                           
                }
            });
        });
    } catch (error) {
        logger.error('ERROR', error);
    }
};

exports.updateDoctor = function (id, doctor, result) {
    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }
            
            client.query(`UPDATE doctor SET name='${doctor.name}', pmdc_no='${doctor.pmdc_no}', contact_no='${doctor.contact_no}', email='${doctor.email}', specialization='${doctor.specialization}' WHERE id= '${id}'`, (err, res) => {
                        release();
                        if (err) {
                            logger.error('Error: ', err.stack);
                            result(err, null);
                        } else {
                            result(null, res.rowCount);
                        }
            });
                
        });
    } catch (error) {
        logger.error(error);
    }
};




exports.getTotalDoctors = function (result) {
    
    const sqlQuery = `SELECT COUNT(*) As COUNT FROM doctor`;
    try {
        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            } else {
                result(null, res.rows);
            }
        });
    } catch (error) {
        logger.error(error);
    }
};











