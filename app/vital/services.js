const pool = require('../../config/db/db');
const config = require('../../config');
const logger = config.logger.createLogger('vital/services');

exports.getAllMedicalVital = function (result) {
    const sqlQuery = 'SELECT * FROM "vital" ORDER BY created_time DESC';
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

exports.getALatestMedicalVital = function (patient_id, result) {
    const sqlQuery = `SELECT * FROM "vital" WHERE patient_id=${patient_id} ORDER BY created_at DESC`;
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

exports.getALatestMedicalVitalForCaretaker = function (caretaker_id, result) {
    const sqlQuery = `SELECT vital.* 
    FROM public.vital
	JOIN public.patient ON vital.patient_id=patient.id
	JOIN public.caretaker ON caretaker.patient_id=patient.id
    WHERE caretaker.id= ${caretaker_id} 
    ORDER BY vital.created_at DESC`;
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

exports.getAllMedicalVitalWithPagination = function (page, pageSize, sortingName, sortingOrder, result) {
    let sortingQuery = ' ORDER BY created_time DESC ';
    if (sortingOrder === 'Undefined' || sortingName === 'Undefined' || sortingOrder === 'undefined' || sortingName === 'undefined') {
        sortingQuery = ' ORDER BY created_time DESC ';
    } else {
        sortingQuery = 'ORDER BY ' + sortingName + ' ' + sortingOrder;
    }
    // id, ch4, co, dust, humidity, latitude, longitude, nh3, no2, node_id, co2, temperature, to_char(created_time , 'YYYY-MM-DD HH24:MI') AS created_time
    const sqlQuery = `SELECT vital.id, to_char(vital.created_at , 'YYYY-MM-DD HH24:MI') AS created_time, patient_id, heart_rate, body_temperature, ecg, ppg, sbp, dbp, spo2, respiration_rate, patient.name as patient_name FROM "vital" JOIN public.patient ON vital.patient_id=patient.id ${sortingQuery} LIMIT ${pageSize} OFFSET ${page * pageSize} `;
    const sqlCountQuery = `SELECT COUNT(*) as count FROM "vital" JOIN public.patient ON vital.patient_id=patient.id `;

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

exports.getAPatientAllMedicalVitalsWithPagination = function (patient_id, page, pageSize, sortingName, sortingOrder, result) {
    let sortingQuery = ' ORDER BY created_time DESC ';
    if (sortingOrder === 'Undefined' || sortingName === 'Undefined' || sortingOrder === 'undefined' || sortingName === 'undefined') {
        sortingQuery = ' ORDER BY created_time DESC ';
    } else {
        sortingQuery = 'ORDER BY ' + sortingName + ' ' + sortingOrder;
    }
    const sqlQuery = `SELECT vital.id, to_char(vital.created_at , 'YYYY-MM-DD HH24:MI') AS created_time, patient_id, heart_rate, body_temperature, ecg, ppg, sbp, dbp, spo2, respiration_rate , patient.name as patient_name FROM "vital" JOIN public.patient ON vital.patient_id=patient.id WHERE patient_id= ${patient_id} ${sortingQuery} LIMIT ${pageSize} OFFSET ${page * pageSize} `;
    const sqlCountQuery = `SELECT COUNT(*) as count FROM "vital" JOIN public.patient ON vital.patient_id=patient.id WHERE patient_id= ${patient_id} `;

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

exports.getAPatientLatestECGVital = function (patient_id, result) {
    const sqlQuery = `SELECT ARRAY( SELECT vital.ecg FROM "vital" JOIN public.patient ON vital.patient_id=patient.id WHERE patient_id= ${patient_id} ORDER BY vital.created_at DESC LIMIT 1000)`;
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

exports.getPatientAllMedicalVitalsByCaretakerWithPagination = function (caretaker_id, page, pageSize, sortingName, sortingOrder, result) {
    let sortingQuery = ' ORDER BY created_time DESC ';
    if (sortingOrder === 'Undefined' || sortingName === 'Undefined' || sortingOrder === 'undefined' || sortingName === 'undefined') {
        sortingQuery = ' ORDER BY created_time DESC ';
    } else {
        sortingQuery = 'ORDER BY ' + sortingName + ' ' + sortingOrder;
    }
    const sqlQuery = `SELECT vital.id, to_char(vital.created_at , 'YYYY-MM-DD HH24:MI') AS created_time, vital.patient_id, heart_rate, body_temperature, ecg, ppg, sbp, dbp, spo2, respiration_rate , patient.name as patient_name 
    FROM public.vital
	JOIN public.patient ON vital.patient_id=patient.id
	JOIN public.caretaker ON caretaker.patient_id=patient.id
    WHERE caretaker.id= ${caretaker_id} ${sortingQuery} LIMIT ${pageSize} OFFSET ${page * pageSize} `;
    const sqlCountQuery = `SELECT COUNT(*) as count 
    FROM public.vital
	JOIN public.patient ON vital.patient_id=patient.id
	JOIN public.caretaker ON caretaker.patient_id=patient.id
    WHERE caretaker.id= ${caretaker_id} `;

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

exports.getADoctorAllMedicalVitalsWithPagination = function (doctor_id, page, pageSize, sortingName, sortingOrder, result) {
    let sortingQuery = ' ORDER BY created_time DESC ';
    if (sortingOrder === 'Undefined' || sortingName === 'Undefined' || sortingOrder === 'undefined' || sortingName === 'undefined') {
        sortingQuery = ' ORDER BY created_time DESC ';
    } else {
        sortingQuery = 'ORDER BY ' + sortingName + ' ' + sortingOrder;
    }
    const sqlQuery = `SELECT vital.id, to_char(vital.created_at , 'YYYY-MM-DD HH24:MI') AS created_time, patient_id, heart_rate, body_temperature, ecg, ppg, sbp, dbp, spo2, respiration_rate , patient.name as patient_name FROM "vital" JOIN public.patient ON vital.patient_id=patient.id WHERE doctor_id= ${doctor_id} ${sortingQuery} LIMIT ${pageSize} OFFSET ${page * pageSize} `;
    const sqlCountQuery = `SELECT COUNT(*) as count FROM "vital" JOIN public.patient ON vital.patient_id=patient.id WHERE doctor_id= ${doctor_id} `;

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

exports.getAllMedicalVitalByNode = function getAllMedicalVitalByNode(patientID, result) {
    const sqlQuery = `SELECT * FROM vital WHERE patient_id = '${patientID}'  ORDER BY created_time DESC`;
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
exports.createMedicalVital = function createMedicalVital(MedicalVital, result) {
    try {
        const sqlQuery = `INSERT INTO "vital"(created_at, patient_id, heart_rate, body_temperature, ecg, ppg, sbp, dbp, spo2, respiration_rate) VALUES ( '${MedicalVital.created_date}', '${MedicalVital.patient_id}', '${MedicalVital.heart_rate}', '${MedicalVital.body_temperature}', '${MedicalVital.ecg}', '${MedicalVital.ppg}', '${MedicalVital.sbp}', '${MedicalVital.dbp}', '${MedicalVital.spo2}', '${MedicalVital.respiration_rate}') RETURNING id`;

        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            } else {
                result(null, res.rowCount);
            }
        });
    } catch (error) {
        logger.error('ERROR', error);
    }
};

exports.deleteMedicalVital = function deleteMedicalVital(id, result) {
    try {
        const sqlQuery = `DELETE FROM vital WHERE id='${id}'`;

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

exports.get10lastdates = function(id, result) {
    try {
        const sqlQuery = `SELECT
            DISTINCT created_time::date AS created_time  
            FROM public."vital" 
            WHERE created_time > current_date - interval '10' day AND node_id=${id} ORDER BY created_time DESC`;

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

exports.get11lastvalues = function(id, result) {
    try {
        const sqlQuery = `SELECT
            ch4
            FROM public."MedicalVital" 
            WHERE node_id=${id} ORDER BY created_time DESC LIMIT 11`;

        pool.query(sqlQuery, [], (err, res) => {
            if (err) {
                logger.error('Error: ', err.stack);
                result(err, null);
            } else {
                logger.error(res.rows);
                result(null, res.rows);
            }
        });
    } catch (error) {
        logger.error(error);
    }
};

exports.getAvgValuesdates = function(id, day, result) {
    try {
        const sqlQuery = `SELECT ROUND(AVG(ch4), 2) as ch4, ROUND(AVG(co), 2) AS co, ROUND(AVG(dust), 2) AS dust, ROUND(AVG(humidity), 2) AS humidity, ROUND(AVG(nh3), 2) AS nh3, ROUND(AVG(no2), 2) AS no2, ROUND(AVG(co2), 2) AS co2, ROUND(AVG(temperature), 2) AS temperature
            
            FROM public."MedicalVital" 
            WHERE created_time::date = current_date - interval '${day}' day AND node_id= '${id}' `;

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


exports.getAvgValuesdatesAsync = function(id, day) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `SELECT ROUND(AVG(ch4), 2) as ch4, ROUND(AVG(co), 2) AS co, ROUND(AVG(dust), 2) AS dust, ROUND(AVG(humidity), 2) AS humidity, ROUND(AVG(nh3), 2) AS nh3, ROUND(AVG(no2), 2) AS no2, ROUND(AVG(co2), 2) AS co2, ROUND(AVG(temperature), 2) AS temperature
                
            FROM public."MedicalVital" 
            WHERE created_time::date = current_date - interval '${day}' day AND node_id= '${id}' `;
            
        pool.query(sqlQuery, [], function (err, res) {
            if(!err) {
                // logger.error(res.rows);
                resolve(res.rows[0])
            } else {
                logger.error(err)
                reject(err)
            }
        });
    })
};

exports.getHumidityDayValuesAsync = function(id, day) {
    return new Promise((resolve, reject) => {
        // const sqlQuery = `SELECT array_agg(humidity::float) AS humidity
        //     FROM public."MedicalVital" 
        //     WHERE created_time::date = current_date - interval '${day}' day AND node_id= '${id}' LIMIT 1000`;

            const sqlQuery = `
            select array(
            SELECT humidity
            FROM public."MedicalVital" 
            WHERE created_time::date = current_date - interval '${day}' day AND node_id= '${id}' LIMIT 1000) as humidity`;
            
        pool.query(sqlQuery, [], function (err, res) {
            if(!err) {
                // logger.error(res.rows);
                resolve(res.rows[0])
            } else {
                logger.error(err)
                reject(err)
            }
        });
    })
};

exports.getDustDayValuesAsync = function(id, day) {
    return new Promise((resolve, reject) => {
        
            const sqlQuery = `
            select array(
            SELECT dust
            FROM public."MedicalVital" 
            WHERE created_time::date = current_date - interval '${day}' day AND node_id= '${id}' LIMIT 1000) as dust`;
            
        pool.query(sqlQuery, [], function (err, res) {
            if(!err) {
                // logger.error(res.rows);
                resolve(res.rows[0])
            } else {
                logger.error(err)
                reject(err)
            }
        });
    })
};


exports.getTemperatureDayValuesAsync = function(id, day) {
    return new Promise((resolve, reject) => {

            const sqlQuery = `
            select array(
            SELECT temperature
            FROM public."MedicalVital" 
            WHERE created_time::date = current_date - interval '${day}' day AND node_id= '${id}' LIMIT 1000) as temperature`;
            
        pool.query(sqlQuery, [], function (err, res) {
            if(!err) {
                // logger.error(res.rows);
                resolve(res.rows[0])
            } else {
                logger.error(err)
                reject(err)
            }
        });
    })
};

exports.getNh3DayValuesAsync = function(id, day) {
    return new Promise((resolve, reject) => {

            const sqlQuery = `
            select array(
            SELECT nh3
            FROM public."MedicalVital" 
            WHERE created_time::date = current_date - interval '${day}' day AND node_id= '${id}' LIMIT 1000) as nh3`;
            
        pool.query(sqlQuery, [], function (err, res) {
            if(!err) {
                // logger.error(res.rows);
                resolve(res.rows[0])
            } else {
                logger.error(err)
                reject(err)
            }
        });
    })
};

exports.getCoDayValuesAsync = function(id, day) {
    return new Promise((resolve, reject) => {

            const sqlQuery = `
            select array(
            SELECT co
            FROM public."MedicalVital" 
            WHERE created_time::date = current_date - interval '${day}' day AND node_id= '${id}' LIMIT 1000) as co`;
            
        pool.query(sqlQuery, [], function (err, res) {
            if(!err) {
                // logger.error(res.rows);
                resolve(res.rows[0])
            } else {
                logger.error(err)
                reject(err)
            }
        });
    })
};

exports.getNo2DayValuesAsync = function(id, day) {
    return new Promise((resolve, reject) => {

            const sqlQuery = `
            select array(
            SELECT no2
            FROM public."MedicalVital" 
            WHERE created_time::date = current_date - interval '${day}' day AND node_id= '${id}' LIMIT 1000) as no2`;
            
        pool.query(sqlQuery, [], function (err, res) {
            if(!err) {
                // logger.error(res.rows);
                resolve(res.rows[0])
            } else {
                logger.error(err)
                reject(err)
            }
        });
    })
};

exports.getCh4DayValuesAsync = function(id, day) {
    return new Promise((resolve, reject) => {

            const sqlQuery = `
            select array(
            SELECT ch4
            FROM public."MedicalVital" 
            WHERE created_time::date = current_date - interval '${day}' day AND node_id= '${id}' LIMIT 1000) as ch4`;
            
        pool.query(sqlQuery, [], function (err, res) {
            if(!err) {
                // logger.error(res.rows);
                resolve(res.rows[0])
            } else {
                logger.error(err)
                reject(err)
            }
        });
    })
};

exports.getCo2DayValuesAsync = function(id, day) {
    return new Promise((resolve, reject) => {

            const sqlQuery = `
            select array(
            SELECT co2
            FROM public."MedicalVital" 
            WHERE created_time::date = current_date - interval '${day}' day AND node_id= '${id}' LIMIT 1000) as co2`;
            
        pool.query(sqlQuery, [], function (err, res) {
            if(!err) {
                // logger.error(res.rows);
                resolve(res.rows[0])
            } else {
                logger.error(err)
                reject(err)
            }
        });
    })
};

exports.getMinMaxValues = function(result) {
    try {
        const sqlQuery = `SELECT 
        ABS(Max(ch4)) AS max_ch4, ABS(Min(ch4)) AS min_ch4, 
        ABS(Max(co)) AS max_co, ABS(Min(co)) AS min_co,
        ABS(Max(dust)) AS max_dust, ABS(Min(dust)) AS min_dust,
        ABS(Max(humidity)) AS max_humidity, ABS(Min(humidity)) AS min_humidity,
        ABS(Max(nh3)) AS max_nh3, ABS(Min(nh3)) AS min_nh3,
        ABS(Max(no2)) AS max_no2, ABS(Min(no2)) AS min_no2,
        ABS(Max(co2)) AS max_co2, ABS(Min(co2)) AS min_co2,
        ABS(Max(temperature)) AS max_temperature, ABS(Min(temperature)) AS min_temperature
        FROM public."MedicalVital"; `;

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





exports.getlastvitaldate = function(id, result) {
    try {
        const sqlQuery = `SELECT
            DISTINCT created_at::date AS created_at  
            FROM public."vital" 
            WHERE patient_id=${id} ORDER BY created_at DESC LIMIT 1`;

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

exports.getHourAvgValueAsync = function(patient_id, startTime, endTime) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `SELECT 
            AVG(heart_rate) as heart_rate,
            AVG(body_temperature) as body_temperature,
            AVG(sbp) as sbp,
            AVG(dbp) as dbp,
            AVG(spo2) as spo2, 
            AVG(respiration_rate) AS respiration_rate
            FROM public."vital" 
            WHERE created_at>= '${startTime}' AND created_at<= '${endTime}' AND patient_id= '${patient_id}' `;
            
        pool.query(sqlQuery, [], function (err, res) {
            if(!err) {
                // logger.error(res.rows);
                resolve(res.rows[0])
            } else {
                logger.error(err)
                reject(err)
            }
        });
    })
};



exports.getlastvitaldateByCareTaker = function(caretaker_id, result) {
    try {
        const sqlQuery = `SELECT
            DISTINCT vital.created_at::date AS created_at  
            FROM public."vital"
            JOIN public.patient ON vital.patient_id=patient.id
            JOIN public.caretaker ON caretaker.patient_id=patient.id
            WHERE caretaker.id= ${caretaker_id} 
            ORDER BY created_at DESC LIMIT 1`;

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

exports.getHourAvgValueAsyncByCareTaker = function(caretaker_id, startTime, endTime) {
    return new Promise((resolve, reject) => {
        const sqlQuery = `SELECT 
            AVG(heart_rate) as heart_rate,
            AVG(body_temperature) as body_temperature,
            AVG(sbp) as sbp,
            AVG(dbp) as dbp,
            AVG(spo2) as spo2, 
            AVG(respiration_rate) AS respiration_rate
            FROM public."vital"
            JOIN public.patient ON vital.patient_id=patient.id
            JOIN public.caretaker ON caretaker.patient_id=patient.id
            WHERE vital.created_at>= '${startTime}' AND vital.created_at<= '${endTime}' AND caretaker.id= '${caretaker_id}' `;
            
        pool.query(sqlQuery, [], function (err, res) {
            if(!err) {
                // logger.error(res.rows);
                resolve(res.rows[0])
            } else {
                logger.error(err)
                reject(err)
            }
        });
    })
};