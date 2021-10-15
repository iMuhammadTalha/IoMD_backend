const moment = require('moment');
const services = require('./services');
const config = require('../../config');
const logger = config.logger.createLogger('MedicalVitals/controller');
// const tf = require('@tensorflow/tfjs');
// require('@tensorflow/tfjs-node');


exports.getAllMedicalVitals = function (req, res, next) {
    services.getAllMedicalVital(function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all MedicalVital'});
        }

        res.locals.allMedicalVitals = rows;
        next();
    });
};

exports.getAllMedicalVitalsWithPagination = function (req, res, next) {
    services.getAllMedicalVitalWithPagination(req.params.page, req.params.pageSize, req.params.sortingName, req.params.sortingOrder, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all MedicalVital'});
        }
        res.locals.allMedicalVitals = rows;
        next();
    });
};

exports.getAPatientAllMedicalVitalsWithPagination = function (req, res, next) {
    services.getAPatientAllMedicalVitalsWithPagination(req.params.patient_id, req.params.page, req.params.pageSize, req.params.sortingName, req.params.sortingOrder, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all MedicalVital'});
        }
        res.locals.allMedicalVitals = rows;
        next();
    });
};

exports.getAPatientLatestECGVital = function (req, res, next) {
    
    res.locals.allMedicalVitals = {
        ECG: [0]
    }
    
    services.getAPatientLatestECGVital(req.params.patient_id, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all MedicalVital'});
        }
        res.locals.allMedicalVitals.ECG = rows[0];
        next();
    });
};

exports.getPatientAllMedicalVitalsByCaretakerWithPagination = function (req, res, next) {
    services.getPatientAllMedicalVitalsByCaretakerWithPagination(req.params.caretaker_id, req.params.page, req.params.pageSize, req.params.sortingName, req.params.sortingOrder, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all MedicalVital'});
        }
        res.locals.allMedicalVitals = rows;
        next();
    });
};

exports.getADoctorAllMedicalVitalsWithPagination = function (req, res, next) {
    services.getADoctorAllMedicalVitalsWithPagination(req.params.doctor_id, req.params.page, req.params.pageSize, req.params.sortingName, req.params.sortingOrder, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all MedicalVital'});
        }
        res.locals.allMedicalVitals = rows;
        next();
    });
};

exports.getAllMedicalVitalsByNode = function (req, res, next) {
    services.getAllMedicalVitalByNode(req.params.id, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all MedicalVital by service'});
        }

        res.locals.allMedicalVitals = rows;
        next();
    });
};

exports.createMedicalVital = function (req, res, next) {

    const MedicalVital = {
        heart_rate: req.body.heart_rate, 
        body_temperature: req.body.body_temperature, 
        ecg: req.body.ecg, 
        ppg: req.body.ppg, 
        sbp: req.body.sbp, 
        dbp: req.body.dbp, 
        spo2: req.body.spo2, 
        respiration_rate: req.body.respiration_rate, 
        patient_id: 1, 
        
        created_date: moment(req.body.created_date).format('YYYY-MM-DD HH:mm:ss')
    };

    services.createMedicalVital(MedicalVital, function (err, MedicalVital) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in create MedicalVital'});
        }
        if (MedicalVital === 1) {
            res.status(200).send({msg: 'MedicalVital Created'});
        } else {
            res.status(200).send({msg: 'MedicalVital not Created'});
        }
        next();
    });

};

exports.deleteMedicalVital = function (req, res, next) {
    services.deleteMedicalVital(req.params.id, function (err, affectedRows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in delete MedicalVital'});
        }
        if (affectedRows === 0) {
            res.locals.Msg = {msg: 'No MedicalVital found with the given id'};
        } else {
            res.locals.Msg = {msg: 'MedicalVital Deleted'};
        }
        next();
    });
};

exports.getAQI = function (req, res, next) {
    res.locals.aqi = {aqi: 0};

    const nh3Index = [200, 400, 800, 1200, 1800];
    const coIndex = [4.4, 9.4, 12.4, 15.4, 30.4, 40.4];
    const no2Index = [0.053, 0.1, 0.36, 0.65, 1.24, 1.64];
    const ch4Index = [50, 100, 150, 200, 300, 400];
    const co2Index = [1000, 2000, 5000, 10000, 20000, 40000];
    const dustIndex = [12, 35.4, 150.4, 250.4, 350.4];
    const ranges = [[0, 50], [51, 100], [101, 150], [151, 200], [201, 300], [301, 500]];
    
    services.getALatestMedicalVital(req.params.id, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all MedicalVital'});
        }
        let MedicalVital = rows[0];
        
        logger.info('RECORDS',MedicalVital);
    
    const no2AQI = this.calculateForVital(MedicalVital.no2, no2Index);
    const dustAQI = this.calculateForVital(MedicalVital.dust, dustIndex);
    const nh3AQI = this.calculateForVital(MedicalVital.nh3, nh3Index);
    const co2AQI = this.calculateForVital(MedicalVital.co2, co2Index);
    const coAQI = this.calculateForVital(MedicalVital.co, coIndex);
    const ch4AQI = this.calculateForVital(MedicalVital.ch4, ch4Index);

    let AQI=Math.round(this.calculateAQIAverage([
        dustAQI, nh3AQI, co2AQI, coAQI, no2AQI, ch4AQI
      ]));

    logger.info(AQI);
    res.locals.aqi.aqi = AQI+10;
        next();
    });
     
};


calculateForVital = function (vital, range) {
    const ranges = [[0, 50], [51, 100], [101, 150], [151, 200], [201, 300], [301, 500]];

    for (let counter = 0; counter < range.length; counter++) {
        if (vital <= range[counter] || counter === range.length - 1) {
          const [iHi, iLo] = ranges[counter];
          return this.calculateAQI(iHi, iLo, range[counter], counter === 0 ? 0 : range[counter - 1],
            counter === range.length - 1 ? range[counter] : vital);
        }
    }
}

calculateAQI = function(iHi, iLo, bpHi, bpLo, cP) {
    return Math.round((((iHi - iLo) / (bpHi - bpLo)) * (cP - bpLo)) + iLo);
}

calculateAQIAverage= function(AQIs) {
    let sum = 0;
    for (const aqi of AQIs) {
      sum += aqi;
    }
    return sum / AQIs.length;
  }

  exports.getARecentVital = function (req, res, next) {

    services.getALatestMedicalVital(req.params.id, function (err, rows) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all MedicalVital'});
        }

    res.locals.aMedicalVital = rows[0];
    next();
    });
    
};



exports.getDailyVitalGraph = function (req, res, next) {
    res.locals.GraphData = {
        date:'',
        heartRateAvg: [0],
        bodyTemperatureAvg: [0],
        sbpAvg: [0],
        dbpAvg: [0],
        spo2Avg: [0],
        respirationRateAvg: [0],
        time: []
    };

    
    let heartRateAvg = [];
    let bodyTemperatureAvg = [];
    let sbpAvg = [];
    let dbpAvg = [];
    let spo2Avg = [];
    let respirationRateAvg = [];
    let time = [];

    
    services.getlastvitaldate(req.params.patient_id, async function (err, lastvitaldate) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get MedicalVital date'});
        }

        logger.info(lastvitaldate[0] && lastvitaldate[0].created_at);


        if(lastvitaldate[0] && lastvitaldate[0].created_at)
        {
            // logger.info('IF')
            res.locals.GraphData.date=moment(lastvitaldate[0].created_at).format('YYYY-MM-DD');
            for(let i=0; i<=23; i++){
                let startTime = moment(lastvitaldate[0].created_at).set('hour', i).format('YYYY-MM-DD HH:00:00')
                let endTime = moment(lastvitaldate[0].created_at).set('hour', i).format('YYYY-MM-DD HH:59:59')
                let hourAvg=await services.getHourAvgValueAsync(req.params.patient_id, startTime, endTime);
                    heartRateAvg[i]=hourAvg.heart_rate;
                    bodyTemperatureAvg[i]=hourAvg.body_temperature;
                    sbpAvg[i]=hourAvg.sbp;
                    dbpAvg[i]=hourAvg.dbp;
                    spo2Avg[i]=hourAvg.spo2;
                    respirationRateAvg[i]=hourAvg.respiration_rate;
                    
                    time[i]= i+':00';

            }
        }
        

                res.locals.GraphData.heartRateAvg = heartRateAvg;
                res.locals.GraphData.bodyTemperatureAvg = bodyTemperatureAvg;
                res.locals.GraphData.sbpAvg = sbpAvg;
                res.locals.GraphData.dbpAvg = dbpAvg;
                res.locals.GraphData.spo2Avg = spo2Avg;
                res.locals.GraphData.respirationRateAvg = respirationRateAvg;

                res.locals.GraphData.time = time;
                
                next();
    });

};

exports.getWeeklyVitalGraph = function (req, res, next) {
    res.locals.GraphData = {
        startDate:'',
        endDate:'',
        heartRateAvg: [0],
        bodyTemperatureAvg: [0],
        sbpAvg: [0],
        dbpAvg: [0],
        spo2Avg: [0],
        respirationRateAvg: [0],
        time: []
    };

    
    let heartRateAvg = [];
    let bodyTemperatureAvg = [];
    let sbpAvg = [];
    let dbpAvg = [];
    let spo2Avg = [];
    let respirationRateAvg = [];
    let time = [];

    
    services.getlastvitaldate(req.params.patient_id, async function (err, lastvitaldate) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get MedicalVital date'});
        }

        logger.info(lastvitaldate[0] && lastvitaldate[0].created_at);


        if(lastvitaldate[0] && lastvitaldate[0].created_at)
        {
            let weekStart = moment(lastvitaldate[0].created_at).subtract(7,'d').format('YYYY-MM-DD 00:00');

            res.locals.GraphData.startDate=moment(weekStart).format('YYYY-MM-DD');
            res.locals.GraphData.endDate=moment(lastvitaldate[0].created_at).format('YYYY-MM-DD');

            for(let i=0; i<=21; i++){
                let startTime = moment(weekStart).set('hour', i*8).format('YYYY-MM-DD HH:00')
                let endTime = moment(weekStart).set('hour', (i+1)*8).format('YYYY-MM-DD HH:00')
                let hourAvg=await services.getHourAvgValueAsync(req.params.patient_id, startTime, endTime);

                    heartRateAvg[i]=hourAvg.heart_rate;
                    bodyTemperatureAvg[i]=hourAvg.body_temperature;
                    sbpAvg[i]=hourAvg.sbp;
                    dbpAvg[i]=hourAvg.dbp;
                    spo2Avg[i]=hourAvg.spo2;
                    respirationRateAvg[i]=hourAvg.respiration_rate;
                    
                    time[i]= startTime;
            }
        }

                res.locals.GraphData.heartRateAvg = heartRateAvg;
                res.locals.GraphData.bodyTemperatureAvg = bodyTemperatureAvg;
                res.locals.GraphData.sbpAvg = sbpAvg;
                res.locals.GraphData.dbpAvg = dbpAvg;
                res.locals.GraphData.spo2Avg = spo2Avg;
                res.locals.GraphData.respirationRateAvg = respirationRateAvg;

                res.locals.GraphData.time = time;
                
                next();
    });

};

