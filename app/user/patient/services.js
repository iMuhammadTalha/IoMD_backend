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
    SELECT patient.*, doctor.name as doctor_name
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

exports.getDoctorAllpatients = function (doctor_id, result) {
    const sqlQuery = `
    SELECT patient.*, doctor.name as doctor_name, doctor.id as doctor_id
	FROM public.patient JOIN public.doctor ON patient.doctor_id=doctor.id
    WHERE doctor.id= '${doctor_id}'
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
            client.query(`INSERT INTO patient ( doctor_id, name, date_of_birth, gender, contact_no, email, address, city, height, weight, password, created_at) VALUES ( '${patient.doctor_id}', '${patient.name}', '${patient.date_of_birth}', '${patient.gender}', '${patient.contact_no}', '${patient.email}', '${patient.address}', '${patient.city}', '${patient.height}', '${patient.weight}', '${patient.password}', '${patient.created_date}') RETURNING id`, (err, res) => {
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
            
            client.query(`UPDATE patient SET doctor_id='${patient.doctor_id}', name='${patient.name}', date_of_birth='${patient.date_of_birth}', gender='${patient.gender}', contact_no='${patient.contact_no}', email='${patient.email}', address='${patient.address}', city='${patient.city}', height='${patient.height}', weight='${patient.weight}' WHERE id= '${id}'`, (err, res) => {
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



exports.deletePatient = function (id, result) {
    try {
        const sqlQuery = `DELETE FROM patient WHERE id='${id}'`;

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











