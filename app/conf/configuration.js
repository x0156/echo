//Return configuration specific settings by deployment environment
var path = require('path');

function getConfiguration() {
	var environment = (process.env.NODE_ENV || 'devel');
	return addVersions(getConfigurationByEnv(environment));
}

function addVersions(conf) {
	conf.versions = {
		generatorEngine: 'Radarc',
		generatorVersion: '4.8.1.23788',
		generatedAt: '2017-08-17T05:41:49.8172079Z',
		formulaName: 'Hivecell.MEAN',
		formulaVersion: '1.4.48'
	};
	return conf;
}

function getConfigurationByEnv(environment) {
	//Default configuration object
	var configuration = {
		environment: '',
		security: {
			rootAccount: 'admin',
			apiKey: 'icinetic', // The key to explore the API Docs and use it from third-party hosts

			//set SERVER-SECRET var on production to a well-know value 
			serverSecret: process.env.SERVER_SECRET || "sample-symetric-key-2014" 
		},
		//cloud storage service for binary fields
		storage: {
			provider: '<<provider>>',   //sample pkgcloud provider. See: https://github.com/pkgcloud/pkgcloud#storage 
			user: '<<user name>>',
			accessKeyId: '<<keyId>>',
			accessKeySecret: '<<secret>>',
			region: '<<region>>',  	   //Sample: eu-west-1 
			container: '<<container>>' //container name
		},
		rootHttpDir: null,
		appPort: (process.env.VCAP_APP_PORT || process.env.PORT || 5000),
		appHost: (process.env.VCAP_APP_HOST || 'localhost'),
		//staticCacheTime:  86400000 * 1,  // 1 day
		staticCacheTime:  300000,  // 300 secs = 5 min 
		mongodbConnection: resolveMongoDbCnx()
	};

	//Google Auth
	configuration.googleAuth = {
		clientID      : process.env.OAUTH2_GOOGLE_CLIENTID, // To be set in the system variable
		clientSecret  : process.env.OAUTH2_GOOGLE_CLIENTSECRET, // To be set in the system variable
		callbackURL   : process.env.OAUTH2_BASEHOST + '/oauth2/google/callback'
	};

	//Facebook Auth
	configuration.facebookAuth = {
		clientID      : process.env.OAUTH2_FACEBOOK_CLIENTID, // To be set in the system variable
		clientSecret  : process.env.OAUTH2_FACEBOOK_CLIENTSECRET, // To be set in the system variable
		callbackURL   : process.env.OAUTH2_BASEHOST + '/oauth2/facebook/callback'
	};

	//Github Auth
	configuration.githubAuth = {
		clientID      : process.env.OAUTH2_GITHUB_CLIENTID, // To be set in the system variable
		clientSecret  : process.env.OAUTH2_GITHUB_CLIENTSECRET, // To be set in the system variable
		callbackURL   : process.env.OAUTH2_BASEHOST + '/oauth2/github/callback'
	};
	
	//Twitter Auth
	configuration.twitterAuth = {
		clientID      : process.env.OAUTH2_TWITTER_CLIENTID, // To be set in the system variable
		clientSecret  : process.env.OAUTH2_TWITTER_CLIENTSECRET, // To be set in the system variable
		callbackURL   : process.env.OAUTH2_BASEHOST + '/oauth2/twitter/callback'
	};

	//Windowslive Auth
	configuration.windowsliveAuth = {
		clientID      : process.env.OAUTH2_WINDOWSLIVE_CLIENTID, // To be set in the system variable
		clientSecret  : process.env.OAUTH2_WINDOWSLIVE_CLIENTSECRET, // To be set in the system variable
		callbackURL   : process.env.OAUTH2_BASEHOST + '/oauth2/windowslive/callback'
	};

	if (environment === 'production') {
		//Override specific settings values for production  -------------
		configuration.environment = 'production';
	}
	else if (environment === 'qa') {
		//Override specific settings values for qa ----------------------
		configuration.environment = 'qa';
	}
	else {  
		//Default environment devel
		//Override specific settings values for devel -------------------
		configuration.environment = 'devel';
		configuration.staticCacheTime = 0; //disables cache for development
	}

	//-------------------------------------------------------------------
	if (configuration.environment === 'devel') {
	    configuration.rootHttpDir = path.normalize(__dirname + '/../../public');
	} 
	else {
	    configuration.rootHttpDir = path.normalize(__dirname + '/../../public-html/' + configuration.environment);
	}

	return configuration;
}

function resolveMongoDbCnx() {
	var dbName = 'DemoDb';
	var defaultCnx = 'mongodb://localhost:27017/' + dbName;

	if (process.env.DB_URI) {
		//Direct connection string via ENV.DB_URI
		return process.env.DB_URI;
	}
	
	var protoTarget = process.env.DB_PORT || process.env.DB_PORT_27017_TCP; //Sample: DB_PORT=tcp://172.17.0.5:5432
	if (protoTarget) {
		//Docker link context passed via DB alias
		var target = protoTarget.substr(6);
		return 'mongodb://' + target + '/' + dbName;
	}
	if (process.env.VCAP_SERVICES) {
		//Cloud Foundry settings
		var vCap = JSON.parse(process.env.VCAP_SERVICES);

		if (vCap['mongodb-2.2']) {
			return vCap['mongodb-2.2'][0].credentials.url || defaultCnx;
		}
		else {
			return vCap['mongodb-2.4'][0].credentials.url || defaultCnx;
		}
	}
	//Mongolab URI
	return process.env.MONGOLAB_URI || process.env.MONGODB_URI ||defaultCnx;
}

module.exports.getConfiguration = getConfiguration;
module.exports.getConfigurationByEnv = getConfigurationByEnv;
