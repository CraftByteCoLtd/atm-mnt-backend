/*----------  setup all the tool we need  ----------*/

var express 	= require('express');
var _ 			= require('lodash');
var mongoose 	= require('mongoose');
var bodyParser 	= require('body-parser');
var morgan 		= require('morgan');

/*----------  Load Config  ----------*/

var PORT 		= process.env.PORT || 3000
var configDB 	= require('./api/configs/database.js');
var configJWT 	= require('./api/configs/jwt.js');


/*----------  Configuration  ----------*/
var app = express()
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

var indexRoute 	= require('./api/routes/index');
var authRoute 	= require('./api/routes/auth');
var usersRoute 	= require('./api/routes/users');


/**

	TODO:
	- Remove the setup Routes

 */

var setupInitData = require('./api/setup/setupInitData')
app.get('/setup', setupInitData.setupInitData);

/*----------  Remove above  ----------*/




/*----------  Add Routes here  ----------*/

// All Routes in the app
app.use('/',indexRoute);
app.use('/auth',authRoute)

// Restrict Routs List
app.use('/*', require('./api/middlewares/authValidate.js'));
app.use('/manage-user',usersRoute);

//appxxx other

app.listen(PORT, () => {
    console.log('ATM-MNT Started on : http://localhost:' + PORT);
});