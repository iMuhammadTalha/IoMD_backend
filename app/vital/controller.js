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
        ch4: req.body.ch4, 
        co: req.body.co, 
        dust: req.body.dust, 
        humidity: req.body.humidity, 
        latitude: req.body.latitude, 
        longitude: req.body.longitude, 
        nh3: req.body.nh3, 
        no2: req.body.no2, 
        node_id: req.body.node_id, 
        co2: req.body.co2,
        temperature: req.body.temperature,
        created_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
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



exports.getAQIGraph = function (req, res, next) {
    res.locals.AQIGraphData = {
        nh3Avg: [0],
        coAvg: [0],
        no2Avg: [0],
        ch4Avg: [0],
        co2Avg: [0],
        dustAvg: [0],
        humitidyAvg: [0],
        temperatureAvg: [0],
        dates: [],
        AQIAvg: [0]
    };

    const nh3Index = [200, 400, 800, 1200, 1800];
    const coIndex = [4.4, 9.4, 12.4, 15.4, 30.4, 40.4];
    const no2Index = [0.053, 0.1, 0.36, 0.65, 1.24, 1.64];
    const ch4Index = [50, 100, 150, 200, 300, 400];
    const co2Index = [1000, 2000, 5000, 10000, 20000, 40000];
    const dustIndex = [12, 35.4, 150.4, 250.4, 350.4];
    const ranges = [[0, 50], [51, 100], [101, 150], [151, 200], [201, 300], [301, 500]];
    
    let nh3Avg = [];
    let coAvg = [];
    let no2Avg = [];
    let ch4Avg = [];
    let co2Avg = [];
    let dustAvg = [];
    let humitidyAvg = [];
    let temperatureAvg = [];
    let dates = [];

    let AQIAvg = [];

    services.get10lastdates(req.params.id, async function (err, last10dates) {
        if (err) {
            logger.error(err);
            return res.status(400).send({msg: 'Error in get all MedicalVital'});
        }

        for(let i=last10dates.length-1; i>=0; i--){
            let dayAvg=await services.getAvgValuesdatesAsync(req.params.id, i);//, function (err, dayAvg) {

                nh3Avg[i]=dayAvg.nh3;
                coAvg[i]=dayAvg.co;
                no2Avg[i]=dayAvg.no2;
                ch4Avg[i]=dayAvg.ch4;
                co2Avg[i]=dayAvg.co2;
                dustAvg[i]=dayAvg.dust;
                humitidyAvg[i]=dayAvg.humidity;
                temperatureAvg[i]=dayAvg.temperature;
                dates[i]= moment(new Date()).subtract(i, "days").format('YYYY-MM-DD');


                const no2AQI = this.calculateForVital(dayAvg.no2, no2Index);
                const dustAQI = this.calculateForVital(dayAvg.dust, dustIndex);
                const nh3AQI = this.calculateForVital(dayAvg.nh3, nh3Index);
                const co2AQI = this.calculateForVital(dayAvg.co2, co2Index);
                const coAQI = this.calculateForVital(dayAvg.co, coIndex);
                const ch4AQI = this.calculateForVital(dayAvg.ch4, ch4Index);

                let AQI=Math.round(this.calculateAQIAverage([
                    dustAQI, nh3AQI, co2AQI, coAQI, no2AQI, ch4AQI
                ]));
                AQIAvg[i]=AQI;
        }
        

                res.locals.AQIGraphData.nh3Avg = nh3Avg;
                res.locals.AQIGraphData.coAvg = coAvg;
                res.locals.AQIGraphData.no2Avg = no2Avg;
                res.locals.AQIGraphData.ch4Avg = ch4Avg;
                res.locals.AQIGraphData.co2Avg = co2Avg;
                res.locals.AQIGraphData.dustAvg = dustAvg;
                res.locals.AQIGraphData.humitidyAvg = humitidyAvg;
                res.locals.AQIGraphData.temperatureAvg = temperatureAvg;
                res.locals.AQIGraphData.dates = dates;
        
                res.locals.AQIGraphData.AQIAvg = AQIAvg;
        
                next();
    });

};



