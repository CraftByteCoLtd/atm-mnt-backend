let moment = require('moment');
let User = require('../models/userModel');
let Atm = require('../models/atmModel');
let TechnicianTicket = require('../models/technicianTicketModel');
let Counter = require('../models/counterModel');



let currentUTC = moment().utc().toDate();


// Populate the initial data

exports.setupAdmin = function(req, res) {

    /*==========================================
    =            Initial User admin            =
    ==========================================*/

    User.collection.drop(function(error) {

        let adminUser = new User({
            "firstName": "Admin",
            "lastName": "PowerUser",
            "userName": "admin",
            "userPwd": "1234",
            "isActive": "true",
            "userEmails": [{
                "desc": "work",
                "email": "admin.puser@gmail.com"
            }, {
                "desc": "home",
                "email": "admin.puser@gmail.com"
            }],
            "userPhones": [{
                "desc": "mobile",
                "number": "0989898987"
            }, {
                "desc": "home",
                "number": "020000000"
            }],
            "authRules": {
                "isAdmin": "true",
                "isWareHouseManager": "true",
                "isDispatcherManager": "true",
                "isAtmTechnician": "true",
                "isAtmVaulter": "true",
                "isTreasurer":"true"
            },
            "created": currentUTC
        })

        adminUser.save(function(error) {

            if (error)

                res.json({
                    "sucess": false,
                    "message": error.errmsg
                });

            else
                res.json({
                    "success": true,
                    "message": "succesfully insert admin user"
                });
        });
    });

};


exports.setupAtm = function(req, res) {


    /*====================================
    =            Initial ATM             =
    ====================================*/

    Atm.collection.drop(function(error) {

        let atmMachine = new Atm({
            atmMachineID: "ATM001",
            atmBalance: 5000,
            atmLocation: {
                lat: 51.678418,
                lng: 7.809007,
            },
            atmNote: 'addtional note.',
            atmStatus: true,
            created: currentUTC,
            updated: currentUTC,
            atmUpdatedBy: {fullName:"Kamon Hj"},
        })

        atmMachine.save(function(error) {

            if (error)

                res.json({
                    "sucess": false,
                    "message": error.errmsg
                });

            else
                res.json({
                    "success": true,
                    "message": "succesfully insert atm "
                });
        });
    });

};

exports.setupCounter = function(req, res) {

    Counter.collection.drop(function(error){
     let tTicketCounter = new Counter({
            "_id" : "tTicketID",
            "seq" : 1.0
        });
        tTicketCounter.save(function(error) {
            if (error)
            console.log(error)});

        let dTicketCounter = new Counter({
            "_id" : "dtID",
            "seq" : 1.0
        });
        dTicketCounter.save(function(error) {
            if (error)
            console.log(error)});
        
        res.json({
                    "success": true,
                    "message": "succesfully reset IDs to 1"
                });
    });

}


exports.setupTechnicianTicket = function(req, res) {

    TechnicianTicket.collection.drop(function(error) {
        let tTicket = new TechnicianTicket({

        tTicketID: "new",
        tTicketCreated: currentUTC,
        tTicketSymptom: "Number pad is not functional",
        tTicketSolution:"Replace a new one",
        tTicketCreatedBy: 
            {
            "fullName": "Admin",
            "userName": "admin"
            }
        ,
        tTicketResponsiblePerson:
            {
            "fullName": "Admin",
            "userName": "admin"
            }
        ,
        tTicketStatus: "open",
        tTicketRepairedParts:[{
            "partID": "P001",
            "partName": "NumberPad",
            "partSerialNumber":"XPAD001"
        },
        {
            "partID": "002",
            "partName": "EnterButton",
            "partSerialNumber":"ENPAD001"
        }

        ],
        atmMachine:
            {atmMachineID: "ATM001"}
        ,
        updated: currentUTC
    })

        tTicket.save(function(error) {
                console.log(error);

            if (error){
                res.json({
                    "sucess": false,
                    "message": error.errmsg
                });
            }else{
                res.json({
                    "success": true,
                    "message": "succesfully insert TechnicianTicket "
                });
            }
        });
    })
};