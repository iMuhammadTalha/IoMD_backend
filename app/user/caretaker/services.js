const pool = require('../../../config/db/db');
const config = require('../../../config');
const logger = config.logger.createLogger('user/careTaker/services');


exports.getAllcareTakerWithPagination = function (page, pageSize, sortingName, sortingOrder, searchKey, result) {
    let sortingQuery = ' ORDER BY careTaker.id DESC ';
    if (sortingOrder === 'Undefined' || sortingName === 'Undefined' || sortingOrder === 'undefined' || sortingName === 'undefined') {
        sortingQuery = ' ORDER BY careTaker.id DESC ';
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
        searchQuery += ` LOWER(concat(careTaker.name)) LIKE '%${searchKey}%' `;
    }
    const sqlQuery = `
    SELECT id, name, pmdc_no, contact_no, email, specialization, password
	FROM public.careTaker 
    ${searchQuery}
    ${sortingQuery} 
    LIMIT ${pageSize} 
    OFFSET ${page * pageSize} `;

    const sqlCountQuery = `
	SELECT COUNT(*) as count 
	
	FROM careTaker 
	
	
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






exports.getAllcareTaker = function (result) {
    const sqlQuery = `
    SELECT caretaker.*, patient.name as patient_name
	FROM public.caretaker JOIN public.patient ON caretaker.patient_id=patient.id
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

exports.getDoctorAllcareTaker = function (doctor_id, result) {
    const sqlQuery = `
    SELECT caretaker.*, patient.name as patient_name
	FROM public.caretaker JOIN public.patient ON caretaker.patient_id=patient.id
    WHERE patient.doctor_id= '${doctor_id}'
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

exports.createcareTaker = function (careTaker, result) {
    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }
            client.query(`INSERT INTO careTaker ( patient_id, name, contact_no, email, password, created_at) VALUES ( '${careTaker.patient_id}', '${careTaker.name}', '${careTaker.contact_no}', '${careTaker.email}',  '${careTaker.password}', '${careTaker.created_date}') RETURNING id`, (err, res) => {
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

exports.updatecareTaker = function (id, careTaker, result) {
    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }
            
            client.query(`UPDATE careTaker SET patient_id='${careTaker.patient_id}', name='${careTaker.name}', contact_no='${careTaker.contact_no}', email='${careTaker.email}' WHERE id= '${id}'`, (err, res) => {
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





exports.deletecareTaker = function (id, result) {
    try {
        const sqlQuery = `DELETE FROM careTaker WHERE id='${id}'`;

        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            } else {
                result(null, res.rowCount);
            }
        });

    } catch (error) {
        logger.error(error);
    }
};



exports.getTotalCareTakers = function (result) {
    
    const sqlQuery = `SELECT COUNT(*) As COUNT FROM careTaker`;
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









