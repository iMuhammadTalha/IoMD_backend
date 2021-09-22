const pool = require('../../../config/db/db');
const config = require('../../../config');
const logger = config.logger.createLogger('user/patient/services');


exports.getAllpatientsWithPagination = function (page, pageSize, sortingName, sortingOrder, searchKey, result) {
    let sortingQuery = ' ORDER BY patient.id DESC ';
    if (sortingOrder === 'Undefined' || sortingName === 'Undefined' || sortingOrder === 'undefined' || sortingName === 'undefined') {
        sortingQuery = ' ORDER BY patient.id DESC ';
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
        searchQuery += ` LOWER(concat(patient.name)) LIKE '%${searchKey}%' `;
    }
    const sqlQuery = `
    SELECT id, name, pmdc_no, contact_no, email, specialization, password
	FROM public.patient 
    ${searchQuery}
    ${sortingQuery} 
    LIMIT ${pageSize} 
    OFFSET ${page * pageSize} `;

    const sqlCountQuery = `
	SELECT COUNT(*) as count 
	
	FROM patient 
	
	
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






exports.getAllpatients = function (result) {
    const sqlQuery = `
    SELECT patient.*
	FROM public.patient JOIN public.doctor ON patient.doctor_id=doctor.id
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

exports.createpatient = function (patient, result) {
    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }
            client.query(`INSERT INTO patient ( name, pmdc_no, contact_no, email, specialization, password, created_date) VALUES ( '${patient.name}', '${patient.pmdc_no}', '${patient.contact_no}', '${patient.email}', '${patient.specialization}', '${patient.password}', '${patient.created_date}') RETURNING id`, (err, res) => {
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

exports.updatepatient = function (id, patient, result) {
    try {
        pool.getClient((err, client, release) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            }
            
            client.query(`UPDATE patient SET name='${patient.name}', pmdc_no='${patient.pmdc_no}', contact_no='${patient.contact_no}', email='${patient.email}', specialization='${patient.specialization}' WHERE id= '${id}'`, (err, res) => {
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















