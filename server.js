/*----------  setup all the tool we need  ----------*/

let express 	= require('express');
let mongoose 	= require('mongoose');
let bodyParser 	= require('body-parser');
let morgan 		= require('morgan');

/*----------  Load Config  ----------*/

const PORT 		= process.env.PORT || 3000
const configDB 	= require('./api/configs/database.js');
const configJWT 	= require('./api/configs/jwt.js');


/*----------  Configuration  ----------*/
var app = express()

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") 
        res.send(200);
    else 
        next();
});

app.use(express.static('public'))


app.set('superDuperSecret',configJWT.secret);

mongoose.Promise = global.Promise;
mongoose.connect(configDB.database);


/*----------  MiddleWare  ----------*/

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));

/*----------  Import Routes ----------*/

const indexRoute 	= require('./api/routes/index');
const authRoute 	= require('./api/routes/auth');
const usersRoute 	= require('./api/routes/users');
const companyProfileRoute = require('./api/routes/company');
const atmRoute    = require('./api/routes/atm');
const technicianTicket = require('./api/routes/technicianTicket');
const part	= require('./api/routes/part');
const dispatchTicket = require('./api/routes/dispatchTicket');
const treasury = require('./api/routes/treasury');


/*----------  Remove  ----------*/
const setupInitData = require('./api/setup/setupInitData')
app.get('/setup/admin', setupInitData.setupAdmin);
app.get('/setup/atm', setupInitData.setupAtm);
app.get('/setup/id', setupInitData.setupCounter);
app.get('/setup/tt', setupInitData.setupTechnicianTicket);
app.get('/setup/treasury', setupInitData.setupTreasury);

/*----------  Remove above  ----------*/


/*----------  Add Routes here  ----------*/

// All Routes in the app
app.use('/',indexRoute);
app.use('/auth',authRoute)

// Restrict Routs List
app.use('/*', require('./api/middlewares/authValidate.js'));
app.use('/manage-user', usersRoute);
app.use('/manage-company', companyProfileRoute);
app.use('/manage-atm', atmRoute);
app.use('/manage-tt', technicianTicket);
app.use('/manage-part', part);
app.use('/manage-dt', dispatchTicket);
app.use('/manage-treasury', treasury);



app.listen(PORT, () => {
    console.log('ATM-MNT Started on : http://localhost:' + PORT);
});